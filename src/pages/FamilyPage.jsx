import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-apollo";
import gql from "graphql-tag";
import ReactGA from "react-ga";
import ClipLoader from "react-spinners/ClipLoader";
import Box from "../components/Box";

const FamilyPage = () => {
    
  useEffect(() => {
    document.title = "Families - ZincBind";
    ReactGA.initialize("UA-51790964-20");
    ReactGA.pageview(window.location.pathname + window.location.search);
  })

  const elements = window.location.href.split("/").filter(Boolean)
  const family = elements[elements.length - 1];

  const query = `{
    groups(family: "${family}") {
      edges { node { id siteCount classifications } }
    }
  }`
  const QUERY = gql(query);
  const { loading, data } = useQuery(QUERY);
  if (loading) {
    return (
      <div className="main-fill"><ClipLoader size="100px" color="#482c54"/></div>
    )
  }
        
  return (
    <main className="family-page">
      <Box className="heading">
        <h1>{ family }</h1>
      </Box>

      {data.groups.edges.map(edge => (
        <Box key={edge.node.id}><Link to={"/groups/" + edge.node.id}>
          <h2>{edge.node.id}</h2>
          <p>{ edge.node.classifications}</p>
          <p>{ edge.node.siteCount } site{edge.node.siteCount=== 1 ? "" : "s"}</p>
        </Link></Box>
      ))}
    </main>
  );
}

export default FamilyPage;