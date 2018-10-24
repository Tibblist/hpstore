const User = require('./../models/user');
const Order = require('./../models/order');

var exports = module.exports = {};

exports.createNewUser = function(user) {

    var user = new User(user);
    user.save();
}