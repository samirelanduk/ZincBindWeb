import React, { Component } from "react";
import Box from "./Box";

class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {
            terms: [{deletable: false, selected: "title", value: ""}]
        }
    }

    addTerm = () => {
        let terms = this.state.terms;
        for (let term of terms) {
            term.deletable = true;
        }
        terms.push({deletable: true, selected: "title", value: ""});
        this.setState({terms: terms});
    }

    updateSelect = (e) => {
        const index = parseInt(e.target.parentNode.getAttribute("data-index"));
        let terms = this.state.terms;
        terms[index].selected = e.target.value;
        this.setState({terms: terms});
    }

    handleInputChange = (e) => {
        const index = parseInt(e.target.parentNode.getAttribute("data-index"));
        let terms = this.state.terms;
        terms[index].value = e.target.value;
        this.setState({terms: terms});
    }

    removeTerm = (e) => {
        const index = parseInt(e.target.parentNode.getAttribute("data-index"));
        let terms = this.state.terms;
        terms.splice(index, 1);
        if (terms.length === 1) {
            for (let term of terms) {
                term.deletable = false;
            }
        }
        this.setState({terms: terms})
    }

    search = () => {
        let query = [];
        for (let term of this.state.terms) {
            if (term.value) {
                query.push(`${term.selected}=${term.value}`);
            }
        }
        query = query.join("&");
        if (query) {
            this.props.history.push(`/search?${query}`);
        }
        
    }
    
    render() { 
        return (
            <main className="search">
                <Box>
                    <h1>Advanced Search</h1>
                </Box>
                
                <Box>
                    
                        {this.state.terms.map((term, i) => {
                            return <div className="search-input" key={i} data-index={i}>
                                <select value={term.selected} onChange={this.updateSelect}>
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
                                <input type="text" onChange={this.handleInputChange}></input>{term.deletable && <button className="remove-term" onClick={this.removeTerm}>×</button>}
                            </div>
                        })}
                        

                    <div className="search-buttons">
                        <button onClick={this.addTerm}>New Term</button>
                        <button onClick={this.search}>Search</button>
                    </div>
                    
                </Box>

                <Box>
                    <h2>BLAST Search</h2>

                    <textarea placeholder="Raw or FASTA formatted peptide sequence"></textarea>

                    <label>Expect Threshold</label>

                    <select className="expect" name="threshold" defaultValue="10">
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