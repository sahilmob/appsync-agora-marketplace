import { API, graphqlOperation } from "aws-amplify";
import {
	Button,
	Dialog,
	Form,
	Input,
	Notification,
	Select
} from "element-react";

import React from "react";
import { UserContext } from "../App";
import { createMarket } from "../graphql/mutations";

// prettier-ignore

class NewMarket extends React.Component {
	state = {
    addMarketDialog: false,
    name: ""
  };

  toggleAddMarketDialog = ()=>{
    this.setState(prevState =>{
      return {
        addMarketDialog: !prevState.addMarketDialog
      }
    })
  }
  handleAddMarket = async(user)=>{
    try{
      const {name} = this.state
      const result =  await API.graphql(graphqlOperation(createMarket, {
        input: {
          name,
          owner: user.username
        }
      }))
      console.log(result)
      this.setState({
        addMarketDialog: false,
        name: ""
      })
    }catch(err){
      Notification.error({
        title: "Error",
        message: `${err.message || "Error adding market"}`
      })
    }
  }

	render() {
    const {addMarketDialog, name} = this.state
    const {toggleAddMarketDialog, handleAddMarket}  =this
		return (
      <UserContext.Consumer>
			{({user}) =><>
				<div className="market-header">
					<h1 className="market-title">Create Your Marketplace
          <Button type="text" icon="edit" className="market-title-button" onClick={toggleAddMarketDialog}/>
          </h1>
				</div>
        <Dialog
        title="Create New Market" visible={addMarketDialog} onCancel={toggleAddMarketDialog} size="large" customClass="dialog">
          <Dialog.Body>
            <Form labelPosition="top">
              <Form.Item label="Market Name">
                <Input value={name} placeholder="Market Name" trim={true} onChange={(name) =>this.setState({name}) }/>
              </Form.Item>
            </Form>
          </Dialog.Body>
          <Dialog.Footer>
            <Button onClick={toggleAddMarketDialog}>Cancel</Button>
            <Button onClick={() =>handleAddMarket(user)} type="primary" disabled={!name}>Add</Button>
          </Dialog.Footer>
        </Dialog>
			</>}
      </UserContext.Consumer>
		);
	}
}

export default NewMarket;
