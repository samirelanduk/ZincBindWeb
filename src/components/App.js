import React from "react";
import {BrowserRouter } from "react-router-dom";
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from "apollo-link-http";
import { ApolloProvider } from "react-apollo";
import { Route, Switch } from "react-router";
import Nav from "./Nav";
import Home from "./Home";
import Search from "./Search";
import Predict from "./Predict";
import Data from "./Data";
import AllData from "./AllData";
import About from "./About";
import Help from "./Help";
import Footer from "./Footer";

class App extends React.Component {

	httpLink = createHttpLink({ uri: "https://api.zincbind.net/" });
    link = ApolloLink.from([this.httpLink]);
	client = new ApolloClient({cache: new InMemoryCache(), link: this.link});
	
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<ApolloProvider client={this.client}>
				<BrowserRouter>
					<Nav />
					<Switch>
						<Route path="/" exact component={Home} />
						<Route path="/search" exact component={Search} />
						<Route path="/predict" exact component={Predict} />
						<Route path="/data" exact render={() => <Data client={this.client}/>} />
						<Route path="/data/all" exact render={({history}) => <AllData history={history} /> } />
						<Route path="/about" exact component={About} />
						<Route path="/help" exact component={Help} />
					</Switch>
					<Footer />
				</BrowserRouter>
			</ApolloProvider>
		);

		
	}
}

export default App;