import { Card, Icon, Loading, Tag } from "element-react";

import { Connect } from "aws-amplify-react";
import Error from "../components/Error";
import { Link } from "react-router-dom";
import React from "react";
import { graphqlOperation } from "aws-amplify";
import { listMarkets } from "../graphql/queries";

const MarketList = () => {
	return (
		<Connect query={graphqlOperation(listMarkets)}>
			{({ data: { listMarkets }, loading, errors }) => {
				if (errors.length > 0) return <Error errors={errors} />;
				if (loading || !listMarkets) return <Loading fullscreen={true} />;
				return (
					<>
						<h2 className="header">
							<img
								src="https://icon.now.sh/store_mall_directory/527FFF"
								alt="store icon"
							/>
							Markets
						</h2>
						{listMarkets.items.map(market => (
							<div className="my-2" key={market.id}>
								<Card
									bodyStyle={{
										padding: "0.7em",
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between"
									}}
								>
									<div>
										<span className="flex">
											<Link className="link" to={`/markets/${market.id}`}>
												{market.name}
											</Link>
											<span style={{ color: "var(--darkAmazonOrange)" }}>
												{market.products && market.products.items
													? market.products.items.length
													: "0"}
											</span>
											<img
												src="https://icon.now.sh/shopping_cart/f60"
												alt="shopping cart"
											/>
										</span>
										<div style={{ color: "var(--lightSquidInk)" }}>
											{market.owner}
										</div>
									</div>
									<div>
										{market.tags &&
											market.tags.map(tag => (
												<Tag key={tag} type="danger" className="mx-1">
													{tag}
												</Tag>
											))}
									</div>
								</Card>
							</div>
						))}
					</>
				);
			}}
		</Connect>
	);
};

export default MarketList;
