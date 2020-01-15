import React from "react";
import ReactDOM from 'react-dom';
import App from "./components/App";
import "./index.scss";

const chainResidues = [
  "VAL", "ILE", "LEU", "GLU", "GLN", "ASP", "ASN", "HIS", "TRP", "PHE",
  "TYR", "ARG", "LYS", "SER", "THR", "MET", "ALA", "GLY", "PRO", "CYS",
  "HIP", "HIE"
]

let metalToNgl = (metal) => {
  return `${metal.residueNumber}^${metal.insertionCode}:${metal.chainId}/0 and .${metal.residueName} and (%A or %)`
}

let residueToNgl = (residue) => {
  let s = `${residue.residueNumber}^${residue.insertionCode}:${residue.chainIdentifier}/0 and (%A or %)`;
  if (chainResidues.includes(residue.name)) {
    let includes = ["sidechain", ".CA"];
    for (const edge of residue.atoms.edges) {
      if (edge.node.coordinateBonds.count) {
        includes.push(`.${edge.node.name}`);
      }
    }
    if (includes.includes(".O")) {
      includes.push(".C");
    }
    includes = includes.join(" or ");
    s = `(${includes}) and ${s}`;
  }
  return s;
}

ReactDOM.render(
  <App />,
  document.getElementById("zincbind")
);

export { residueToNgl, metalToNgl };