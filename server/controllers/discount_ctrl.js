const Discount = require('./../models/discount');
const mongoose = require('mongoose');

var exports = module.exports = {};

exports.getDiscounts = async function() {
    var discounts = await Discount.find();
    discounts.forEach(discount => {
        discount._id = undefined;
        discount.creator = undefined;
        discount.__v = undefined;
    });
    return discounts;
}

exports.verifyDiscount = async function(code) {
    var discount = await Discount.findOne({code: code.toUpperCase()});
    return discount;
}

exports.updateDiscounts = async function(discounts, user) {
    var discountList = await Discount.find();
    var usedIndices = [];
    var lastDiscount = discountList[discountList.length - 1];
    try {
        discountList.forEach(discount => {
            var discountIndex = discountDoesExist(discounts, discount.code);
            console.log(discounts);
            console.log(discount.code);
            if (discountIndex !== -1) {
                console.log("Found discount at index:" + discountIndex);
                Discount.findOne({code: discount.code.toUpperCase()}, function(err, discountObject){
                    if (err) {
                        console.log(err);
                        return;
                    }
    
                    if (discountObject === null) { //This should never trigger!
                        console.log("Discount code: " + discounts[discountIndex].code + " doesn't exist in db yet");
                        return;
                    }
                    
                    discountObject.maxUse = discounts[discountIndex].maxUse;
                    discountObject.percentOff = discounts[discountIndex].percentOff;
                    discountObject.save();
                })
            } else {
                console.log("Deleting discount: " + discount.code);
                Discount.deleteOne({code: discount.code}, function(err, res) {
                    if (err) console.log(err);
                    //console.log(res);
                });
            }
        });
    } catch (e) {
        console.log(e);
        return;
    }

    discounts.forEach(discount => {
        console.log("Adding code: " + discount.code + " to db.")
        if (discountDoesExist(discountList, discount.code) === -1) {
            createDiscount(discount, user);
        }
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

function createDiscount(obj, user) {
    console.log(obj);
    var discount = new Discount({code: obj.code.toUpperCase(), maxUse: obj.maxUse, percentOff: obj.percentOff, uses: 0});
    discount._id = new mongoose.Types.ObjectId();
    discount.creator = user;
    discount.save();
}

exports.useDiscount = async function(code) {
    var discount = await Discount.findOne({code: code.toUpperCase()});
    if (discount.uses >= discount.maxUse) {
        return false;
    } else {
        discount.uses++;
        console.log(discount.uses);
        await discount.save();
        return true;
    }
}