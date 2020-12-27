import React, { useEffect } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink } from "apollo-link";
import { createHttpLink } from "apollo-link-http";
import ReactGA from "react-ga";
import roundTo from "round-to";
import { predictUrl } from "../api";
import Box from "../components/Box";

const JOB = gql`query($id: String!) {
  structureJob(id: $id) {
      status protein rejectedCount rejectedLocationCount
      sites { probability family residues { identifier name } }
      locations { probability location half}
  }
}`

const httpLink = createHttpLink({ uri: predictUrl(), });
const link = ApolloLink.from([httpLink]);
const predictClient = new ApolloClient({cache: new InMemoryCache(), link: link});

const StructureJobPage = props => {

  useEffect(() => {
    document.title = props.match.params.id + " Job - ZincBind";
    ReactGA.initialize("UA-51790964-20");
    ReactGA.pageview(window.location.pathname + window.location.search);
  })

  const { loading, data, stopPolling } = useQuery(JOB, {
    variables: {id: props.match.params.id},
    pollInterval: 1000,
    client: predictClient
  });

  if (data && (data.structureJob.status === "complete" || data.structureJob.status === "error")) {
    stopPolling();
  }

  let sites = [];
  if (data) {
    sites = data.structureJob.sites.concat(data.structureJob.locations)
  }
  sites.sort((s1, s2) => s2.probability - s1.probability)

  return (
    <main className="structure-job-page">
      <Box className="heading"><h1>Structure Job</h1></Box>

      {
        !loading && (
          <>
            <Box>
              <div className="label status">Status: <span>{ data.structureJob.status }</span></div>
              <div className="label">Protein: <span>{ data.structureJob.protein }</span></div>
               <div className="label">Rejected sites: <span>{data.structureJob.rejectedCount + data.structureJob.rejectedLocationCount}</span></div>
            </Box>
            <Box>
              <h2> Predicted sites: { data.structureJob.sites.length + data.structureJob.locations.length }</h2>
              <div className="structures">
                {
                  sites.map((site, s) => {
                    return (
                      <div className="predicted-structure" key={s}>
                        <div className="info">
                          <div className="family">{site.family || "Location"}</div>
                          <div className="probability">p={roundTo(site.probability, 2)}</div>
                          <div className="half">{site.half ? "Half site" : ""}</div>
                        </div>
                        <div className="site">
                          {site.residues ? site.residues.map(residue => {
                          return <div className="residue" key={residue.identifier}>{residue.name} {residue.identifier}</div>
                          }): site.location.join(", ")}
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </Box>
          </>
        )
      }
    </main>
  )
}

export default StructureJobPage;