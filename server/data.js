const parsedJSON = require('./eveids.json');
const matsArray = require('./matsNeeded');
const conversions = require('./converter');
var itemIDMap = new Map();
var bpMap = new Map();
var productsArray = [];
var itemArray = [];
var materialArray = [];

var exports = module.exports = {};

exports.init = function() {
    mapItemIDs();
    createConversionMap();
    createItemArray();
}

var exampleItem = {
    id: 1,
    name: 'test',
    mats: [{
        id: 2,
        name: 'trit',
        quantity: 200
    }]
}

function mapItemIDs() {
    for (var i = 0; i < parsedJSON.length; i++) {
        itemIDMap.set(parseInt(parsedJSON[i].ID, 10), parsedJSON[i].NAME);
    }
    //console.log(itemIDMap);
    //console.log(parsedJSON.length)
    //console.log(itemIDMap.get(32773))
}

function createConversionMap() {
    for (var i = 0; i < conversions.length; i++) {
        bpMap.set(parseInt(conversions[i].typeID, 10), {itemID: parseInt(conversions[i].productTypeID, 10), quantityPerRun: parseInt(conversions[i].quantity, 10)});
    }
}

function createItemArray() {
    for (var i = 0; i < matsArray.length; i++) {
        var item = matsArray[i];
        var type = parseInt(item.typeID, 10);
        var index = findItem(type);
        if (type == 41425) {
            console.log(item);
        }
        if (index > -1) {
            var mat = {
                id: parseInt(item.materialTypeID, 10),
                name: itemIDMap.get(parseInt(item.materialTypeID, 10)),
                quantity: parseInt(item.quantity, 10)
            }
            itemArray[index].mats.push(mat);
        } else {
            if (bpMap.get(parseInt(item.typeID, 10)) == undefined) {
                //console.log(item);
                continue;
            }
            var newItem = {
                id: bpMap.get(parseInt(item.typeID, 10)).itemID,
                bpid: parseInt(item.typeID, 10),
                quantity: bpMap.get(parseInt(item.typeID, 10)).quantityPerRun,
                name: itemIDMap.get(type),
                mats: []
            }
            var mat = {
                id: parseInt(item.materialTypeID, 10),
                name: itemIDMap.get(parseInt(item.materialTypeID, 10)),
                quantity: parseInt(item.quantity, 10)
            }
            newItem.mats.push(mat);
            itemArray.push(newItem);
            productsArray.push(newItem.id);
        }
    }
    console.log("Beginning heavy processing");
    for (var i = 0; i < itemArray.length; i++) {
        if (itemArray[i].id != 32790) {
            continue;
        }
        for (var j = 0; j < itemArray[i].mats.length; j++) {
            var mat = itemArray[i].mats[j];
            if (productsArray.includes(mat.id)) {
                for (var k = 0; k < itemArray.length; k++) {
                    var item = itemArray[k];
                    if (item.id == mat.id) {
                        console.log(itemArray[i]);
                        console.log(item);
                        for (var g = 0; g < item.mats.length; g++) {
                            var found = false;
                            for (var f = 0; f < itemArray[i].mats.length; f++) {
                                if (item.mats[g].id == itemArray[i].mats[f].id) {
                                    console.log("adding " + itemArray[i].mats[f].quantity + " of " + itemArray[i].mats[f].name + " to " + item.mats[g].name);
                                    itemArray[i].mats[f].quantity += item.mats[g].quantity;
                                    console.log(itemArray[i].name + "Now needs " + itemArray[i].mats[f].quantity + " of " + itemArray[i].mats[f].name);
                                    found = true;
                                }
                            }
                            if (!found) {
                                console.log("Pushing to mat array: " + item.mats[g].name);
                                itemArray[i].mats.push(item.mats[g]);
                            }
                        }
                        itemArray[i].mats.splice(j, 1);
                        console.log(itemArray[i]);
                    }
                }
            }
        }
    }
    console.log("Ending heavy processing");
    for (var i = 0; i < itemArray.length; i++) {
        for (var j = 0; j < itemArray[i].mats.length; j++) {
            var mat = itemArray[i].mats[j];
            if (!doesMatExist(mat.id)) {
                materialArray.push(mat);
            }
        }
    }
    for (var i = 0; i < 100; i++) {
        //console.log(itemArray[i]);
    }
    for (var i = 0; i < materialArray.length; i++) {
        //console.log(materialArray[i]);
    }
    var json = JSON.stringify(itemArray, null, 4);
    var fs = require('fs');
    fs.writeFile('myjsonfile.json', json, 'utf8', function(){

    });
}

function findItem (typeID) {
    for (var i = 0; i < itemArray.length; i++) {
        if (itemArray[i].bpid == typeID) {
            return i;
        }
    }
    return -1;
}

function doesMatExist(matID) {
    for (var i = 0; i < materialArray.length; i++) {
        if (materialArray[i].id == matID) {
            return true;
        }
    }
    return false;
}