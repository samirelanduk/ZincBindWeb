import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Box from "./Box";
import ZincSites from "./ZincSites";

class PdbResult extends Component {

    formatDate = (datestring) => {
        const date = new Date(datestring)
        const month = [
         "January", "February", "March", "April", "May", "June", "July",
         "August", "September", "October", "November", "December"
        ][date.getMonth()];
        return `${date.getDate()} ${month}, ${date.getFullYear()}`;
    }
    
    render() { 
        return (
            <div className="pdb-result"><Box>
                <div className="pdb">
                    <div className="row-1">
                        <div className="id">{ this.props.pdb.id }</div>
                        <div className="date">{ this.formatDate(this.props.pdb.depositionDate) }</div>
                        <div className="species">{ this.props.pdb.organism }</div>
                    </div>
                    <div className="row-2">
                        <div className="title">{ this.props.pdb.title }</div>
                    </div>
                    <div className="row-3">
                        <div className="classification">{ this.props.pdb.classification }</div>
                        <div className="technique">{ this.props.pdb.technique }</div>
                        <div className="resolution">{ (this.props.pdb.resolution ? this.props.pdb.resolution + " Å" : "")}</div>
                    </div>
                </div>

                <div className="zincsites">
                    <ZincSites sites={this.props.pdb.zincsites.edges} />
                </div>
                
                
               
            </Box></div>
        );
    }
}
 
export default withRouter(PdbResult);