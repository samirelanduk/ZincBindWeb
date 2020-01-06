import React, { Fragment, Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Box from "./Box";

class Pdb extends Component {
    
    render() {
        const code = this.props.match.params.code;
        const query_string = `{ pdb(id: "${code}") {
            title
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
                                <Box><h1>{ data.pdb.title }</h1></Box>
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