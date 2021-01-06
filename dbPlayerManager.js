const configs = require('./configs')

const dbName = "test";
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:"+configs.mongodbPassword+"@rotr.4v0xs.mongodb.net/"+dbName+"?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useUnifiedTopology: true });


async function getDocumentsByMatch(collection, match) {
  const array = [];
  const cursor = collection.find(match);
  while(await cursor.hasNext()) {
    const doc = await cursor.next();
    array.push(doc);
  }
  return array;
}

async function addPlayerData(data) {
    if(await findAddedPlayerById(data.discordId)) {
        return 'nok';
    }
    exports.addedPlayers.insertOne(data);
    return 'ok';
}

async function updatePlayerDataById(id, data) {
  collection.findOneAndUpdate({ discordId: id }, {$set: data }, {upsert: true});
}

async function addPlayerToInvitedList(player) {
    if(await findInvitedPlayerById(player.discordId)) {
        return 'nok';
    }
    exports.invitedPlayes.insertOne(player);
    return 'ok';
}

async function findInvitedPlayerById(id) {
    return await exports.invitedPlayes.findOne( { discordId: id } );;
} 

async function findAddedPlayerById(id) {
    return await exports.addedPlayers.findOne( { discordId: id } );
} 

function removeInvitedPlayerById(id) {
  exports.invitedPlayes.findOneAndDelete( { discordId: id } );
}

async function removeAddedPlayerById(id) {
  return await exports.addedPlayers.findOneAndDelete( { discordId: id } );
}

async function updateInvitedList() {
  const cursor = invitedPlayes.find({});
  while(await cursor.hasNext()) {
    const doc = await cursor.next();
    
  }
}

exports.removeAddedPlayerById = removeAddedPlayerById;
exports.updateInvitedList = updateInvitedList;
exports.removeInvitedPlayerById = removeInvitedPlayerById;
exports.findInvitedPlayerById = findInvitedPlayerById;
exports.addPlayerToInvitedList = addPlayerToInvitedList;
exports.findAddedPlayerById = findAddedPlayerById;
exports.addPlayerData = addPlayerData;
exports.client = client;
exports.getDocumentsByMatch = getDocumentsByMatch;
