import React, { Fragment, Component } from "react";
import Box from "./Box";
import { Link } from "react-router-dom";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import ReactGA from "react-ga";

class Families extends Component {
    
    render() {
        document.title = "Families - ZincBind";
        ReactGA.initialize("UA-51790964-20");
        ReactGA.pageview(window.location.pathname + window.location.search);

        const QUERY = gql`{ families }`;
        
        return (
            <main className="families">
                <Box className="heading">
                    <h1>Families</h1>
                </Box>

                <div className="families-grid">
                <Query query={QUERY} >
                    {
                        ({loading, data}) => {
                            if (loading) {
                                return <div></div>
                            }
                            return (
                                <Fragment>
                                    {data.families.map(family => {
                                        const [name, count] = family.split("-");
                                        return <Box key={name} className="family">
                                            <Link to={"/families/" + name}>
                                                <h2>{name}</h2>
                                                <p>{count} {count == 1 ? "family" : "families"}</p>
                                            </Link>
                                        </Box>
                                    })}
                                </Fragment>
                            )
                        }
                    }
                </Query>
                </div>


            </main>
        );
    }
}

export default Families;