import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Box from "./Box";

class SiteResult extends Component {

    render() { 
        return (
            <div className="site-result"><Box>
                
                <div className="site-id">{ this.props.site.id }</div>
                <div className="site-info">
                    
                    <div className="pdb">{ this.props.site.pdb.title }</div>
                    <div className="residues">
                        <div className="family">{ this.props.site.family }</div>
                        {this.props.site.residues.edges.map((edge) => {
                        return <div className="residue" key={edge.node.id}>
                            <span className="residue-id">{ edge.node.atomiumId}</span>
                            <span className="residue-name">{ edge.node.name}</span>
                        </div>
                    })}</div>
                </div>
                
                
                
            </Box></div>
        );
    }
}
 
export default withRouter(SiteResult);