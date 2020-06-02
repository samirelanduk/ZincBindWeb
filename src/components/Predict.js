import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from "apollo-link-http";
import ReactGA from "react-ga";
import Select from "react-select";
import Box from "./Box";

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
        onCompleted: response => {
            props.history.push(`/sequence-jobs/${response.searchSequence.jobId}/`);
        }
    });

    const familiesUpdated = selection => {
        setSelectedFamilies(selection.map(s => s.value))
    }

    const sequenceSubmit = e => {
        e.preventDefault();
        searchSequence({
            variables: {
                sequence: sequence, families: selectedFamilies
            },
            onCompleted: x => console.log(x)
        })
    }

    return ( <main className="predict-page">
        <Box><h1>Predict Zinc Binding</h1></Box>
        <Box>
            <h2>Sequence Prediction</h2>
            <form onSubmit={sequenceSubmit}>
                <textarea
                    placeholder="Sequence"
                    value={sequence}
                    onChange={e => setSequence(e.target.value)}
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
    </main> );
}
 
export default Predict;