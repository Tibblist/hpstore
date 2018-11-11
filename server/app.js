const express = require('express');
const mongoose = require("mongoose");
var morgan = require("morgan");  
var compression = require("compression");  
var helmet = require("helmet");
var fs = require('fs');
const esi = require('./esi');
const dataJS = require('./data');
const user_ctrl = require('./controllers/user_ctrl');
const order_ctrl = require('./controllers/order_ctrl')

const app = express();
// Serve the static files from the React app
app.use(helmet());
app.use(compression());
app.use(morgan("common"));
app.use(express.static('../../../build/'));
app.use(express.json());

const dbRoute = "mongodb://Tibblist:034469poop@ds237713.mlab.com:37713/hpstore";

mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => {
  dataJS.init();
  dataJS.recalcPricing();
  console.log("connected to the database")
});

db.on("error", console.error.bind(console, "MongoDB connection error:"));

// An api endpoint that returns all the orders for a all users
app.get('/api/getOrders', async (req,res) => {
  var user = await user_ctrl.getUserWithToken(req.get('Authorization'));
  if (user_ctrl.userIsValid(user)) {
    var orders = await order_ctrl.getOrders(user, user_ctrl.userIsBuilder(user));
    //console.log(orders);
    var ret = parseOrdersToArray(orders, user);
    res.json(ret);
    res.end();
  } else {
    res.send(403);
    res.end();
  }
});

app.get('/api/getOrder', async (req,res) => {
  var user = await user_ctrl.getUserWithToken(req.get('Authorization'));
  if (user_ctrl.userIsBuilder(user)) {
    //console.log(req.query);
    var order = await order_ctrl.findOrderByTID(req.query.id);
    if (order === null) {
      res.send({status: "Not Found"});
      res.end();
      return;
    }
    var builder = '';
    console.log(order);
    if (order.builder == undefined) {
      builder = "Unclaimed";
    } else {
      builder = order.builder.primaryCharacter.name;
    }
    var ret = {
      id: order.transID,
      items: order.items,
      price: order.price,
      buyer: order.buyer.primaryCharacter.name,
      builder: builder,
      amountPaid: order.amountPaid,
      endDate: order.endDate,
      deliveredDate: order.deliveredDate,
      location: order.location,
      character: order.character,
      status: order.status
    }
    res.json(ret);
    res.end();
  } else {
    res.send(403);
    res.end();
  }
});

app.post('/api/postOrderUpdate', async (req, res) => {
  var user = await user_ctrl.getUserWithToken(req.get('Authorization'));
  if (user_ctrl.userIsBuilder(user)) {
    order_ctrl.updateOrder(req.body);
    res.send("OK");
    res.end();
  } else {
    res.send(403);
    res.end();
  }
});

app.post('/api/claimOrder', async (req, res) => {
  var user = await user_ctrl.getUserWithToken(req.get('Authorization'));
  if (user_ctrl.userIsBuilder(user)) {
    order_ctrl.claimOrder(req.body.id, user, res);
  } else {
    res.send(403);
    res.end();
  }
});

app.post('/api/postOrder', async (req, res) => {
  var user = await user_ctrl.getUserWithToken(req.get('Authorization'));
  if (user_ctrl.userIsValid(user)) {
    order_ctrl.createOrder(res, req.body, user);
  } else {
    res.send(403);
    res.end();
  }
});

app.get('/callback', (req, res) => {
  var code = req.query.code;
  var redirect = req.query.state
  esi.initialCodeProcessing(res, code).then(function() {
    res.redirect(redirect);
    res.end();
  }).catch(function(err){
    console.log(err);
  });
});

app.get('/api/getItems', (req,res) => {
  res.json(dataJS.getPriceArray());
});

app.get('/api/getMargins', async (req,res) => {
  const margins = require('./margins');
  var user = await user_ctrl.getUserWithToken(req.get('Authorization'));
  if (user_ctrl.userIsBuilder(user)) {
    res.json(margins);
  } else {
    res.send(403);
    res.end();
  }
});

app.post('/api/postMargins', async (req, res) => {
  var user = await user_ctrl.getUserWithToken(req.get('Authorization'));
  if (user_ctrl.userIsBuilder(user)) {
    fs.writeFile('margins.json', JSON.stringify(req.body, null, 1), 'utf8', function(){
      console.log("Saved margins to disk");
      dataJS.recalcPricing();
    });
    res.send("OK");
    res.end();
  } else {
    res.send(403);
    res.end();
  }
});

