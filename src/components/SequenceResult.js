import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Box from "./Box";
import ZincSites from "./ZincSites";

class SequenceResult extends Component {

    componentDidMount() {
        const sequenceBoxWidth = this.refs.sequence.offsetWidth;
        const hitOffset = this.refs.in.offsetLeft
        const hitWidth = this.refs.in.offsetWidth;
        const padding = parseInt(window.getComputedStyle(this.refs.sequence, null).getPropertyValue("padding-left").slice(0, 2));        
        this.refs.sequence.scrollLeft = hitOffset - (sequenceBoxWidth / 2) - padding + (hitWidth / 2);
    }

    render() {
        const preQuery = this.props.query.slice(0, this.props.sequence.queryFrom - 1).toLowerCase();
        const postQuery = this.props.query.slice(this.props.sequence.queryTo).toLowerCase();
        const preSequence = this.props.sequence.chain.sequence.slice(0, this.props.sequence.hitFrom - 1).toLowerCase();
        const postSequence = this.props.sequence.chain.sequence.slice(this.props.sequence.hitTo).toLowerCase();
        
        let queryPad = "";
        let sequencePad = "";
        if (preQuery > preSequence) {
            sequencePad = " ".repeat(preQuery.length);
        }
        if (preQuery < preSequence) {
            queryPad = " ".repeat(preSequence.length);
        }
        let pad = " ".repeat(Math.max(preQuery.length, preSequence.length));
        
        
        let organism = this.props.sequence.chain.pdb.organism;
        if (organism) {
            organism = organism[0].toUpperCase() + organism.slice(1).toLowerCase();
        } else {
            organism = "No organism given";
        }

        return (
            <div className="sequence-result"><Box>
                <div className="info">
                    <h2>{ this.props.sequence.chain.pdb.id }, Chain { this.props.sequence.chain.atomiumId }</h2>
                    <div className="metric">E-value:<br></br>{ this.props.sequence.evalue }</div>
                    <div className="metric">Score:<br></br>{ this.props.sequence.score }</div>
                    <div className="title">{ this.props.sequence.chain.pdb.title } (<span>{ organism }</span>, { this.props.sequence.chain.pdb.depositionDate.split("-")[0] })</div>
                </div>
                <div className="sequence" ref="sequence">
                    <div className="query">{ queryPad }<span className="out">{preQuery}</span><span className="in">{ this.props.sequence.qseq }</span><span className="out">{postQuery}</span></div>
                    <div className="midline">{ pad }{ this.props.sequence.midline }{ pad }</div>
                    <div className="hit">{ sequencePad }<span className="out">{preSequence}</span><span className="in" ref="in">{ this.props.sequence.hseq }</span><span className="out">{postSequence}</span></div>
                </div>

                <ZincSites sites={this.props.sequence.chain.chainInteractions.edges }/>
                
            </Box></div>
        );
    }
}
 
export default withRouter(SequenceResult);