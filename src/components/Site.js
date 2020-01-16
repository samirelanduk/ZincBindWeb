import React, { Fragment, Component } from "react";
import { Link } from "react-router-dom";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Box from "./Box";
import ZincSites from "./ZincSites";
import PdbInfo from "./PdbInfo";
import NglInterface from "./NglInterface";
import { metalToNgl, residueToNgl } from "../index";
import NotFound from "./NotFound";
import { BarLoader } from "react-spinners";

class Site extends Component {

    elementClick(e) {
        
        const selector = e.target.dataset.ngl;
        let stage = window.stage;
        const rep = e.target.classList.contains("metal") ? "ball+stick" : "licorice";
        if (e.target.classList.contains("active")) {
            e.target.classList.remove("active");
            stage.residueColors[selector].setVisibility(false);
        } else {
            e.target.classList.add("active");
            var r = stage.compList[0].addRepresentation(rep, {
                color: "#16a085", aspectRatio: 8, sele: selector, assembly: stage.assembly
            });
            stage.residueColors[selector] = r;
        }
    }
    
    render() {
        const id = this.props.match.params.id;
        const query_string = `{ zincsite(id: "${id}") {
            id family pdb { 
                id title classification keywords depositionDate technique organism
                expressionSystem assembly resolution rvalue
            }
            metals { count edges { node {
                id chainId residueNumber residueName element insertionCode x y z
                coordinateBonds { count edges { node { atom { id x y z } } } }
            } } }
            residues(primary: true) { count edges { node {
                id chainIdentifier residueNumber insertionCode name chainSignature
                atoms { edges { node { id name coordinateBonds { count } } } }
            } } }
            group { zincsites { count edges { node { id family residues(primary: true) {
                edges { node { id atomiumId name } }
            } } } } }
            chainInteractions { count edges { node { sequence chain { id atomiumId }}}}
        }}`
        const QUERY = gql(query_string);
        document.title = id + " - ZincBind";

        return (
        <main className="site-page">
            <Query query={QUERY} >
                {
                    ({loading, data, error}) => {
                        if (loading) {
                            return <Box><BarLoader
                                color={"#482c54"}
                                css={{margin: "auto"}}
                            /></Box>
                        }
                        if (error && error.message.substring("not found")) {
                            return <NotFound />
                        }
                        let data_ = JSON.parse(JSON.stringify(data));
                        let index = null;
                        for (let i = 0; i < data_.zincsite.group.zincsites.edges.length; i++) {
                            if (data_.zincsite.group.zincsites.edges[i].node.id === id) {
                                index = i; break;
                            }
                        }
                        let residues = [];
                        for (const edge of data.zincsite.residues.edges) {
                            residues.push(edge.node); 
                        }
                        data_.zincsite.group.zincsites.edges.shift(index);
                        data_.zincsite.group.zincsites.count -= 1;
                        
                        return (
                            <Fragment>
                                <Box className="heading"><h1>{ data_.zincsite.id }</h1></Box>

                                <div className="two-box">
                                    <Box>
                                        <h3 className="box-heading">PDB</h3>
                                        <div className="site-pdb">
                                            <Link to={ "/pdbs/" + data_.zincsite.pdb.id }>{ data_.zincsite.pdb.id }</Link>: { data_.zincsite.pdb.title }
                                        </div>

                                        <h3 className="box-heading">Metals: { data_.zincsite.metals.count }</h3>
                                        <div className="site-metals">
                                            { data_.zincsite.metals.edges.map(edge => {
                                                return <div className="metal" key={edge.node.id} onClick={this.elementClick} data-ngl={metalToNgl(edge.node)}>
                                                    {edge.node.chainId}:{edge.node.residueNumber}{edge.node.insertionCode} ({edge.node.element}, {edge.node.coordinateBonds.count}-coordination)
                                                </div>
                                            }) }
                                        </div>

                                        <h3 className="box-heading">Liganding Residues: { data_.zincsite.residues.count } ({ data_.zincsite.family })</h3>
                                        <div className="site-residues">
                                            { data_.zincsite.residues.edges.map(edge => {
                                                return <div className="residue" key={edge.node.id} onClick={this.elementClick} data-ngl={residueToNgl(edge.node)}>
                                                    {edge.node.chainIdentifier}:{edge.node.residueNumber}{edge.node.insertionCode} ({edge.node.name})
                                                </div>
                                            }) }
                                        </div>
                                    </Box>
                                    <Box>
                                        <h2>Equivalent Sites: { data_.zincsite.group.zincsites.count }</h2>
                                        {
                                        data_.zincsite.group.zincsites.count === 0 ? 
                                        <p>No equivalent sites - this binding site is unique in the database.</p> :
                                        <ZincSites sites={ data_.zincsite.group.zincsites.edges } />}
                                    </Box>
                                </div>

                                <
                                    NglInterface
                                    code={data_.zincsite.pdb.id} assembly={data_.zincsite.pdb.assembly}
                                    metals={data_.zincsite.metals.edges}
                                    residues={residues}
                                    zoom={true}
                                />

                                <Box className="chains">
                                    <h2>Chains Involved: {data_.zincsite.chainInteractions.count}</h2>
                                    {data_.zincsite.chainInteractions.edges.map((edge, i) => {
                                        return (<div className="pdb-chain" key={i}>
                                            <h3 className="chain-id">Chain {edge.node.chain.atomiumId}</h3>
                                            
                                            <div className="sequence">{ edge.node.sequence.split("").map((char, i) => {
                                                return (char === char.toUpperCase() ? (<span key={i} className="binding">{ char }</span>) : <span key={i}>{ char }</span>)
                                            }) }</div>
                                        </div>)
                                    })}
                                </Box>

                                <PdbInfo pdb={ data.zincsite.pdb } code={ data.zincsite.pdb.id} title={true} />
                            </Fragment>
                        )
                    }
                }
                
            </Query>
        </main>
        );
    }
}
 
export default Site;