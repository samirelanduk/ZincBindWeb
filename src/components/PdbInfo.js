import React from "react";
import Box from "./Box";

class PdbInfo extends React.Component {

	render() {
		return (
			<Box className="properties">
                {this.props.title && <h2 className="pdb-row full">Pdb Information</h2>}
                <div className="pdb-row"><span className="property">Code: </span> <a href={"https://www.rcsb.org/structure/" + this.props.code} target="_blank" rel="noopener noreferrer">{this.props.code}</a></div>
                <div className="pdb-row"><span className="property">Deposited: </span> {this.props.pdb.depositionDate}</div>

                <div className="pdb-row"><span className="property">Resolution: </span> {this.props.pdb.resolution}</div>
                <div className="pdb-row"><span className="property">R-value: </span> {this.props.pdb.rvalue}</div> 

                <div className="pdb-row"><span className="property">Classification: </span> {this.props.pdb.classification}</div>
                <div className="pdb-row"><span className="property">Biological Assembly: </span> {this.props.pdb.assembly}</div>

                <div className="pdb-row full"><span className="property">Source Organism: </span> <span className="species">{this.props.pdb.organism}</span></div>
                <div className="pdb-row full"><span className="property">Expression Organism: </span> <span className="species">{this.props.pdb.expressionSystem}</span></div>
                <div className="pdb-row full"><span className="property">Experimental Technique: </span> {this.props.pdb.technique}</div>
                <div className="pdb-row full"><span className="property">Keywords: </span> {this.props.pdb.keywords}</div>
            </Box>
		);
	}
}

export default PdbInfo;








