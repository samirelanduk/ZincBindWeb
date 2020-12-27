import React, { useEffect } from "react";
import Box from "../components/Box";
import { Link } from "react-router-dom";
import { useQuery } from "react-apollo";
import gql from "graphql-tag";
import ReactGA from "react-ga";
import { ClipLoader } from "react-spinners";


const FamiliesPage = () => {
    
  useEffect(() => {
    document.title = "Families - ZincBind";
    ReactGA.initialize("UA-51790964-20");
    ReactGA.pageview(window.location.pathname + window.location.search);
  });
        
  const QUERY = gql`{ families }`;
  const { loading, data } = useQuery(QUERY);

  if (loading) {
      return (
        <div className="main-fill"><ClipLoader size="100px" color="#482c54"/></div>
      )
  }
        
  return (
    <main className="families-page">
      <Box className="heading">
        <h1>Families</h1>
      </Box>

      <div className="families-grid">
        {data.families.map(family => {
          const [name, count] = family.split("-");
          return <Box key={name} className="family">
            <Link to={"/families/" + name}>
              <h2>{name}</h2>
              <p>{count} {count === 1 ? "group" : "groups"}</p>
            </Link>
          </Box>
        })}
      </div>
    </main>
  );
}

export default FamiliesPage;