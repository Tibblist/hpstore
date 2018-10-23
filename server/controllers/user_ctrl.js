const User = require('./../models/user');
const Order = require('./../models/order');

var exports = module.exports = {};

exports.createNewUser = function() {

    var user = new User({'state': 'hi'});
    user.save();
}