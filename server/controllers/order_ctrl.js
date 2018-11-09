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
        res.send({status: 5});
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
    //console.log(tid);
    var order = await Order.findOne({transID: tid}).populate({path: 'buyer', populate: {path: 'primaryCharacter'}}).populate({path: 'builder', populate: {path: 'primaryCharacter'}});
    //console.log(order);
    return order;
}

exports.updateOrder = async function (newOrder) {
    Order.findOne({transID: newOrder.id}, function (err, order) {
        if (order === null || err) {
            console.log("Error updating order #" + tid);
            console.log(err);
            return null;
        }
        order.items = newOrder.items;
        order.price = newOrder.price;
        order.amountPaid = newOrder.amountPaid;
        order.endDate = newOrder.endDate;
        order.deliveredDate = newOrder.deliveredDate;
        order.location = newOrder.location;
        order.character = newOrder.character;
        order.status = newOrder.status;
        order.save();
    });
}

exports.claimOrder = async function (tid, user, res) {
    //console.log(tid);
    Order.findOne({transID: tid}, async function (err, order) {
        if (err) {
            console.log("Didn't find order #" + tid);
            return null;
        }
        order.builder = user;
        await order.save();
        res.send("OK");
        res.end();
    });
}