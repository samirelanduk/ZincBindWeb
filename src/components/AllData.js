import React, { Fragment, Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Box from "./Box";
import SearchNav from "./SearchNav";
import SearchResult from "./SearchResult";

class AllData extends Component {

    paramsObject = (string) => {
        let params = {};
        if (string) {
            let queries = string.slice(1).split("&");
            for (const query of queries) {
                let [k, v] = query.split("=");
                params[k] = v;
            }
        }
        return params
    }
    
    render() {

        // Get keywords as dict
        let params = this.paramsObject(this.props.history.location.search);

        // How should the results be sorted?
        const sort = "sort" in params ? params.sort : "-deposition_date";

        // How many pages should be skipped?
        const skip = "page" in params ? (parseInt(params.page) - 1) * 25 : 0;

        // What filters should be applied
        const lookup = {
            title: "title__contains", classification: "classification__contains",
            keywords: "keywords__contains", organism: "organism__contains",
            expression: "expressionSystem__contains", technique: "technique__contains",
            resolution_lt: "resolution__lt", resolution_gt: "resolution__gt",
            rfactor_lt: "rfactor__lt", rfactor_gt: "rfactor__gt",
            deposited_lt: "depositionDate__lt", deposited_gt: "depositionDate__gt"
        }
        let query = [];
        for (let key in lookup) {
            if (key in params) {
                const value = isNaN(params[key]) ? `"${params[key]}"` : params[key];
                query.push(`${lookup[key]}: ${value}`)
            }
        }
        query = query.join(", ");
        if (query) {
            query = ", " + query;
        }
        console.log(query);

        // Make query
        const query_string = `query pdbs($sort: String, $skip: Int) { pdbs(sort: $sort, first: 25, skip: $skip${query}) { edges { node {
            id depositionDate organism title classification technique resolution zincsites {
                edges { node { id residues { edges { node { id atomiumId }}} } }
            }
        } } } count: stats { pdbCount }}`

        const QUERY = gql(query_string);

        
        

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