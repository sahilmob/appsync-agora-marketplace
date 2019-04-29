import { API, graphqlOperation } from "aws-amplify";
import {
	Button,
	Card,
	Dialog,
	Form,
	Input,
	Notification,
	Popover,
	Radio
} from "element-react";
import { convertCentsToDollars, convertDollarsToCents } from "../utils";
import { deleteProduct, updateProduct } from "../graphql/mutations";

import PayButton from "./PayButton";
import React from "react";
import { S3Image } from "aws-amplify-react";
import { UserContext } from "../App";

// prettier-ignore

class Product extends React.Component {
	state = {
    description: "",
    price: "",
    shipped: false,
    updateProductDialog: false,
    deleteProductDialog: false,
  };

  handleSelectProductToUpdate = (product)=>{
    this.setState({
      updateProductDialog: true,
      description: product.description,
      price: convertCentsToDollars(product.price),
      shipped: product.shipped
    })
  }

  handleUpdateProduct = async(productId)=>{
    const {description, price, shipped} = this.state
    try{
      this.setState({
        updateProductDialog: false
      })
      const input = {
        id: productId,
        price: convertDollarsToCents(price),
        description,
        shipped
      }
      const {data: {updateProduct: updatedProduct}} = await API.graphql(graphqlOperation(updateProduct, {input}))
      console.log(updatedProduct)
      Notification({
        title: "Success",
        message: "Product successfully updated!",
        type: "success"
      })
    }catch(err){
      console.log(err)
    }
  }

  handleDeleteProduct = async(productId)=>{
    console.log(productId)
    try{
      this.setState({deleteProductDialog:false})
      await API.graphql(graphqlOperation(deleteProduct, {
        input: {
          id:productId
        }
      }))
        Notification({
        title: "Success",
        message: "Product successfully deleted!",
        type: "success"
      })
    }catch(err){
      console.log(err)
    }
  }

	render() {
    const{updateProductDialog, description, price, shipped, deleteProductDialog} =this.state
    const { product } = this.props;
    const {handleSelectProductToUpdate, handleUpdateProduct,handleDeleteProduct} = this
		return (<UserContext.Consumer>
    {({user})=>{
      const isProductOwner = user && user.attributes.sub === product.owner
      return (<div className="card-container">
      <Card bodyStyle={{padding: 0, minWidth: '200px'}}>
      <S3Image imgKey={product.file.key}  theme={{photoImg: {maxWidth: '100%', maxHeight: '100%'}}}/>
      <div className="card-body">
        <h3 className="m-0">{product.description}</h3>
        <div className="items-center">
          <img src={`https://icon.now.sh/${product.shipped ? 'markunread_mailbox' : 'mail'}`} alt='shipping icon' className='icon'/>
          {product.shipped ? "Shipped" : "Emailed"}
          <span className="mx-1">
            ${convertCentsToDollars(product.price)}
          </span>
          {isProductOwner && <PayButton />}
        </div>
      </div>
      </Card>
      <div className="text-center">
        {isProductOwner && (
          <>
            <Button type="warning" className="m-1" icon="edit" onClick={()=>handleSelectProductToUpdate(product)}/>
            <Popover placement="top" width="160" trigger="click" visible={deleteProductDialog} content={
              <>
                  <p>Do you want tot delete this?</p>
                  <div className="text-right">
                      <Button size="mini" type="text" className="m-1" onClick={()=>this.setState({deleteProductDialog:false})}>Cancel</Button>
                  <Button type="primary" size="mini" className="m-1" onClick={()=>handleDeleteProduct(product.id)}>Confirm</Button>
                  </div>
              </>
            }>
              <Button type="danger" icon="delete" onClick={()=>{this.setState({deleteProductDialog: true})}}/>
            </Popover>
          </>
        )}
      </div>
      <Dialog title="Update Product" size="large" customClass="dialog" visible={updateProductDialog} onCancel={()=>this.setState({updateProductDialog: false})}>
      <Dialog.Body>
        <Form labelPosition="top">
						<Form.Item label="Update Description">
							<Input
                icon="information"
								placeholder="Product Description"
								onChange={description => this.setState({ description })}
                value={description}
                trim={true}
							/>
						</Form.Item>
						<Form.Item label="Update Products Price">
							<Input
								type="number"
								icon="plus"
								placeholder="Price ($USD)"
								onChange={price => this.setState({ price })}
								value={price}
							/>
						</Form.Item>
						<Form.Item label="Update Shipping">
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
					</Form>
          </Dialog.Body>
          <Dialog.Footer>
            <Button onClick={()=>this.setState({updateProductDialog:false})}>Cancel</Button>
            <Button onClick={()=>handleUpdateProduct(product.id)} type="primary">Update</Button>
          </Dialog.Footer>
      </Dialog>
    </div>)
    }}
    </UserContext.Consumer>);
	}
}

export default Product;
