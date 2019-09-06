import React, { Component } from "react";
import { Link } from "react-router-dom";
import zincsite from '../images/zincsite.png';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return (
            <main className="home">
                <div className="home-row home-1">
                    <div className="home-cell site-description">
                        <h1>The Database of Zinc Binding Sites</h1>
                        <p>ZincBind is a database of zinc binding sites, automatically generated from the Protein Data Bank. There are currently 6,458 unique sites, with 31,753 representatives across 14,657 PDB files.</p>
                    </div>
                    <div className="home-cell site-search">
                        <div className="small-links"><Link to="/data/all/">Browse all sites</Link></div>
                        <form action="/search">
                            <input autocomplete="off" name="q" placeholder="PDB code, description, etc." type="text" />
                            <input type="submit" value="Search" />
                        </form>
                    </div>
                </div>
                <div className="home-row home-2">
                    <div className="home-cell home-picture">
                        <img src={zincsite} alt="Zinc Site" />
                    </div>
                    <div className="home-cell site-info">
                        <h2>Classified and Clustered</h2>
                        <p>ZincBind identifies all zinc atoms in the PDB, determines their bind site where appropriate, and clusters them on sequence identity. Each site is annotated and linked to equivalent sites.</p>
                    </div>
                </div>
            </main>
        );
    }
}
 
export default Home;