app.get('/api/getMatPrices', async (req,res) => {
  const mats = require('./mats');
  var user = await user_ctrl.getUserWithToken(req.get('Authorization'));
  if (user_ctrl.userIsValid(user)) {
    res.json(mats);
  } else {
    res.send(403);
    res.end();
  }
});

app.get('/api/getSettings', async (req,res) => {
  const mats = require('./mats');
  var user = await user_ctrl.getUserWithToken(req.get('Authorization'));
  if (user_ctrl.userIsBuilder(user)) {
    res.json({character: user.defaultCharacter, location: user.defaultShipping});
  } else {
    res.send(403);
    res.end();
  }
});

app.post('/api/postMatPrices', async (req, res) => {
  var user = await user_ctrl.getUserWithToken(req.get('Authorization'));
  if (user_ctrl.userIsBuilder(user)) {
    fs.writeFile('mats.json', JSON.stringify(req.body, null, 1), 'utf8', function(){
      console.log("Saved prices to disk");
      dataJS.recalcPricing();
    });
    res.send("OK");
    res.end();
  } else {
    res.send(403);
    res.end();
  }
});

app.post('/api/postSettings', async (req, res) => {
  var user = await user_ctrl.getUserWithToken(req.get('Authorization'));
  if (user_ctrl.userIsValid(user)) {
    user_ctrl.changeUserSettings(user, req.body.character, req.body.location);
    res.send("OK");
    res.end();
  } else {
    res.send(403);
    res.end();
  }
});

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile('index.html', { root: __dirname });
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);

function parseOrdersToArray(orders, user) {
  var ret = {
    isBuilder: user_ctrl.userIsBuilder(user),
    data: []
  };
  var date;
  if (ret.isBuilder) {
    for (var i = 0; i < orders.length; i++) {
      var subArray = [];
      subArray.push(orders[i].transID);
      if (orders[i].builder == undefined) {
        subArray.push("Unclaimed");
      } else {
        subArray.push(orders[i].builder.primaryCharacter.name);
      }
      if (orders[i].buyer === null) {
        //console.log(orders[i]);
      }
      subArray.push(orders[i].buyer.primaryCharacter.name);
      subArray.push(numberWithCommas(orders[i].price));
      var itemString = '';
      for (var j = 0; j < orders[i].items.length; j++) {
        if (j == 0) {
          itemString += orders[i].items[j].name + " x" + orders[i].items[j].quantity
        } else {
          itemString += "\n" + orders[i].items[j].name + " x" + orders[i].items[j].quantity
        }
      }
      subArray.push(itemString);
      subArray.push(orders[i].location);
      subArray.push(orders[i].character);
      date = Date.parse(orders[i].orderDate);
      date = new Date(date);
      subArray.push(date.toDateString());
      if (orders[i].endDate == null) {
        subArray.push("Not in build yet");
      } else {
        date = Date.parse(orders[i].endDate);
        date = new Date(date);
        subArray.push(date.toDateString());
      }
      if (orders[i].deliveredDate == null) {
        subArray.push("");
      } else {
        date = Date.parse(orders[i].deliveredDate);
        date = new Date(date);
        subArray.push(date.toDateString());
      }
      subArray.push(orders[i].status);
      ret.data.push(subArray);
    }
  } else {
    for (var i = 0; i < orders.length; i++) {
      var subArray = [];
      subArray.push(orders[i].transID);
      if (orders[i].builder == undefined) {
        subArray.push("Unclaimed");
      } else {
        subArray.push(orders[i].builder.primaryCharacter.name);
      }
      subArray.push(numberWithCommas(orders[i].price));
      var itemString = '';
      for (var j = 0; j < orders[i].items.length; j++) {
        if (j == 0) {
          itemString += orders[i].items[j].name + " x" + orders[i].items[j].quantity
        } else {
          itemString += "\n" + orders[i].items[j].name + " x" + orders[i].items[j].quantity
        }
      }
      subArray.push(itemString);
      subArray.push(orders[i].location);
      subArray.push(orders[i].character);
      date = Date.parse(orders[i].orderDate);
      date = new Date(date);
      subArray.push(date.toDateString());
      if (orders[i].endDate == null) {
        subArray.push("Not in build yet");
      } else {
        date = Date.parse(orders[i].endDate);
        date = new Date(date);
        subArray.push(date.toDateString());
      }
      if (orders[i].deliveredDate == null) {
        subArray.push("");
      } else {
        date = Date.parse(orders[i].deliveredDate);
        date = new Date(date);
        subArray.push(date.toDateString());
      }
      subArray.push(orders[i].status);
      ret.data.push(subArray);
    }
  }

  return ret;
}

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}