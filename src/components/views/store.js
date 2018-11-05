import React from 'react';
import StoreHeader from './store-header';
import ItemGrid from '../utils/item-grid';
import '../../css/store.css';
import { AuthService, AuthRoute } from '../../backend/client/auth';
import {Route} from 'react-router-dom';
import { Paper } from '@material-ui/core';
const request = require('superagent');

export default class Store extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      itemArray: [],
      cart: [],
      searchArray: [],
      isSearching: false,
    }
    this.fetchData = this.fetchData.bind(this);
    //console.log("Constructor ran");
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    console.log("Fetching data");
    request
        .get("/api/getItems")
        .set('Authorization', AuthService.getToken())
        .end((err, res) => {
            if (err) {
                console.log(err);
                this.setState({
                    itemArray: [{id: '0', name: 'Error getting items', price: 0}]
                }); 
                return;
            }
            var newSuggestions = [];
            for (var i = 0; i < res.body.length; i++) {
              newSuggestions.push({label: res.body[i].name});
            }
            //console.log(newSuggestions);
            this.setState({
                itemArray: res.body,
                suggestions: newSuggestions
            });
        })
    }

    addToCart = (id) => {
      var item = findItemByID(id, this.state.itemArray);
      if (item == null) {
        return;
      }
      var cartItem = {
        id: item.id,
        name: item.name,
        quantity: 1,
        price: item.price
      }
      var newCart = this.state.cart;
      newCart = addItemToCart(cartItem, newCart);
      this.setState({
        cart: newCart,
      });
    }

    filterArray = (string) => {
      console.log("Filtering for: " + string);
      var inputLength = string.length;
      var newItemArray = this.state.itemArray.filter(function (value, index, arr) {
        return value.name.slice(0, inputLength).toLowerCase() === string.toLowerCase();
      });

      if (string === null || string === "") {
        this.setState({
          isSearching: false,
          searchArray: []
        });
      } else {
        this.setState({
          isSearching: true,
          searchArray: newItemArray,
        });
      }
    }

    render() {
      var array = [];
        if (this.state.isSearching) {
          array = this.state.searchArray;
        } else {
          array = this.state.itemArray;
        }
        return (
            <div>
              <Route
                path='/store'
                exact
                render={(props) => <ShowItems {...props} suggestions={this.state.suggestions} cart={this.state.cart} changeFunction={this.filterArray} addFunction={this.addToCart} items={array}/>}
              />
              <AuthRoute
              path='/store/checkout'
              render={(props) => <CheckoutItems {...props} cart={this.state.cart}/>}
              />
            </div>
        );
    }
}

class ShowItems extends React.Component {
  render() {
    return (
      <div>
          <StoreHeader suggestions={this.props.suggestions} cart={this.props.cart} changeFunction={this.props.changeFunction}></StoreHeader>
          <ItemGrid addFunction={this.props.addFunction} items={this.props.items}></ItemGrid>
      </div>
    );
  }
}

class CheckoutItems extends React.Component {
  
  render() {
    return (
      <Paper>
        {this.props.cart.map((item, id) => {
          return <Paper key={id}>
            
          </Paper>
        })}
      </Paper>
    )}
}

function findItemByID(id, items) {
  for (var i = 0; i < items.length; i++) {
    if (items[i].id == id) {
      return items[i];
    }
  }
  return null;
}

function addItemToCart(item, cart) {
  for (var i = 0; i < cart.length; i++) {
    if (item.id == cart[i].id) {
      cart[i].quantity = cart[i].quantity + item.quantity;
      return cart;
    }
  }
  cart.push(item);
  return cart;
}