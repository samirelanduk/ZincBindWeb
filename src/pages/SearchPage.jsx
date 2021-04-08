import React, { useState, useEffect } from "react";
import ReactGA from "react-ga";
import Box from "../components/Box";
import SearchResults from "./SearchResultsPage";

const SearchPage = props => {

  useEffect(() => {
    document.title = "Search - ZincBind";
    ReactGA.initialize("UA-51790964-20");
    ReactGA.pageview(window.location.pathname + window.location.search);
  })

  const [pdbSelect,] = useState([
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
  ])
  const [pdbTerms, setPdbTerms] = useState([[0, ""]]);
  const [siteTerms, setSiteTerms] = useState([[0, ""]]);
  const [blastString, setBlastString] = useState("");
  const [expectString, setExpectString] = useState("10");

        
  let siteSelectList = [];
  for (const row of pdbSelect) {
    siteSelectList.push(["structure-" + row[0], "Structure " + row[1], row[2]]);
  }
  siteSelectList.push(["family", "Family is", "e.g. C2H2"]);
  siteSelectList.push(["code", "Family contains", "e.g. C2"]);
  siteSelectList.push(["residues", "Residue Names contain", "e.g. GLU, BON"]);
  const [siteSelect,] = useState(siteSelectList);

  const addTerm = (e) => {
    const dataType = e.target.getAttribute("data-type");
    let terms = dataType === "pdb" ? pdbTerms : siteTerms;
    let done = terms.map(term => term[0]);
    let next = 0;
    for (let x = 0; x < (dataType === "pdb" ? pdbSelect : siteSelect).length; x++) {
      if (!(done.includes(x))) {
        next = x;
        break;
      }
    }
    terms.push([next, ""]);
    const set = dataType === "pdb" ? setPdbTerms : setSiteTerms;
    set([...terms]);
  }

  const removeTerm = (e) => {
    const dataType = e.target.getAttribute("data-type");
    const set = dataType === "pdb" ? setPdbTerms : setSiteTerms;
    let terms = dataType === "pdb" ? pdbTerms : siteTerms;
    const index = parseInt(e.target.parentNode.getAttribute("data-index"));
    terms.splice(index, 1);
    set([...terms]);
  }

  const updateSelect = (e) => {
    const dataType = e.target.parentNode.getAttribute("data-type");
    const index = parseInt(e.target.parentNode.getAttribute("data-index"));
    const set = dataType === "pdb" ? setPdbTerms : setSiteTerms;
    let terms = dataType === "pdb" ? pdbTerms : siteTerms;
    console.log(terms);
    terms[index] = [e.target.selectedIndex, ""];
    set([...terms]);
  }

  const updateInput = (e) => {
    const dataType = e.target.parentNode.getAttribute("data-type");
    const index = parseInt(e.target.parentNode.getAttribute("data-index"));
    const set = dataType === "pdb" ? setPdbTerms : setSiteTerms;
    let terms = dataType === "pdb" ? pdbTerms : siteTerms;
    terms[index][1] = e.target.value;
    set([...terms]);
  }

  const keyDown = (e) => {
    if (e.which === 13 || e.keyCode === 13) {
      search(e);
    }
  }

  const search = (e) => {
    let dataType = e.target.getAttribute("data-type");
    if (!dataType) {
      dataType = e.target.parentNode.getAttribute("data-type");
    }
    let query = [];
    let terms = dataType === "pdb" ? pdbTerms : siteTerms;
    let select = dataType === "pdb" ? pdbSelect : siteSelect;
    for (let term of terms) {
      if (term[1]) {
        query.push(`${select[term[0]][0]}=${term[1]}`);
      }
    }
    query = query.join("&");
    if (query) {
      props.history.push(`/search?${query}`);
    }
  }

  const blastStringUpdate = (e) => {
    setBlastString(e.target.value.replace(/=/g, "%3D").replace(/\n/g, "\\n"));
  }

  const expectUpdate = (e) => {
    setExpectString(e.target.value);
  }

  const blastSearch = () => {
    if (blastString) {
      let query = `sequence=${blastString}&expect=${expectString}`;
      console.log(blastString)
      props.history.push(`/search?${query}`);
    }
  }
        
  if (props.history.location.search) {
    return <SearchResults history={props.history} />
  }

  return (
    <main className="search-page">
      <Box><h1>Advanced Search</h1></Box>
        
      <Box>
        <h2>PDB Search</h2>
        {pdbTerms.map((term, i) => {
          return (
            <div className="search-input" key={i} data-index={i} data-type="pdb">
              <select value={pdbSelect[term[0]][0]} onChange={updateSelect}>
                {pdbSelect.map((option, o) => {
                  return <option key={o} value={option[0]}>{option[1]}</option>
                })}
              </select>
              <input type="text" placeholder={pdbSelect[term[0]][2]} onChange={updateInput} onKeyDown={keyDown} value={term[1]}></input>{
                pdbTerms.length > 1 && <button className="remove-term" data-type="pdb" onClick={removeTerm}>×</button>
              }
            </div>
          )
        })}
        
        <div className="search-buttons">
          <button onClick={addTerm} data-type="pdb">New Term</button>
          <button onClick={search} data-type="pdb">Search</button>
        </div> 
      </Box>

      <Box>
        <h2>Site Search</h2>
        {siteTerms.map((term, i) => {
          return (
            <div className="search-input" key={i} data-index={i} data-type="site">
              <select value={siteSelect[term[0]][0]} onChange={updateSelect}>
                {siteSelect.map((option, o) => {
                  return <option key={o} value={option[0]}>{option[1]}</option>
                })}
              </select>
              <input type="text" placeholder={siteSelect[term[0]][2]} onChange={updateInput} onKeyDown={keyDown} value={term[1]}></input>{
                siteTerms.length > 1 && <button className="remove-term" data-type="site" onClick={removeTerm}>×</button>
              }
            </div>
          )
        })}
          
        <div className="search-buttons">
          <button onClick={addTerm} data-type="site">New Term</button>
          <button onClick={search} data-type="site">Search</button>
        </div> 
      </Box>


      <Box>
        <h2>BLAST Search</h2>

        <textarea onChange={blastStringUpdate} placeholder="Raw or FASTA formatted peptide sequence"></textarea>

        <label>Expect Threshold</label>

        <select className="expect" name="threshold" defaultValue="10" onChange={expectUpdate}>
          <option value="0.0001">0.0001</option>
          <option value="0.001">0.001</option>
          <option value="0.01">0.01</option>
          <option value="0.1">0.1</option>
          <option value="1.0">1</option>
          <option value="10">10</option>
          <option value="100">100</option>
          <option value="1000">1000</option>
        </select>

        <button onClick={blastSearch}>BLAST Search</button>
      </Box>
    </main>
  )
}
 
export default SearchPage;