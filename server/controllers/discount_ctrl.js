const Discount = require('./../models/discount');
const mongoose = require('mongoose');

var exports = module.exports = {};

exports.createDiscount = function(obj, user) {
    var discount = new Discount({code: obj.code.toUpperCase(), maxUses: obj.maxUses, percentOff: obj.percentOff, uses: 0});
    discount._id = new mongoose.Types.ObjectId();
    discount.creator = user;
    discount.save();
}

exports.verifyDiscount = async function(code) {
    var discount = await Discount.findOne({code: code.toUpperCase()});
    return discount;
}

exports.useDiscount = async function(code) {
    var discount = await Discount.findOne({code: code.toUpperCase()});
    discount.uses++;
    await discount.save();
    return discount;
}