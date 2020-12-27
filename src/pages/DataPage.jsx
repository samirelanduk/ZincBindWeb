import React, { useEffect } from "react";
import ReactGA from "react-ga";
import gql from "graphql-tag";
import { Link } from "react-router-dom";
import Box from "../components/Box";
import Chart from "../components/Chart"

const DataPage = () => {
    
  useEffect(() => {
    document.title = "Data - ZincBind";
    ReactGA.initialize("UA-51790964-20");
    ReactGA.pageview(window.location.pathname + window.location.search);
  })
        
  const RESIDUES_QUERY = gql`{ stats { residueCounts(cutoff: 5) {
      label count
  } } }`;

  const TECHNIQUES_QUERY = gql`{ stats { techniqueCounts(cutoff: 3) {
      label count
  } } }`;

  const SPECIES_QUERY = gql`{ stats { speciesCounts(cutoff: 6) {
      label count
  } } }`;

  const CLASSIFICATIONS_QUERY = gql`{ stats { classificationCounts(cutoff: 5) {
      label count
  } } }`;

  const FAMILIES_QUERY = gql`{ stats { familiesCounts(cutoff: 10) {
      label count
  } } }`;

  const RESOLUTIONS_QUERY = gql`{ stats { resolutionCounts {
      label count
  } } }`;

  return (
    <main className="data-page">
      <Box>
        <h1>ZincBind Data</h1>
      </Box>
          
      <Box>
        <p>
          The full list of Zinc Binding Sites can be browsed <Link to="/data/all/">here</Link>.
          They can also be browsed by Family and Group <Link to="/families/">here</Link>.
          See the <Link to="/api/">GraphQL API</Link> for programmatic access to the data.
        </p>
      </Box>

      <div className="charts">
        <Box>
          <Chart title="Residues" color="#079992" query={RESIDUES_QUERY} />
        </Box>

        <Box>
          <Chart title="Techniques" color="#0a3d62" query={TECHNIQUES_QUERY} />
        </Box>

        <Box>
          <Chart title="Species" color="#0c2461" query={SPECIES_QUERY} />
        </Box>

        <Box>
          <Chart title="Classifications" color="#b71540" query={CLASSIFICATIONS_QUERY} />
        </Box>

        <Box>
          <Chart title="Families" color="#e58e26" query={FAMILIES_QUERY} />
        </Box>

        <Box>
          <Chart title="Resolution" color="#6a89cc" query={RESOLUTIONS_QUERY} />
        </Box>
      </div>
    </main>
  );
}

 
export default DataPage;