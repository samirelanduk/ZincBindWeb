import React, { Component } from "react";
import Box from "./Box";
import wellcome from '../images/wellcome.jpg';
import ismb from '../images/ismb.png';
import ucl from '../images/ucl.png';
import birkbeck from '../images/birkbeck.jpg';
import django from '../images/django.png';
import graphql from '../images/graphql.png';
import react from '../images/react.jpg';
import highcharts from '../images/highcharts.png';
import ngl from '../images/ngl.png';
import blast from '../images/blast.jpg';

class About extends Component {
    
    render() { 
        return (
            <main className="about">
                <Box>
                    <h1>About</h1>
                </Box>

                <Box>
                    <p>ZincBind is a database of zinc binding site structures, automatically generated from the <a href="https://rcsb.org/" target="_blank">Protein Data Bank</a>.</p>
                    <p>For every PDB structure which contains at least one zinc atom, ZincBind identifies the liganding residues and creates a binding site for the zinc - with liganding residues defined as those with a relevant atom within 3 Angstroms of the zinc.</p>
                    <p>If two zinc atoms share a liganding residue, or if a zinc atom shares a liganding residue with some other metal ion, these are clustered together into a single multi-metal site.</p>
                    <p>The chains associated with each zinc site are stored, and clustered on 90% sequence identity. These clusters are then used to cluster the Zinc Sites themselves - where two sites belong to the same cluster if they are associated with the same chain cluster(s) and have the same binding residue identifiers.</p>
                </Box>

                <Box>
                    <a href="https://wellcome.ac.uk/" target="_blank" className="logo"><img src={wellcome} alt="Wellcome" /></a>
                    <a href="http://www.ismb.lon.ac.uk/" target="_blank" className="logo"><img src={ismb} alt="ISMB" /></a>
                    <a href="https://www.ucl.ac.uk/" target="_blank" className="logo"><img src={ucl} alt="UCL" /></a>
                    <a href="http://www.bbk.ac.uk/" target="_blank" className="logo"><img src={birkbeck} alt="Birkbeck" /></a>
                    <a href="https://www.djangoproject.com/" target="_blank" className="logo"><img src={django} alt="Django" /></a>
                    <a href="https://graphql.org/" target="_blank" className="logo"><img src={graphql} alt="GraphQL" /></a>
                    <a href="https://reactjs.org/" target="_blank" className="logo"><img src={react} alt="React" /></a>
                    <a href="https://www.highcharts.com/" target="_blank" className="logo"><img src={highcharts} alt="Highcharts" /></a>
                    <a href="http://nglviewer.org/ngl/api/manual/" target="_blank" className="logo"><img src={ngl} alt="NGL" /></a>
                    <a href="https://blast.ncbi.nlm.nih.gov/Blast.cgi" target="_blank" className="logo"><img src={blast} alt="BLAST" /></a>
                </Box>
            </main>
        );
    }
}
 
export default About;