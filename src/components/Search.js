import React, { Component } from "react";
import Box from "./Box";

class Search extends Component {
    
    render() { 
        return (
            <main className="search">
                <Box>
                    <h1>Advanced Search</h1>
                </Box>
                
                <Box>
                    <div className="search-input">
                        <select onChange={() => {}}>
                            <option data-placeholder="e.g. antibody, carbonic anhydrase" value="title">Title contains</option>
                            <option data-placeholder="e.g. oxidoreductase, membrane" value="classification">Classification contains</option>
                            <option data-placeholder="e.g. ion channel, zinc finger" value="keywords">Keywords contain</option>
                            <option data-placeholder="e.g. homo sapiens" value="organism">Organism contains</option>
                            <option data-placeholder="e.g. saccharomyces" value="expression">Expression System contains</option>
                            <option data-placeholder="e.g. NMR" value="technique">Technique contains</option>
                            <option data-placeholder="e.g. 2.5" value="resolution_lt">Resolution better than</option>
                            <option data-placeholder="e.g. 10" value="resolution_gt">Resolution worse than</option>
                            <option data-placeholder="e.g. 0.2" value="rfactor_lt">Rfactor better than</option>
                            <option data-placeholder="e.g. 0.3" value="rfactor_gt">Rfactor worse than</option>
                            <option data-placeholder="e.g. 2017-01-01" value="deposited_gt">Deposited since</option>
                            <option data-placeholder="e.g. 2000-01-01" value="deposited_lt">Deposited before</option>
                            <option data-placeholder="e.g. H3, C2H2" value="family">Family is</option>
                            <option data-placeholder="e.g. H3, C2" value="code">Family contains</option>
                            <option data-placeholder="e.g. GLU, BON" value="residue_names">Residue names contain</option>
                        </select>
                        <input type="text"></input>
                    </div>

                    <div className="search-buttons">
                        <button>New Term</button>
                        <button>Search</button>
                    </div>
                    
                </Box>

                <Box>
                    <h2>BLAST Search</h2>

                    <textarea placeholder="Raw or FASTA formatted peptide sequence"></textarea>

                    <label>Expect Threshold</label>

                    <select className="expect" name="threshold" value="10">
                        <option value="0.0001">0.0001</option>
                        <option value="0.001">0.001</option>
                        <option value="0.01">0.01</option>
                        <option value="0.1">0.1</option>
                        <option value="1.0">1</option>
                        <option value="10">10</option>
                        <option value="100">100</option>
                        <option value="1000">1000</option>
                    </select>

                    <button>BLAST Search</button>
                </Box>
            </main>
        )
    }
}
 
export default Search;