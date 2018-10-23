const Order = require('./../models/order')
const User = require('./../models/user')
const Item = require('./../models/item')

var exports = module.exports = {};

exports.createOrder = function(res, obj) {
    console.log(obj);
    new Order(obj).save((err, order) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.send("OK").end();
        }
    });
}

exports.findOrderByBuyer = function(res, buyerName) {
    Order.find
}