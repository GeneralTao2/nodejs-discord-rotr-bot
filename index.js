const playerList = require('./player_manager')
const db = require('./dbPlayerManager')
const discord = require('./discordPlayerManager')
const configs = require('./configs')
//GeneralTao#5693
// ======================================================================== CONNECTION ============

db.client.connect(async err => {
  if(err) {
    throw err;
  }
  
  db.addedPlayers = db.client.db("test").collection("addedPlayers");
  db.invitedPlayes = db.client.db("test").collection("invitedPlayers");

  //console.log(await db.getDocumentsByMatch(collection, {'x': 10}));
  /*let res = await db.addPlayerData({
    "tag": {
      "name": "GeneralTao",
      "discr": "5693"
    },
    "regDate": new Date(),
    "language": "ru",
  });
  console.log(res);*/
  
  //db.updateDocumentByMatch(collection, {}, {'new2': new Date()});

  //db.client.close();
});

discord.client.on('ready',async () => {
  console.log("Yeah, connected!");
  await discord.init();
  let testTag = {
    name: 'GeneralTao',
    discr: '5693'
  };
  discord.draw();
  //console.log(discord.getUserByTagObj(testTag));
  //playerList.init();
});

// ======================================================================== DISCORD ===============

async function invatePlayer(message) {
  const invitedTagString = discord.matchTagStringByCommand(message.content);
  const invitedTagObj = discord.matchTagObjByTagString(invitedTagString);
  const invitedUser = discord.getUserByTagObj(invitedTagObj);
  if(!invitedUser) {
    discord.currentChennel.send("Player `" + invitedTagString +"` nor found.");
    return;
  }

  if(await db.findAddedPlayerById(invitedUser.id)) {
    discord.currentChennel.send("Player `" + invitedTagString +"` already added.");
    return;
  }

  const adPlayerToInviteListResult = await db.addPlayerToInvitedList({
    discordId: invitedUser.id,
    tag: invitedTagObj
  });

  if(adPlayerToInviteListResult === 'nok') {
    discord.currentChennel.send("Player `" + invitedTagString +"` already invited.");
    return;
  }

  message.react('👌');

  const inviterTagString = message.author.tag;
  invitedUser.send('Hello! I am ROTR BP community player manager. My main goal is to gover players from ROTR discord network to game. \n**' + inviterTagString + 
    '** invited you, so you can accept or refuce. Do you want to go through a simple registration?\nWrite "-yes" or "-not"');

  //console.log(invitedTagObj);
  /*let player = defineMember(nameId);
  if(player) {
    playerList.push({
      id:       player.user.id,
      language: player.roles.cache.has(englishUserRoleID) ? 'english' : 'russian',
      username: nameId
    });
    player.user.send("Hello! I am ROTR BP community player manager. **" + inviter + 
    "** added you. Now you can get requests to play. To get more info about me enter `-help`.")
    currentChennel.send("All right, player `" + nameId +"` added.");
    playerList.save();
  } else {
    currentChennel.send("Player `" + nameId +"` not found.");
  }*/
}

async function removePlayer(message) {
  const invitedTagString = discord.matchTagStringByCommand(message.content);
  const invitedTagObj = discord.matchTagObjByTagString(invitedTagString);
  const invitedUserId = discord.getUserByTagObj(invitedTagObj).id;

  if(!(await db.findAddedPlayerById(invitedUserId))) {
    discord.currentChennel.send("Player `" + invitedTagString +"` not found.");
    return;
  }
  db.removeAddedPlayerById(invitedUserId);
  message.react('👌');
}

