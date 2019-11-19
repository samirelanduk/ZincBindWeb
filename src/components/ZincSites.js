import React, { Component } from "react";

class ZincSites extends Component {
    
    render() { 
        return <div className="zinc-sites">
            {
                this.props.sites.map((site) => {
                    return <div className="site" key={site.node.site.id}>
                        <h3 className="site-info">{ site.node.site.id } ({ site.node.site.family })</h3>
                        
                        <div className="residues">
                        {
                            site.node.site.residues.edges.map((edge) => {
                                return <span key={edge.node.id} className="residue">{edge.node.atomiumId} ({edge.node.name})</span>
                            })
                        }
                        </div>

                    </div>
                })
            }
        </div>
    }
}
 
export default ZincSites;