import React, { Component } from "react";
import gql from "graphql-tag";
import Box from "./Box";
import AllData from "./AllData";

class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {
            terms: [{deletable: false, selected: "title__contains", value: ""}],
            blastString: "",
            expectString: "10"
        }
    }

    addTerm = () => {
        let terms = this.state.terms;
        for (let term of terms) {
            term.deletable = true;
        }
        terms.push({deletable: true, selected: "title__contains", value: ""});
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

    blastStringUpdate = (e) => {
        const value = e.target.value;
        this.setState({blastString: value});
    }

    expectUpdate = (e) => {
        this.setState({expectString: e.target.value});
    }

    blastSearch = () => {
        if (this.state.blastString) {
            let query = `sequence=${this.state.blastString}&expect=${this.state.expectString}`;
            this.props.history.push(`/search?${query}`);
        }
        
    }
    
    render() {
        if (this.props.history.location.search) {
            const terms = this.props.history.location.search.slice(1).split("&");
            let query = [];
            for (const term of terms) {
                let words = term.split("=");
                if (!["page", "sort"].includes(words[0])) {
                    words[1] = isNaN(words[1]) ? `"${words[1]}"` : words[1]
                    query.push(`${words[0]}: ${words[1]}`)
                }
            }
            query = query.join(", ");
            
            const query_string = `query pdbs($sort: String, $skip: Int) { pdbs(sort: $sort, first: 25, skip: $skip, ${query}) { edges { node {
                id depositionDate organism title classification technique resolution zincsites {
                    edges { node { id residues { edges { node { id atomiumId }}} } }
                }
            } } } count: stats { pdbCount }}`
            const QUERY = gql(query_string);

            return <AllData history={this.props.history} query={QUERY} />
        }
        return (
            <main className="search">
                <Box>
                    <h1>Advanced Search</h1>
                </Box>
                
                <Box>
                    
                        {this.state.terms.map((term, i) => {
                            return <div className="search-input" key={i} data-index={i}>
                                <select value={term.selected} onChange={this.updateSelect}>
                                    <option data-placeholder="e.g. antibody, carbonic anhydrase" value="title__contains">Title contains</option>
                                    <option data-placeholder="e.g. oxidoreductase, membrane" value="classification__contains">Classification contains</option>
                                    <option data-placeholder="e.g. ion channel, zinc finger" value="keywords__contains">Keywords contain</option>
                                    <option data-placeholder="e.g. homo sapiens" value="organism__contains">Organism contains</option>
                                    <option data-placeholder="e.g. saccharomyces" value="expression__contains">Expression System contains</option>
                                    <option data-placeholder="e.g. NMR" value="technique__contains">Technique contains</option>
                                    <option data-placeholder="e.g. 2.5" value="resolution__lt">Resolution better than</option>
                                    <option data-placeholder="e.g. 10" value="resolution__gt">Resolution worse than</option>
                                    <option data-placeholder="e.g. 0.2" value="rfactor__lt">Rfactor better than</option>
                                    <option data-placeholder="e.g. 0.3" value="rfactor__gt">Rfactor worse than</option>
                                    <option data-placeholder="e.g. 2017-01-01" value="deposited_gt">Deposited since</option>
                                    <option data-placeholder="e.g. 2000-01-01" value="deposited__lt">Deposited before</option>
                                    <option data-placeholder="e.g. H3, C2H2" value="family__contains">Family is</option>
                                    <option data-placeholder="e.g. H3, C2" value="code__contains">Family contains</option>
                                    <option data-placeholder="e.g. GLU, BON" value="residue_names__contains">Residue names contain</option>
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

                    <textarea onChange={this.blastStringUpdate} placeholder="Raw or FASTA formatted peptide sequence"></textarea>

                    <label>Expect Threshold</label>

                    <select className="expect" name="threshold" defaultValue="10" onChange={this.expectUpdate}>
                        <option value="0.0001">0.0001</option>
                        <option value="0.001">0.001</option>
                        <option value="0.01">0.01</option>
                        <option value="0.1">0.1</option>
                        <option value="1.0">1</option>
                        <option value="10">10</option>
                        <option value="100">100</option>
                        <option value="1000">1000</option>
                    </select>

                    <button onClick={this.blastSearch}>BLAST Search</button>
                </Box>
            </main>
        )
    }
}
 
export default Search;