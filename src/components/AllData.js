import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Box from "./Box";
import SearchResult from "./SearchResult";

class AllData extends Component {
    
    render() {

        const QUERY = gql`{ pdbs(first: 25) { edges { node {
            id depositionDate organism title classification technique resolution zincsites {
                edges { node { id residues { edges { node { id atomiumId }}} } }
            }
        } } } }`;

        return (
            <main className="all-data search-results">
                <Box>
                    <h1>All Data</h1>
                </Box>

                <Query query={QUERY} >
                    {
                        ({loading, data}) => {
                            if (loading) {
                                return <div className="results"></div>
                            }
                            return <div className="results">{
                                data.pdbs.edges.map((edge) => {
                                    return <SearchResult pdb={edge.node} key={edge.node.id} />
                                })
                            }</div>
                            
                        }
                    }
                </Query>
                
            </main>
        )
    }
}

export default AllData;