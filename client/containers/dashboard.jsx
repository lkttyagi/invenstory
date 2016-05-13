import React from 'react'
import { Button, Snackbar } from 'react-toolbox';

import Table from '../components/table'
import { store } from '../store/initStore'
import * as api from '../util/requests'
import Addproduct from '../components/addproduct'
import Ship from '../components/ship'
import DeleteProduct from '../components/deleteproduct'
import Details from '../components/details'

/*
  mounted tracks the mounting status of the container and is used to verify that the container
  is mounted before using setState.

  Backlog is used as storage and will store the updates that were ignored if the container wasn't mounted
  when new information came in.

  Backlog is checked and set back to "not pending" whenever componentDidMount is called

  A lot of state is being used in this container and this seems very un-redux-like at first glance.
  The reason we are using state is because of 2 main reasons.
  1) We are currently not using React-Redux and updating state to rerender seems less hacky than forceUpdate.
  2) There are input fields in one of the components rendered here and it seems less efficient to dispatch 
      and recieve subscription events for each keystroke
 */

var backlog = {
  historical: {
    pending: false,
    payload: null
  }
}

export default class DashboardContainer extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      // toggle visibility
      showModal: false,
      showSearchOption: true,
      showShipModal: false,
      showDeleteModal: false,
      
      // related to store
      tableData: store.getState().tableData,
      detail: {},
      historical: { graphData: null, options: null},
      
      // form inputs
      searchResults: [],
      searchString: '',
      asin: '',
      seller_sku: '',
      purchase_price: '',
      purchase_date: '',
      quantity: '',
      ship_quantity: '',

      // form validation
      err_asin: '',
      err_purchase_price: '',
      err_purchase_date: '',
      err_quantity: '',
      err_ship_quantity: '',
    };

    this.mounted = false;
    let component = this;
    store.register("dashboard", ["detail","tableData"], this, function(newState){

      // Get historical data for this item.
      if(newState && newState.detail && typeof newState.detail.id === "number"){
        api.getHistoricalData(newState.detail.id)
        .then(function(data){
           
          let historicalData = {
            graphData: [ 
              ["Date", "Price"], 
              ...data[0].history.map((cur)=>
                [ new Date(cur.amzn_fetch_date), cur.amzn_price_fba || cur.amzn_price_fbm ])
            ],

            options: {
              title: 'Product Historical Price Data',
              curveType: 'function',
              bar: { groupWidth: '75%' },
              isStacked: true,
              pointSize: 3,
              hAxis: {
                format:'MMM d, y'
              }
            }
          }

          if(component.mounted){
            component.setState({ "historical": historicalData })
          } else {
            backlog.historical.payload = historicalData
            backlog.historical.pending = true
          }
        })
        .catch(function(err){
          console.log("error in catch from api.getHistoricalData in the DashboardContainer", err)
        })
      }
    })
  }

  componentDidMount(){
    if(backlog.historical.pending){
      this.setState({ "historical": backlog.historical.payload })
      backlog.historical.pending = false
    }

    store.syncWithStore("dashboard", ["detail","tableData"],this)

    if(document.getElementById("styles__table___1QENt") && document.getElementById("styles__table___1QENt").getElementsByTagName('input') && document.getElementById("styles__table___1QENt").getElementsByTagName('input')[0])
      document.getElementsByTagName('input')[0].placeholder = "Search Table . ."
  }


  componentWillMount(){
    api.checkAuth()
  }

  componentWillUnmount(){
    store.unMounting("tabs", this)
  }

  handleInput(name, value) {
    this.setState({[name]: value});
  }

  handleModal(){
    this.setState({showModal: !this.state.showModal});
  }

  handleSubmit(){
    let inputErr = 0;
    
  // Need to refactor
    if (this.state.asin.length < 10) {
      this.setState({err_asin: "Must be 10 characters"});
      inputErr++;
    } else this.setState({err_asin: ''});

    if (!this.state.seller_sku || this.state.seller_sku.length < 4) {
      this.setState({err_seller_sku: "Must be between 4-30 characters"});
      inputErr++;
    } else this.setState({err_seller_sku: ''});

    if (!this.state.purchase_price || this.state.purchase_price < 0) {
      this.setState({err_purchase_price: "Please enter valid purchase price"});
      inputErr++;
    } else this.setState({err_purchase_price: ''});

    if (!this.state.quantity || this.state.quantity < 1) {
      this.setState({err_quantity: "Please enter valid quantity"});
      inputErr++;
    } else this.setState({err_quantity: ''});

    // need to add purchase date check <= current date
    if (!this.state.purchase_date) {
      this.setState({err_purchase_date: "Please enter purchase date"});
      inputErr++;
    } else this.setState({err_purchase_date: ''});

    if (!inputErr) {
      let inventory = {};
      // standardize user sku & asin inputs to all caps
      inventory.seller_sku = this.state.seller_sku.toUpperCase();
      inventory.asin = this.state.asin.toUpperCase();
      // round purchase price to 2 decimals
      inventory.purchase_price = Math.round(this.state.purchase_price * 100) / 100;
      inventory.purchase_date = this.state.purchase_date;
      inventory.quantity = this.state.quantity;
      api.addUserInventory(inventory)
      this.resetModal()
      this.handleBlur();
    }
  }

  resetModal(){
    this.setState({
      asin: '',
      seller_sku: '',
      purchase_price: '',
      purchase_quantity: '',
      purchase_date: '',
      err_asin: '',
      err_purchase_price: '',
      err_purchase_date: '',
      err_quantity: '',
      quantity: '',
      showSearchOption: true,
      showModal: false
    });
  }
  
  handleSearchToggle(){
    this.setState({showSearchOption: !this.state.showSearchOption})
  }

  handleSearchStringChange(value){
    this.setState({searchString: value})
  }

  handleAmazonSearch(){

    if(!this.state.showSearchOption)
      this.setState({showSearchOption: !this.state.showSearchOption})

    let component = this;
    api.searchAmazonForASIN(this.state.searchString)
    .then(function(data){
      component.setState({searchResults: data})
    })
    .catch(function(err){
      console.log("There was an error in handleAmazonSearch, dashboard container, line ~240")
    })
  }

  handleAmazonResultSelection(ASIN){
    this.setState({
      asin: ASIN,
      searchResults: [],
      searchString: '',
      showSearchOption: false
    })
  }

  handleBlur(){
    this.setState({ detail: {} });
  }

  handleShipModal(){
    this.resetShipQuantity();
    this.setState({
      showShipModal: !this.state.showShipModal
    });
  }

  confirmShip(id){
    console.log("SHIP QTY:", this.state.ship_quantity);
    if (isNaN(this.state.ship_quantity) || this.state.ship_quantity < 1) {
      this.setState({ship_quantity: 0});
    } else {
      console.log("PASSED")
      this.setState({err_ship_quantity: ''});
      api.shipInventoryItems({id: id, quantity: this.state.ship_quantity})
      this.handleShipModal();
      console.log("Confirmed Shipped:", this.state.ship_quantity)
      this.handleBlur();
    }
  }

  handleQuantityChange(val){
    this.setState({ship_quantity: val})
  }

  resetShipQuantity(){
    this.setState({
      ship_quantity: '',
      err_ship_quantity: '',
    });
  }

  smartAdd(data){
    this.setState({
      showSearchOption: false,
      asin: data.amzn_asin,
      seller_sku: data.seller_sku,
      quantity: '',
      showModal: true,
    });
  }

  handleDeleteModal(){
    this.setState({
      showDeleteModal: !this.state.showDeleteModal
    });
  }

  confirmDelete(id){
    api.deleteInventoryItem({id: id});
    this.handleBlur();
    this.handleDeleteModal();
  }

  calculateTotals(data){
    let totalValue = 0; 
    let totalCost = 0;
    data.forEach(function(item){
      totalValue += Number((item["Total Value"]).slice(1))
      totalCost += Number((item["Total Cost"]).slice(1))
    })
    return {totalCost: totalCost, totalValue: totalValue}
  }

  render(){
    var details, dashboard;

    if(this.state.detail && this.state.detail.amzn_asin)
     details = <Details
        smartAdd={this.smartAdd.bind(this)}
        deleteAll={this.confirmDelete.bind(this)} 
        hideDetails={this.handleBlur.bind(this)} 
        data={this.state.detail}
        historical={this.state.historical.graphData}
        options={this.state.historical.options} 
        handleShipModal={this.handleShipModal.bind(this)}
        handleDeleteModal={this.handleDeleteModal.bind(this)}
       />

    if(this.state.tableData[0])
      dashboard = <Table data={this.state.tableData} columnNames={Object.keys(this.state.tableData[0])}/>

    return <div>
      <h3 style={{color: "green"}}>Total Inventory Value: ${(this.calculateTotals(this.state.tableData).totalValue).toFixed(2)}</h3>
      <h4 style={{color: "blue"}}>Total Inventory Cost: ${(this.calculateTotals(this.state.tableData).totalCost).toFixed(2)}</h4>
      <Button
        style={{"display": "inline", "marginLeft": "86%"}}
        label='Add Product' raised floating primary
        onMouseUp={this.handleModal.bind(this)}
      />

      <br/>
      {dashboard}
      {this.props.children}
      <Addproduct 
        active={this.state.showModal}
        handleSubmit={this.handleSubmit.bind(this)}
        handleInput={this.handleInput.bind(this)}
        resetModal={this.resetModal.bind(this)}
        asin={this.state.asin}
        seller_sku={this.state.seller_sku}
        purchase_price={this.state.purchase_price}
        quantity={this.state.quantity}
        purchase_date={this.state.purchase_date}
        err_asin={this.state.err_asin}
        err_seller_sku={this.state.err_seller_sku}
        err_purchase_price={this.state.err_purchase_price}
        err_quantity={this.state.err_quantity}
        err_purchase_date={this.state.err_purchase_date}
        handleSearchStringChange={this.handleSearchStringChange.bind(this)}
        handleAmazonSearch={this.handleAmazonSearch.bind(this)}
        handleAmazonResultSelection={this.handleAmazonResultSelection.bind(this)}
        handleSearchToggle={this.handleSearchToggle.bind(this)}
        showSearch={this.state.showSearchOption}
        searchResults={this.state.searchResults}
        searchString={this.state.searchString}
      /> 
      <Ship
        active={this.state.showShipModal}
        data={this.state.detail}
        ship_quantity={this.state.ship_quantity}
        err_quantity={this.state.err_ship_quantity}
        handleShipModal={this.handleShipModal.bind(this)}
        handleQuantityChange={this.handleQuantityChange.bind(this)}
        confirmShip={this.confirmShip.bind(this)}
      />
      <DeleteProduct
        active={this.state.showDeleteModal}
        data={this.state.detail}
        handleDeleteModal={this.handleDeleteModal.bind(this)}
        confirmDelete={this.confirmDelete.bind(this)}
      />
      {details}
    </div>
  }
}
