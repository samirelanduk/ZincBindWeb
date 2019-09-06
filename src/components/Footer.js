import React, { Component } from "react";
import { Link } from "react-router-dom";

class Footer extends Component {
    
    render() {
        return (
            <footer>
                <div className="links">
                    <div className="useful">
                        <h3>Useful Links</h3>
                        <a href="http://www.bioinf.org.uk/" target="_blank">The ACRM Group</a>
                        <a href="https://github.com/samirelanduk/zincbind" target="_blank">Source code</a>
                        <Link to="/changelog/">Changelog</Link>
                    </div>
                    <div className="related">
                        <h3>Related Projects</h3>
                        <a href="http://metalweb.cerm.unifi.it/" target="_blank">MetalPDB</a>
                        <a href="http://synpharm.guidetopharmacology.org/" target="_blank">SynPHARM</a>
                        <a href="https://www.bindingdb.org/bind/index.jsp" target="_blank">The Binding Database</a>
                    </div>
                </div>
                <div className="attribution">
                    Created by: <a target="_blank" href="https://samireland.com/">Sam Ireland</a>
                </div>
            </footer>
        );
    }
}
 
export default Footer;