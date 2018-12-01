/* eslint-disable no-redeclare */
const express = require('express');
const mongoose = require("mongoose");
var morgan = require("morgan");  
var compression = require("compression");  
var helmet = require("helmet");
var fs = require('fs');
const esi = require('./esi');
const dataJS = require('./data');
const user_ctrl = require('./controllers/user_ctrl');
const order_ctrl = require('./controllers/order_ctrl');
const discount_ctrl = require('./controllers/discount_ctrl');
const INFO = require('./config');
const bot = require('./bot');

const app = express();
// Serve the static files from the React app
app.use(helmet());
app.use(compression());
app.use(morgan("common"));
app.use(express.static('./build/'));
app.use(express.json());

const dbRoute = INFO.DB;

mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", async () => {
  dataJS.init();
  //await dataJS.getMarketerPricing();
  dataJS.recalcPricing();
  console.log("connected to the database")
});

db.on("error", console.error.bind(console, "MongoDB connection error:"));

async function validAuth(req, res, next) {
  var user = await user_ctrl.getUserWithToken(req.get('Authorization'));
  if (user_ctrl.userIsValid(user)) {
    req.user = user;
    next();
  } else {
    res.sendStatus(403);
    res.end();
  }
}

async function builderAuth(req, res, next) {
  var user = await user_ctrl.getUserWithToken(req.get('Authorization'));
  if (user_ctrl.userIsBuilder(user)) {
    req.user = user;
    next();
  } else {
    res.sendStatus(403);
    res.end();
  }
} 

async function adminAuth(req, res, next) {
  var user = await user_ctrl.getUserWithToken(req.get('Authorization'));
  if (user_ctrl.userIsAdmin(user)) {
    req.user = user;
    next();
  } else {
    res.sendStatus(403);
    res.end();
  }
}

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
  var order = await order_ctrl.findOrderByTID(req.query.id);
  if (order === null) {
    res.send({status: 404});
    res.end();
    return;
  }
  if (user_ctrl.userIsBuilder(user) || user.token === order.buyer.token) {
    //console.log(req.query);
    var builder = '';
    if (order.builder === undefined) {
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
    res.send({status: 403});
    res.end();
  }
});

app.get('/api/verifyDiscount', async (req,res) => {
  var user = await user_ctrl.getUserWithToken(req.get('Authorization'));
  if (user_ctrl.userIsValid(user)) {
    var discount = await discount_ctrl.verifyDiscount(req.query.code);
    var valid = true;
    if (discount === null || discount === undefined || discount.uses === discount.maxUse) {
      valid = false;
      res.json({valid: valid, percentOff: 0});
    } else {
      res.json({valid: valid, percentOff: discount.percentOff});
    }
    res.end();
  } else {
    res.send(403);
    res.end();
  }
});

app.get('/api/getDiscounts', async (req,res) => {
  var user = await user_ctrl.getUserWithToken(req.get('Authorization'));
  if (user_ctrl.userIsBuilder(user)) {
    var discounts = await discount_ctrl.getDiscounts();
    res.json(discounts);
    res.end();
  } else {
    res.send(403);
    res.end();
  }
});

