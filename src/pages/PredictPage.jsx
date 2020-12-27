import React, { useState, useRef, useEffect } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import { ApolloLink } from "apollo-link";
import "react-toggle/style.css"
import ReactGA from "react-ga";
import Select from "react-select";
import { predictUrl } from "../api";
import Box from "../components/Box";
import fileUpload from "../images/file-upload.svg"

const SEARCH_SEQUENCE = gql`mutation($sequence: String!, $families: [String]) {
  searchSequence(sequence: $sequence, families: $families) {
    jobId
  }
}`

const SEARCH_STRUCTURE = gql`mutation(
  $structure: Upload!, $families: [String], $findHalf: Boolean,
  $useFamiliesModels: Boolean, $useLocationModels: Boolean
) {
  searchStructure(
    structure: $structure, families: $families, findHalf: $findHalf,
    useFamiliesModels: $useFamiliesModels, useLocationModels: $useLocationModels
  ) { jobId }
}`;

const uploadLink = createUploadLink({
    uri: predictUrl(),
    headers: {"keep-alive": "true"}
})
const link = ApolloLink.from([uploadLink]);
const predictClient = new ApolloClient({cache: new InMemoryCache(), link: link});

const PredictPage = props => {

  useEffect(() => {
    document.title = "Predict - ZincBind";
    ReactGA.initialize("UA-51790964-20");
    ReactGA.pageview(window.location.pathname + window.location.search);
  })

  const [sequence, setSequence] = useState("");
  const [selectedSequenceFamilies, setSelectedSequenceFamilies] = useState([]);
  const [sequenceError, setSequenceError] = useState("");

  const fileRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [selectedStructureFamilies, setSelectedStructureFamilies] = useState([]);
  const [searchByLocation,] = useState(false);
  const [searchByFamily,] = useState(true);
  const [searchHalfSites,] = useState(false);
  const [structureError, setStructureError] = useState("");

  const sequenceFamilies = [
    {value: "C2H1", label: "C2H1"},
    {value: "C2H2", label: "C2H2"},
    {value: "C3", label: "C3"},
    {value: "C3H1", label: "C3H1"},
    {value: "C4", label: "C4"},
    {value: "D1H1", label: "D1H1"},
    {value: "D1H2", label: "D1H2"},
    {value: "E1H1", label: "E1H1"},
    {value: "E1H2", label: "E1H2"},
    {value: "H3", label: "H3"},
  ]

  const structureFamilies = [
    {value: "C2H1", label: "C2H1"},
    {value: "C2H2", label: "C2H2"},
    {value: "C3", label: "C3"},
    {value: "C3H1", label: "C3H1"},
    {value: "C4", label: "C4"},
    {value: "D1H1", label: "D1H1"},
    {value: "D1H2", label: "D1H2"},
    {value: "E1H1", label: "E1H1"},
    {value: "E1H2", label: "E1H2"},
    {value: "H3", label: "H3"},
  ]

  const sequenceFamiliesUpdated = selection => {
    setSelectedSequenceFamilies(selection ? selection.map(s => s.value) : []);
  }

  const structureFileAdded = e => {
    if (e.target.files.length) {
      setFileName(e.target.files[0].name);
    }
  }

  const structureFamiliesUpdated = selection => {
    setSelectedStructureFamilies(selection ? selection.map(s => s.value) : []);
  }

  const [searchSequence,] = useMutation(SEARCH_SEQUENCE, {
    client: predictClient,
    onError: () => setSequenceError("Sorry, an error occured."),
    onCompleted: response => {
      props.history.push(`/sequence-jobs/${response.searchSequence.jobId}/`);
    }
  });

  const [searchStructure,] = useMutation(SEARCH_STRUCTURE, {
    client: predictClient,
    onError: () => setStructureError("Sorry, an error occured."),
    onCompleted: response => {
      props.history.push(`/structure-jobs/${response.searchStructure.jobId}/`);
    }
  });
  
  const sequenceSubmit = e => {
    e.preventDefault();
    if (sequence.length) {
      searchSequence({
        variables: {
          sequence: sequence, families: selectedSequenceFamilies
        }
      })
    }
  }

  const structureSubmit = e => {
    e.preventDefault();
    if (fileRef.current.files.length) {
      searchStructure({
        variables: {
          structure: fileRef.current.files[0],
          families: selectedStructureFamilies,
          findHalf: searchHalfSites,
          useFamiliesModels: searchByFamily,
          useLocationModels: searchByLocation
        }
      })
    }
  }

  return (
    <main className="predict-page">
      <Box><h1>Predict Zinc Binding</h1></Box>

      <div className="predict-grid">
        <Box>
          <h2>Sequence Prediction</h2>
          <form onSubmit={sequenceSubmit}>
            {sequenceError && <div className="error">{ sequenceError }</div>}
            <textarea
              className={sequenceError ? "errored" : ""}
              placeholder="Sequence"
              value={sequence}
              onChange={e => {setSequence(e.target.value); setSequenceError("")}}
            />
            <div className="options">
              <Select
                isMulti
                name="colors"
                options={sequenceFamilies}
                placeholder="Limit families..."
                onChange={sequenceFamiliesUpdated}
                className="families-select"
                classNamePrefix="select"
              />
              <input type="submit" value="Predict" />
            </div>
          </form>
        </Box>

        <Box>
          <h2>Structure Prediction</h2>
          <form onSubmit={structureSubmit}>
            {structureError && <div className="error">{ structureError }</div>}
            <div className="file-upload">
              <label htmlFor="file"><img src={fileUpload} alt="upload"/></label>
              <input type="file" id="file" ref={fileRef} onChange={structureFileAdded} />
              <label>{fileName || "Upload Structure File (.pdb, .cif or .mmtf)"}</label>
            </div>
            
            <div className="options">
              <Select
                isMulti
                name="colors"
                options={structureFamilies}
                placeholder="Limit families..."
                onChange={structureFamiliesUpdated}
                className="families-select"
                classNamePrefix="select"
              />
              <input type="submit" value="Predict" />
            </div>
          </form>
        </Box>
      </div>
    </main> 
  );
}
 
export default PredictPage;