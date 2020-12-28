import React, { useEffect } from "react";
import { useQuery } from "react-apollo";
import gql from "graphql-tag";
import Box from "../components/Box";
import ZincSites from "../components/ZincSites";
import PdbInfo from "../components/PdbInfo";
import NglInterface from "../components/NglInterface";
import { BarLoader } from "react-spinners";
import ReactGA from "react-ga";

const PdbPage = () => {

  useEffect(() => {
    ReactGA.initialize("UA-51790964-20");
    ReactGA.pageview(window.location.pathname + window.location.search);
    document.title = `PDB ${code} - ZincBind`;
  })

  const elements = window.location.href.split("/").filter(Boolean)
  const code = elements[elements.length - 1];

  const query1 = `{ pdb(id: "${code}") {
      title classification keywords depositionDate technique organism
      expressionSystem assembly resolution rvalue
  }}`;
  const QUERY1 = gql(query1);
  const query2 = `{ pdb(id: "${code}") {
      chains {
          count edges { node { id sequence atomiumId chainInteractions { count }} }
      } metals(element: "ZN") { count edges { node {
          id chainId residueNumber
      } } }
      ignored: metals(omissionReason__contains: "") { count edges { node {
            id chainId residueNumber omissionReason
      } } }
  }}`;
  const QUERY2 = gql(query2);
  const query3 = `{ pdb(id: "${code}") {
      zincsites { count edges { node { id family residues(primary: true) {
          edges { node {
              id atomiumId name insertionCode residueNumber
          } }
      } } } }
  }}`;
  const QUERY3 = gql(query3);
  const query4 = `{ pdb(id: "${code}") {assembly
      allMetals: metals { edges { node {
          id chainId residueNumber residueName insertionCode x y z
          coordinateBonds { edges { node { atom { id x y z } } } }
      } } }
      zincsites { count edges { node { id family residues(primary: true) {
          edges { node {
              id atomiumId name insertionCode residueNumber
              chainIdentifier atoms { edges { node { id name coordinateBonds { count } } } }
          } }
      } } } }
  }}`
  const QUERY4 = gql(query4);

  const { loading: loading1, data: data1 } = useQuery(QUERY1);
  const { loading: loading2, data: data2 } = useQuery(QUERY2);
  const { loading: loading3, data: data3 } = useQuery(QUERY3);
  const { loading: loading4, data: data4 } = useQuery(QUERY4);

  let residues = [];
  if (data4) {
    for (const edge of data4.pdb.zincsites.edges) {
      for (const edge2 of edge.node.residues.edges) {
        residues.push(edge2.node)
      }   
    }
  }
  
      

  return (
    <main className="pdb-page">
      {loading1  ? (
        <Box><BarLoader
          color={"#482c54"}
          css={{margin: "auto"}}
        /></Box>
      ) : (
        <>
          <Box className="heading"><h1>{ data1.pdb.title }</h1></Box>
          <PdbInfo pdb={data1.pdb} code={code} title={false} />
        </>
      )}

      {loading2 ? (
        <Box />
      ) : (
        <>
          { data2.pdb.chains.count > 0 &&
          <Box className="chains">
              <h2>Zinc-Bearing Chains: {data2.pdb.chains.count}</h2>
              {data2.pdb.chains.edges.map((edge) => {
                  return (<div className="pdb-chain" key={edge.node.id}>
                      <h3 className="chain-id">Chain {edge.node.atomiumId}</h3>
                      <div className="site-count">{ edge.node.chainInteractions.count } binding site{edge.node.chainInteractions.count === 1 ? "" : "s"}</div>
                      <div className="sequence">{ edge.node.sequence.split("").map((char, i) => {
                          return (char === char.toUpperCase() ? (<span key={i} className="binding">{ char }</span>) : <span key={i}>{ char }</span>)
                      }) }</div>
                  </div>)
              })}
          </Box>
          }

          <Box className={`atoms${data2.pdb.ignored.count ? " split" : ""}`}>
            <div className="identified">
              <h2>Zinc Atoms: {data2.pdb.metals.count}</h2>
              <div className="all-zincs">
                {data2.pdb.metals.edges.map(edge => {
                  return <div className="atom" key={edge.node.id}>{ edge.node.chainId }:{ edge.node.residueNumber }</div>
                })}
              </div>
            </div>
            {data2.pdb.ignored.count > 0 && 
            <div className="ignored">
              <h2>Not Used: {data2.pdb.ignored.count}</h2>
              <table className="ingored-zincs">
                <tbody>
                  {data2.pdb.ignored.edges.map(edge => {
                    return <tr key={edge.node.id}>
                      <td>{ edge.node.chainId }{ edge.node.residueNumber }: </td><td>{ edge.node.omissionReason }</td>
                    </tr>
                  })}
                  </tbody>
              </table>
            </div>}
          </Box>     
        </>
      )}

      {loading3 ? (
        <Box />
      ) : (
        data3.pdb.zincsites.count > 0 && (
          <Box className="sites">
            <h2>Zinc Binding Sites: { data3.pdb.zincsites.count }</h2>   
            <ZincSites sites={data3.pdb.zincsites.edges} />
          </Box>
        )
      )}

      {loading4 ? (
        <Box />
      ) : (
        <NglInterface
          code={code} assembly={data4.pdb.assembly}
          metals={data4.pdb.allMetals.edges}
          residues={residues}
          zoom={false}
        />
      )}
    </main>
  );
}
 
export default PdbPage;