app.post('/api/postDiscounts', async (req, res) => {
  var user = await user_ctrl.getUserWithToken(req.get('Authorization'));
  if (user_ctrl.userIsBuilder(user)) {
    discount_ctrl.updateDiscounts(req.body, user);
    res.send("OK");
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

app.post('/api/unClaimOrder', async (req, res) => {
  var user = await user_ctrl.getUserWithToken(req.get('Authorization'));
  if (user_ctrl.userIsBuilder(user)) {
    order_ctrl.claimOrder(req.body.id, undefined, res);
  } else {
    res.send(403);
    res.end();
  }
});

app.post('/api/completeOrder', async(req, res) => {
  var user = await user_ctrl.getUserWithToken(req.get('Authorization'));
  if (user_ctrl.userIsBuilder(user)) {
    var ret = await order_ctrl.completeOrder(req.body.id);
    res.json({status: ret});
    res.end();
  } else {
    res.sendStatus(403);
    res.end();
  }
});

app.post('/api/postOrder', async (req, res) => {
  var user = await user_ctrl.getUserWithToken(req.get('Authorization'));
  if (user_ctrl.userIsValid(user)) {
    var order = await order_ctrl.createOrder(res, req.body, user);
    if (order) bot.postOrder(order.transID, user.primaryCharacter.name, order.price);
  } else {
    res.send(403);
    res.end();
  }
});

app.post('/api/postUsers', async (req, res) => {
  var user = await user_ctrl.getUserWithToken(req.get('Authorization'));
  if (user_ctrl.userIsAdmin(user)) {
    for (var i = 0; i < req.body.length; i++) {
      user_ctrl.updateUserGroup(req.body[i].id, req.body[i].group);
    }
    res.send("OK");
    res.end();
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

app.get('/api/getUsers', async (req,res) => {
  var user = await user_ctrl.getUserWithToken(req.get('Authorization'));
  if (user_ctrl.userIsAdmin(user)) {
    var users = await user_ctrl.getAllUsers();
    var tempUserArray = [];
    for (var i = 0; i < users.length; i++) {
      var tempUser = {
        id: users[i]._id,
        name: users[i].primaryCharacter.name,
        group: users[i].group,
      }
      tempUserArray.push(tempUser);
    }
    res.json(tempUserArray);
  } else {
    res.send(403);
    res.end();
  }
});

app.get('/api/getCategories', async (req,res) => {
  const margins = require('./margins');
  for (var i = 0; i < margins.length; i++) {
    if (parseInt(margins[i].id, 10) === 1) {
      margins.splice(i, 1);
    }
  }
  var catArray = [];
  for (var j = 0; j < margins.length; j++) {
    var category = {
      id: margins[j].id,
      name: margins[j].name,
    }
    catArray.push(category);
  }
  res.json(catArray);
  delete require.cache[require.resolve('./margins')]
});

app.get('/api/getPricelist', async (req,res) => {
  const pricelist = require('./pricelist');
  var user = await user_ctrl.getUserWithToken(req.get('Authorization'));
  if (user_ctrl.userIsBuilder(user)) {
    res.json(pricelist);
  } else {
    res.send(403);
    res.end();
  }
  delete require.cache[require.resolve('./pricelist')]
});

app.get('/api/getoooList', async (req,res) => {
  const pricelist = require('./ooolist');
  var user = await user_ctrl.getUserWithToken(req.get('Authorization'));
  if (user_ctrl.userIsBuilder(user)) {
    res.json(pricelist);
  } else {
    res.send(403);
    res.end();
  }
  delete require.cache[require.resolve('./ooolist')]
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

app.post('/api/postPricelist', async (req, res) => {
  var user = await user_ctrl.getUserWithToken(req.get('Authorization'));
  if (user_ctrl.userIsBuilder(user)) {
    fs.writeFile('pricelist.json', JSON.stringify(req.body, null, 1), 'utf8', function(){
      console.log("Saved pricelist to disk");
      dataJS.recalcPricing();
    });
    res.send("OK");
    res.end();
  } else {
    res.send(403);
    res.end();
  }
});

app.post('/api/postoooList', async (req, res) => {
  var user = await user_ctrl.getUserWithToken(req.get('Authorization'));
  if (user_ctrl.userIsBuilder(user)) {
    fs.writeFile('ooolist.json', JSON.stringify(req.body, null, 1), 'utf8', function(){
      console.log("Saved ooolist to disk");
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
  var user = await user_ctrl.getUserWithToken(req.get('Authorization'));
  if (user_ctrl.userIsValid(user)) {
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

app.delete('/api/deleteOrder', async (req, res) => {
  var user = await user_ctrl.getUserWithToken(req.get('Authorization'));
  if (user_ctrl.userIsBuilder(user)) {
    order_ctrl.deleteOrder(req.query.id);
    res.sendStatus(200);
    res.end();
  } else {
    res.sendStatus(403);
    res.end();
  }
});

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile('build/index.html', { root: __dirname });
});

const port = process.env.PORT || 80;
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
      if (orders[i].builder === undefined) {
        subArray.push("Unclaimed");
      } else {
        subArray.push(orders[i].builder.primaryCharacter.name);
      }
      if (orders[i].buyer === null) {
        //console.log(orders[i]);
      }
      subArray.push(orders[i].buyer.primaryCharacter.name);
      subArray.push(numberWithCommas(orders[i].price));
      subArray.push(orders[i].code ? orders[i].code : "None");
      var itemString = '';
      for (var j = 0; j < orders[i].items.length; j++) {
        if (j === 0) {
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
    // eslint-disable-next-line no-redeclare
    for (var i = 0; i < orders.length; i++) {
      // eslint-disable-next-line no-redeclare
      var subArray = [];
      subArray.push(orders[i].transID);
      if (orders[i].builder === undefined) {
        subArray.push("Unclaimed");
      } else {
        subArray.push(orders[i].builder.primaryCharacter.name);
      }
      subArray.push(numberWithCommas(orders[i].price));
      var itemString = '';
      // eslint-disable-next-line no-redeclare
      for (var j = 0; j < orders[i].items.length; j++) {
        if (j === 0) {
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