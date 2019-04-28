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
    tags: ["Art","Web Dev", "Technology", "Crafts", "Entertainment"],
    options: [],
    name: "",
    selectedTags: []
  };

  toggleAddMarketDialog = ()=>{
    this.setState(prevState =>{
      return {
        addMarketDialog: !prevState.addMarketDialog
      }
    })
  }

  handleSelectTags = (selectedTags)=>{
    this.setState({
      selectedTags
    })
  }

  handleFilterTags = query=>{
    const {tags} = this.state;
    const options = tags.map(tag =>({value: tag, label:tag}))
    .filter(tag => tag.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
    this.setState({
      options
    })
  }

  handleAddMarket = async(user)=>{
    try{
      const {name, selectedTags} = this.state
      const result =  await API.graphql(graphqlOperation(createMarket, {
        input: {
          name,
          owner: user.username,
          tags: selectedTags
        }
      }))
      console.log(result)
      this.setState({
        addMarketDialog: false,
        name: "",
        selectedTags: []
      })
    }catch(err){
      Notification.error({
        title: "Error",
        message: `${err.message || "Error adding market"}`
      })
    }
  }

	render() {
    const {addMarketDialog, name, options} = this.state;
    const {toggleAddMarketDialog, handleAddMarket, handleSelectTags, handleFilterTags}  = this;
    const { handleSearch, searchTerm, handleSearchChange, handleClearSearch, isSearching} = this.props
		return (
      <UserContext.Consumer>
			{({user}) =><>
				<div className="market-header">
					<h1 className="market-title">Create Your Marketplace
          <Button type="text" icon="edit" className="market-title-button" onClick={toggleAddMarketDialog}/>
          </h1>

          <Form inline={true} onSubmit={handleSearch}>
            <Form.Item>
                <Input placeholder="Search Markets..." value={searchTerm} onChange={handleSearchChange} onIconClick={handleClearSearch} icon="circle-cross"/>
            </Form.Item>
            <Form.Item>
                <Button type="info" icon="search" onClick={handleSearch} loading={isSearching}>Search</Button>
            </Form.Item>
          </Form>

				</div>

        <Dialog
        title="Create New Market" visible={addMarketDialog} onCancel={toggleAddMarketDialog} size="large" customClass="dialog">
          <Dialog.Body>
            <Form labelPosition="top">
              <Form.Item label="Market Name">
                <Input value={name} placeholder="Market Name" trim={true} onChange={(name) =>this.setState({name}) }/>
              </Form.Item>
              <Form.Item label="Add Tags">
                  <Select multiple={true} filterable={true} placeholder="Market Tag" onChange={selectedTags => handleSelectTags(selectedTags)} remoteMethod={handleFilterTags} remote={true}>
                  {options.map(option => <Select.Option key={option.value} label={option.label} value={option.value}/>)}
                  </Select>
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
