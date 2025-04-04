import React, { Fragment, Component } from "react";
import Box from "./Box"
import { TwitterPicker } from "react-color";
import * as NGL from "ngl/dist/ngl.js";
import { ClipLoader } from "react-spinners";
import { metalToNgl, residueToNgl } from "../index";

class NglInterface extends Component {
  /**
   * This will remain a Class Component for now owing to the componentDidMount
   * complexity.
   */

  chainResidues = [
    "VAL", "ILE", "LEU", "GLU", "GLN", "ASP", "ASN", "HIS", "TRP", "PHE",
    "TYR", "ARG", "LYS", "SER", "THR", "MET", "ALA", "GLY", "PRO", "CYS",
    "HIP", "HIE", "DA", "DG", "DC", "DT", "A", "G", "C", "U"
  ]

  stage = null;

  constructor(props) {
    super(props);
    this.state = {nglLoading: true, hasError: false};
  }

  repChange = () => {
    if (this.stage) {
      this.stage.rep.setVisibility(false);
      this.stage.rep = this.stage.compList[0].addRepresentation(
        this.refs.rep.value, {sele: "/0 and (not water)",
        assembly: this.stage.assembly,
        opacity: this.refs.highlightToggle.classList.contains("active") ? 0.2 : 1}
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
    if (this.stage) {
      this.stage.rep.setVisibility(false);
      if (this.refs.highlightToggle.classList.contains("active")) {
        this.refs.highlightToggle.classList.remove("active");
        this.stage.rep = this.stage.compList[0].addRepresentation(
          this.refs.rep.value, {sele: "/0 and (not water)",
          assembly: this.stage.assembly, opacity: 1}
        );
      } else {
        this.refs.highlightToggle.classList.add("active");
        this.stage.rep = this.stage.compList[0].addRepresentation(
          this.refs.rep.value, {sele: "/0 and (not water)",
          assembly: this.stage.assembly, opacity: 0.2}
        );
      }
    }
  }

  colorChange = (e) => {
    let canvas = document.getElementsByTagName("canvas").item(0);
    canvas.style.backgroundColor = e.hex;
  }

  componentDidMount() {
    if (this.state.hasError) {
      for (let div of document.getElementById("ngl-container").getElementsByTagName("div")) {
        div.parentNode.removeChild(div);
      }
      return
    }
    // Get selector for metals
    let metals = [];
    for (const edge of this.props.metals) {
      metals.push(metalToNgl(edge.node));
    }
    metals = metals.join(" or ");

    // Get selector for residues
    let residues = [];
    for (const residue of this.props.residues) {
      residues.push(residueToNgl(residue));
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

    this.stage = new NGL.Stage("ngl-container", {backgroundColor: "#ffffff"});
    const assembly = this.props.assembly === null ? "AU" : "BU" + this.props.assembly;
    this.stage.assembly = assembly;

    // If the user double clicks, make it full screen
    this.stage.viewer.container.addEventListener("dblclick", () => {
      this.stage.toggleFullscreen();
    });

    // If the screen changes size, deal with it
    let handleResize = () => {
      this.stage.handleResize();
    }
    window.addEventListener("orientationchange", handleResize, false);
    window.addEventListener("resize", handleResize, false);


    //this.stage.loadFile("rcsb://" + this.props.code + ".cif").then((component) => {
    this.stage.loadFile("https://files.rcsb.org/view/" + this.props.code + ".cif").then((component) => {
      this.setState({nglLoading: false})
      // Make the whole thing a cartoon
      try {
        this.stage.rep = component.addRepresentation("cartoon", {sele: "/0", assembly: assembly});
      } catch (e) {
        this.setState({hasError: true});
        this.componentDidMount();
        return;
      }
      

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
            let shape = new NGL.Shape("shape", { disableImpostor: true });
            shape.addCylinder(lines[x], lines[x + 1], [0.56, 0.37, 0.6], 0.1);
            let shapeComp = this.stage.addComponentFromObject(shape);
            shapeComp.addRepresentation("distance");
          }
        }
      }

      // Store the representations
      this.stage.residueColors = {};

      if (this.props.zoom) {
        this.stage.viewerControls.center(bonds[0][0]);
        this.stage.viewerControls.zoom(0.75);
      } else {
        component.autoView();
      }

      window.stage = this.stage;
    });
    
  }
  
  render() {
    return (
      <Box className="ngl-interface" key={this.props.code}>
        <div className="window" id="ngl-container">
        
        {
          this.state.hasError ? <p>Structure could not be loaded.</p> : <ClipLoader
          css={{margin: "auto", display: "block", marginTop: "140px"}}
          size={150}
          color={"#482c54"}
          loading={this.state.nglLoading}
        />
        }
        </div>
        <div className="controls">
          { this.state.hasError ||
          <Fragment>
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

          <div className="toggles">
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
            
          </div>

          <div className="control">
            <label>Background</label>
            <TwitterPicker triangle="hide" onChange={this.colorChange} colors={[
              "#000000", "#FFFFFF", "#7BDCB5", "#fab1a0", "#8ED1FC",
              "#ff7675", "#ABB8C3", "#482c54", "#f5f6fa", "#303952"
            ]} />
          </div></Fragment> }

          
        </div>
      </Box>
    );
  }
}
 
export default NglInterface;