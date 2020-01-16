import React, { Component } from "react";
import ReactGA from "react-ga";

class Predict extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() {
        document.title = "Predict - ZincBind";
        ReactGA.initialize("UA-51790964-20");
        ReactGA.pageview(window.location.pathname + window.location.search);

        return ( <main>Predict</main> );
    }
}
 
export default Predict;