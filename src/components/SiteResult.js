import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Box from "./Box";

class SiteResult extends Component {

    render() { 
        return (
            <div className="site-result"><Box>
                
                <div className="site-id">{ this.props.site.id }</div>
                <div className="site-info">
                    
                    <div className="pdb">{ this.props.site.pdb.title } (<span>{ this.props.site.pdb.organism }</span>, { this.props.site.pdb.depositionDate.split("-")[0] })</div>
                    <div className="residues">
                        <div className="family">{ this.props.site.family }</div>
                        {this.props.site.residues.edges.map((edge) => {
                        return <span className="residue" key={edge.node.id}>
                            { edge.node.atomiumId} ({ edge.node.name})
                        </span>
                    })}</div>
                </div>
                
                
                
            </Box></div>
        );
    }
}
 
export default withRouter(SiteResult);