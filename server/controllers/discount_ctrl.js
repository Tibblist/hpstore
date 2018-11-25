const Discount = require('./../models/discount');
const mongoose = require('mongoose');

var exports = module.exports = {};

exports.createDiscount = function(obj, user) {
    var discount = new Discount({code: obj.code.toUpperCase(), maxUses: obj.maxUses, percentOff: obj.percentOff, uses: 0});
    discount._id = new mongoose.Types.ObjectId();
    discount.creator = user;
    discount.save();
}

exports.getDiscounts = async function() {
    var discounts = await Discount.find();
    return discounts;
}

exports.verifyDiscount = async function(code) {
    var discount = await Discount.findOne({code: code.toUpperCase()});
    return discount;
}

exports.updateDiscounts = async function(discounts) {
    var discountList = Discount.find();
    discountList.forEach(discount => {
        var discountIndex = discountDoesExist(discounts, discount.code);
        if (discountIndex !== -1) {
            Discount.findOne({code: discount.code.toUpperCase()}, function(err, discountObject){
                if (err) {
                    console.log(err);
                    return;
                }

                if (discountObject === null) { //This should never trigger!
                    console.log("Discount code: " + discounts[discountIndex].code + " doesn't exist in db yet");
                    return;
                }
                
                discountObject.maxUses = discounts[discountIndex].maxUses;
                discountObject.percentOff = discounts[discountIndex].percentOff;
                discountObject.save();
                discounts.splice(discountIndex, 1);
            })
        } else {
            Discount.deleteOne({code: discount.code});
        }
    });

    discounts.forEach(discount => {
        console.log("Adding code: " + discount.code + " to db.")
        var newDiscount = new Discount(discount);
        newDiscount.save();
    });
}

function discountDoesExist(discounts, code) {
    for (var i = 0; i < discounts.length; i++) {
        if (discounts[i].code === code) {
            return i;
        }
    }

    return -1;
}

exports.useDiscount = async function(code) {
    var discount = await Discount.findOne({code: code.toUpperCase()});
    if (discount.uses === discount.maxUses) {
        return false;
    } else {
        discount.uses++;
        await discount.save();
        return true;
    }
}