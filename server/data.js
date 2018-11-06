const parsedJSON = require('./eveids.json');
const matsArray = require('./matsNeeded');
const conversions = require('./converter');
const itemInfo = require('./invTypes');
const itemGroups = require('./invGroups');
const itemMeta = require('./invMeta');
var fs = require('fs');
var itemIDMap = new Map();
var itemGroupMap = new Map();
var groupCategoryMap = new Map();
var bpMap = new Map();
var publishedMap = new Map();
var metaMap = new Map();
var productsArray = [];
var itemArray = [];
var materialArray = [];
var itemPriceArray = [];

var exports = module.exports = {};

exports.init = function() {
    mapItemIDs();
    createConversionMap();
    mapItemsToGroup();
    mapGroupToCatagory();
    mapPublished();
    mapMeta();
    createItemArray();
}

function mapItemsToGroup() {
    for (var i = 0; i < itemInfo.length; i++) {
        itemGroupMap.set(parseInt(itemInfo[i].typeID, 10), parseInt(itemInfo[i].groupID, 10));
    }
}

function mapGroupToCatagory() {
    for (var i = 0; i < itemGroups.length; i++) {
        groupCategoryMap.set(parseInt(itemGroups[i].groupID, 10), parseInt(itemGroups[i].categoryID, 10));
    }
}

function mapItemIDs() {
    for (var i = 0; i < parsedJSON.length; i++) {
        itemIDMap.set(parseInt(parsedJSON[i].ID, 10), parsedJSON[i].NAME);
    }
}

function mapPublished() {
    for (var i = 0; i < itemInfo.length; i++) {
        publishedMap.set(parseInt(itemInfo[i].typeID, 10), parseInt(itemInfo[i].published, 10));
    }
}

