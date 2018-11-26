import React, { Fragment } from 'react';
import StoreHeader from './store-header';
import ItemGrid from '../utils/item-grid';
import { AuthService, AuthRoute } from '../../backend/client/auth';
import {Route} from 'react-router-dom';
import CheckoutItems from './checkout';
import StoreSideBar from '../utils/store-sidebar'
import { Typography, Paper, Button, Divider } from '@material-ui/core';
import {Link} from 'react-router-dom';

const request = require('superagent');

export default class Store extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      itemArray: [],
      cart: [],
      hullArray: [],
      modArray: [],
      hullSuggestions: [],
      modSuggestions: [],
      searchArray: [],
      isSearching: false,
      group: 0
    }
    this.fetchData = this.fetchData.bind(this);
    //console.log("Constructor ran");
  }

  componentDidMount() {
    this.fetchData();
    var cart = localStorage.getItem("Cart");
    document.title = "Store";
    if (cart !== null) {
      //console.log(cart);
      cart = JSON.parse(cart);
      this.setState({
        cart: cart,
      })
    }
  }

  clearCart = () => {
    this.setState({
      cart: []
    })
  }

  fetchData = () => {
    //console.log("Fetching data");
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
            var hullArray = res.body.filter(function (value, index, arr) {
              return value.category === 6;
            });
            var modArray = res.body.filter(function (value, index, arr) {
              return value.category === 7;
            });
            var newSuggestions = [];
            for (var i = 0; i < res.body.length; i++) {
              newSuggestions.push({label: res.body[i].name});
            }
            var hullSuggestions = [];
            for (var i = 0; i < hullArray.length; i++) {
              hullSuggestions.push({label: hullArray[i].name});
            }
            var modSuggestions = [];
            for (var i = 0; i < modArray.length; i++) {
              modSuggestions.push({label: modArray[i].name});
            }
            this.setState({
                itemArray: res.body,
                suggestions: newSuggestions,
                hullArray: hullArray,
                modArray: modArray,
                hullSuggestions: hullSuggestions,
                modSuggestions: modSuggestions
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

    componentDidUpdate(props) {
      //console.log(JSON.stringify(this.state.cart));
      localStorage.setItem("Cart", JSON.stringify(this.state.cart));
    }

    filterArray = (string, category) => {
      //console.log("Filtering for: " + string);
      var inputLength = string.length;
      var newItemArray = this.state.itemArray.filter(function (value, index, arr) {
        for (var i = 0; i < category.length; i++) {
          if (value.category === category[i]) {
            return value.name.slice(0, inputLength).toLowerCase() === string.toLowerCase();
          }
        }
        return false;
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

    filterArrayByGroup = (group) => {
      if (group === this.state.group) {
        this.setState({
          isSearching: false,
          group: 0
        });
        return;
      }
      var newItemArray = this.state.itemArray.filter(function (value, index, arr) {
        if (value.group === parseInt(group, 10)) {
          return true;
        }
        return false;
      });

      this.setState({
        searchArray: newItemArray,
        isSearching: true,
        group: group
      });
    }

    updatePrices = () => {
      this.fetchData();
      var cart = this.state.cart;
      for (var i = 0; i < cart.length; i++) {
        var item = cart[i];
        for (var j = 0; j < this.state.itemArray.length; j++) {
          if (item.id === this.state.itemArray[j].id) {
            cart[i].price = this.state.itemArray[j].price;
          }
        }
      }
      this.setState({
        cart: cart
      })
    }

    changeQuantity = (id, e) => {
      var newCart = this.state.cart;
      for (var i = 0; i < newCart.length; i++) {
        if (newCart[i].id == id) {
          if (e.target.value === "0") {
            newCart.splice(i, 1);
            break;
          }
          if (e.target.value === "") {
            newCart[i].quantity = 0;
            break;
        }
          newCart[i].quantity = parseInt(e.target.value, 10);
        }
      }
      this.setState({
        cart: newCart,
      });
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
                render={(props) => <StoreHome {...props}></StoreHome>}
              />
              <Route
                path='/store/hulls'
                render={(props) => <ShowHulls {...props} changeQuantity={this.changeQuantity} suggestions={this.state.hullSuggestions} cart={this.state.cart} changeFunction={this.filterArray} addFunction={this.addToCart} items={this.state.isSearching ? array : this.state.hullArray} filterArrayGroup={this.filterArrayByGroup}/>}
              />
              <Route
                path='/store/mods'
                render={(props) => <ShowMods {...props} changeQuantity={this.changeQuantity} suggestions={this.state.modSuggestions} cart={this.state.cart} changeFunction={this.filterArray} addFunction={this.addToCart} items={this.state.isSearching ? array : this.state.modArray} filterArrayGroup={this.filterArrayByGroup}/>}
              />
              <Route
                path='/store/fittings'
                exact
                render={(props) => <ShowHulls {...props} changeQuantity={this.changeQuantity} suggestions={this.state.suggestions} cart={this.state.cart} changeFunction={this.filterArray} addFunction={this.addToCart} items={array} filterArrayGroup={this.filterArrayByGroup}/>}
              />
              <Route
              path="/store/fittings/parser"
              render={(props) => <div/>}
              />
              <AuthRoute
              path='/store/checkout'
              component={CheckoutItems}
              cart={this.state.cart}
              clearCart={this.clearCart}
              updatePrices={this.updatePrices}
              />
            </div>
        );
    }
}

class ShowHulls extends React.Component {
  render() {
    return (
      <Fragment>
          <StoreHeader suggestions={this.props.suggestions} cart={this.props.cart} category={[6]} changeFunction={this.props.changeFunction} changeQuantity={this.props.changeQuantity}></StoreHeader>
          <StoreSideBar filterArray={this.props.filterArrayGroup}/>
          <ItemGrid addFunction={this.props.addFunction} items={this.props.items}></ItemGrid>
      </Fragment>
    );
  }
}

class ShowMods extends React.Component {

  render() {
    return (
      <Fragment>
        <StoreHeader suggestions={this.props.suggestions} cart={this.props.cart} category={[7, 87]} changeFunction={this.props.changeFunction} changeQuantity={this.props.changeQuantity}></StoreHeader>
        <ItemGrid addFunction={this.props.addFunction} items={this.props.items}></ItemGrid>
      </Fragment>
    )
  }
}

class StoreHome extends React.Component {

  render () {
    return (
      <Fragment>
        <Typography variant="h4" align="center">What are you looking for?</Typography>
        <Paper style={{'display': 'flex', 'flex-direction': 'column', 'margin-top': 10, 'margin-right': '25%', 'margin-left': '25%'}}>
          <Button component={Link} to="/store/hulls">Hulls</Button>
          <Divider/>
          <Button component={Link} to="/store/mods">Mods/Fighters</Button>
          <Divider/>
          <Button component={Link} to="/store/fittings">Doctrine Fittings</Button>
          <Divider/>
          <Button component={Link} to="/store/fittings/parser">Custom Fittings</Button>
        </Paper>
      </Fragment>
    )
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