import React, { Component } from "react";
import Box from "./Box"
import { TwitterPicker } from "react-color";
import { Stage, Shape } from "ngl";

class NglInterface extends Component {

    chainResidues = [
        "VAL", "ILE", "LEU", "GLU", "GLN", "ASP", "ASN", "HIS", "TRP", "PHE",
        "TYR", "ARG", "LYS", "SER", "THR", "MET", "ALA", "GLY", "PRO", "CYS",
        "HIP", "HIE", "DA", "DG", "DC", "DT", "A", "G", "C", "U"
    ]

    stage = null;

    repChange = () => {
        if (this.stage) {
            this.stage.rep.setVisibility(false);
            this.stage.rep = this.stage.compList[0].addRepresentation(
                this.refs.rep.value, {sele: "/0 and (not water)",
                assembly: this.stage.assembly}
            );
        }
    }

    toggleSpin = () => {
        if (this.stage) {
            if (this.refs.spinToggle.classList.contains("active")) {
                this.refs.spinToggle.classList.remove("active");
                this.stage.setSpin(false);
            } else {
                this.refs.spinToggle.classList.add("active");
                this.stage.setSpin(true);
            }
        }
    }

    toggleHighlight = () => {
        if (this.refs.highlightToggle.classList.contains("active")) {
            this.refs.highlightToggle.classList.remove("active");
        } else {
            this.refs.highlightToggle.classList.add("active");
        }
    }

    componentDidMount() {
        // Get selector for metals
        let metals = [];
        let coordinatingAtoms = [];
        for (const edge of this.props.metals) {
            metals.push(`${edge.node.residueNumber}^${edge.node.insertionCode}:${edge.node.chainId}/0 and .${edge.node.residueName} and (%A or %)`);
            for (let edge2 of edge.node.coordinateBonds.edges) {
                coordinatingAtoms.push(edge2.node.atom.id)
            }
        }
        metals = metals.join(" or ");

        // Get selector for residues
        let residues = [];
        for (const residue of this.props.residues) {
            let s = `${residue.residueNumber}^${residue.insertionCode}:${residue.chainIdentifier}/0 and (%A or %)`
            if (this.chainResidues.includes(residue.name)) {
                let includes = ["sidechain", ".CA"];
                for (let edge of residue.atoms.edges) {
                    if (coordinatingAtoms.includes(edge.node.id)) {
                        includes.push(`.${edge.node.name}`)
                    }
                }
                if (includes.includes(".O")) {
                    includes.push(".C");
                }
                includes = includes.join(" or ");
                s = `(${includes}) and ${s}`;
            }
            residues.push(s)
        }
        residues = residues.join(" or ");

        // What are the vectors for distance lines?
        let bonds = [];
        for (const edge of this.props.metals) {
            let location = [edge.node.x, edge.node.y, edge.node.z];
            for (const edge2 of edge.node.coordinateBonds.edges) {
                bonds.push([location, [edge2.node.atom.x, edge2.node.atom.y, edge2.node.atom.z]])
            }
        }

        this.stage = new Stage("ngl-container", {backgroundColor: "#ffffff"});
        const assembly = this.props.assembly === null ? "AU" : "BU" + this.props.assembly;
        this.stage.assembly = assembly;

        // If the user double clicks, make it full screen
        this.stage.viewer.container.addEventListener("dblclick", function () {
            this.stage.toggleFullscreen();
        });

        // If the screen changes size, deal with it
        function handleResize () {
            this.stage.handleResize();
        }
        window.addEventListener("orientationchange", handleResize, false);
        window.addEventListener("resize", handleResize, false);

        this.stage.loadFile("rcsb://" + this.props.code + ".mmtf").then((component) => {
            // Make the whole thing a cartoon
            this.stage.rep = component.addRepresentation("cartoon", {sele: "/0", assembly: assembly});

            // Make metals appear as spheres
            component.addRepresentation("ball+stick", {sele: metals, aspectRatio: 8, assembly: assembly});

            // Make residue side chains appear as sticks
            if (residues.length > 0) {
                component.addRepresentation("licorice", {sele: residues, assembly: assembly});
            }

            // Make distance lines appear
            for (let b = 0; b < bonds.length; b++) {
                let metalPos = bonds[b][0];
                let atomPos = bonds[b][1];
                let vector = [
                    metalPos[0] - atomPos[0], metalPos[1] - atomPos[1], metalPos[2] - atomPos[2]
                ]
                const DIV = 16;
                let miniVector = [vector[0] / DIV, vector[1] / DIV, vector[2] / DIV]
                let lines = []
                for (let x = 0; x <= DIV; x++) {
                    lines.push([
                        atomPos[0] + miniVector[0] * x, atomPos[1] + miniVector[1] * x, atomPos[2] + miniVector[2] * x
                    ])
                }
                for (let x = 0; x < DIV; x++) {
                    if (x % 3 !== 0) {
                        let shape = new Shape("shape", { disableImpostor: true });
                        shape.addCylinder(lines[x], lines[x + 1], [0.56, 0.37, 0.6], 0.1);
                        let shapeComp = this.stage.addComponentFromObject(shape);
                        shapeComp.addRepresentation("distance");
                    }
                }
            }

            component.autoView();
        });
    }
    
    render() {
        return (
            <Box className="ngl-interface">
                <div className="window" id="ngl-container">

                </div>
                <div className="controls">
                    <div className="control">
                        <label>Protein View</label>
                        <select onChange={this.repChange} ref="rep" >
                            <option value="cartoon">Cartoon</option>
                            <option value="ball+stick">Ball and Stick</option>
                            <option value="line">Lines</option>
                            <option value="backbone">Backbone</option>
                            <option value="ribbon">Ribbon</option>
                            <option value="rope">Rope</option>
                            <option value="tube">Tube</option>
                        </select>
                    </div>

                    <div className="control">
                        <label>Spin</label>
                        <span ref="spinToggle" className="toggle-switch" onClick={this.toggleSpin}>
                            <span className="toggle-knob"></span>
                        </span>
                    </div>

                    <div className="control">
                        <label>Highlight</label>
                        <span ref="highlightToggle" className="toggle-switch" onClick={this.toggleHighlight}>
                            <span className="toggle-knob"></span>
                        </span>
                    </div>

                    <div className="control">
                        <label>Background</label>
                        <TwitterPicker triangle="hide" />
                    </div>

                    
                </div>
            </Box>
        );
    }
}
 
export default NglInterface;