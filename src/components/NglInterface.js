import React, { Component } from "react";
import Box from "./Box"
import { TwitterPicker } from "react-color";
import { Stage, Shape } from "ngl";

class NglInterface extends Component {

    toggleSpin = () => {
        if (this.refs.spinToggle.classList.contains("active")) {
            this.refs.spinToggle.classList.remove("active");
        } else {
            this.refs.spinToggle.classList.add("active");
        }
    }

    componentDidMount() {
        // Get selector for metals
        let metals = [];
        for (const edge of this.props.metals) {
            metals.push(`${edge.node.residueNumber}^${edge.node.insertionCode}:${edge.node.chainId}/0 and .${edge.node.residueName} and (%A or %)`)
        }
        metals = metals.join(" or ");

        // Get selector for residues
        let residues = [];
        for (const residue of this.props.residues) {
            let s = `${residue.residueNumber}^${residue.insertionCode}:${residue.chainIdentifier}/0 and (%A or %)`
            if (["HIS"].includes(residue.name)) {
                let includes = ["sidechain", ".CA"];
                includes = includes.join(" or ");
                //TODO: liganding atoms on main chain
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

        /* for (var b = 0; b < bonds.length; b++) {
            var metalPos = bonds[b][0];
            var atomPos = bonds[b][1];
            var vector = [
                metalPos[0] - atomPos[0], metalPos[1] - atomPos[1], metalPos[2] - atomPos[2]
            ]
            DIV = 16;
            miniVector = [vector[0] / DIV, vector[1] / DIV, vector[2] / DIV]
            lines = []
            for (x = 0; x <= DIV; x++) {
                lines.push([
                    atomPos[0] + miniVector[0] * x, atomPos[1] + miniVector[1] * x, atomPos[2] + miniVector[2] * x
                ])
            }
            for (x = 0; x < DIV; x++) {
                if (x % 3 != 0) {
                    var shape = new NGL.Shape("shape", { disableImpostor: true });
                    shape.addCylinder(lines[x], lines[x + 1], [0.56, 0.37, 0.6], 0.1);
                    var shapeComp = stage.addComponentFromObject(shape);
                    shapeComp.addRepresentation("distance");
                }
            }
        } */

        let stage = new Stage("ngl-container", {backgroundColor: "#ffffff"});
        const assembly = this.props.assembly === null ? "AU" : "BU" + this.props.assembly;

        // If the user double clicks, make it full screen
        stage.viewer.container.addEventListener("dblclick", function () {
            stage.toggleFullscreen();
        });

        stage.loadFile("rcsb://" + this.props.code + ".mmtf").then(function(component) {
            // Make the whole thing a cartoon
            stage.rep = component.addRepresentation("cartoon", {sele: "/0", assembly: assembly});

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
                    if (x % 3 != 0) {
                        let shape = new Shape("shape", { disableImpostor: true });
                        shape.addCylinder(lines[x], lines[x + 1], [0.56, 0.37, 0.6], 0.1);
                        let shapeComp = stage.addComponentFromObject(shape);
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
                        <select>
                            <option>Cartoon</option>
                            <option>Ball and Stick</option>
                            <option>Lines</option>
                            <option>Backbone</option>
                            <option>Ribbon</option>
                            <option>Rope</option>
                            <option>Tube</option>
                        </select>
                    </div>

                    <div className="control">
                        <label>Spin</label>
                        <span ref="spinToggle" className="toggle-switch" onClick={this.toggleSpin}>
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