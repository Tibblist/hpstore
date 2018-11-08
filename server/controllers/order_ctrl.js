const Order = require('./../models/order')
const User = require('./../models/user')
const dataJS = require('./../data');
const mongoose = require('mongoose');


var exports = module.exports = {};

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  

function getRandomNumber(x) {
    var numberString = '';
    for (var i = 0; i < x; i++) {
        numberString = numberString + getRandomInt(9).toString();
    }
    return numberString;
}

exports.createOrder = async function(res, obj, user) {
    var order = new Order({discountCode: obj.discountCode});
    order._id = new mongoose.Types.ObjectId();
    order.buyer = user;
    order.location = obj.location;
    order.character = obj.character;
    var id = getRandomNumber(8);
    var testOrder = await Order.findOne({transID: id})
    while (testOrder) {
        id = getRandomNumber(8);
        testOrder = await Order.findOne({transID: id})
    }

    order.transID = id;
    if (!dataJS.validatePricing(obj.items)) {
        console.log("Failed to validate pricing for: " + user.primaryCharacter.name);
        res.send("Invalid pricing");
        res.end();
        return;
    }
    var totalPrice = 0;
    for (var i = 0; i < obj.items.length; i++) {
        totalPrice += obj.items[i].price * obj.items[i].quantity;
        var newItem = {
            id: obj.items[i].id,
            name: obj.items[i].name,
            quantity: obj.items[i].quantity,
            price: obj.items[i].price
        }
        order.items.push(newItem);
    }
    order.status = 1;
    order.orderDate = new Date();
    order.endDate = null;
    order.deliveredDate = null;
    order.price = totalPrice;
    order.amountPaid = 0;
    order.code = obj.discountCode;
    order.save();
    res.send(id);
    res.end();
}

exports.getOrders = async function(user, isBuilder) {
    var orders = await Order.find().populate({path: 'buyer', populate: {path: 'primaryCharacter'}}).populate({path: 'builder', populate: {path: 'primaryCharacter'}}).exec();
    if (isBuilder) {
        return orders;
    } else {
        var newArray = [];
        for (order in orders) {
            if (order.buyer.token == user.token) {
                newArray.push(order);
            }
        }
        return newArray;
    }
}

exports.findOrderByTID = async function (tid) {
    return await Order.find({transID: tid});
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