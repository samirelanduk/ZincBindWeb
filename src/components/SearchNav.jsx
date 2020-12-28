import React from "react";
import { Link } from "react-router-dom";
import Box from "./Box";
import { BarLoader } from "react-spinners";

const SearchNav = props => {
  
  const sort = (event) => {
    let query = props.history.location.search;
    query = query ? query : "?";
    if (query.includes("sort=")) {
      query = query.replace(/sort=(.+?)(&|$)/, `sort=${event.target.value}&`)
    } else if (query.length === 1) {
      query = query +  `sort=${event.target.value}`
    } else {
      query = query +  `&sort=${event.target.value}`
    }
    if (query.endsWith("&")) {
      query = query.slice(0, -1)
    }
    props.history.push(query);
  }

  const makeParamsString = (params, page) => {
    let string = "";
    for (let key of Object.keys(params)) {
      string += key + "=" + (key === "page" ? page : params[key]) + "&";
    }
    return string.slice(0, string.length - 1);
  }


  if (!props.params) {
    return (
      <div className={"search-nav sequence"}>
        <Box>
          <BarLoader
            color={"#482c54"}
            css={{margin: "auto"}}
          />
          </Box>
      </div>
    ); 
  }

  let path = props.history.location.pathname;

  let params = {};

  for (let pair of props.history.location.search.slice(1).split("&")) {
    pair = pair.split("=");
    if (pair[0]) {
      params[pair[0]] = pair[1];
    }
      
  }
  params.page = params.page || 1;

  const pageCount = Math.ceil(props.count / 25);

  let oneLink = makeParamsString(params, 1);
  let nextLink = makeParamsString(params, parseInt(params.page) + 1);
  let prevLink = makeParamsString(params, parseInt(params.page) - 1);

  let lastLink = makeParamsString(params, pageCount);

  return (
    <div className={"search-nav" + ("sequence" in props.params ? " sequence" : "")}>
      <Box>
        <select onChange={sort} value={props.params.sort}>
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
 
export default SearchNav;