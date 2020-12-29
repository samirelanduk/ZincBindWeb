import React from "react";
import Box from "./Box";

const NoResults = (props) => {

  let sentence = "Perhaps try a more vague search?";
  if (props.q) {
    sentence = "Search is case-insensitive, and searches PDB codes (for exact matches) and PDB descriptions, classifications, organisms, and experimental techniques (for partial matches).";
  }
  if (props.sequence) {
    sentence = "BLAST search currently requires peptide sequences only - did you submit a nucleotide sequence?";
  }
  return <Box><div className="no-results">
    <p>There were no results for this search.</p>

    <p>{ sentence }</p>
  </div></Box>
}

export default NoResults;
