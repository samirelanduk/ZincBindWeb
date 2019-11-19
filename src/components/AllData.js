import React, { Fragment, Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Box from "./Box";
import SearchNav from "./SearchNav";
import SearchResult from "./SearchResult";
import SequenceResult from "./SequenceResult";

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

        // What kind of search is this?
        if ("sequence" in params) {
            return this.renderBlast(params, skip);
        }

        // What filters should be applied
        const pdbLookup = {
            title: "title__contains", classification: "classification__contains",
            keywords: "keywords__contains", organism: "organism__contains",
            expression: "expressionSystem__contains", technique: "technique__contains",
            resolution_lt: "resolution__lt", resolution_gt: "resolution__gt",
            rfactor_lt: "rfactor__lt", rfactor_gt: "rfactor__gt",
            deposited_lt: "depositionDate__lt", deposited_gt: "depositionDate__gt"
        }
        let pdbQquery = [];
        for (let key in pdbLookup) {
            if (key in params) {
                const value = isNaN(params[key]) ? `"${params[key]}"` : params[key];
                pdbQquery.push(`${pdbLookup[key]}: ${value}`)
            }
        }
        pdbQquery = pdbQquery.join(", ");
        if (pdbQquery) {
            pdbQquery = ", " + pdbQquery;
        }
        const siteLookup = {
            family: "family", code: "family__contains",
            residue_name: "residueNames__contains"
        }
        let siteQuery = [];
        for (let key in siteLookup) {
            if (key in params) {
                const value = isNaN(params[key]) ? `"${params[key]}"` : params[key];
                siteQuery.push(`${siteLookup[key]}: ${value}`)
            }
        }
        siteQuery = siteQuery.join(", ");
        if (siteQuery) {
            siteQuery = `(${siteQuery})`;
        }

        // Make query
        const query_string = `query pdbs($sort: String, $skip: Int) { pdbs(sort: $sort, first: 25, skip: $skip${pdbQquery}) { edges { node {
            id depositionDate organism title classification technique resolution zincsites${siteQuery} {
                edges { node { id family residues(primary: true) { edges { node { id atomiumId name }}} } }
            }
        } } } count: pdbs(sort: $sort${pdbQquery}) { count }}`

        const QUERY = gql(query_string);

        
        

        return (
            <main className="all-data search-results">
                <Box>
                    <h1>{pdbQquery ? "Search Results" : "All Data"}</h1>
                </Box>

                

                <Query query={QUERY} variables={{sort: sort, skip: skip}} >
                    {
                        ({loading, data}) => {
                            if (loading) {
                                return <div className="results"></div>
                            }
                            return (
                                <Fragment>
                                <SearchNav history={this.props.history} sort={sort} count={data.count.count} />
                                <div className="results">{
                                    data.pdbs.edges.map((edge) => {
                                        return <SearchResult pdb={edge.node} key={edge.node.id} />
                                    })
                                }</div>
                                <SearchNav history={this.props.history} sort={sort} count={data.count.count} />
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
}

export default AllData;