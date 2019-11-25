import React, { Component } from "react";
import { Link } from "react-router-dom";

class ZincSites extends Component {
    
    render() {
        for (let edge of this.props.sites) {
            if ("site" in edge.node) {
                edge.node = edge.node.site
            }
        }
        return <div className="zinc-sites">
            {
                this.props.sites.map((edge) => {
                    return <Link className="site" key={edge.node.id} to={`/${edge.node.id}/`}>
                        <h3 className="site-info">{ edge.node.id } ({ edge.node.family })</h3>
                        
                        <div className="residues">
                        {
                            edge.node.residues.edges.map((edge2) => {
                                return <span key={edge2.node.id} className="residue">{edge2.node.atomiumId} ({edge2.node.name})</span>
                            })
                        }
                        </div>

                    </Link>
                })
            }
        </div>
    }
}
 
export default ZincSites;