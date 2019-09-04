import React from "react";
import {BrowserRouter } from "react-router-dom";
import { Route, Switch } from "react-router";
import Nav from "./Nav";
import Home from "./Home";
import Search from "./Search";
import Predict from "./Predict";
import Data from "./Data";
import About from "./About";
import Help from "./Help";

class App extends React.Component {
	render() {
		return (
			<BrowserRouter>
				<Nav />
				<Switch>
					<Route path="/" exact component={Home} />
					<Route path="/search" exact component={Search} />
					<Route path="/predict" exact component={Predict} />
					<Route path="/data" exact component={Data} />
					<Route path="/about" exact component={About} />
					<Route path="/help" exact component={Help} />
				</Switch>
			</BrowserRouter>
		);
	}
}

export default App;