function mapMeta() {
    for (var i = 0; i < itemMeta.length; i++) {
        metaMap.set(parseInt(itemMeta[i].typeID, 10), parseInt(itemMeta[i].metaGroupID, 10));
    }
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
        if (bpMap.get(parseInt(item.typeID, 10)) == undefined) {
            //console.log(item);
            continue;
        }
        var categoryID = groupCategoryMap.get(itemGroupMap.get(bpMap.get(parseInt(item.typeID, 10)).itemID));
        if (index > -1) {
            var matCategoryID = groupCategoryMap.get(itemGroupMap.get(parseInt(item.materialTypeID, 10)));
            if (isValidMat(matCategoryID)) {
                continue;
            }
            var mat = {
                id: parseInt(item.materialTypeID, 10),
                name: itemIDMap.get(parseInt(item.materialTypeID, 10)),
                category: matCategoryID,
                quantity: parseInt(item.quantity, 10)
            }
            itemArray[index].mats.push(mat);
        } else {
            if (isValidItem(categoryID)) {
                continue;
            }
            var newItem = {
                id: bpMap.get(parseInt(item.typeID, 10)).itemID,
                bpid: parseInt(item.typeID, 10),
                quantity: bpMap.get(parseInt(item.typeID, 10)).quantityPerRun,
                name: itemIDMap.get(bpMap.get(parseInt(item.typeID, 10)).itemID),
                category: categoryID,
                published: publishedMap.get(bpMap.get(parseInt(item.typeID, 10)).itemID),
                meta: metaMap.get(bpMap.get(parseInt(item.typeID, 10)).itemID),
                mats: []
            }
            if (newItem.meta == undefined) {
                newItem.meta = 0;
            }
            if (newItem.id == 16672) {
                if (newItem.quantity == 20) {
                    continue;
                }
                console.log("Removing bad data");
            }
            var matCategoryID = groupCategoryMap.get(itemGroupMap.get(parseInt(item.materialTypeID, 10)));
            if (isValidMat(matCategoryID)) {
                itemArray.push(newItem);
                productsArray.push(newItem.id);
                continue;
            }
            var mat = {
                id: parseInt(item.materialTypeID, 10),
                name: itemIDMap.get(parseInt(item.materialTypeID, 10)),
                category: matCategoryID,
                quantity: parseInt(item.quantity, 10)
            }
            newItem.mats.push(mat);
            itemArray.push(newItem);
            productsArray.push(newItem.id);    
        }
    }
    console.log("Beginning heavy processing");
    
    breakDownArray();
    cleanDuplicates();
    breakDownArray();
    cleanDuplicates();
    breakDownArray();
    cleanDuplicates();
    breakDownArray();
    cleanDuplicates();
    filterArray();


    //recalcPricing();
    
    console.log("Ending heavy processing");
    for (var i = 0; i < itemArray.length; i++) {
        for (var j = 0; j < itemArray[i].mats.length; j++) {
            var mat = itemArray[i].mats[j];
            if (!doesMatExist(mat.id)) {
                if (mat.id > 17000) {
                    continue;
                }
                materialArray.push({id: mat.id, name: mat.name, price: 0});
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
    fs.writeFile('filteredItemArray.json', json, 'utf8', function(){

    });/*
    console.log(materialArray);
    fs.writeFile('mats.json', JSON.stringify(materialArray, null, 1), 'utf8', function(){

    });*/
}

function isValidItem(id) {
    if (id != 6 && id != 7 && id != 8 && id != 18 && id != 87 && id != 4 && id != 24 && id != 17) {
        return true;
    }
    return false;
}

function isValidMat(id) {
    if (id != 4 && id != 24 && id != 6 && id != 17) {
        return true;
    }
    return false;
}

function isMatAProduct(matID) {
    if (productsArray.includes(matID)) {
        return true;
    } else {
        return false;
    }
}

function filterItem(id) {
    if (id != 6 && id != 7 && id != 18 && id != 87) {
        return true;
    }
    return false;
}

function filterArray() {
    for (var i = 0; i < itemArray.length; i++) {
        itemArray = itemArray.filter(function (value, index, arr) {
            if (filterItem(value.category)) {
                return false;
            } else if (value.published == 0) {
                return false;
            } else if (value.meta > 2) {
                return false;
            } else if ((itemGroupMap.get(value.id) > 772 && itemGroupMap.get(value.id) < 790) || (itemGroupMap.get(value.id) > 1231 && itemGroupMap.get(value.id) < 1235)) {
                return false;
            }
            return true;
        });
    }
}

exports.recalcPricing = function() {
    //console.log("Recalcing price");
    const mats = require('./mats');
    var matsMap = new Map();
    for (var i = 0; i < mats.length; i++) {
        //console.log(parseInt(mats[i].id, 10) + ", " + parseInt(mats[i].price, 10));
        matsMap.set(parseInt(mats[i].id, 10), parseInt(mats[i].price, 10));
    }
    //console.log(matsMap);
    for (var i = 0; i < itemArray.length; i++) {
        //if (itemArray[i].id == 12005) console.log(itemArray[i])
        var newItem = {
            id: itemArray[i].id,
            name: itemArray[i].name,
            category: itemArray[i].category,
            price: 0
        }
        var newPrice = 0;
        for (var j = 0; j < itemArray[i].mats.length; j++) {
            //if (itemArray[i].id == 12005) console.log(itemArray[i].mats[j]);
            var matCost = matsMap.get(itemArray[i].mats[j].id);
            if (isNaN(matCost)) {
                continue;
            }
            newPrice += (itemArray[i].mats[j].quantity * matsMap.get(itemArray[i].mats[j].id));
            //if (itemArray[i].id == 12005) console.log(newPrice);
        }
        //console.log(newPrice);
        newPrice = Math.round(newPrice);
        if (newPrice < 1000000 && newItem.category != 8) {
            if (itemArray[i].meta == 0) {
                newPrice = 1000000;
            } else {
                newPrice = 2000000;
            }
        }
        newItem.price = newPrice;
        itemPriceArray.push(newItem);
    }
    //console.log(itemPriceArray);
}

exports.validatePricing = function (items, modifier) {
    for (var i = 0; i < items.length; i++) {
        if (findItemPrice(items[i].id) * modifier != items[i].price) {
            return false;
        }
    }
    return true;
}

function findItemPrice(id) {
    for (var i = 0; i < itemPriceArray.length; i++) {
        if (itemPriceArray[i].id == id) {
            return itemPriceArray[i].price;
        }
    }
}

exports.getPriceArray = function() {
    return itemPriceArray;
}

function breakDownArray() {
    var idToCheck = 11539;
    for (var i = 0; i < itemArray.length; i++) {
        var newMatsArray = [];
        for (var j = 0; j < itemArray[i].mats.length; j++) {
            if (itemArray[i].mats[j].name != undefined && itemArray[i].mats[j].name.includes("Fuel Block")) {
                newMatsArray.push(itemArray[i].mats[j]);
                continue;
            }
            if (isMatAProduct(itemArray[i].mats[j].id)) {
                var item = findItem(itemArray[i].mats[j].id);
                for (var k = 0; k < item.mats.length; k++) {
                    var found = false;
                    for (var g = 0; g < itemArray[i].mats.length; g++) {
                        if (item.mats[k].id == itemArray[i].mats[g].id) {
                            newMatsArray.push({id: itemArray[i].mats[g].id, name: itemArray[i].mats[g].name, quantity: itemArray[i].mats[g].quantity + ((item.mats[k].quantity * itemArray[i].mats[j].quantity)/ item.quantity)})

                            found = true;
                        }
                    }
                    if (!found) {
                        var mat = {
                            id: item.mats[k].id,
                            name: item.mats[k].name,
                            quantity: (item.mats[k].quantity * itemArray[i].mats[j].quantity)/item.quantity
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
                    mat.quantity = mat.quantity + mat2.quantity;
                }
            }
            newMatArray.push(mat);
        }
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