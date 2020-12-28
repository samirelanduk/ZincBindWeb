import React from "react";
import { withRouter, Link } from "react-router-dom";
import Box from "./Box";

const SiteResult = props => {

  let organism = props.site.pdb.organism;
  if (organism) {
    organism = organism[0].toUpperCase() + organism.slice(1).toLowerCase();
  } else {
    organism = "No organism given";
  }

  return (
    <Link className="site-result" to={`/${ props.site.id }/`}><Box>
      
      <div className="site-id">{ props.site.id }</div>
      <div className="site-info">
        <div className="pdb">{ props.site.pdb.title } (<span>{ organism }</span>, { props.site.pdb.depositionDate.split("-")[0] })</div>
        <div className="residues">
          <div className="family">{ props.site.family }</div>
          {props.site.residues.edges.map((edge) => {
          return <span className="residue" key={edge.node.id}>
            { edge.node.atomiumId} ({ edge.node.name})
          </span>
        })}</div>
      </div>
    </Box></Link>
  );
}
 
export default withRouter(SiteResult);