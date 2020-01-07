import React, { Component } from "react";
import Box from "./Box"
import { TwitterPicker } from "react-color";

class NglInterface extends Component {

    toggleSpin = () => {
        if (this.refs.spinToggle.classList.contains("active")) {
            this.refs.spinToggle.classList.remove("active");
        } else {
            this.refs.spinToggle.classList.add("active");
        }
    }
    
    render() { 
        return (
            <Box className="ngl-interface">
                <div className="window">

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