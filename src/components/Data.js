import React, { Component } from "react";
import { Link } from "react-router-dom";
import Box from "./Box";

class Data extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return (
            <main className="data">
                <Box>
                    <h1>ZincBind Data</h1>
                </Box>
                    
                <Box>
                    <p>The full list of Zinc Binding Sites can be browsed <Link to="/data/all/">here</Link>.
                    They can also be browsed by Family and Group <Link to="/families/">here</Link>.
                    See the <a href="https://api.zincbind.net">GraphQL API</a> for programmatic access to the data.</p>
                </Box>

                <div className="charts">
                    <Box>
                        chart1
                    </Box>

                    <Box>
                        chart2
                    </Box>

                    <Box>
                        chart3
                    </Box>

                    <Box>
                        chart4
                    </Box>

                    <Box>
                        chart5
                    </Box>

                    <Box>
                        chart6
                    </Box>
                </div>
            </main>
        );
    }
}
 
export default Data;