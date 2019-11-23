import React, { Fragment, Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Box from "./Box";
import SearchNav from "./SearchNav";
import PdbResult from "./PdbResult";
import SequenceResult from "./SequenceResult";
import SiteResult from "./SiteResult";

class SearchResults extends Component {

    paramsObject = (string) => {
        let params = {};
        if (string) {
            let queries = string.slice(1).split("&");
            for (const query of queries) {
                let [k, v] = query.split("=");
                params[k] = v;
            }
        }
        if (!"sort" in params) {
            params.sort = "-deposition_date";
        }
        return params
    }

    gqlFilter(params, lookup) {
        let query = [];
        for (let key in lookup) {
            if (key in params) {
                const value = isNaN(params[key]) ? `"${params[key]}"` : params[key];
                query.push(`${lookup[key]}: ${value}`)
            }
        }
        query = query ? ", " + query.join(", ") : query.join(", ");
        return query;
    }
    
    render() {
        // Get keywords as dict
        let params = this.paramsObject(this.props.history.location.search);

        // How many pages should be skipped?
        const skip = "page" in params ? (parseInt(params.page) - 1) * 25 : 0;

        // What kind of search is this?
        const isSite = Object.keys(params).some((key) => {
            return key.startsWith("structure") || ["family", "code", "residues"].includes(key);
        });
        if ("sequence" in params) {
            return this.renderBlast(params, skip);
        } else if (isSite) {
            return this.renderSiteSearch(params, skip);
        } else {
            return this.renderPdbSearch(params, skip);
        }
    }

    renderPdbSearch(params, skip) {

        // What filters should be applied
        
        let pdbQuery = ""; 
        if ("q" in params) {
            pdbQuery = `term: "${params.q}"`;
        } else {
            pdbQuery = this.gqlFilter(params, {
                title: "title__contains", classification: "classification__contains",
                keywords: "keywords__contains", organism: "organism__contains",
                expression: "expressionSystem__contains", technique: "technique__contains",
                resolution_lt: "resolution__lt", resolution_gt: "resolution__gt",
                rfactor_lt: "rfactor__lt", rfactor_gt: "rfactor__gt",
                deposited_lt: "depositionDate__lt", deposited_gt: "depositionDate__gt"
            })
        }

        // Make query
        const query_string = `query pdbs($sort: String, $skip: Int) { pdbs(sort: $sort, first: 25, skip: $skip${pdbQuery}) { edges { node {
            id depositionDate organism title classification technique resolution zincsites {
                edges { node { id family residues(primary: true) { edges { node { id atomiumId name }}} } }
            }
        } } } count: pdbs(sort: $sort${pdbQuery}) { count }}`

        const QUERY = gql(query_string);

        return (
            <main className="all-data search-results">
                <Box>
                    <h1>{pdbQuery ? "Search Results" : "All Data"}</h1>
                </Box>

                

                <Query query={QUERY} variables={{sort: params.sort, skip: skip}} >
                    {
                        ({loading, data}) => {
                            if (loading) {
                                return <div className="results"></div>
                            }
                            return (
                                <Fragment>
                                <SearchNav history={this.props.history} sort={params.sort} count={data.count.count} />
                                <div className="results">{
                                    data.pdbs.edges.map((edge) => {
                                        return <PdbResult pdb={edge.node} key={edge.node.id} />
                                    })
                                }</div>
                                <SearchNav history={this.props.history} sort={params.sort} count={data.count.count} />
                                </Fragment>
                            );
                            
                        }
                    }
                </Query>
                
            </main>
        )
    }

    renderBlast(params, skip) {
        const QUERY = gql`{ blast(sequence: "${params.sequence}", evalue: ${params.expect}, first: 25, skip: ${skip}) {
            count edges { node { id qseq hseq midline evalue score bitScore chain {
                id atomiumId pdb { id title } chainInteractions { edges { node { site { id family residues(primary: true) { edges { node { atomiumId name id }}}} }}}
            } } }
        } count: blast(sequence: "${params.sequence}", evalue: ${params.expect}) { count }}`
        return (
            <main className="all-data search-results">
                <Box><h1>BLAST Results</h1></Box>
                
                <Query query={QUERY} >
                {
                    ({loading, data}) => {
                        if (loading) {
                            return <div className="results"></div>
                        }
                        return (
                            <Fragment>
                            <SearchNav history={this.props.history} count={data.count.count} />
                            <div className="results">{
                                data.blast.edges.map((edge) => {
                                    return <SequenceResult sequence={edge.node} key={edge.node.id} />
                                })
                            }</div>
                            <SearchNav history={this.props.history} count={data.count.count} />
                            </Fragment>
                        );
                        
                    }
                }
                </Query>
            </main>
        )
    }

    renderSiteSearch(params, skip) {
        const siteQuery = this.gqlFilter(params, {
            family: "family", code: "family__contains",
            residues: "residueNames__contains"
        })

        const query_string = `query zincsites($skip: Int) {
            zincsites(first: 25, skip: $skip${siteQuery}) { edges { node {
                id family pdb { title } residues(primary: true) { edges { node { atomiumId name }}}
            } } }
            count: zincsites(${siteQuery}) { count }
        }`

        const QUERY = gql(query_string);
        return (
            <main className="all-data search-results">
                <Box><h1>Search Results</h1></Box>
                
                <Query query={QUERY} variables={{skip: skip}} >
                {
                    ({loading, data}) => {
                        if (loading) {
                            return <div className="results"></div>
                        }
                        return (
                            <Fragment>
                            <SearchNav history={this.props.history} count={data.count.count} />
                            <div className="results">{
                                data.zincsites.edges.map((edge) => {
                                    return <SiteResult site={edge.node} key={edge.node.id} />
                                })
                            }</div>
                            <SearchNav history={this.props.history} count={data.count.count} />
                            </Fragment>
                        );
                        
                    }
                }
                </Query>
            </main>
        )
    }
}

export default SearchResults;