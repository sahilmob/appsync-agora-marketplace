import MarketList from "../components/MarketList";
import NewMarket from "../components/NewMarket";
import React from "react";

class HomePage extends React.Component {
	state = {};

	render() {
		return (
			<>
				<NewMarket />
				<MarketList />
			</>
		);
	}
}

export default HomePage;
