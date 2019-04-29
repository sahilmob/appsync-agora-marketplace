import { API, graphqlOperation } from "aws-amplify";
import { Icon, Loading, Tabs } from "element-react";

import { Link } from "react-router-dom";
import NewProduct from "../components/NewProduct";
import Product from "../components/Product";
import React from "react";
import { getMarket } from "../graphql/queries";

class MarketPage extends React.Component {
	state = {
		market: null,
		isLoading: true,
		isMarketOwner: false
	};

	componentDidMount() {
		this.handleGetMarket();
	}

	handleGetMarket = async () => {
		const { marketId } = this.props;
		try {
			const {
				data: { getMarket: market }
			} = await API.graphql(
				graphqlOperation(getMarket, {
					id: marketId
				})
			);
			this.setState(
				{
					market,
					isLoading: false
				},
				() => this.checkMarketOwner()
			);
		} catch (err) {
			this.setState({
				isLoading: false
			});
			console.log(err);
		}
	};

	checkMarketOwner = () => {
		const { user } = this.props;
		const { market } = this.state;
		if (user) {
			this.setState({
				isMarketOwner: user.username === market.owner
			});
		}
	};

	render() {
		const { market, isLoading, isMarketOwner } = this.state;
		const { marketId } = this.props;
		return isLoading ? (
			<Loading fullscreen={true} />
		) : (
			<>
				<Link to="/" className="link">
					Back to Markets List
				</Link>
				<span className="items-center pt-2">
					<h2 className="mb-mr">{market.name}</h2>
				</span>
				<div className="items-center pt-2">
					<span style={{ color: "var(--lightSquidInk)", paddingBottom: "1em" }}>
						<Icon name="date" className="icon" />
						{market.createdAt}
					</span>
				</div>
				<Tabs type="border-card" value={isMarketOwner ? "1" : "2"}>
					{isMarketOwner && (
						<Tabs.Pane
							label={
								<>
									<Icon name="plus" className="icon" />
									Add Product
								</>
							}
							name="1"
						>
							<NewProduct marketId={marketId} />
						</Tabs.Pane>
					)}
					<Tabs.Pane
						label={
							<>
								<Icon name="menu" className="icon" />
								Products ({market.products.items.length})
							</>
						}
						name="2"
					>
						<div className="product-list">
							{market.products.items.map(product => (
								<Product product={product} />
							))}
						</div>
					</Tabs.Pane>
				</Tabs>
			</>
		);
	}
}

export default MarketPage;
