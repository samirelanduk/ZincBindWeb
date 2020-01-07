import React, { Fragment, Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Box from "./Box";
import ZincSites from "./ZincSites";
import PdbInfo from "./PdbInfo";
import NglInterface from "./NglInterface";

class Pdb extends Component {
    
    render() {
        const code = this.props.match.params.code;
        const query_string = `{ pdb(id: "${code}") {
            title classification keywords depositionDate technique organism
            expressionSystem assembly resolution rvalue chains {
                count edges { node { id sequence atomiumId chainInteractions { count }} }
            } metals(element: "ZN") { count edges { node {
                id chainId residueNumber
            } } }
            ignored: metals(omissionReason__contains: "") { count edges { node {
                 id chainId residueNumber omissionReason
            } } }
            allMetals: metals { edges { node {
                id chainId residueNumber residueName insertionCode
            } } }
            zincsites { count edges { node { id family residues(primary: true) {
                edges { node { id atomiumId name } }
            } } } }
        }}`
        const QUERY = gql(query_string);

        return (
        <main className="pdb-page">
            <Query query={QUERY} >
                {
                    ({loading, data}) => {
                        if (loading) {
                            return <Box />
                        }
                        return (
                            <Fragment>
                                <Box className="heading"><h1>{ data.pdb.title }</h1></Box>
                                <PdbInfo pdb={data.pdb} code={code} title={false} />

                                <Box className="chains">
                                    <h2>Zinc-Bearing Chains: {data.pdb.chains.count}</h2>
                                    {data.pdb.chains.edges.map((edge) => {
                                        return (<div className="pdb-chain" key={edge.node.id}>
                                            <h3 className="chain-id">Chain {edge.node.atomiumId}</h3>
                                            <div className="site-count">{ edge.node.chainInteractions.count } binding site{edge.node.chainInteractions.count === 1 ? "" : "s"}</div>
                                            <div className="sequence">{ edge.node.sequence.split("").map((char, i) => {
                                                return (char === char.toUpperCase() ? (<span key={i} className="binding">{ char }</span>) : <span key={i}>{ char }</span>)
                                            }) }</div>
                                        </div>)
                                    })}
                                </Box>

                                <Box className="atoms">
                                    <div className="identified">
                                        <h2>Zinc Atoms: {data.pdb.metals.count}</h2>
                                        <div className="all-zincs">
                                            {data.pdb.metals.edges.map(edge => {
                                                return <div className="atom" key={edge.node.id}>{ edge.node.chainId }:{ edge.node.residueNumber }</div>
                                            })}
                                        </div>
                                    </div>
                                    <div className="ignored">
                                        <h2>Not Used: {data.pdb.ignored.count}</h2>
                                        <table className="ingored-zincs">
                                            <tbody>
                                                {data.pdb.ignored.edges.map(edge => {
                                                    return <tr key={edge.node.id}>
                                                        <td>{ edge.node.chainId }{ edge.node.residueNumber }: </td><td>{ edge.node.omissionReason }</td>
                                                    </tr>
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </Box>

                                <Box className="sites">
                                    <h2>{ data.pdb.zincsites.count } Zinc Binding Site{ data.pdb.zincsites.count === 1 ? "" : "s"}</h2>
                                    <ZincSites sites={data.pdb.zincsites.edges } />
                                </Box>

                                <NglInterface code={code} assembly={data.pdb.assembly} metals={data.pdb.allMetals.edges}/>
                            </Fragment>
                        )
                    }
                }
                
            </Query>
        </main>
        );
    }
}
 
export default Pdb;