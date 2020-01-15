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
                ["deposited_gt", "Deposited before", "e.g. 2000-01-01"]
            ],
            pdbTerms: [[0, ""]],
            siteTerms: [[0, ""]],
            blastString: "",
            expectString: "10"
        }
        let siteSelect = [];
        for (const row of this.state.pdbSelect) {
            siteSelect.push(["structure-" + row[0], "Structure " + row[1], row[2]]);
        }
        siteSelect.push(["family", "Family is", "e.g. C2H2"]);
        siteSelect.push(["code", "Family contains", "e.g. C2"]);
        siteSelect.push(["residues", "Residue Names contain", "e.g. GLU, BON"]);
        this.state.siteSelect = siteSelect;
    }

    addTerm = (e) => {
        const dataType = e.target.getAttribute("data-type");
        let terms = this.state[`${dataType}Terms`];
        let done = terms.map(term => term[0]);
        let next = 0;
        for (let x = 0; x < this.state[`${dataType}Select`].length; x++) {
            if (!(done.includes(x))) {
                next = x;
                break;
            }
        }
        terms.push([next, ""]);
        this.setState({[`${dataType}Terms`]: terms});
    }

    removeTerm = (e) => {
        const dataType = e.target.parentNode.getAttribute("data-type");
        const index = parseInt(e.target.parentNode.getAttribute("data-index"));
        let terms = this.state[`${dataType}Terms`];
        terms.splice(index, 1);
        this.setState({[`${dataType}Terms`]: terms});
    }

    updateSelect = (e) => {
        const dataType = e.target.parentNode.getAttribute("data-type");
        const index = parseInt(e.target.parentNode.getAttribute("data-index"));
        let terms = this.state[`${dataType}Terms`];
        terms[index] = [e.target.selectedIndex, ""];
        this.setState({[`${dataType}Terms`]: terms});
    }

    updateInput = (e) => {
        const dataType = e.target.parentNode.getAttribute("data-type");
        const index = parseInt(e.target.parentNode.getAttribute("data-index"));
        let terms = this.state[`${dataType}Terms`];
        terms[index][1] = e.target.value;
        this.setState({[`${dataType}Terms`]: terms});
    }

    keyDown = (e) => {
        if (e.which === 13 || e.keyCode === 13) {
            this.search(e);
        }
    }

    search = (e) => {
        let dataType = e.target.getAttribute("data-type");
        if (!dataType) {
            dataType = e.target.parentNode.getAttribute("data-type");
        }
        let query = [];
        for (let term of this.state[`${dataType}Terms`]) {
            if (term[1]) {
                query.push(`${this.state[`${dataType}Select`][term[0]][0]}=${term[1]}`);
            }
        }
        query = query.join("&");
        if (query) {
            this.props.history.push(`/search?${query}`);
        }
    }

    blastStringUpdate = (e) => {
        let value = e.target.value;
        let lines = value.split(/[\r\n]+/);
        if (lines[0][0] === ">") {
            lines.shift();
        }
        this.setState({blastString: lines.join("")});
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
        document.title = "Search - ZincBind";
        
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
                            <div className="search-input" key={i} data-index={i} data-type="pdb">
                                <select value={this.state.pdbSelect[term[0]][0]} onChange={this.updateSelect}>
                                    {this.state.pdbSelect.map((option, o) => {
                                        return <option key={o} value={option[0]}>{option[1]}</option>
                                    })}
                                </select>
                                <input type="text" placeholder={this.state.pdbSelect[term[0]][2]} onChange={this.updateInput} onKeyDown={this.keyDown} value={term[1]}></input>{
                                    this.state.pdbTerms.length > 1 && <button className="remove-term" onClick={this.removeTerm}>×</button>
                                }
                            </div>
                        )
                    })}
                    
                    <div className="search-buttons">
                        <button onClick={this.addTerm} data-type="pdb">New Term</button>
                        <button onClick={this.search} data-type="pdb">Search</button>
                    </div> 
                </Box>

                <Box>
                    <h2>Site Search</h2>
                    {this.state.siteTerms.map((term, i) => {
                        return (
                            <div className="search-input" key={i} data-index={i} data-type="site">
                                <select value={this.state.siteSelect[term[0]][0]} onChange={this.updateSelect}>
                                    {this.state.siteSelect.map((option, o) => {
                                        return <option key={o} value={option[0]}>{option[1]}</option>
                                    })}
                                </select>
                                <input type="text" placeholder={this.state.siteSelect[term[0]][2]} onChange={this.updateInput} onKeyDown={this.keyDown} value={term[1]}></input>{
                                    this.state.siteTerms.length > 1 && <button className="remove-term" onClick={this.removeTerm}>×</button>
                                }
                            </div>
                        )
                    })}
                    
                    <div className="search-buttons">
                        <button onClick={this.addTerm} data-type="site">New Term</button>
                        <button onClick={this.search} data-type="site">Search</button>
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