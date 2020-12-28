import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from "apollo-link-http";
import { ApolloProvider } from "react-apollo";
import { apiUrl } from "../api";
import Nav from "./Nav";
import Home from "../pages/HomePage";
import Search from "../pages/SearchPage";
import Predict from "../pages/PredictPage";
import Data from "../pages/DataPage";
import SearchResults from "../pages/SearchResultsPage";
import About from "../pages/AboutPage";
import Help from "../pages/HelpPage";
import Api from "../pages/ApiPage";
import Families from "../pages/FamiliesPage";
import Family from "../pages/FamilyPage";
import Group from "../pages/GroupPage";
import Pdb from "../pages/PdbPage";
import Site from "../pages/SitePage";
import SequenceJob from "../pages/SequenceJobPage";
import StructureJob from "../pages/StructureJobPage";
import Footer from "./Footer";
import NotFound from "../pages/NotFoundPage";

const App = () => {

	const httpLink = createHttpLink({ uri: apiUrl() });
	const link = ApolloLink.from([httpLink]);
	const client = new ApolloClient({cache: new InMemoryCache(), link: link});
		
	return (
		<ApolloProvider client={client}>
			<BrowserRouter>
				<Nav />
				<Switch>
					<Route path="/" exact component={Home} />
					<Route path="/search" exact render={({history}) => <Search history={history} /> } />
					<Route path="/predict" exact component={Predict} />
					<Route path="/data" exact render={() => <Data client={client}/>} />
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

export default App;