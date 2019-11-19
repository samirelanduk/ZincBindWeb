import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Box from "./Box";

class SequenceResult extends Component {

    render() { 
        return (
            <div className="sequence-result"><Box>
                <div className="info">
                    <h2>{ this.props.sequence.chain.pdb.id }, Chain { this.props.sequence.chain.atomiumId }</h2>
                    <div class="metric">E-value:<br></br>{ this.props.sequence.evalue }</div>
                    <div class="metric">Score:<br></br>{ this.props.sequence.score }</div>
                    <div class="title">{ this.props.sequence.chain.pdb.title }</div>
                </div>
                <div className="sequence">
                    <div className="query">{ this.props.sequence.qseq }</div>
                    <div className="midline">{ this.props.sequence.midline }</div>
                    <div className="hit">{ this.props.sequence.hseq }</div>
                </div>
                
            </Box></div>
        );
    }
}
 
export default withRouter(SequenceResult);