import React, { Component } from "react";

class Box extends Component {
    render() { 
        console.log(this.props)
        let className = "box";
        if (this.props.className) {
            className += " " + this.props.className;
        }
        return (
            <div className={className}>
                {this.props.children}
            </div>
        );
    }
}
 
export default Box;