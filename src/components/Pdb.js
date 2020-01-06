import React, { Fragment, Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Box from "./Box";

class Pdb extends Component {
    
    render() {
        const code = this.props.match.params.code;
        const query_string = `{ pdb(id: "${code}") {
            title classification keywords depositionDate technique organism
            expressionSystem assembly resolution rvalue chains {
                count edges { node { id sequence atomiumId chainInteractions { count }} }
            } metals(element: "ZN") { count edges { node { id chainId residueNumber } } }
            ignored: metals(omissionReason__contains: "") { count edges { node {
                 id chainId residueNumber omissionReason
            } } }
        }}`
        const QUERY = gql(query_string);

        return (
        <main className="pdb">
            <Query query={QUERY} >
                {
                    ({loading, data}) => {
                        if (loading) {
                            return <Box />
                        }
                        return (
                            <Fragment>
                                <Box className="heading"><h1>{ data.pdb.title }</h1></Box>
                                <Box className="properties">
                                    <div className="pdb-row"><span className="property">Code: </span> <a href={"https://www.rcsb.org/structure/" + code} target="_blank" rel="noopener noreferrer">{code}</a></div>
                                    <div className="pdb-row"><span className="property">Deposited: </span> {data.pdb.depositionDate}</div>

                                    <div className="pdb-row"><span className="property">Resolution: </span> {data.pdb.resolution}</div>
                                    <div className="pdb-row"><span className="property">R-value: </span> {data.pdb.rvalue}</div> 

                                    <div className="pdb-row"><span className="property">Classification: </span> {data.pdb.classification}</div>
                                    <div className="pdb-row"><span className="property">Biological Assembly: </span> {data.pdb.assembly}</div>

                                    <div className="pdb-row full"><span className="property">Source Organism: </span> <span className="species">{data.pdb.organism}</span></div>
                                    <div className="pdb-row full"><span className="property">Expression Organism: </span> <span className="species">{data.pdb.expressionSystem}</span></div>
                                    <div className="pdb-row full"><span className="property">Experimental Technique: </span> {data.pdb.technique}</div>
                                    <div className="pdb-row full"><span className="property">Keywords: </span> {data.pdb.keywords}</div>
                                </Box>

                                <Box className="chains">
                                    <h2>Zinc-Bearing Chains: {data.pdb.chains.count}</h2>
                                    {data.pdb.chains.edges.map((edge) => {
                                        return (<div className="pdb-chain" key={edge.node.id}>
                                            <h3 className="chain-id">Chain {edge.node.atomiumId}</h3>
                                            <div className="site-count">{ edge.node.chainInteractions.count } binding site{edge.node.chainInteractions.count === 1 ? '' : 's'}</div>
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