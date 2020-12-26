import React, { Fragment, Component } from "react";
import Box from "../components/Box";
import ZincSites from "../components/ZincSites";
import { Link } from "react-router-dom";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import ReactGA from "react-ga";

class GroupPage extends Component {
    
    render() {

        const id = this.props.match.params.group;
        document.title = `Group ${id} - ZincBind`;
        ReactGA.initialize("UA-51790964-20");
        ReactGA.pageview(window.location.pathname + window.location.search);

        const query = `{
            group(id: "${id}") {
                id keywords classifications zincsites { count edges { node { 
                    id family residues(primary: true) { edges { node { atomiumId name } } }
                } } }
            }
        }`
        const QUERY = gql(query);
        
        return (
            <main className="site-page">
                <Box className="heading">
                    <h1>Group: { id }</h1>
                </Box>

                <Query query={QUERY} >
                    {
                        ({loading, data}) => {
                            if (loading) {
                                return <div></div>
                            }
                            return (
                                <div className="two-box">
                                    <Box className="group">
                                        <h2>Group Information</h2>
                                        <h3 className="box-heading">Common classifications</h3>
                                        <div className="group-info">{data.group.classifications}</div>

                                        <h3 className="box-heading">Common keywords</h3>
                                        <div className="group-info">{data.group.keywords}</div>
                                    </Box>
                                    <Box className="group">
                                        <h2>Representative Sites: { data.group.zincsites.count }</h2>
                                        <ZincSites sites={ data.group.zincsites.edges } />
                                    </Box> 
                                </div>
                            )
                        }
                    }
                </Query>


            </main>
        );
    }
}

export default GroupPage;