const parsedJSON = require('./eveids.json');
const matsArray = require('./matsNeeded');
const conversions = require('./converter');
const itemInfo = require('./invTypes');
const itemGroups = require('./invGroups');
const itemMeta = require('./invMeta');
var fs = require('fs');
const request = require('superagent');
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
var groupArray = [];
var unfilteredArray = [];

var exports = module.exports = {};

exports.init = function() {
    mapItemIDs();
    createConversionMap();
    mapItemsToGroup();
    mapGroupToCatagory();
    mapPublished();
    mapMeta();
    createMarginMap();
    createUnfilteredArray();
    //createItemArray();
    itemArray = require('./filteredItemArray.json');
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
    for (var i = 0; i < itemInfo.length; i++) {
        itemIDMap.set(parseInt(itemInfo[i].typeID, 10), itemInfo[i].typeName);
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

function createMarginMap() {
    
}

function initialMarginCreation() {
    var groups = [];
    for (var i = 0; i < itemGroups.length; i++) {
        if (!groupArray.includes(parseInt(itemGroups[i].groupID, 10))) {
            continue;
        }
        groups.push({id: itemGroups[i].groupID, name: itemGroups[i].groupName, margin: 0})
    }
    var json = JSON.stringify(groups, null, 4);
    fs.writeFile('margins.json', json, 'utf8', function(){

    });
}

function createCategoryArray() {
    for (var i = 0; i < itemArray.length; i++) {
        if(itemArray[i].category != 6) {
            continue;
        }
        var groupID = parseInt(itemGroupMap.get(itemArray[i].id), 10);
        if (groupArray.includes(groupID)) {
            continue;
        }
        groupArray.push(groupID);
    }
}

function createUnfilteredArray() {
    for (var i = 0; i < itemInfo.length; i++) {
        if (parseInt(itemInfo[i].published, 10) !== 1) {
            continue;
        }
        var item = {
            id: parseInt(itemInfo[i].typeID, 10),
            name: itemInfo[i].typeName,
            price: 0
        }
        if (isValidItem(groupCategoryMap.get(itemGroupMap.get(parseInt(item.id, 10))))) {
            continue;
        };
        if (item.name === '') {
            continue;
        }
        //console.log(item);
        unfilteredArray.push(item);
    }
    console.log(unfilteredArray.length);
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

    //createCategoryArray();
    //initialMarginCreation();

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
            for (var i = 0; i < nameExceptions.length; i++) {
                if (value.name.includes(nameExceptions[i])) {
                    if (value.id == 12753) {
                        return true;
                    }
                    return false;
                }
            }
            return true;
        });
    }
}

