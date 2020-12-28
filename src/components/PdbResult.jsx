import React from "react";
import { withRouter, Link } from "react-router-dom";
import Box from "./Box";
import ZincSites from "./ZincSites";

const PdbResult = props => {

  const formatDate = (datestring) => {
    const date = new Date(datestring)
    const month = [
     "January", "February", "March", "April", "May", "June", "July",
     "August", "September", "October", "November", "December"
    ][date.getMonth()];
    return `${date.getDate()} ${month}, ${date.getFullYear()}`;
  }
  
  return (
    <div className="pdb-result"><Box>
      <Link className="pdb" to={`/pdbs/${props.pdb.id}/`}>
        <div className="row-1">
          <div className="id">{ props.pdb.id }</div>
          <div className="date">{ formatDate(props.pdb.depositionDate) }</div>
          <div className="species">{ props.pdb.organism }</div>
        </div>
        <div className="row-2">
          <div className="title">{ props.pdb.title }</div>
        </div>
        <div className="row-3">
          <div className="classification">{ props.pdb.classification }</div>
          <div className="technique">{ props.pdb.technique }</div>
          <div className="resolution">{ (props.pdb.resolution ? props.pdb.resolution + " Å" : "")}</div>
        </div>
      </Link>

      <div className="zincsites">
        <ZincSites sites={props.pdb.zincsites.edges} />
      </div>
    </Box></div>
  );
}
 
export default withRouter(PdbResult);