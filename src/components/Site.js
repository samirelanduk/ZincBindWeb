import React, { Fragment, Component } from "react";
import { Link } from "react-router-dom";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Box from "./Box";

class Site extends Component {
    
    render() {
        const id = this.props.match.params.id;
        const query_string = `{ zincsite(id: "${id}") {
            id family pdb { id title }
            metals { count edges { node {
                id chainId residueNumber insertionCode element coordinateBonds { count }
            } } }
            residues(primary: true) { count edges { node {
                id chainIdentifier residueNumber insertionCode name
            } } }
        }}`
        const QUERY = gql(query_string);

        return (
        <main className="site-page">
            <Query query={QUERY} >
                {
                    ({loading, data}) => {
                        if (loading) {
                            return <Box />
                        }
                        return (
                            <Fragment>
                                <Box className="heading"><h1>{ data.zincsite.id }</h1></Box>

                                <div className="two-box">
                                    <Box>
                                        <h3>PDB</h3>
                                        <div className="site-pdb">
                                            <Link to={ "/pdbs/" + data.zincsite.pdb.id }>{ data.zincsite.pdb.id }</Link>: { data.zincsite.pdb.title }
                                        </div>

                                        <h3>Metals: { data.zincsite.metals.count }</h3>
                                        <div className="metals">
                                            { data.zincsite.metals.edges.map(edge => {
                                                return <div className="metal" key={edge.node.id}>
                                                    {edge.node.chainId}:{edge.node.residueNumber}{edge.node.insertionCode} ({edge.node.element}, {edge.node.coordinateBonds.count}-coordination)
                                                </div>
                                            }) }
                                        </div>

                                        <h3>Liganding Residues: { data.zincsite.residues.count }</h3>
                                        <div className="residues">
                                            { data.zincsite.residues.edges.map(edge => {
                                                return <div className="residue" key={edge.node.id}>
                                                    {edge.node.chainIdentifier}:{edge.node.residueNumber}{edge.node.insertionCode} ({edge.node.name})
                                                </div>
                                            }) }
                                        </div>
                                    </Box>
                                    <Box>
                                        
                                    </Box>
                                </div>
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