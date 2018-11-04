import React from 'react';
import StoreHeader from './store-header';
import ItemGrid from '../utils/item-grid';
import '../../css/store.css';
import { AuthService } from '../../backend/client/auth';
const request = require('superagent');

export default class Store extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      itemArray: [],
      cart: [],
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

    render() {
        return (
            <div>
                <StoreHeader suggestions={this.state.suggestions} cart={this.state.cart}></StoreHeader>
                <ItemGrid addFunction={this.addToCart} items={this.state.itemArray}></ItemGrid>
            </div>
        );
    }
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