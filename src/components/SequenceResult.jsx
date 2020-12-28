import React, { useRef, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Box from "./Box";
import ZincSites from "./ZincSites";

const SequenceResult = props => {

  const sequenceRef = useRef(null);
  const inRef = useRef(null);


  useEffect(() => {
    const sequenceBoxWidth = sequenceRef.current.offsetWidth;
    const hitOffset = inRef.current.offsetLeft
    const hitWidth = inRef.current.offsetWidth;
    const padding = parseInt(window.getComputedStyle(sequenceRef.current, null).getPropertyValue("padding-left").slice(0, 2));    
    sequenceRef.current.scrollLeft = hitOffset - (sequenceBoxWidth / 2) - padding + (hitWidth / 2);
  })

    const preQuery = props.query.slice(0, props.sequence.queryFrom - 1).toLowerCase();
    const postQuery = props.query.slice(props.sequence.queryTo).toLowerCase();
    const preSequence = props.sequence.chain.sequence.slice(0, props.sequence.hitFrom - 1).toLowerCase();
    const postSequence = props.sequence.chain.sequence.slice(props.sequence.hitTo).toLowerCase();
    
    let queryPad = "";
    let sequencePad = "";
    if (preQuery > preSequence) {
      sequencePad = " ".repeat(preQuery.length);
    }
    if (preQuery < preSequence) {
      queryPad = " ".repeat(preSequence.length);
    }
    let pad = " ".repeat(Math.max(preQuery.length, preSequence.length));
    
    
    let organism = props.sequence.chain.pdb.organism;
    if (organism) {
      organism = organism[0].toUpperCase() + organism.slice(1).toLowerCase();
    } else {
      organism = "No organism given";
    }

    return (
      <div className="sequence-result"><Box>
        <div className="info">
          <h2>{ props.sequence.chain.pdb.id }, Chain { props.sequence.chain.atomiumId }</h2>
          <div className="metric">E-value:<br></br>{ props.sequence.evalue }</div>
          <div className="metric">Score:<br></br>{ props.sequence.score }</div>
          <div className="title">{ props.sequence.chain.pdb.title } (<span>{ organism }</span>, { props.sequence.chain.pdb.depositionDate.split("-")[0] })</div>
        </div>
        <div className="sequence" ref={sequenceRef}>
          <div className="query">{ queryPad }<span className="out">{preQuery}</span><span className="in">{ props.sequence.qseq }</span><span className="out">{postQuery}</span></div>
          <div className="midline">{ pad }{ props.sequence.midline }{ pad }</div>
          <div className="hit">{ sequencePad }<span className="out">{preSequence}</span><span className="in" ref={inRef}>{ props.sequence.hseq }</span><span className="out">{postSequence}</span></div>
        </div>

        <ZincSites sites={props.sequence.chain.chainInteractions.edges }/>
        
      </Box></div>
    );
}
 
export default withRouter(SequenceResult);