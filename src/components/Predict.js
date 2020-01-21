import React, { Component } from "react";
import ReactGA from "react-ga";
import Box from "./Box";

class Predict extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() {
        document.title = "Predict - ZincBind";
        ReactGA.initialize("UA-51790964-20");
        ReactGA.pageview(window.location.pathname + window.location.search);

        return ( <main>
            <Box><h1>Predict Zinc Binding</h1></Box>
            <Box><p>Coming soon</p></Box>
        </main> );
    }
}
 
export default Predict;