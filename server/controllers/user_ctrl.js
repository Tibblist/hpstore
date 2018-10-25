const User = require('./../models/user');
const Order = require('./../models/order');
const Character = require('./../models/character');
const mongoose = require('mongoose')

var exports = module.exports = {};

exports.createNewUser = function(charID, charName, charCorpID, charAllianceID) {
    var newCharacter = new Character({'charID': charID, name: charName, corpID: charCorpID, allianceID: charAllianceID});
    newCharacter._id = new mongoose.Types.ObjectId();
    newCharacter.save();
    var newUser = new User({group: 1});
    newUser.primaryCharacter = newCharacter;
    newUser.characters.push(newCharacter);
    newUser._id = new mongoose.Types.ObjectId();
    newUser.save();
}

exports.checkIfUserExists = function(id) {
    return new Promise(function (resolve, reject) {
    User.find({'primaryCharacter.charID': id}, function(err, user) {
            var found = false;
            if (err) {
                console.log(err);
                reject(err);
            }
            if (!user.length) {
                console.log("didn't find user");
            } else {
                console.log("Found user: " + user);
                found = true;
            }
            resolve(found);
        });
    });
}