exports.recalcPricing = function() {
    //console.log("Recalcing price");
    const mats = require('./mats');
    const margins = require('./margins');
    const pricelist = require('./pricelist');
    const ooolist = require('./ooolist');
    const marketPrices = require('./marketData');
    itemPriceArray = [];
    var matsMap = new Map();
    var marginMap = new Map();
    var universalMargin = 0;
    for (var i = 0; i < margins.length; i++) {
        if (parseInt(margins[i].id, 10) === 1) {
            universalMargin = parseInt(margins[i].margin)/100;        
        }
    }
    for (var i = 0; i < mats.length; i++) {
        //console.log(parseInt(mats[i].id, 10) + ", " + parseInt(mats[i].price, 10));
        matsMap.set(parseInt(mats[i].id, 10), parseInt(mats[i].price, 10));
    }
    for (var i = 0; i < margins.length; i++) {
        //console.log(parseInt(mats[i].id, 10) + ", " + parseInt(mats[i].price, 10));
        marginMap.set(parseInt(margins[i].id, 10), parseInt(margins[i].margin, 10)/100);
    }
    //console.log(marginMap);
    //console.log(matsMap);
    for (var i = 0; i < itemArray.length; i++) {
        //if (itemArray[i].id == 12005) console.log(itemArray[i])
        var newItem = {
            id: itemArray[i].id,
            name: itemArray[i].name,
            category: itemArray[i].category,
            group: itemGroupMap.get(itemArray[i].id),
            price: 0,
            disabled: false
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
        if(newItem.category == 6) {
            var groupID = itemGroupMap.get(newItem.id);
            var margin = marginMap.get(groupID);
            //var oldPrice = new Number(newPrice);
            newPrice = newPrice + (newPrice * margin) + (newPrice * universalMargin);
            /*if (newPrice != oldPrice) {
                console.log("changing price of " + newItem.name + " from: " + oldPrice + " to: " + newPrice + " with margin " + margin);
                console.log("Amount added = " + newPrice * margin)
            }*/
        }

        newPrice = Math.round(newPrice);
        if (newPrice < 500000 && newItem.category != 8) {
            if (itemArray[i].meta == 0) {
                newPrice = 500000;
            } else {
                newPrice = 1500000;
            }
        }

        for (var j = 0; j < ooolist.length; j++) {
            if (ooolist[j] === newItem.id) {
                newItem.disabled = true;
                break;
            }
        }

        newItem.price = newPrice;

        for (var j = 0; j < marketPrices.length; j++) {
            if (marketPrices[j].sell.forQuery.types[0] === newItem.id) {
                newItem.price = marketPrices[j].sell.fivePercent;
            }
        }

        for (var j = 0; j < pricelist.length; j++) {
            if (pricelist[j].id === newItem.id) {
                newItem.price = pricelist[j].price;
                newItem.custom = true;
                break;
            }
        }

        if (newItem.price > 10000000) newItem.price = Math.round(newItem.price/1000000) * 1000000
        newItem.price = Math.round(newItem.price);
        itemPriceArray.push(newItem);
    }
    delete require.cache[require.resolve('./mats')];
    delete require.cache[require.resolve('./margins')];
    delete require.cache[require.resolve('./pricelist')];
    delete require.cache[require.resolve('./ooolist')];
    delete require.cache[require.resolve('./marketData')];
}

const writeFile = (path, data, opts = 'utf8') =>
    new Promise((res, rej) => {
        fs.writeFile(path, data, opts, (err) => {
            console.log("Wrote to file!");
            if (err) rej(err)
            else res()
        })
})

exports.getMarketerPricing = async function() {
    var idArray = [];
    var counter = 0;
    var costArray = [];
    var requestArray = [];
    for (var i = 0; i < unfilteredArray.length; i++) {
        var group = itemGroupMap.get(unfilteredArray[i].id);
        if (group !== 883 && group !== 547 && group !== 485 && group !== 1538 && group !== 30 && group !== 659 && group !== 941 && group !== 513) {
            idArray.push(unfilteredArray[i].id);
            counter++;
            if (counter > 199) {
                //console.log(idArray);
                requestArray.push(request.get('https://api.evemarketer.com/ec/marketstat/json').query({'typeid': idArray.toString()}));
                counter = 0;
                idArray = [];
            }
        }
    }
    requestArray.push(request.get('https://api.evemarketer.com/ec/marketstat/json').query({ 'typeid': idArray.toString() }))
    var results = await Promise.all(requestArray).catch(function(e) {
        console.log(e);
    });
    for (var i = 0; i < results.length; i++) {
        costArray= costArray.concat(results[i].body);
    }
    console.log(results[results.length - 1].header);
    await writeFile('marketData.json', JSON.stringify(costArray));
}

exports.validatePricing = function (items, code) {
    var modifier = 1; //CHANGE TO CHECK EXPECTED MODIFIER BASED ON CODE
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

const nameExceptions = [
    "Etana",
    "Cambion",
    "Gnosis",
    "Moracha",
    "Chremoas",
    "Astero",
    "Stratios",
    "Nestor",
    "Leopard",
    "Whiptail",
    "Chameleon",
    "Garmur",
    "Orthrus",
    "Barghest",
    "Caldari Navy Hookbill",
    "Phantasm",
    "Cynabal",
    "Republic Fleet Firetail",
    "Succubus",
    "Cruor",
    "Daredevil",
    "Dramiel",
    "Confessor",
    "Shuttle",
    "Svipul",
    "Jackdaw",
    "Utu",
    "Adrestia",
    "Imp",
    "Fiend",
    "Malice",
    "Vangel",
    "Pacifier",
    "Imperial Navy Slicer",
    "Nightmare",
    "Machariel",
    "Federation Navy Comet",
    "Ashimmu",
    "Rabisu",
    "Caedes",
    "Victor",
    "Sunesis",
    "Enforcer",
    "Marshal",
    "Virtuoso",
    "Prototype Seven",
    "Tengu",
    "Legion",
    "Proteus",
    "Loki",
    "Freki",
    "Mimir",
    "Hecate",
    "Modal Enduring Triple Neutron Blaster Cannon",
    "Limited Jump Drive Economizer",
    "Prototype Jump Drive Economizer",
    "Large Higgs Anchor I",
    "Medium Higgs Anchor I",
    "Shadow",
    "Mining Foreman Link - Harvester Capacitor Efficiency II",
    "Mining Foreman Link - Mining Laser Field Enhancement I",
    "Mining Foreman Link - Harvester Capacitor Efficiency I",
    "Limited Hyperspatial Accelerator",
    "Experimental Hyperspatial Accelerator",
    "Prototype Hyperspatial Accelerator",
    "Pandemic SPHERE Modified Entosis Link",
    "Affirmative. Modified Entosis Link",
    "Spectre Fleet's Modified Entosis Link",
    "Noir. Modified Entosis Link",
    "Capital Implacable Compact Emergency Hull Energizer",
    "Capital Indefatigable Enduring Emergency Hull Energizer",
    "Anode Scoped Triple Neutron Blaster Cannon",
    "Modulated Compact Quad Mega Pulse Laser",
    "Modal Enduring Quad Mega Pulse Laser",
    "Anode Scoped Quad Mega Pulse Laser",
    "Afocal Precise Quad Mega Pulse Laser",
    "Regulated Compact Triple Neutron Blaster Cannon",
    "Limited Precise Triple Neutron Blaster Cannon",
    "Compact Carbine Quad 800mm Repeating Cannon",
    "Ample Gallium Quad 800mm Repeating Cannon",
    "Scout Scoped Quad 800mm Repeating Cannon",
    "Prototype Precise Quad 800mm Repeating Cannon",
    "Modulated Compact Dual Giga Pulse Laser",
    "Modal Enduring Dual Giga Pulse Laser",
    "Anode Scoped Dual Giga Pulse Laser",
    "Afocal Precise Dual Giga Pulse Laser",
    "Modulated Compact Dual Giga Beam Laser",
    "Modal Enduring Dual Giga Beam Laser",
    "Anode Scoped Dual Giga Beam Laser",
    "Afocal Precise Dual Giga Beam Laser",
    "Regulated Compact Ion Siege Blaster",
    "Modal Enduring Ion Siege Blaster",
    "Anode Scoped Ion Siege Blaster",
    "Limited Precise Ion Siege Blaster",
    "Carbide Compact Dual 1000mm Railgun",
    "Compressed Enduring Dual 1000mm Railgun",
    "Scout Scoped Dual 1000mm Railgun",
    "Prototype Precise Dual 1000mm Railgun",
    "Carbine Compact Hexa 2500mm Repeating Cannon",
    "Gallium Ample Hexa 2500mm Repeating Cannon",
    "Scout Scoped Hexa 2500mm Repeating Cannon",
    "Prototype Precise Hexa 2500mm Repeating Cannon",
    "Carbide Compact Quad 3500mm Siege Artillery",
    "Gallium Ample Quad 3500mm Siege Artillery",
    "Scout Scoped Quad 3500mm Siege Artillery",
    "Prototype Precise Quad 3500mm Siege Artillery",
    "Arbalest Compact XL Cruise Missile Launcher",
    "TE-2100 Ample XL Cruise Missile Launcher",
    "Arbalest Compact XL Torpedo Launcher",
    "TE-2100 Ample XL Torpedo Launcher",
    "Arbalest Compact Rapid Torpedo Launcher",
    "TE-2100 Ample Rapid Torpedo Launcher",
    "10000MN Y-S8 Compact Afterburner",
    "10000MN Monopropellant Enduring Afterburner",
    "50000MN Y-T8 Compact Microwarpdrive",
    "50000MN Quad LiF Restrained Microwarpdrive",
    "50000MN Cold-Gas Enduring Microwarpdrive",
    "Hermes Compact Fighter Support Unit",
    "Capital Coaxial Compact Remote Armor Repairer",
    "25000mm Rolled Tungsten Compact Plates",
    "25000mm Crystalline Carbonide Restrained Plates",
    "Capital Azeotropic Restrained Shield Extender",
    "Capital F-S9 Regolith Compact Shield Extender",
    "Capital I-a Enduring Armor Repairer",
    "Capital ACM Compact Armor Repairer",
    "Capital Solace Scoped Remote Armor Repairer",
    "Capital I-b Enduring Hull Repairer",
    "Capital IEF Compact Hull Repairer",
    "Capital C-5L Compact Shield Booster",
    "Capital Clarity Ward Enduring Shield Booster",
    "Capital Compact Pb-Acid Cap Battery",
    "Capital F-RX Compact Capacitor Booster",
    "Small Ancillary Remote Shield Booster",
    "Medium Ancillary Remote Shield Booster",
    "Large Ancillary Remote Shield Booster",
    "Small Ancillary Remote Armor Repairer",
    "Capital Ancillary Remote Shield Booster",
    "Medium Ancillary Remote Armor Repairer",
    "Large Ancillary Remote Armor Repairer",
    "Capital Ancillary Remote Armor Repairer",
    "Capital Asymmetric Enduring Remote Shield Booster",
    "Capital Murky Compact Remote Shield Booster",
    "Mining Foreman Link - Laser Optimization II",
    "Capital Higgs Anchor I",
    "'Plow' Gas Cloud Harvester",
    "'Crop' Gas Cloud Harvester",
    "Capital Radiative Scoped Remote Capacitor Transmitter",
    "Capital S95a Scoped Remote Shield Booster",
    "Mining Foreman Link - Mining Laser Field Enhancement II",
    "Ancillary"
]