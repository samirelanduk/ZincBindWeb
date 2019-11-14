import React, { Fragment, Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Box from "./Box";
import SearchNav from "./SearchNav";
import SearchResult from "./SearchResult";

class AllData extends Component {
    
    render() {

        const QUERY = this.props.query || gql`query pdbs($sort: String, $skip: Int) { pdbs(sort: $sort, first: 25, skip: $skip) { edges { node {
            id depositionDate organism title classification technique resolution zincsites {
                edges { node { id residues { edges { node { id atomiumId }}} } }
            }
        } } } count: stats { pdbCount }}`;

        let params = this.props.history.location.search;
        let keywords = params.slice(1).split("&");
        let sort = "-deposition_date";
        let skip = 0;
        for (let keyword of keywords) {
            if (keyword.split("=")[0] === "sort") {
                sort = keyword.split("=")[1];
            }
            if (keyword.split("=")[0] === "page") {
                skip = (parseInt(keyword.split("=")[1]) - 1) * 25;
            }
        }
        

        return (
            <main className="all-data search-results">
                <Box>
                    <h1>All Data</h1>
                </Box>

                

                <Query query={QUERY} variables={{sort: sort, skip: skip}} >
                    {
                        ({loading, data}) => {
                            if (loading) {
                                return <div className="results"></div>
                            }
                            return (
                                <Fragment>
                                <SearchNav history={this.props.history} sort={sort} count={data.count.pdbCount} />
                                <div className="results">{
                                    data.pdbs.edges.map((edge) => {
                                        return <SearchResult pdb={edge.node} key={edge.node.id} />
                                    })
                                }</div>
                                <SearchNav history={this.props.history} sort={sort} count={data.count.pdbCount} />
                                </Fragment>
                            );
                            
                        }
                    }
                </Query>
                
            </main>
        )
    }
}

export default AllData;