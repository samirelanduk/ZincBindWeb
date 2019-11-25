import React, { Fragment, Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Box from "./Box";
import SearchNav from "./SearchNav";
import PdbResult from "./PdbResult";
import SequenceResult from "./SequenceResult";
import SiteResult from "./SiteResult";
import NoResults from "./NoResults";

class SearchResults extends Component {

    paramsObject = (string) => {
        let params = {};
        if (string) {
            let queries = string.slice(1).split("&");
            for (const query of queries) {
                let [k, v] = query.split("=");
                params[k] = decodeURI(v);
            }
        }
        if (!("sort" in params)) {
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
        console.log(params)
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
            pdbQuery = `, term: "${params.q}"`;
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
                    <h1>{pdbQuery.length > 2 ? "Search Results" : "All Data"}</h1>
                </Box>

                

                <Query query={QUERY} variables={{sort: params.sort, skip: skip}} >
                    {
                        ({loading, data}) => {
                            if (loading) {
                                return (
                                    <Fragment>
                                        <SearchNav />
                                        <div className="results"></div>
                                    </Fragment>
                                )
                            }
                            if (data.count.count === 0) {
                                return <NoResults q={ "q" in params }/>
                            }
                            return (
                                <Fragment>
                                <SearchNav history={this.props.history} sort={params.sort} count={data.count.count} params={params} />
                                <div className="results">{
                                    data.pdbs.edges.map((edge) => {
                                        return <PdbResult pdb={edge.node} key={edge.node.id} />
                                    })
                                }</div>
                                <SearchNav history={this.props.history} sort={params.sort} count={data.count.count} params={params} />
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
            residues: "residueNames__contains",
            "structure-title": "pdb__title__contains",
            "structure-classification": "pdb__classification__contains",
            "structure-keywords": "pdb__keywords__contains",
            "structure-organism": "pdb__organism__contains",
            "structure-expression": "pdb__expressionSystem__contains",
            "structure-technique": "pdb__technique__contains",
            "structure-resolution_lt": "pdb__resolution__lt",
            "structure-resolution_gt": "pdb__resolution__gt",
            "structure-rfactor_lt": "pdb__rfactor__lt",
            "structure-rfactor_gt": "pdb__rfactor__gt",
            "structure-deposited_lt": "pdb__depositionDate__lt",
            "structure-deposited_gt": "pdb__depositionDate__gt"
        })

        const query_string = `query zincsites($skip: Int, $sort: String) {
            zincsites(first: 25, skip: $skip, sort: $sort${siteQuery}) { edges { node {
                id family pdb { title organism depositionDate } residues(primary: true) { edges { node { id atomiumId name }}}
            } } }
            count: zincsites(${siteQuery}) { count }
        }`

        const QUERY = gql(query_string);
        let sort = (params.sort[0] === "-" ? "-" : "") + "pdb__" + params.sort.replace("-", "")
        
        return (
            <main className="all-data search-results">
                <Box><h1>Search Results</h1></Box>
                
                <Query query={QUERY} variables={{skip: skip, sort: sort}} >
                {
                    ({loading, data}) => {
                        if (loading) {
                            return <div className="results"></div>
                        }
                        if (data.count.count === 0) {
                            return <NoResults q={false}/>
                        }
                        return (
                            <Fragment>
                            <SearchNav history={this.props.history} count={data.count.count} params={params} />
                            <div className="results">{
                                data.zincsites.edges.map((edge) => {
                                    return <SiteResult site={edge.node} key={edge.node.id} />
                                })
                            }</div>
                            <SearchNav history={this.props.history} count={data.count.count} params={params} />
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
            count edges { node { id qseq hseq midline evalue score bitScore hitFrom hitTo chain {
                id atomiumId sequence pdb { id title depositionDate organism } chainInteractions { edges { node { site { id family residues(primary: true) { edges { node { atomiumId name id }}}} }}}
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
                        if (data.count.count === 0) {
                            return <NoResults sequence={true}/>
                        }
                        return (
                            <Fragment>
                            <SearchNav history={this.props.history} count={data.count.count} params={params} />
                            <div className="results">{
                                data.blast.edges.map((edge) => {
                                    return <SequenceResult sequence={edge.node} key={edge.node.id} />
                                })
                            }</div>
                            <SearchNav history={this.props.history} count={data.count.count} params={params} />
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