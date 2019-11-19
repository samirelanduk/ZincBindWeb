import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Box from "./Box";
import ZincSites from "./ZincSites";

class SequenceResult extends Component {

    render() { 
        return (
            <div className="sequence-result"><Box>
                <div className="info">
                    <h2>{ this.props.sequence.chain.pdb.id }, Chain { this.props.sequence.chain.atomiumId }</h2>
                    <div className="metric">E-value:<br></br>{ this.props.sequence.evalue }</div>
                    <div className="metric">Score:<br></br>{ this.props.sequence.score }</div>
                    <div className="title">{ this.props.sequence.chain.pdb.title }</div>
                </div>
                <div className="sequence">
                    <div className="query">{ this.props.sequence.qseq }</div>
                    <div className="midline">{ this.props.sequence.midline }</div>
                    <div className="hit">{ this.props.sequence.hseq }</div>
                </div>

                <ZincSites sites={this.props.sequence.chain.chainInteractions.edges }/>
                
            </Box></div>
        );
    }
}
 
export default withRouter(SequenceResult);