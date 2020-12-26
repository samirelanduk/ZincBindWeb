import React, { Fragment, Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Box from "../components/Box";
import ZincSites from "../components/ZincSites";
import PdbInfo from "../components/PdbInfo";
import NglInterface from "../components/NglInterface";
import { BarLoader } from "react-spinners";
import ReactGA from "react-ga";

class PdbPage extends Component {
    
    render() {
        const code = this.props.match.params.code;
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
        ReactGA.initialize("UA-51790964-20");
        ReactGA.pageview(window.location.pathname + window.location.search);

        return (
        <main className="pdb-page">
            <Query query={QUERY1} >
                {
                    ({loading, data}) => {
                        if (loading) {
                            return <Box><BarLoader
                                color={"#482c54"}
                                css={{margin: "auto"}}
                            /></Box>
                        }
                        document.title = code + " - ZincBind";
                        return (
                            <Fragment>
                                <Box className="heading"><h1>{ data.pdb.title }</h1></Box>
                                <PdbInfo pdb={data.pdb} code={code} title={false} />
                            </Fragment>
                        )
                    }
                }
            </Query>
            <Query query={QUERY2} >
                {
                    ({loading, data}) => {
                        if (loading) {
                            return <Box />
                        }
                        document.title = code + " - ZincBind";
                        return (
                            <Fragment>
                                { data.pdb.chains.count > 0 &&
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
                                }

                                <Box className={`atoms${data.pdb.ignored.count ? " split" : ""}`}>
                                    <div className="identified">
                                        <h2>Zinc Atoms: {data.pdb.metals.count}</h2>
                                        <div className="all-zincs">
                                            {data.pdb.metals.edges.map(edge => {
                                                return <div className="atom" key={edge.node.id}>{ edge.node.chainId }:{ edge.node.residueNumber }</div>
                                            })}
                                        </div>
                                    </div>
                                    {data.pdb.ignored.count > 0 && 
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
                                    </div>}
                                </Box>
                            </Fragment>
                        )
                    }
                }
            </Query>
            <Query query={QUERY3} >
                {
                    ({loading, data}) => {
                        if (loading) {
                            return <Box />
                        }
                        document.title = code + " - ZincBind";
                        return (
                            data.pdb.zincsites.count > 0 &&
                                <Box className="sites">
                                    <h2>Zinc Binding Sites: { data.pdb.zincsites.count }</h2>
                                    
                                    <ZincSites sites={data.pdb.zincsites.edges} />
                                </Box>
                        )
                    }
                }
            </Query>
            <Query query={QUERY4} >
                {
                    ({loading, data}) => {
                        if (loading) {
                            return <Box />
                        }
                        
                        let residues = [];
                        for (const edge of data.pdb.zincsites.edges) {
                            for (const edge2 of edge.node.residues.edges) {
                                residues.push(edge2.node)
                            }   
                        }
                        return (
                            <NglInterface
                                code={code} assembly={data.pdb.assembly}
                                metals={data.pdb.allMetals.edges}
                                residues={residues}
                                zoom={false}
                            />
                        )
                    }
                }
                
            </Query>
        </main>
        );
    }
}
 
export default PdbPage;