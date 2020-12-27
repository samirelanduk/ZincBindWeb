import React, { useEffect } from "react";
import { useQuery } from "react-apollo";
import gql from "graphql-tag";
import { Link } from "react-router-dom";
import zincsite from "../images/zincsite.png";
import deepLearning from "../images/deep-learning.svg";
import ReactGA from "react-ga";

const HomePage = () => {

  useEffect(() => {
    document.title = "ZincBind";
    ReactGA.initialize("UA-51790964-20");
    ReactGA.pageview(window.location.pathname + window.location.search);
  })
  
  const QUERY = gql`{ stats { pdbCount allSiteCount uniqueSiteCount } }`;
  const { loading, data } = useQuery(QUERY);
  const { uniqueSiteCount, allSiteCount, pdbCount } = data ? data.stats : {};

        
  return (
    <main className="home-page">
      <div className="home-row home-1">
        <div className="home-cell site-description">
          <h1>The Database of Zinc<br />Binding Sites</h1>
          <p>{loading ? "" : (
            `ZincBind is a database of zinc binding sites, automatically generated from the Protein Data Bank. There are currently ${uniqueSiteCount.toLocaleString()} unique sites, with ${allSiteCount.toLocaleString()} representatives across ${pdbCount.toLocaleString()} PDB files.`
          )}</p>
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
 
export default HomePage;