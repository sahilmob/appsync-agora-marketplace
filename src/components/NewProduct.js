import { API, Auth, Storage, graphqlOperation } from "aws-amplify";
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
import aws_exports from "../aws-exports";
import { convertDollarsToCents } from "../utils";
import { createProduct } from "../graphql/mutations";

// prettier-ignore
const initialState = {
  description: "",
  price: "",
  shipped: true,
  imagePreview: "",
  image: "",
  isUploading: false,
  percentUploaded: 0
};
class NewProduct extends React.Component {
	state = { ...initialState };

	handleAddProduct = async () => {
		const { image, description, price, shipped } = this.state;
		const { marketId } = this.props;

		try {
			this.setState({
				isUploading: true
			});

			const visibility = "public";

			const { identityId } = await Auth.currentCredentials();

			const filename = `/${visibility}/${identityId}/${Date.now()}-${
				image.name
			}`;

			this.setState({ ...initialState });

			const uploadedFile = await Storage.put(filename, image.file, {
				contentType: image.type,
				progressCallback: progress => {
					const percentUploaded = Math.round(
						(process.loaded / progress.total) * 100
					);
					this.setState({
						percentUploaded
					});
				}
			});

			const file = {
				key: uploadedFile.key,
				bucket: aws_exports.aws_user_files_s3_bucket,
				region: aws_exports.aws_user_files_s3_bucket_region
			};

			const input = {
				productMarketId: marketId,
				price: convertDollarsToCents(price),
				description,
				shipped,
				file
			};
			const {
				data: { createProduct: createdProduct }
			} = await API.graphql(graphqlOperation(createProduct, { input }));
			console.log("Created product", createdProduct);
			Notification({
				title: "Success",
				message: "Product successfully created!",
				type: "success"
			});
		} catch (err) {
			console.log("error adding product");
		}
	};

	render() {
		const {
			description,
			price,
			shipped,
			imagePreview,
			image,
			isUploading,
			percentUploaded
		} = this.state;
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
						{isUploading && (
							<Progress
								type="circle"
								className="progress"
								status="success"
								percentage={percentUploaded}
							/>
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
								disabled={!image || !description || !price || isUploading}
								loading={isUploading}
								type="primary"
								onClick={handleAddProduct}
							>
								{isUploading ? "Loading..." : "Add Product"}
							</Button>
						</Form.Item>
					</Form>
				</div>
			</div>
		);
	}
}

export default NewProduct;
