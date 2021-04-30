const configs = require('./configs')

const dbName = configs.dbName
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const uri = "mongodb+srv://admin:"+configs.mongodbPassword+"@rotr.4v0xs.mongodb.net/"+dbName+"?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useUnifiedTopology: true });

const roleIds = {
  en: 1,
  ru: 2,
  moderator: 3
}


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
  return await exports.addedPlayers.insertOne(data);
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

async function addBreak(player) {
  exports.breaks.insertOne(player);
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

async function findBreakById(id) {
  return await exports.breaks.findOne( { discordId: id } );
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

async function removeBreakById(id) {
  return await exports.breaks.findOneAndDelete( { discordId: id } );
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

exports.forEach = async (players, callback) => {
  const cursor = players.find({});
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

async function breaksForEach(callback) {
  const cursor = exports.breaks.find({});
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

//==================================================================== CONFIGS ================
async function findIndexByName(collection, name) {
  const indexesCursor = await collection.listIndexes()
  const indexesArray = await  indexesCursor.toArray()
  return indexesArray.find(index => index.name === name)
  
}

async function findConfigedRoleById(id) {

}

async function checkIndex() {
  let state = {
    invitedPlayers: false,
    gathers: false,
    breaks: false
  }
  if(!await findIndexByName(exports.invitedPlayers, "createdAt_1")) {
    exports.invitedPlayers.createIndex(
      { "createdAt": 1 }, { expireAfterSeconds: 3*24*60*60 } )
  } else {
    state.invitedPlayers = true
  }
  if(!await findIndexByName(exports.gathers, "expireAt_1")) {
    exports.gathers.createIndex(
      { "expireAt": 1 }, { expireAfterSeconds: 0 } )
  } else {
      state.gathers = true
  }
  if(!await findIndexByName(exports.breaks, "expireAt_1")) {
    exports.breaks.createIndex(
      { "expireAt": 1 }, { expireAfterSeconds: 0 } )
  } else {
      state.breaks = true
  }
  return state
}

async function setRole(roleDiscordId, roleName) {
  const roleInfo = await exports.configs.findOne({roleId: roleIds[roleName]})
  if(roleInfo) {
    exports.configs.updateOne({roleId: roleIds[roleName]}, {'$set': {discordId: roleDiscordId}})
    return roleInfo.discordId
  } else {
    exports.configs.insertOne({
      roleId: roleIds[roleName],
      discordId: roleDiscordId
    })
    return null
  }
}

async function getRole(roleName) {
  return await exports.configs.findOne({roleId: roleIds[roleName]})
}

async function setBotChannel(channelId, helpMessageDiscordIds) {
  exports.configs.insertOne({
    channel: 'bot',
    discordId: channelId,
    helpMessageDiscordIds: helpMessageDiscordIds
  })
}

async function getBotChannelId() {
  return await exports.configs.findOne({channel: 'bot'})
}

async function removeBotChannelId() {
  return (await exports.configs.findOneAndDelete({channel: 'bot'})).value
}

async function putInvitationMessageId(messageId, userId)  {
  return await exports.invitedPlayers.updateOne({discordId: userId}, {'$set': {inviationMessageId: messageId}})
}

async function putLanguageMessageId(messageId, userId)  {
  return await exports.invitedPlayers.updateOne({discordId: userId}, {'$set': {languageMessageId: messageId}})
}

exports.putLanguageMessageId = putLanguageMessageId
exports.putInvitationMessageId = putInvitationMessageId
exports.removeBotChannelId = removeBotChannelId
exports.setBotChannel = setBotChannel
exports.getBotChannelId = getBotChannelId
exports.getRole = getRole
exports.setRole = setRole
exports.checkIndex = checkIndex
exports.addBreak = addBreak
exports.removeBreakById = removeBreakById
exports.findBreakById = findBreakById
exports.breaksForEach = breaksForEach
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
exports.roleIds = roleIds
exports.getDocumentsByMatch = getDocumentsByMatch;
