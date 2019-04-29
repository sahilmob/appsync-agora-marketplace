import {
	Button,
	Form,
	Input,
	Notification,
	Progress,
	Radio
} from "element-react";

import { PhotoPicker } from "aws-amplify-react";
import React from "react";

// prettier-ignore
const initialState = {
  description: "",
  price: "",
  shipped: true,
  imagePreview: "",
  image: ""
};
class NewProduct extends React.Component {
	state = { ...initialState };

	handleAddProduct = () => {
		console.log(this.state);
		this.setState({ ...initialState });
	};

	render() {
		const { description, price, shipped, imagePreview, image } = this.state;
		const { handleAddProduct } = this;
		return (
			<div className="flex-center">
				<h2 className="header">Add New Product</h2>
				<div>
					<Form className="market-header">
						<Form.Item label="Add Products Description">
							<Input
								type="text"
								icon="information"
								placeholder="Description"
								onChange={description => this.setState({ description })}
								value={description}
							/>
						</Form.Item>
						<Form.Item label="Set Products Price">
							<Input
								type="number"
								icon="plus"
								placeholder="Price ($USD)"
								onChange={price => this.setState({ price })}
								value={price}
							/>
						</Form.Item>
						<Form.Item label="Is the Product Shipped or Emailed to the Customer">
							<div className="text-center">
								<Radio
									value="true"
									checked={shipped === true}
									onChange={() => this.setState({ shipped: true })}
								>
									Shipped
								</Radio>
								<Radio
									value="false"
									checked={shipped === false}
									onChange={() => this.setState({ shipped: false })}
								>
									Emailed
								</Radio>
							</div>
						</Form.Item>
						{imagePreview && (
							<img className="image-preview" src={imagePreview} />
						)}
						<PhotoPicker
							title="Product Image"
							preview="hidden"
							onLoad={url => this.setState({ imagePreview: url })}
							onPick={file => this.setState({ image: file })}
							theme={{
								formContainer: {
									margin: 0,
									padding: "0.8em"
								},
								formSection: {
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									justifyContent: "center"
								},
								sectionBody: {
									margin: 0,
									width: "250px"
								},
								sectionHeader: {
									padding: "0.2em",
									color: "var(--darkAmazonOrange)"
								},
								photoPickerButton: {
									display: "none"
								}
							}}
						/>
						<Form.Item>
							<Button
								disabled={!image || !description || !price}
								type="primary"
								onClick={handleAddProduct}
							>
								Add Product
							</Button>
						</Form.Item>
					</Form>
				</div>
			</div>
		);
	}
}

export default NewProduct;
