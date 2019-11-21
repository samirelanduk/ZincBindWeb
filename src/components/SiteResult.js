import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Box from "./Box";

class SiteResult extends Component {

    render() { 
        return (
            <div className="site-result"><Box>
                
                { this.props.site.id}
                
                
            </Box></div>
        );
    }
}
 
export default withRouter(SiteResult);