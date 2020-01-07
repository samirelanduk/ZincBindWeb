import React, { Component } from "react";
import Box from "./Box"
import { TwitterPicker } from "react-color";
import { Stage } from "ngl";

class NglInterface extends Component {

    toggleSpin = () => {
        if (this.refs.spinToggle.classList.contains("active")) {
            this.refs.spinToggle.classList.remove("active");
        } else {
            this.refs.spinToggle.classList.add("active");
        }
    }

    componentDidMount() {
        let stage = new Stage("ngl-container", {backgroundColor: "#ffffff"});
        const assembly = this.props.assembly === null ? "AU" : "BU" + this.props.assembly;

        // If the user double clicks, make it full screen
        stage.viewer.container.addEventListener("dblclick", function () {
            stage.toggleFullscreen();
        });
        
        stage.loadFile("rcsb://" + this.props.code + ".mmtf").then(function(component) {
            stage.rep = component.addRepresentation("cartoon", {sele: "/0", assembly: assembly});
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