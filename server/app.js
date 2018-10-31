const express = require('express');
const mongoose = require("mongoose");
var morgan = require("morgan");  
var compression = require("compression");  
var helmet = require("helmet");
const esi = require('./esi');
const dataJS = require('./data')


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
  console.log("connected to the database")
});

db.on("error", console.error.bind(console, "MongoDB connection error:"));

const Status = Object.freeze({
  PAY:    1,
  BUILD:  2,
  DELAY:  3,
  REJECT: 4,
});

var data = [
  prepData(110, "Naglfar", 1200000000, "10/20/18", "10/27/18", "1", Status.BUILD),
  prepData(114, "Naglfar", 1200000000, "10/20/18", "10/27/18", "1", Status.PAY),
  prepData(120, "Naglfar", 1200000000, "10/20/18", "10/27/18", "1", Status.DELAY),
  prepData(123, "Naglfar", 1200000000, "10/20/18", "10/27/18", "1", Status.REJECT),
  prepData(125, "Naglfar", 1200000000, "10/20/18", "10/27/18", "1", Status.REJECT),
]

function prepData(transID, name, price, startDate, expectedDate, deliveredDate, status) {
  return {transID, name, price, startDate, expectedDate, deliveredDate, status};
}

// An api endpoint that returns all the orders for a all users
app.get('/api/getOrders', (req,res) => {
    res.json(data);
    console.log('Sent list of orders');
});

app.post('/api/createOrder', (req, res) => {
  data.push(req.body);
  console.log("Recieved order: " + req.body);
});

app.get('/callback', (req, res) => {
  var code = req.query.code;
  esi.initialCodeProcessing(res, code).then(function() {
    res.redirect('/account');
    res.end();
  }).catch(function(err){
    console.log("ERROR: " + err);
  });
});

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile('index.html', { root: __dirname });
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);