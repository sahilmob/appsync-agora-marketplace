import { API, graphqlOperation } from "aws-amplify";
import { Icon, Loading, Tabs } from "element-react";
import {
	onCreateProduct,
	onDeleteProduct,
	onUpdateProduct
} from "../graphql/subscriptions";

import { Link } from "react-router-dom";
import NewProduct from "../components/NewProduct";
import Product from "../components/Product";
import React from "react";

// import { getMarket } from "../graphql/queries";

export const getMarket = `query GetMarket($id: ID!) {
  getMarket(id: $id) {
    id
    name
    products {
      items {
        id
        description
        price
        shipped
				owner
				file{
					key
				}
        createdAt
      }
      nextToken
    }
    tags
    owner
    createdAt
  }
}
`;

class MarketPage extends React.Component {
	state = {
		market: null,
		isLoading: true,
		isMarketOwner: false
	};

	componentDidMount() {
		this.handleGetMarket();
		this.createProductListener = API.graphql(
			graphqlOperation(onCreateProduct)
		).subscribe({
			next: productData => {
				const { market } = this.state;
				const createdProduct = productData.value.data.onCreateProduct;
				const prevProducts = market.products.items.filter(
					item => item.id !== createdProduct.id
				);
				const updatedProducts = [createdProduct, ...prevProducts];
				const updatedMarket = { ...market };
				updatedMarket.products.items = updatedProducts;
				this.setState({
					market: updatedMarket
				});
			}
		});

		this.updateProductListener = API.graphql(
			graphqlOperation(onUpdateProduct)
		).subscribe({
			next: productData => {
				const { market } = this.state;
				const updatedProduct = productData.value.data.onUpdateProduct;
				const updatedProductIndex = market.products.items.findIndex(
					item => item.id === updatedProduct.id
				);
				const updatedProducts = [
					...market.products.items.slice(0, updatedProductIndex),
					updatedProduct,
					...market.products.items.slice(updatedProductIndex + 1)
				];
				const updatedMarket = { ...market };
				updatedMarket.products.items = updatedProducts;
				this.setState({
					market: updatedMarket
				});
			}
		});

		this.deleteProductListener = API.graphql(
			graphqlOperation(onDeleteProduct)
		).subscribe({
			next: productData => {
				const { market } = this.state;
				const deletedProduct = productData.value.data.onDeleteProduct;
				const updatedProducts = market.products.items.filter(
					item => item.id !== deletedProduct.id
				);
				const updatedMarket = { ...market };
				updatedMarket.products.items = updatedProducts;
				this.setState({
					market: updatedMarket
				});
			}
		});
	}

	componentWillUnmount() {
		this.createProductListener.unsubscribe();
		this.updateProductListener.unsubscribe();
		this.deleteProductListener.unsubscribe();
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
								<Product product={product} key={product.id} />
							))}
						</div>
					</Tabs.Pane>
				</Tabs>
			</>
		);
	}
}

export default MarketPage;
