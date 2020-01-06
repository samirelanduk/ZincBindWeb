import React, { Fragment, Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Box from "./Box";

class Pdb extends Component {
    
    render() {
        const code = this.props.match.params.code;
        const query_string = `{ pdb(id: "${code}") {
            title classification keywords depositionDate technique organism
            expressionSystem assembly resolution rvalue
        }}`
        const QUERY = gql(query_string);

        return (
        <main className="pdb">
            <Query query={QUERY} >
                {
                    ({loading, data}) => {
                        if (loading) {
                            return <Box />
                        }
                        return (
                            <Fragment>
                                <Box className="heading"><h1>{ data.pdb.title }</h1></Box>
                                <Box className="properties">
                                    <div className="pdb-row"><span className="property">Code: </span> <a href={"https://www.rcsb.org/structure/" + code} target="_blank" rel="noopener">{code}</a></div>
                                    <div className="pdb-row"><span className="property">Deposited: </span> {data.pdb.depositionDate}</div>

                                    <div className="pdb-row"><span className="property">Resolution: </span> {data.pdb.resolution}</div>
                                    <div className="pdb-row"><span className="property">R-value: </span> {data.pdb.rvalue}</div> 

                                    <div className="pdb-row"><span className="property">Classification: </span> {data.pdb.classification}</div>
                                    <div className="pdb-row"><span className="property">Biological Assembly: </span> {data.pdb.assembly}</div>

                                    <div className="pdb-row full"><span className="property">Source Organism: </span> <span className="species">{data.pdb.organism}</span></div>
                                    <div className="pdb-row full"><span className="property">Expression Organism: </span> <span className="species">{data.pdb.expressionSystem}</span></div>
                                    <div className="pdb-row full"><span className="property">Experimental Technique: </span> {data.pdb.technique}</div>
                                    <div className="pdb-row full"><span className="property">Keywords: </span> {data.pdb.keywords}</div>
                                    
                                </Box>
                            </Fragment>
                        )
                    }
                }
                
            </Query>
        </main>
        );
    }
}
 
export default Pdb;