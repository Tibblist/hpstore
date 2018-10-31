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
        if (itemIDMap.get(parseInt(conversions[i].productTypeID, 10)) == undefined) {
            continue;
        }
        if (itemIDMap.get(parseInt(conversions[i].productTypeID, 10)).includes("Blueprint")) {
            //console.log("Blocked invention item");
            continue;
        }
        bpMap.set(parseInt(conversions[i].typeID, 10), {itemID: parseInt(conversions[i].productTypeID, 10), quantityPerRun: parseInt(conversions[i].quantity, 10)});
    }
}

function createItemArray() {
    for (var i = 0; i < matsArray.length; i++) {
        var item = matsArray[i];
        var type = parseInt(item.typeID, 10);
        var index = findItemIndex(type);
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
                name: itemIDMap.get(bpMap.get(parseInt(item.typeID, 10)).itemID),
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
    /*for (var i = 0; i < itemArray.length; i++) {
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
    }*/
    
    breakDownArray();
    cleanDuplicates();
    breakDownArray();
    cleanDuplicates();
    breakDownArray();
    cleanDuplicates();

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

function isMatAProduct(matID) {
    if (productsArray.includes(matID)) {
        return true;
    } else {
        return false;
    }
}

function breakDownArray() {
    for (var i = 0; i < itemArray.length; i++) {
        var newMatsArray = [];
        for (var j = 0; j < itemArray[i].mats.length; j++) {
            if (isMatAProduct(itemArray[i].mats[j].id)) {
                var item = findItem(itemArray[i].mats[j].id);
                for (var k = 0; k < item.mats.length; k++) {
                    var found = false;
                    for (var g = 0; g < itemArray[i].mats.length; g++) {
                        if (item.mats[k].id == itemArray[i].mats[g].id) {
                            newMatsArray.push({id: itemArray[i].mats[g].id, name: itemArray[i].mats[g].name, quantity: itemArray[i].mats[g].quantity + item.mats[k].quantity})
                            found = true;
                        }
                    }
                    if (!found) {
                        var mat = {
                            id: item.mats[k].id,
                            name: item.mats[k].name,
                            quantity: item.mats[k].quantity
                        }
                        newMatsArray.push(mat);
                    }
                }
            } else {
                newMatsArray.push(itemArray[i].mats[j]);
            }
        }
        itemArray[i].mats = newMatsArray;
    }
}

function cleanDuplicates() {
    var index = findItemIndex(12006);

    for (var i = 0; i < itemArray.length; i++) {
        //console.log(itemArray[index].mats);
        var newMatArray = [];
        for (var j = 0; j < itemArray[i].mats.length; j++) {
            var mat = itemArray[i].mats[j];
            if (isInNewArray(mat.id, newMatArray)) {
                continue;
            }
            for (var k = 0; k < itemArray[i].mats.length; k++) {
                var mat2 = itemArray[i].mats[k];
                if (k == j) {
                    continue;
                }
                if (mat.id == mat2.id) {
                    //if (itemArray[i].id == 12005) console.log("adding " + mat.quantity + " of " + mat.name + " to " + mat2.quantity);
                    mat.quantity = mat.quantity + mat2.quantity;
                }
            }
            newMatArray.push(mat);
        }
        //if (itemArray[i].id == 12005) console.log(newMatArray);
        itemArray[i].mats = newMatArray;
    }
}

function isInNewArray(id, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].id == id) {
            return true;
        }
    }
    return false;
}

function findItem(typeID) {
    for (var i = 0; i < itemArray.length; i++) {
        if (itemArray[i].id == typeID) {
            return itemArray[i];
        }
    }
    console.log("ERROR FINDING ITEM");
    console.log(typeID);
    return null;
}

function findItemIndex (typeID) {
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