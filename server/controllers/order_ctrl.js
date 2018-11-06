const Order = require('./../models/order')
const User = require('./../models/user')
const Item = require('./../models/item')
const dataJS = require('./../data');

var exports = module.exports = {};

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  

function getRandomNumber(x) {
    var numberString;
    for (var i = 0; i < x; i++) {
        numberString = numberString + getRandomInt(9).toString();
    }
    return numberString;
}

exports.createOrder = async function(res, obj, user) {
    console.log(obj);
    var order = new Order();
    order.buyer = user;
    var id = getRandomNumber(8);
    var testOrder = await Order.findOne({transID: id})
    
    while (testOrder) {
        id = getRandomNumber(8);
        testOrder = await Order.findOne({transID: id})
    }

    order.transID = id;
    if (!dataJS.validatePricing(obj.items)) {
        res.send("Invalid pricing");
        res.end();
        return;
    }

    
}

exports.findOrderByBuyer = function(res, buyerName) {
    Order.find({'buyer.primaryCharacter.name': buyerName}, function(err, order) {
        if (err) {
            console.log(err);
        }
        res.send(order);
    });
}

exports.findOrderByTID = function (res, tid) {
    Order.find({transID: tid}, function(err, order) {
        if (err) {
            console.log(err);
        }
        res.send(order);
    });
}

exports.updateOrderPrice = function (tid, newPrice) {
    Order.findOne({transID: tid}, function(err, order){
        if (err) {
            console.log(err);
        }
        order.changePrice(newPrice);
    });
}

exports.updateOrderPaid = function (tid, newPaid) {
    Order.findOne({transID: tid}, function(err, order){
        if (err) {
            console.log(err);
        }
        order.changePaid(newPaid);
    })
}