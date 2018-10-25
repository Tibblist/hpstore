const request = require('superagent');
const user_ctrl = require('./controllers/user_ctrl');

const CLIENT_ID = "c568354f648e47f2a5f1d54b1c0d297f";
const CLIENT_SECRET = "GupzMDAz0aG1MDeAdPGhAe5XGqlBtuyQB01PkyDB";
const buffData = CLIENT_ID + ":" + CLIENT_SECRET;
let buff = new Buffer(buffData);  
const base_64 = buff.toString('base64');

var exports = module.exports = {};

exports.getCharacterName = function(refreshToken) {

}

exports.initialCodeProcessing = function(authCode) {
    request
  .post('https://login.eveonline.com/oauth/token')
  .set('Authorization', "Basic " + base_64)
  .set('Content-Type', 'application/json')
  //.set('host', 'login.eveonline.com')
  .send({"grant_type":"authorization_code", "code":authCode})
  .end((err, res) => {
    if (err) {
        console.log(err);
    }
    console.log(res.body);
    console.log(res.body.access_token);
    verifyToken(res.body);
  });
}

function verifyToken(body) {
    request
    .get('https://esi.evetech.net/verify/')
    .query({token: body.access_token})
    .end((err, res) => {
        if (err) {
            console.log(err);
        }
        checkIfUser(res.body);
    });
}

function checkIfUser(body) {
    user_ctrl.checkIfUserExists(body.CharacterID).then(function (found) {
        if (!found) {
            getCharInfo(body.CharacterID).then(function(charBody) {
                console.log(charBody);
                user_ctrl.createNewUser(body.CharacterID, body.CharacterName, charBody.corporation_id, charBody.alliance_id);
            });
        }
    });
}


//Strictly ESI info calls below

function getCharInfo(charID) {
    return new Promise(function (resolve, reject) {
        request
        .get('https://esi.evetech.net/latest/characters/' + charID + '/')
        .query({ datasource: 'tranquility' })
        .end(function (err, res) {
            if (err) {
                console.log(err);
                reject("Couldn't get character info");
            } else {
                resolve(res.body);
            }
        });
    }); 
}