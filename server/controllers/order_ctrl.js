const Order = require('./../models/order');
const discount_ctrl = require('./discount_ctrl');
const dataJS = require('./../data');
const mongoose = require('mongoose');
const User = require('./../models/user');
const Character = require('./../models/character');

var exports = module.exports = {};

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  

function getRandomNumber(x) {
    var numberString = '';
    for (var i = 0; i < x; i++) {
        var int = getRandomInt(9);
        if (i === 0) {
            while (int === 0) {
                int = getRandomInt(9);
            }
        }
        numberString = numberString + int.toString();
    }
    return numberString;
}

exports.createOrder = async function(res, obj, user) {
    var order = new Order({discountCode: obj.discountCode});
    var discount = await discount_ctrl.verifyDiscount(obj.discountCode);
    order._id = new mongoose.Types.ObjectId();
    if (user) order.buyer = user;
    else {
        var guest = await User.findOne({token: 0});
        if (!guest) {
            var newCharacter = new Character({name: 'Guest'});
            newCharacter._id = new mongoose.Types.ObjectId();
            await newCharacter.save();
            var makeGuest = new User({token: 0, group: 1, });
            makeGuest._id = new mongoose.Types.ObjectId();
            makeGuest.primaryCharacter = newCharacter;
            await makeGuest.save();
            guest = makeGuest;
        }
        order.buyer = guest;
    }
    order.location = obj.location;
    order.character = obj.character;
    var id = getRandomNumber(8);
    var testOrder = await Order.findOne({transID: id})
    while (testOrder) {
        id = getRandomNumber(8);
        testOrder = await Order.findOne({transID: id})
    }
    if (discount !== null) {
        var isValid = await discount_ctrl.useDiscount(discount.code);
        if (isValid === false) {
            discount = null;
            res.send({status: 1});
            res.end();
        }
    } else {
        discount = {percentOff: 0}
    }
    order.transID = id;
    if (!dataJS.validatePricing(obj.items)) {
        if (user) console.log("Failed to validate pricing for: " + user.primaryCharacter.name);
        else console.log("Failed to validate pricing for: " + obj.character);
        res.send({status: 2});
        res.end();
        return;
    }
    var totalPrice = 0;
    for (var i = 0; i < obj.items.length; i++) {
        totalPrice += (obj.items[i].price * obj.items[i].quantity) - ((obj.items[i].price * obj.items[i].quantity) * discount.percentOff/100);
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
    return order;
}

exports.getOrders = async function(user, isBuilder) {
    var orders = await Order.find().populate({path: 'buyer', populate: {path: 'primaryCharacter'}}).populate({path: 'builder', populate: {path: 'primaryCharacter'}}).exec();
    if (isBuilder) {
        return orders;
    } else {
        var newArray = [];
        for (var i = 0; i < orders.length; i++) {
            if (orders[i].buyer.token === user.token) {
                //console.log("Pushing order");
                newArray.push(orders[i]);
            }
        }
        return newArray;
    }
}

exports.getAllOrders = async function() {
    return await Order.find().populate({path: 'buyer', populate: {path: 'primaryCharacter'}}).populate({path: 'builder', populate: {path: 'primaryCharacter'}}).exec();
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
            console.log("Error updating order #" + newOrder.id);
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
        if (err || order === null) {
            console.log("Didn't find order #" + tid);
            res.end();
            return null;
        }
        order.builder = user;
        await order.save();
        res.send("OK");
        res.end();
    });
}

exports.deleteOrder = async function(tid) {
    Order.deleteOne({transID: tid}, function(err, res) {
        if (err) console.log(err);
        //else console.log(res);
    });
}

exports.completeOrder = async function(tid) {
    var order = await Order.findOne({transID: tid});
    if (order !== null) {
        order.deliveredDate = new Date();
        order.status = 5;
        await order.save();
        return true;
    } else {
        return false;
    }
}