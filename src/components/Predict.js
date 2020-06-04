import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
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

const httpLink = createHttpLink({ uri: "http://localhost:7001/" });
const link = ApolloLink.from([httpLink]);
const predictClient = new ApolloClient({cache: new InMemoryCache(), link: link});

const Predict = props => {
    const [sequence, setSequence] = useState("");
    const [selectedFamilies, setSelectedFamilies] = useState([]);
    const [error, setError] = useState("");


    document.title = "Predict - ZincBind";
    ReactGA.initialize("UA-51790964-20");
    ReactGA.pageview(window.location.pathname + window.location.search);

    const families = [
        {value: "H3", label: "H3"},
        {value: "C4", label: "C4"},
        {value: "H2C2", label: "H2C2"},
    ]

    const [searchSequence, searchSequenceMutation] = useMutation(SEARCH_SEQUENCE, {
        client: predictClient,
        onError: () => setError("Sorry, an error occured."),
        onCompleted: response => {
            props.history.push(`/sequence-jobs/${response.searchSequence.jobId}/`);
        }
    });

    const familiesUpdated = selection => {
        setSelectedFamilies(selection.map(s => s.value))
    }

    const sequenceSubmit = e => {
        e.preventDefault();
        if (sequence.length) {
            searchSequence({
                variables: {
                    sequence: sequence, families: selectedFamilies
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
                    {error && <div className="error">{ error }</div>}
                    <textarea
                        className={error ? "errored" : ""}
                        placeholder="Sequence"
                        value={sequence}
                        onChange={e => {setSequence(e.target.value); setError("")}}
                    />
                    <div className="options">
                        <Select
                            isMulti
                            name="colors"
                            options={families}
                            placeholder="Limit families..."
                            onChange={familiesUpdated}
                            className="families-select"
                            classNamePrefix="select"
                        />
                        <input type="submit" value="Predict" />
                    </div>
                </form>
            </Box>

            <Box>
                <h2>Structure Prediction</h2>
                <form onSubmit={sequenceSubmit}>
                    {error && <div className="error">{ error }</div>}
                    
                    <div className="file-upload">
                        <img src={fileUpload} />
                        <label>Upload Structure File (.pdb, .cif or .mmtf)</label>
                    </div>
                    <div className="toggles">
                        <div className="toggle">
                            <Toggle
                                id="location"
                                defaultChecked={true}
                                
                            />
                            <label htmlFor="location">Search by location</label>
                        </div>
                        <div className="toggle">
                            <Toggle
                                id="family"
                                defaultChecked={true}
                                
                            />
                            <label htmlFor="location">Search by family</label>
                        </div>
                        <div className="toggle">
                            <Toggle
                                id="half"
                                defaultChecked={false}
                                
                            />
                            <label htmlFor="location">Search for half-sites</label>
                        </div>

                    </div>
                    <div className="options">
                        <Select
                            isMulti
                            name="colors"
                            options={families}
                            placeholder="Limit families..."
                            onChange={familiesUpdated}
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