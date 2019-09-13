import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Box from "./Box";
import SearchNav from "./SearchNav";
import SearchResult from "./SearchResult";

class AllData extends Component {
    
    render() {

        const QUERY = gql`query pdbs($sort: String) { pdbs(sort: $sort, first: 25) { edges { node {
            id depositionDate organism title classification technique resolution zincsites {
                edges { node { id residues { edges { node { id atomiumId }}} } }
            }
        } } } }`;

        let params = this.props.history.location.search;
        let keywords = params.slice(1).split("&");
        let sort = "-deposition_date";
        for (let keyword of keywords) {
            if (keyword.split("=")[0] === "sort") {
                sort = keyword.split("=")[1];
            }
        }

        return (
            <main className="all-data search-results">
                <Box>
                    <h1>All Data</h1>
                </Box>

                <SearchNav history={this.props.history} sort={sort} />

                <Query query={QUERY} variables={{sort: sort}} >
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