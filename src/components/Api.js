import React, { Component } from "react";
import Box from "./Box";
import ReactGA from "react-ga";

class Api extends Component {
    
    render() {
        document.title = "API - ZincBind";
        ReactGA.initialize("UA-51790964-20");
        ReactGA.pageview(window.location.pathname + window.location.search);
        
        return (
            <main className="api">
                <Box>
                    <h1>API Access</h1>
                </Box>

                <Box>
                    <p>ZincBind has two different APIs for delivering programmatic
                    access to the data and tools available here. The ZincBindDB
                    API allows access to the database of zinc binding sites
                    itself, and the ZincBindPredict API gives access to the
                    predictive models via its job system.
                    </p>

                    <p>The APIs are both <a href="https://graphql.org" target="_blank" rel="noopener noreferrer">GraphQL</a> APIs,
                    which means that you can request as much or as little data per
                    request as you like. Their HTML interfaces also provide autocomplete
                    hints as to the kinds of queries and mutations you can make.
                    </p>

                </Box>

                <Box>
                    <h2>ZincBindDB</h2>

                    <p className="endpoint">Endpoint: <a href="https://api.zincbind.net">https://api.zincbind.net</a></p>
                    <iframe src="https://api.zincbind.net"></iframe>
                </Box>

                <Box>
                    <h2>ZincBindPredict</h2>

                    <p className="endpoint">Endpoint: <a href="https://predict.zincbind.net">https://predict.zincbind.net</a></p>
                    <iframe src="https://predict.zincbind.net"></iframe>
                </Box>
            </main>
        );
    }
}
 
export default Api;