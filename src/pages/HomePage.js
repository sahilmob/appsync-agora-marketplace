import { API, graphqlOperation } from "aws-amplify";

import MarketList from "../components/MarketList";
import NewMarket from "../components/NewMarket";
import React from "react";
import { searchMarkets } from "../graphql/queries";

class HomePage extends React.Component {
	state = {
		searchTerm: "",
		searchResults: [],
		isSearching: false
	};

	handleSearchChange = searchTerm => this.setState({ searchTerm });

	handleClearSearch = () =>
		this.setState({ searchTerm: "", searchResults: [] });

	handleSearch = async event => {
		event.preventDefault();
		const { searchTerm } = this.state;
		try {
			this.setState({ isSearching: true });
			const {
				data: {
					searchMarkets: { items }
				}
			} = await API.graphql(
				graphqlOperation(searchMarkets, {
					filter: {
						or: [
							{ name: { match: searchTerm } },
							{ owner: { match: searchTerm } },
							{ tags: { match: searchTerm } }
						]
					},
					sort: {
						field: "createdAt",
						direction: "desc"
					}
				})
			);
			console.log(items);
			this.setState({
				searchResults: items,
				isSearching: false
			});
		} catch (err) {
			this.setState({
				isSearching: false
			});
			console.log(err);
		}
	};

	render() {
		const { handleSearchChange, handleClearSearch, handleSearch } = this;
		const { searchTerm, isSearching, searchResults } = this.state;
		return (
			<>
				<NewMarket
					handleSearchChange={handleSearchChange}
					handleClearSearch={handleClearSearch}
					handleSearch={handleSearch}
					searchTerm={searchTerm}
					isSearching={isSearching}
				/>
				<MarketList searchResults={searchResults} />
			</>
		);
	}
}

export default HomePage;
