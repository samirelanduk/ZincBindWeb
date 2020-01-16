import React, { Component } from "react";
import Box from "./Box";
import ReactGA from "react-ga";

class NotFound extends Component {
    
    render() { 
        ReactGA.initialize("UA-51790964-20");
        ReactGA.pageview(window.location.pathname + window.location.search);

        return (
            <main className="not-found">
                <Box>
                    <h1>Page Not Found</h1>
                </Box>
            </main>
        );
    }
}
 
export default NotFound;