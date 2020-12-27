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
  sequenceJob(id: $id) {
      status protein sites { residues family probability } rejectedCount
  }
}`

const httpLink = createHttpLink({ uri: predictUrl(), });
const link = ApolloLink.from([httpLink]);
const predictClient = new ApolloClient({cache: new InMemoryCache(), link: link});

const SequenceJobPage = props => {

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

  if (data && (data.sequenceJob.status === "complete" || data.sequenceJob.status === "error")) {
    stopPolling();
  }

  return (
    <main className="sequence-job-page">
      <Box className="heading"><h1>Sequence Job</h1></Box>

      {
        !loading && (
          <>
            <Box>
              <div className="label status">Status: <span>{ data.sequenceJob.status }</span></div>
              <div className="label">Sequence:</div>
              <div className="sequence">{ data.sequenceJob.protein }</div>
              <div className="label">Rejected sites: <span>{data.sequenceJob.rejectedCount}</span></div>
            </Box>
            <Box>
              <h2> Predicted sites: { data.sequenceJob.sites.length }</h2>
              <div className="sequences">
                {
                  data.sequenceJob.sites.map((site, s) => {
                    return (
                      <div className="predicted-sequence" key={s}>
                        <div className="info">
                          <div className="family">{site.family}</div>
                          <div className="probability">p={roundTo(site.probability, 2)}</div>
                        </div>
                        <div className="sequence">{site.residues.split("").map(
                          (x, i) => <span key={i} className={x.toUpperCase() === x ? "upper" : "lower"}>{x}</span>
                        )}</div>
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

export default SequenceJobPage;