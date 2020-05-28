import React, { Component } from "react";
import ReactGA from "react-ga";
import Select from "react-select";
import Box from "./Box";

class Predict extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sequence: ""
        }
    }
    render() {
        document.title = "Predict - ZincBind";
        ReactGA.initialize("UA-51790964-20");
        ReactGA.pageview(window.location.pathname + window.location.search);

        const families = [
            {value: "H3", label: "H3"},
            {value: "C4", label: "C4"},
            {value: "H2C2", label: "H2C2"},
        ]

        return ( <main className="predict-page">
            <Box><h1>Predict Zinc Binding</h1></Box>
            <Box>
                <h2>Sequence Prediction</h2>
                <form>
                    <textarea
                        placeholder="Sequence"
                        value={this.state.sequence}
                        onChange={e => this.setState({sequence: e.target.value})}
                    />
                    <div className="options">
                        <Select
                            isMulti
                            name="colors"
                            options={families}
                            placeholder="Limit families..."
                            className="families-select"
                            classNamePrefix="select"
                        />
                        <input type="submit" value="Predict" />
                    </div>
                </form>

            </Box>
        </main> );
    }
}
 
export default Predict;