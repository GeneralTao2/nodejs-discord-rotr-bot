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
  exports.addedPlayers.insertOne(data);
}

async function updatePlayerDataById(id, data) {
  collection.findOneAndUpdate({ discordId: id }, {$set: data }, {upsert: true});
}

async function addPlayerToInvitedList(player) {
  exports.invitedPlayers.insertOne(player);
}

async function addPlayerToBannedList(player) {
  exports.bannedPlayers.insertOne(player);
}

async function addGather(player) {
  exports.gathers.insertOne(player);
}
async function findGatherById(id) {
  return await exports.gathers.findOne( { discordId: id } );;
} 

async function findGatherByPlayerQuantityAndMapName(playerQuantity, mapName) {
  return await exports.gathers.findOne( {"$and": [
    { playerQuantity: playerQuantity },
    { mapName: mapName }
   ]} )
} 

async function gathersForEach(callback) {
  const cursor = exports.gathers.find({});
  let array = [];
  while(await cursor.hasNext()) {
    const doc = await cursor.next()
    array.push(await callback(doc))
  }
  return array
}

async function findInvitedPlayerById(id) {
    return await exports.invitedPlayers.findOne( { discordId: id } );;
} 

async function findAddedPlayerById(id) {
    return await exports.addedPlayers.findOne( { discordId: id } );
} 

async function findBannedPlayerById(id) {
  return await exports.bannedPlayers.findOne( { discordId: id } );
} 

async function removeInvitedPlayerById(id) {
  return await exports.invitedPlayers.findOneAndDelete( { discordId: id } );
}

async function removeAddedPlayerById(id) {
  return await exports.addedPlayers.findOneAndDelete( { discordId: id } );
}

async function removeBannedPlayerById(id) {
  return await exports.bannedPlayers.findOneAndDelete( { discordId: id } );
}

async function invitedPlayersForEach(callback) {
  const cursor = exports.invitedPlayers.find({});
  let array = [];
  while(await cursor.hasNext()) {
    const doc = await cursor.next()
    array.push(await callback(doc))
  }
  return array
}

async function addedPlayersForEach(callback) {
  const cursor = exports.addedPlayers.find({});
  let array = [];
  while(await cursor.hasNext()) {
    const doc = await cursor.next()
    array.push(await callback(doc))
  }
  return array
}

async function bannedPlayersForEach(callback) {
  const cursor = exports.bannedPlayers.find({});
  let array = [];
  while(await cursor.hasNext()) {
    const doc = await cursor.next()
    array.push(await callback(doc))
  }
  return array
}

async function updateGatherData(inviterId, userId, state) {
  return await exports.gathers.updateOne({
    discordId: inviterId,
    "invitedPlayer.discordId": userId
  }, {
    "$set": {
      "invitedPlayer.$.accept": state
    }
  })
}

exports.gathersForEach = gathersForEach
exports.findGatherByPlayerQuantityAndMapName = findGatherByPlayerQuantityAndMapName
exports.updateGatherData = updateGatherData
exports.findGatherById = findGatherById
exports.addGather = addGather
exports.bannedPlayersForEach = bannedPlayersForEach
exports.addedPlayersForEach = addedPlayersForEach
exports.removeBannedPlayerById = removeBannedPlayerById;
exports.findBannedPlayerById = findBannedPlayerById;
exports.addPlayerToBannedList = addPlayerToBannedList;
exports.invitedPlayersForEach = invitedPlayersForEach;
exports.removeAddedPlayerById = removeAddedPlayerById;
exports.removeInvitedPlayerById = removeInvitedPlayerById;
exports.findInvitedPlayerById = findInvitedPlayerById;
exports.addPlayerToInvitedList = addPlayerToInvitedList;
exports.findAddedPlayerById = findAddedPlayerById;
exports.addPlayerData = addPlayerData;
exports.client = client;
exports.getDocumentsByMatch = getDocumentsByMatch;