/*
function requestConfirming(message) {
  let userMail = message.content.match(/`.*`/);
  let playerIndex = playerList.findByName('GeneralTao#5693');
  playerIndex--;
  let playerDiskr = playerList.players[playerIndex].id;
  currentChennel.send("You gonna invite these players: \n" +
  playerList.textPlayerList() + "\nAre you sure?").then(mess => upDownManager(mess, playerDiskr, function() {
    console.log('ok');
    requestMailing(userMail);
  }, function() {
    console.log('not ok');
  }))
}*/
/*
function requestMailing(userMail) {
  let nameId = 'GeneralTao#5693';
  let playerIndex = playerList.findByName(nameId);
  playerIndex--;
  let playerDiskr = playerList.players[playerIndex].id;
  let mail = 'Hello! Want to play?\n`' + userMail + '`';
  client.users.cache.get(playerDiskr).send(mail);
}

function upDownManager(message, playerDiskr, upFunction, downFunction) {
  message.react('👍');
  message.react('👎');
    const upFilter = (reaction, user) => reaction.emoji.name === '👍' && user.id === playerDiskr;
    const downFilter = (reaction, user) => reaction.emoji.name === '👎' && user.id === playerDiskr;
    const upCollector = message.createReactionCollector(upFilter, { time: 15000 });
    const downCollector = message.createReactionCollector(downFilter, { time: 15000 });
    upCollector.on('collect', r => { 
      removeUpDownReactions(message);
      message.react('👌');
      upFunction();
    });
    downCollector.on('collect', r => { 
      removeUpDownReactions(message);
      message.react('❌');
      downFunction();
    });
    downCollector.on('end', collected => { 
      console.log(`Collected ${collected.size} items`);
      let hasDownFinger = message.reactions.cache.has('👎');
      removeUpDownReactions(message);
      if(hasDownFinger) {
        message.react('❌');
      }
    });
}

function removeUpDownReactions(messsage) {
  if(messsage.reactions.cache.has('👍')) {
    messsage.reactions.cache.get('👍').remove();
  }
  if(messsage.reactions.cache.has('👎')) {
    messsage.reactions.cache.get('👎').remove();
  }
}


function printPlayer(message) {
  let nameId = matchTagByCommand(message.content);
  let playerIndex = playerList.findByName(nameId);
  if(!playerIndex) {
    currentChennel.send("Player `" + nameId +"` not found.");
    return;
  }
  playerIndex--;
  let text = playerList.textPlayer(playerIndex);
  currentChennel.send(text);
}

function printPlayerList() {
  let text = playerList.textPlayerList();
  currentChennel.send(text);
}

function addPlayer(message) {
  let nameId = matchTagByCommand(message.content);;
  let inviter = message.author.username;

  if(playerList.findByName(nameId)) {
    currentChennel.send("Player `" + nameId +"` already added.");
    return;
  }
  let player = defineMember(nameId);
  if(player) {
    playerList.push({
      id:       player.user.id,
      language: player.roles.cache.has(englishUserRoleID) ? 'english' : 'russian',
      username: nameId
    });
    player.user.send("Hello! I am ROTR BP community player manager. **" + inviter + 
    "** added you. Now you can get requests to play. To get more info about me enter `-help`.")
    currentChennel.send("All right, player `" + nameId +"` added.");
    playerList.save();
  } else {
    currentChennel.send("Player `" + nameId +"` not found.");
  }
}

*/

async function handleUserMessage(message) {
  const user = message.author;
  const userId = user.id;
  const language = discord.getLanguageByUserId(userId);

  const invitedPlayer = await db.findInvitedPlayerById(userId);
  if(invitedPlayer) {
    console.log(invitedPlayer);
    /*let addPlayerDataResponse = await db.addPlayerData({
      discordId: userId,
      regDate: new Date(),
      language: language
      db.removeInvitedPlayerById(userId);
    });
    if(addPlayerDataResponse === 'nok') {
      throw "Bad addPlayerDataResponse"
    }*/
    const userTag = user.username + '#' + user.discriminator;
    discord.currentChennel.send("All right, player `" + userTag +"` added.");
  } else {
    message.reply(discord.ErrorMessage('Omg omg wtf!!!'));
  }
}
// ================================================================ DISCORD EVENT HANDLING =========

// Handle message types
discord.client.on('message', async (message) => {
  if(message.author.bot) {
    return;
  }

  if(!message.guild) {
    handleUserMessage(message);
    return;
  }

  let chennel = message.guild.channels.cache.find(ch => ch.name === 'bot');
  if (!chennel) {
    return;
  }
  if (message.content.match(/-invite [a-zA-Z0-9_-]*#\d{4}/)) {
    invatePlayer(message);
  }
  if (message.content.match(/-remove [a-zA-Z0-9_-]*#\d{4}/)) {
    removePlayer(message);
  }
  /*if (message.content.match(/-add [a-zA-Z0-9_-]*#\d{4}/)) {
    addPlayer(message);
  }
  if (message.content.match(/-req `.*`/) ) {
    requestConfirming(message);
  }
  if (message.content.match(/-print [a-zA-Z0-9_-]*#\d{4}/)) {
    printPlayer(message);
  } else if (message.content.match(/-print/)) {
    printPlayerList();
  }*/
});

discord.client.login(configs.token);

//playerList.save();