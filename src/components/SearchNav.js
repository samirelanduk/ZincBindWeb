import React, { Component } from "react";
import Box from "./Box";

class SearchNav extends Component {
    
    sort = (event) => {
        this.props.history.push(`${this.props.history.location.pathname}?sort=${event.target.value}`);
    }

    render() {
        return (
            <div className="seartch-nav">
                <Box>
                <select onChange={this.sort} value={this.props.sort}>
                    <option value="-deposition_date">Newest to Oldest</option>
                    <option value="deposition_date">Oldest to Newest</option>
                    <option value="resolution">Resolution (Best to Worst)</option>
                    <option value="-resolution">Resolution (Worst to Best)</option>
                    <option value="rvalue">R-value (Best to Worst)</option>
                    <option value="-rvalue">R-value (Worst to Best)</option>
                    <option value="title">PDB Title (A-Z)</option>
                    <option value="-title">PDB Title (Z-A)</option>
                    <option value="id">PDB Code (A-Z)</option>
                    <option value="-id">PDB Code (Z-A)</option>
                </select>
                </Box>
            </div>
        );
    }
}
 
export default SearchNav;