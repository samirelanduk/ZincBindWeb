import React, { useState, useRef } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from "apollo-link-http";
import "react-toggle/style.css"
import ReactGA from "react-ga";
import Select from "react-select";
import Toggle from "react-toggle";
import Box from "./Box";
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
}`

const uploadLink = createUploadLink({
    uri: "http://localhost:7001", headers: {"keep-alive": "true"}
})
const httpLink = createHttpLink({ uri: "http://localhost:7001/" });
const link = ApolloLink.from([uploadLink, httpLink]);
const predictClient = new ApolloClient({cache: new InMemoryCache(), link: link});

const Predict = props => {
    document.title = "Predict - ZincBind";
    ReactGA.initialize("UA-51790964-20");
    ReactGA.pageview(window.location.pathname + window.location.search);

    const [sequence, setSequence] = useState("");
    const [selectedSequenceFamilies, setSelectedSequenceFamilies] = useState([]);
    const [sequenceError, setSequenceError] = useState("");

    const fileRef = useRef(null);
    const [fileName, setFileName] = useState("");
    const [selectedStructureFamilies, setSelectedStructureFamilies] = useState([]);
    const [searchByLocation, setSearchByLocation] = useState(true);
    const [searchByFamily, setSearchByFamily] = useState(true);
    const [searchHalfSites, setSearchHalfSites] = useState(false);
    const [structureError, setStructureError] = useState("");

    const sequenceFamilies = [
        {value: "H3", label: "H3"},
        {value: "C4", label: "C4"},
        {value: "H2C2", label: "H2C2"},
    ]

    const structureFamilies = [
        {value: "H3", label: "H3"},
        {value: "C4", label: "C4"},
        {value: "H2C2", label: "H2C2"},
    ]

    const sequenceFamiliesUpdated = selection => {
        setSelectedSequenceFamilies(selection.map(s => s.value))
    }

    const structureFileAdded = e => {
        if (e.target.files.length) {
            setFileName(e.target.files[0].name);
        }
    }

    const structureFamiliesUpdated = selection => {
        setSelectedStructureFamilies(selection.map(s => s.value))
    }

    const [searchSequence, searchSequenceMutation] = useMutation(SEARCH_SEQUENCE, {
        client: predictClient,
        onError: () => setSequenceError("Sorry, an error occured."),
        onCompleted: response => {
            props.history.push(`/sequence-jobs/${response.searchSequence.jobId}/`);
        }
    });

    const [searchStructure, searchStructureMutation] = useMutation(SEARCH_STRUCTURE, {
        client: predictClient,
        onError: () => setSequenceError("Sorry, an error occured."),
        onCompleted: response => {
            //props.history.push(`/structure-jobs/${response.searchStructure.jobId}/`);
        }
    });
    
    const sequenceSubmit = e => {
        e.preventDefault();
        if (sequence.length) {
            searchSequence({
                variables: {
                    sequence: sequence, families: selectedSequenceFamilies
                },
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
                },
            })
        }
    }

    return ( <main className="predict-page">
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
                        <label for="file"><img src={fileUpload} /></label>
                        <input type="file" id="file" ref={fileRef} onChange={structureFileAdded} />
                        <label>{fileName || "Upload Structure File (.pdb, .cif or .mmtf)"}</label>
                    </div>
                    <div className="toggles">
                        <div className="toggle">
                            <Toggle
                                id="location"
                                checked={searchByLocation}
                                onChange={() => setSearchByLocation(!searchByLocation)}
                            />
                            <label htmlFor="location">Search by location</label>
                        </div>
                        <div className="toggle">
                            <Toggle
                                id="family"
                                checked={searchByFamily} 
                                onChange={() => setSearchByFamily(!searchByFamily)}
                            />
                            <label htmlFor="location">Search by family</label>
                        </div>
                        <div className="toggle">
                            <Toggle
                                id="half"
                                checked={searchHalfSites}
                                onChange={() => setSearchHalfSites(!searchHalfSites)}
                            />
                            <label htmlFor="location">Search for half-sites</label>
                        </div>

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
    </main> );
}
 
export default Predict;