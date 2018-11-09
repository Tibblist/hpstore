const User = require('./../models/user');
const Order = require('./../models/order');
const Character = require('./../models/character');
const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

var exports = module.exports = {};

exports.createNewUser = function(charID, charName, charCorpID, charAllianceID) {
    var newCharacter = new Character({'charID': charID, name: charName, corpID: charCorpID, allianceID: charAllianceID});
    newCharacter._id = new mongoose.Types.ObjectId();
    var newUser = new User({group: 1});
    newUser.primaryCharacter = newCharacter;
    newUser.characters.push(newCharacter);
    newUser._id = new mongoose.Types.ObjectId();
    console.log("Primary Character of newUser is: " + newUser.primaryCharacter.name);
    newUser.token = uuidv4();
    newCharacter.owner = newUser;
    newUser.save(function(err) {
        console.log(err);
    });
    newCharacter.save(function(err) {
        console.log(err);
    });
    return newUser;
}

exports.changeUserSettings = async function(user, character, location) {
    user.defaultShipping = location;
    user.defaultCharacter = character;
    user.save();
    //console.log(user);
}

exports.checkIfUserExists = function(id) {
    return new Promise(function (resolve, reject) {
        Character.find({charID: id})
        .populate('owner')
        .exec(function(err, char) {
            if (err) {
                reject(err);
            }
            //console.log(char); 
            if(!char.length) {
                console.log("No char found");
                resolve([null, false]);
                return;
            }
            //console.log(char[0].owner);
            resolve([char[0].owner, true, char[0].name, char[0].owner.group]);
        });
    });
}

exports.getUserWithToken = async function(token) {
    var user = await User.findOne({'token': token}).populate('primaryCharacter');
    return user;
}

exports.userIsAdmin = function(user) {
    return (user.group == 3)
}

exports.userIsBuilder = function(user) {
    return (user.group > 1)
}

exports.userIsValid = function(user) {
    return (user.group > 0)
}