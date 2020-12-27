import React, { useEffect } from "react";
import { useRouteMatch } from "react-router";
import { useQuery } from "react-apollo";
import gql from "graphql-tag";
import ClipLoader from "react-spinners/ClipLoader";
import ReactGA from "react-ga";
import Box from "../components/Box";
import ZincSites from "../components/ZincSites";

const GroupPage = () => {

  useEffect(() => {
    document.title = `Group ${id} - ZincBind`;
    ReactGA.initialize("UA-51790964-20");
    ReactGA.pageview(window.location.pathname + window.location.search);
  })

  const id = useRouteMatch("/groups/:group").params.group;
  const query = `{
    group(id: "${id}") {
      id keywords classifications zincsites { count edges { node { 
        id family residues(primary: true) { edges { node { id atomiumId name } } }
      } } }
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
    <main className="site-page">
      <Box className="heading">
        <h1>Group: { id }</h1>
      </Box>

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
    </main>
  );
}

export default GroupPage;