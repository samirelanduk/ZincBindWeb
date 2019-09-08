import React, { Component } from "react";
import { Link } from "react-router-dom";
import Box from "./Box";
import Chart from "./Chart"

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
                        <Chart title="Residues" color="#079992" data={[[], []]} />
                    </Box>

                    <Box>
                        <Chart title="Techniques" color="#0a3d62" data={[[], []]} />
                    </Box>

                    <Box>
                        <Chart title="Species" color="#0c2461" data={[[], []]} />
                    </Box>

                    <Box>
                        <Chart title="Classifications" color="#b71540" data={[[], []]} />
                    </Box>

                    <Box>
                        <Chart title="Families" color="#e58e26" data={[[], []]} />
                    </Box>

                    <Box>
                        <Chart title="Resolution" color="#6a89cc" data={[[], []]} />
                    </Box>
                </div>
            </main>
        );
    }
}
 
export default Data;