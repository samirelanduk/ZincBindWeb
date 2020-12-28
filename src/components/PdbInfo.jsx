import React from "react";
import Box from "./Box";
import externalLink from "../images/external-link.svg";

const PdbInfo = props => {

  return (
    <Box className="properties">
      {props.title && <h2 className="pdb-row full">PDB Information</h2>}
      <div className="pdb-row"><span className="property">Code: </span> <a href={"https://www.rcsb.org/structure/" + props.code} target="_blank" rel="noopener noreferrer">{props.code} <img src={externalLink} alt="external" /></a></div>
      <div className="pdb-row"><span className="property">Deposited: </span> {props.pdb.depositionDate}</div>

      <div className="pdb-row"><span className="property">Resolution: </span> {props.pdb.resolution || "N/A"}</div>
      <div className="pdb-row"><span className="property">R-value: </span> {props.pdb.rvalue || "N/A"}</div> 

      <div className="pdb-row"><span className="property">Classification: </span> {props.pdb.classification}</div>
      <div className="pdb-row"><span className="property">Biological Assembly: </span> {props.pdb.assembly || "AU"}</div>

      <div className="pdb-row full"><span className="property">Source Organism: </span> {props.pdb.organism ? <span className="species">{props.pdb.organism}</span> : <span>Unknown</span>}</div>
      <div className="pdb-row full"><span className="property">Expression Organism: </span> {props.pdb.expressionSystem ? <span className="species">{props.pdb.expressionSystem}</span> : <span>Unknown</span>}</div>
      <div className="pdb-row full"><span className="property">Experimental Technique: </span> {props.pdb.technique}</div>
      <div className="pdb-row full keywords"><span className="property">Keywords: </span> {props.pdb.keywords.split(", ").map((keyword, i) => {
        return <a key={i} href={`/search?keywords=${keyword}`}>{ keyword }</a>
      })}</div>
    </Box>
  );
}

export default PdbInfo;








