import React from "react";

const Box = props => {

    let className = "box";
    if (props.className) {
        className += " " + props.className;
    }
    return (
      <div className={className}>
        {props.children}
      </div>
    );
}
 
export default Box;