import React, { Fragment, Component } from "react";
import Box from "./Box";
import { Link } from "react-router-dom";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import ReactGA from "react-ga";

class Family extends Component {
    
    render() {

        const family = this.props.match.params.family;
        document.title = "Families - ZincBind";
        ReactGA.initialize("UA-51790964-20");
        ReactGA.pageview(window.location.pathname + window.location.search);

        const query = `{
            groups(family: "${family}") {
                edges {
                    node {
                        id siteCount classifications
                    }
                }
            }
        }`
        const QUERY = gql(query);
        
        return (
            <main className="family">
                <Box className="heading">
                    <h1>{ family }</h1>
                </Box>

                <Query query={QUERY} >
                    {
                        ({loading, data}) => {
                            if (loading) {
                                return <div></div>
                            }
                            return (
                                <Fragment>
                                    {
                                        data.groups.edges.map(edge => {
                                            return <Box><Link to={"/groups/" + edge.node.id}>
                                                <h2>{edge.node.id}</h2>
                                                <p>{ edge.node.classifications}</p>
                                                <p>{ edge.node.siteCount } site{edge.node.siteCount=== 1 ? "" : "s"}</p>
                                            </Link></Box>
                                        })
                                    }
                                </Fragment>
                            )
                        }
                    }
                </Query>


            </main>
        );
    }
}

export default Family;