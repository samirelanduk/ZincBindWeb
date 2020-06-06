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
import SearchResults from "./SearchResults";
import About from "./About";
import Help from "./Help";
import Api from "./Api";
import Families from "./Families";
import Family from "./Family";
import Group from "./Group";
import Pdb from "./Pdb";
import Site from "./Site";
import SequenceJob from "./SequenceJob";
import StructureJob from "./StructureJob";
import Footer from "./Footer";
import NotFound from "./NotFound";

export const isDevelopment = () => {
  /**
   * Returns true if app is running locally.
   */
  return !process.env.NODE_ENV || process.env.NODE_ENV === "development";
}


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
						<Route path="/search" exact render={({history}) => <Search history={history} /> } />
						<Route path="/predict" exact component={Predict} />
						<Route path="/data" exact render={() => <Data client={this.client}/>} />
						<Route path="/data/all" exact render={({history}) => <SearchResults history={history} /> } />
						<Route path="/about" exact component={About} />
						<Route path="/help" exact component={Help} />
						<Route path="/api" exact component={Api} />
						<Route path="/families" exact component={Families} />
						<Route path="/pdbs/:code" component={Pdb} />
						<Route path="/families/:family" component={Family} />
						<Route path="/groups/:group" component={Group} />
						<Route path="/sequence-jobs/:id/" component={SequenceJob} />
						<Route path="/structure-jobs/:id/" component={StructureJob} />
						<Route path="/:id" component={Site} />
						<Route path="" component={NotFound} />
					</Switch>
					<Footer />
				</BrowserRouter>
			</ApolloProvider>
		);

		
	}
}

export default App;