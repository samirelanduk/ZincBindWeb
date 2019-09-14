import React, { Component } from "react";
import { Link } from "react-router-dom";
import Box from "./Box";

class SearchNav extends Component {
    
    sort = (event) => {
        this.props.history.push(`${this.props.history.location.pathname}?sort=${event.target.value}`);
    }

    makeParamsString = (params, page) => {
        let string = "";
        for (let key of Object.keys(params)) {
            string += key + "=" + (key === "page" ? page : params[key]) + "&";
        }
        return string.slice(0, string.length - 1);
    }

    render() {

        let path = this.props.history.location.pathname;

        let params = {};

        for (let pair of this.props.history.location.search.slice(1).split("&")) {
            pair = pair.split("=");
            if (pair[0]) {
                params[pair[0]] = pair[1];
            }
           
        }
        params.page = params.page || 1;

        const pageCount = Math.ceil(this.props.count / 25);

        let oneLink = this.makeParamsString(params, 1);
        let nextLink = this.makeParamsString(params, parseInt(params.page) + 1);
        let prevLink = this.makeParamsString(params, parseInt(params.page) - 1);

        let lastLink = this.makeParamsString(params, pageCount);


        return (
            <div className="search-nav">
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

                    <div className="search-links">
                        {params.page > 2 && <Link className="search-link" to={`${path}?${oneLink}`}>1</Link>}
                        {params.page > 3 && <div className="search-link">...</div>}
                        {params.page > 1 && <Link className="search-link" to={`${path}?${prevLink}`}>{parseInt(params.page) - 1}</Link>}
                        <div className="search-link">{params.page}</div>
                        {params.page < pageCount - 1 && <Link className="search-link" to={`${path}?${nextLink}`}>{parseInt(params.page) + 1}</Link>}
                        {params.page < pageCount - 2 && <div className="search-link">...</div>}
                        {params.page < pageCount && <Link className="search-link" to={`${path}?${lastLink}`}>{pageCount}</Link>}
                    </div>
                </Box>
            </div>
        );
    }
}
 
export default SearchNav;