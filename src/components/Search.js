import React, { Component } from "react";
import Box from "./Box";
import SearchResults from "./SearchResults";

class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pdbSelect: [
                ["title", "Title contains", "e.g. antibody, carbonic anhydrase"],
                ["classification", "Classification contains", "e.g. oxidoreductase, membrane"],
                ["keywords", "Keywords contain", "e.g. ion channel, zinc finger"],
                ["organism", "Organism contains", "e.g. homo sapiens"],
                ["expression", "Expression System contains", "e.g. saccharomyces"],
                ["technique", "Technique contains", "e.g. NMR"],
                ["resolution_lt", "Resolution better than", "e.g. 2.5"],
                ["resolution_gt", "Resolution worse than", "e.g. 10"],
                ["rfactor_lt", "Rfactor better than", "e.g. 0.2"],
                ["rfactor_gt", "Rfactor worse than", "e.g. 0.3"],
                ["deposited_lt", "Deposited since", "e.g. 2017-01-01"],
                ["deposted_gt", "Deposited before", "e.g. 2000-01-01"]
            ],
            pdbTerms: [[0, ""]],
            siteTerms: [],
            blastString: "",
            expectString: "10"
        }
        let siteSelect = [];
        for (const row of this.state.pdbSelect) {
            siteSelect.push([row[0], row[1], row[2]]);
        }
        this.state.siteSelect = siteSelect;
    }

    addTerm = () => {
        let terms = this.state.pdbTerms;
        terms.push([0, ""]);
        this.setState({pdbTerms: terms});
    }

    removeTerm = (e) => {
        const index = parseInt(e.target.parentNode.getAttribute("data-index"));
        let terms = this.state.pdbTerms;
        terms.splice(index, 1);
        this.setState({terms: terms});
    }

    updateSelect = (e) => {
        const index = parseInt(e.target.parentNode.getAttribute("data-index"));
        let terms = this.state.pdbTerms;
        terms[index] = [e.target.selectedIndex, ""];
        this.setState({pdbTerms: terms});
    }

    updateInput = (e) => {
        const index = parseInt(e.target.parentNode.getAttribute("data-index"));
        let terms = this.state.pdbTerms;
        terms[index][1] = e.target.value;
        this.setState({pdbTerms: terms});
    }

    search = () => {
        let query = [];
        for (let term of this.state.pdbTerms) {
            if (term[1]) {
                query.push(`${this.state.pdbSelect[term[0]][0]}=${term[1]}`);
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
            return <SearchResults history={this.props.history} />
        }
        return (
            <main className="search">
                <Box><h1>Advanced Search</h1></Box>
                
                <Box>
                    <h2>PDB Search</h2>
                    {this.state.pdbTerms.map((term, i) => {
                        return (
                            <div className="search-input" key={i} data-index={i}>
                                <select value={this.state.pdbSelect[term[0]][0]} onChange={this.updateSelect}>
                                    {this.state.pdbSelect.map((option, o) => {
                                        return <option key={o} value={option[0]}>{option[1]}</option>
                                    })}
                                </select>
                                <input type="text" placeholder={this.state.pdbSelect[term[0]][2]} onChange={this.updateInput} value={term[1]}></input>{
                                    this.state.pdbTerms.length > 1 && <button className="remove-term" onClick={this.removeTerm}>×</button>
                                }
                            </div>
                        )
                    })}
                    
                    <div className="search-buttons">
                        <button onClick={this.addTerm}>New Term</button>
                        <button onClick={this.search}>Search</button>
                    </div> 
                </Box>


                <Box>
                    <h2>Site Search</h2>

                    <div className="search-input" data-index={1}>
                        <select value="title" onChange={this.updateSelect}>
                            <option data-placeholder="e.g. antibody, carbonic anhydrase" value="title">Structure Title contains</option>
                            <option data-placeholder="e.g. oxidoreductase, membrane" value="classification">CStructure lassification contains</option>
                            <option data-placeholder="e.g. ion channel, zinc finger" value="keywords">Structure Keywords contain</option>
                            <option data-placeholder="e.g. homo sapiens" value="organism">Structure Organism contains</option>
                            <option data-placeholder="e.g. saccharomyces" value="expression">Structure Expression System contains</option>
                            <option data-placeholder="e.g. NMR" value="technique">Structure Technique contains</option>
                            <option data-placeholder="e.g. 2.5" value="resolution_lt">Structure Resolution better than</option>
                            <option data-placeholder="e.g. 10" value="resolution_gt">Structure Resolution worse than</option>
                            <option data-placeholder="e.g. 0.2" value="rfactor_lt">Structure Rfactor better than</option>
                            <option data-placeholder="e.g. 0.3" value="rfactor_gt">Structure Rfactor worse than</option>
                            <option data-placeholder="e.g. 2017-01-01" value="deposited_gt">Structure Deposited since</option>
                            <option data-placeholder="e.g. 2000-01-01" value="deposited_lt">vDeposited before</option>
                            <option data-placeholder="e.g. H3, C2H2" value="family">Family is</option>
                            <option data-placeholder="e.g. H3, C2" value="code">Family contains</option>
                            <option data-placeholder="e.g. GLU, BON" value="residue_names">Residue names contain</option>
                        </select>
                        <input type="text" onChange={this.handleInputChange}></input>
                    </div>

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