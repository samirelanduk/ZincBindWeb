import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Link } from "react-router-dom";
import zincsite from '../images/zincsite.png';
import deepLearning from '../images/deep-learning.svg';

class Home extends Component {
    
    render() {
        const QUERY = gql`{ stats { pdbCount allSiteCount uniqueSiteCount } }`;

        return (
            <main className="home">
                <div className="home-row home-1">
                    <div className="home-cell site-description">
                        <h1>The Database of Zinc Binding Sites</h1>
                        <Query query={QUERY} >
                            {
                                ({data, loading}) => {
                                    if (loading) {
                                        return <p></p>
                                    }

                                    const {pdbCount, allSiteCount, uniqueSiteCount} = data.stats;
                                    return <p>ZincBind is a database of zinc binding sites, automatically generated from the Protein Data Bank. There are currently {uniqueSiteCount.toLocaleString()} unique sites, with {allSiteCount.toLocaleString()} representatives across {pdbCount.toLocaleString()} PDB files.</p>
                                }
                            }
                        </Query>
                        
                    </div>
                    <div className="home-cell site-search">
                        <div className="small-links"><Link to="/data/all/">Browse all sites</Link></div>
                        <form action="/search">
                            <input autoComplete="off" name="q" placeholder="PDB code, description, etc." type="text" />
                            <input type="submit" value="Search" />
                        </form>
                    </div>
                </div>
                <div className="home-row home-2">
                    <div className="home-cell home-picture">
                        <img src={zincsite} alt="Zinc Site" />
                    </div>
                    <div className="home-cell site-info">
                        <h2>Classified and Clustered</h2>
                        <p>ZincBind identifies all zinc atoms in the PDB, determines their bind site where appropriate, and clusters them on sequence identity. Each site is then organised into groups and families.</p>
                    </div>
                </div>
                <div className="home-row home-3">
                    <div className="home-cell home-picture">
                        <img src={deepLearning} alt="Machine Learning" />
                    </div>
                    <div className="home-cell site-info">
                        <h2>Predict Zinc Binding</h2>
                        <p>Use classifiers trained on the database to predict zinc binding in structure or sequence. ZincBind hihglights probable zinc binding sites and assigns probabilities.</p>
                    </div>
                    
                </div>
            </main>
        );
    }
}
 
export default Home;