import React, { Fragment, Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Box from "./Box";

class Site extends Component {
    
    render() {
        const id = this.props.match.params.id;
        const query_string = `{ zincsite(id: "${id}") {
            id family
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