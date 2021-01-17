const db = require('./dbPlayerManager')
const discord = require('./discordPlayerManager')
const configs = require('./configs')
const banner = require("./bannerManager")
const mapm = require("./mapManager")
const local = require("./localization")
//GeneralTao#5693
// ======================================================================== CONNECTION ============

discord.client.on('ready',async () => {
  try {
    await db.client.connect();
    db.addedPlayers = await db.client.db("test").collection("addedPlayers");
    db.invitedPlayers = await db.client.db("test").collection("invitedPlayers");
    db.bannedPlayers = await db.client.db("test").collection("bannedPlayers");
  } catch (error) {
    console.log(error)
  }

  console.log("Yeah, connected!");
  await discord.init();
  await initLastInvitationMessages();
  //DARKozDARKA
//#4148
  let testTag = {
    name: 'GeneralTao',
    discr: '5693'
  };
  //await discord.currentChennel.send('Making images...');
  //await mapm.makeAllImages();
  //await discord.currentChennel.send('Done!');
  const maps = await mapm.getMaps()
  const members = discord.currentGuild.members.cache.array();

  const buffer = await banner.getMapCollageByPlayer(2);
  const attachment = discord.imageAttachment(buffer);
  await discord.currentChennel.send('', attachment);
  /*for(let m=0; m<1; m++) {
    const user = members[m].user;
    for(let i=10; i<11; i++) {
      //console.log(user)
      if(maps[i] === "MapCache.ini") {
        continue
      }
      //const mapName = '[RANK] [NMC] Plant Waste'
      const buffer = await banner.getGameBanner(maps[i], user)
      const attachment = discord.imageAttachment(buffer);
      await discord.currentChennel.send('', attachment);
    }
  }*/
  discord.draw();
  //console.log(discord.getUserByTagObj(testTag));
  //playerList.init();
});

async function invitePlyerToGame(user, map, message) {
  const buffer = await banner.getGameBanner(map, user)
  const attachment = discord.imageAttachment(buffer);
  await discord.currentChennel.send(message, attachment);
}

// ======================================================================== DISCORD ===============

async function initLastInvitationMessages() {
  db.invitedPlayersForEach(async (invitedPlayer) => {
    const user = await discord.getUserById(invitedPlayer.discordId)
    const lastMessage = await discord.getLastUserDMbyId(invitedPlayer.discordId);
    await removeUpDownReactions(lastMessage);
    upDownManager(lastMessage, user.id, () => {
      addPlayerAfterInviting(user)
    }, () => {
      ignorePlayerAfterInviting(user)
    })
  })
}

async function invitePlayer(user) {
  return await db.addPlayerToInvitedList({
    discordId: user.id,
    tag: {
      name: user.username,
      discr: user.discriminator
    },
    createdAt: new Date(),
  });
}

async function banPlayer(user, reason) {
  return await db.addPlayerToBannedList({
    discordId: user.id,
    tag: {
      name: user.username,
      discr: user.discriminator
    },
    reason: reason,
    createdAt: new Date(),
  });
}

async function addPlayer(user) {
  return await db.addPlayerData({
    discordId: user.id,
    tag: {
      name: user.username,
      discr: user.discriminator
    },
    language: discord.getLanguageByUserId(user.id),
    createdAt: new Date(),
  });
}

async function sendMessageToUser(user, contentCB) {
	try {
    const language = discord.getLanguageByUserId(user.id);
    const content = contentCB(arguments, language)
    discord.getLanguageByUserId(user.id)
		return await user.send(content)
	} catch (error) {
    if((await db.removeAddedPlayerById(user.id)).value) {
      discord.currentChennel.send("Player `"+user.tag+"` blocked me. Removing.");
    } else {
      discord.currentChennel.send("Player `"+user.tag+"` blocked me.");
    }
    db.removeInvitedPlayerById(user.id)
    return null
	}
}

async function addPlayerAfterInviting(user) {
  if(!await db.findInvitedPlayerById(user.id)) {
    console.log("Player "+user.tag+" is not invited.")
    return
  }
  if(await db.findAddedPlayerById(user.id)) {
    console.log("Player "+user.tag+" already added.")
    return
  }
  addPlayer(user);
  db.removeInvitedPlayerById(user.id);
  discord.currentChennel.send("All right, player `"+user.tag+"` added.");
}


//---------------------------------------------------------------- INVITE COMMAND ----------------

async function invatePlayerCommand(message) {
  message.react('👌');
  const users = message.mentions.users.array()
  for(let u=0; u<users.length; u++) {
    const user = users[u];
    if(user.bot) {
      discord.currentChennel.send("Cannot invite bot `"+user.tag+"`.");
      continue
    }
    if(await db.findBannedPlayerById(user.id)) {
      discord.currentChennel.send("Player `"+user.tag+"` was banned.");
      continue
    }
    if(await db.findAddedPlayerById(user.id)) {
      discord.currentChennel.send("Player `"+user.tag+"` already added.");
      continue
    }
    if(await db.findInvitedPlayerById(user.id)) {
      discord.currentChennel.send("Player `"+user.tag+"` already invited.");
      continue
    }
    invitePlayer(user)
    
    const sendedMessage = await sendMessageToUser(user, local.invitation, message.author.tag)
    if(!sendedMessage) {
      return
    }
    upDownManager(sendedMessage, user.id, () => {
      addPlayerAfterInviting(user)
    }, () => {
      ignorePlayerAfterInviting(user)
    })

  }
}

//---------------------------------------------------------------- REMOVE ----------------

async function removePlayerCommand(message) {
  message.react('👌');
  if(!discord.isPlayerModerById(message.author.id)) {
    discord.currentChennel.send("Only moderator can send this command.")
    return
  }
  const users = message.mentions.users.array()
  for(let u=0; u<users.length; u++) {
    const user = users[u];

    if((await db.removeAddedPlayerById(user.id)).value) {
      sendMessageToUser(user, local.removeing, message.author.tag)
    } else {
      discord.currentChennel.send("Player `" + user.tag +"` not found.");
    }

  }
}

//---------------------------------------------------------------- CANCEL ----------------

async function cancelPlayerInvitationCommand(message) {
  message.react('👌');
  const users = message.mentions.users.array()
  for(let u=0; u<users.length; u++) {
    const user = users[u];

    if(await db.findInvitedPlayerById(user.id)) {
      db.removeInvitedPlayerById(user.id);
      sendMessageToUser(user, local.canceling)
    } else {
      discord.currentChennel.send("Payer `" + user.tag +"` not found.");
    }

  }
}

//---------------------------------------------------------------- BAN ----------------

async function banPlayerCommand(message) {
  message.react('👌');
  if(!discord.isPlayerModerById(message.author.id)) {
    discord.currentChennel.send("Only moderator can send this command.")
    return
  }
  const user = message.mentions.users.array()[0]

  if(user.bot) {
    discord.currentChennel.send("Cannot invite bot `"+user.tag+"`.")
    return
  }
  const reasonMatch = message.content.match(/-ban {1,5}<@![0-9]{18}> (.*)/)
  if(!reasonMatch) {
    discord.currentChennel.send("Please, write ban reason.")
    return
  }
  let reason = reasonMatch[1]
  db.removeAddedPlayerById(user.id)
  db.removeInvitedPlayerById(user.id)
  banPlayer(user, reason)
  sendMessageToUser(user, local.banning, message.author.tag, reason)
}

//---------------------------------------------------------------- UNBAN ----------------

async function unbanPlayerCommand(message) {
  message.react('👌');
  if(!discord.isPlayerModerById(message.author.id)) {
    discord.currentChennel.send("Only moderator can send this command.")
    return
  }
  const users = message.mentions.users.array()
  for(let u=0; u<users.length; u++) {
    const user = users[u];

    if((await db.removeBannedPlayerById(user.id)).value) {
      sendMessageToUser(user, local.unbanning, message.author.tag)
    } else {
      discord.currentChennel.send("Payer `" + user.tag +"` not found.");
    }

  }

}

//---------------------------------------------------------------- GET USER ----------------

async function getUserCommand(message) {
  message.react('👌');
  if(!discord.isPlayerModerById(message.author.id)) {
    discord.currentChennel.send("Only moderator can send this command.")
    return
  }
  let user = message.mentions.users.array()[0]
  user.fetch()
  discord.currentChennel.send("```"+JSON.stringify(user,  null, 2)+"```")

}

//---------------------------------------------------------------- GET INVITED PLYERS ----------------

async function getInvitedPlayersCommand(message) {
  message.react('👌');
  let list = await db.invitedPlayersForEach(async player => {
    const user = discord.getUserById(player.discordId)
    return user.tag
  })
  if(list.length === 0) {
    discord.currentChennel.send("Invited plyers list is empty.")
    return
  }
  let content = '```'
  for(let i=0; i<list.length; i++) {
    content += (i+1).toString() + '. ' + list[i] + '\n';
  }
  content += '```'
  discord.currentChennel.send(content)
}

//---------------------------------------------------------------- GET ADDED PLAYERS ----------------

async function getAddedPlayersCommand(message) {
  message.react('👌');
  let list = await db.addedPlayersForEach(async player => {
    const user = discord.getUserById(player.discordId)
    return user.tag
  })
  if(list.length === 0) {
    discord.currentChennel.send("Added plyers list is empty.")
    return
  }
  let content = '```'
  for(let i=0; i<list.length; i++) {
    content += (i+1).toString() + '. ' + list[i] + '\n';
  }
  content += '```'
  discord.currentChennel.send(content)
}

//---------------------------------------------------------------- GET BANNED PLARS ----------------

async function getBannedPlayersCommand(message) {
  message.react('👌');
  let list = await db.bannedPlayersForEach(async player => {
    const user = discord.getUserById(player.discordId)
    return user.tag
  })
  if(list.length === 0) {
    discord.currentChennel.send("Banned plyers list is empty.")
    return
  }
  let content = '```'
  for(let i=0; i<list.length; i++) {
    content += (i+1).toString() + '. ' + list[i] + '\n';
  }
  content += '```'
  discord.currentChennel.send(content)
}

//---------------------------------------------------------------- ADD ----------------

async function addCommand(message) {
  message.react('👌');
  if(!discord.isPlayerModerById(message.author.id)) {
    discord.currentChennel.send("Only moderator can send this command.")
    return
  }
  const users = message.mentions.users.array()
  for(let u=0; u<users.length; u++) {
    const user = users[u];

    if(user.bot) {
      discord.currentChennel.send("Cannot invite bot `"+user.tag+"`.")
      return
    }
    if(await db.findBannedPlayerById(user.id)) {
      discord.currentChennel.send("Player `"+user.tag+"` was banned.")
      return
    }
    db.removeInvitedPlayerById(user.id)
    if(await db.findAddedPlayerById(user.id)) {
      console.log("Player "+user.tag+" already added.")
      return
    }
    addPlayer(user);

  }
}

//---------------------------------------------------------------- MAKE MODER ----------------

async function makeModerCommand(message) {
  message.react('👌');
  if(!discord.isPlayerModerById(message.author.id)) {
    discord.currentChennel.send("Only moderator can send this command.")
    return
  }
  const users = message.mentions.users.array()
  for(let u=0; u<users.length; u++) {
    const user = users[u];
    
    if(!await db.findAddedPlayerById(user.id)) {
      discord.currentChennel.send("Payer `" + user.tag +"` not found.");
    }
    if(discord.isPlayerModerById(user.id)) {
      discord.currentChennel.send("Payer `" + user.tag +"` already is moderator.");
    }
    discord.pinModerRoleById(user.id)
  }
}

//---------------------------------------------------------------- UNMAKE MODER ----------------

async function unmakeModerCommand(message) {
  message.react('👌');
  if(!discord.isPlayerModerById(message.author.id)) {
    discord.currentChennel.send("Only moderator can send this command.")
    return
  }
  const users = message.mentions.users.array()
  for(let u=0; u<users.length; u++) {
    const user = users[u];
    if(discord.isPlayerModerById(user.id)) {
      discord.unpinModerRoleById(user.id)
    } else {
      discord.currentChennel.send("Plyer `"+user.tag+"` isn't moderator.")
    }

  }
}

//---------------------------------------------------------------- SHOW MAPS ----------------

async function showMaps(message) {
  const buffer = await banner.getGameBanner(maps[i], user)
  const attachment = discord.imageAttachment(buffer);
  await discord.currentChennel.send('', attachment);
}

//---------------------------------------------------------------- GET BANNED PLARS ----------------


//---------------------------------------------------------------- GET BANNED PLARS ----------------

const threeDays = 3*24*60*60*1000;
function upDownManager(message, userId, upFunction, downFunction) {
  message.react('✅');
  message.react('❎');
  const upFilter = (reaction, user) => reaction.emoji.name === '✅' && user.id === userId;
  const downFilter = (reaction, user) => reaction.emoji.name === '❎' && user.id === userId;
  const upCollector = message.createReactionCollector(upFilter, { time: threeDays });
  const downCollector = message.createReactionCollector(downFilter, { time: threeDays });
  upCollector.on('collect', r => { 
    removeUpDownReactions(message);
    message.react('👌');
    upFunction();
  });
  downCollector.on('collect', r => { 
    removeUpDownReactions(message);
    downFunction();
  });
  downCollector.on('end', collected => { 
    console.log(`Collected ${collected.size} items`);
    removeUpDownReactions(message);
  });
}

async function removeUpDownReactions(message) {
  if(message.reactions.cache.has('✅')) {
    await message.reactions.cache.get('✅').users.remove();
  }
  if(message.reactions.cache.has('❎')) {
    await message.reactions.cache.get('❎').users.remove();
  }
}


async function ignorePlayerAfterInviting(user) {
  const userId = user.id;
  const invitedPlayer = await db.findInvitedPlayerById(userId);
  if(invitedPlayer) {
    db.removeInvitedPlayerById(userId);
    const userTag = user.username + '#' + user.discriminator;
    discord.currentChennel.send("Payer `" + userTag +"` rejected invitation.");
  }
}


async function handleUserMessage(message) {
  
}
// ================================================================ DISCORD EVENT HANDLING =========

// Handle message types
discord.client.on('message', async (message) => {
  if(message.author.bot) {
    return
  }

  if(await db.findBannedPlayerById(message.author.id)) {
    return
  }

  if(!message.guild) {
    handleUserMessage(message);
    return;
  }

  let chennel = message.guild.channels.cache.find(ch => ch.name === 'bot');
  if (!chennel) {
    return;
  }
  if(message.mentions.users.array().length) {
    if (message.content.match(/-invite {1,5}<@![0-9]{18}>/)) {
      invatePlayerCommand(message);
    }
    if (message.content.match(/-remove {1,5}<@![0-9]{18}>/)) {
      removePlayerCommand(message);
    }
    if (message.content.match(/-cancel {1,5}<@![0-9]{18}>/)) {
      cancelPlayerInvitationCommand(message);
    }
    if (message.content.match(/-ban {1,5}<@![0-9]{18}>/)) {
      banPlayerCommand(message);
    }
    if (message.content.match(/-unban {1,5}<@![0-9]{18}>/)) {
      unbanPlayerCommand(message);
    }
    if (message.content.match(/-user {1,5}<@![0-9]{18}>/)) {
      getUserCommand(message);
    }
    if (message.content.match(/-add {1,5}<@![0-9]{18}>/)) {
      addCommand(message);
    }
    if (message.content.match(/-moder {1,5}<@![0-9]{18}>/)) {
      makeModerCommand(message);
    }
    if (message.content.match(/-unmoder {1,5}<@![0-9]{18}>/)) {
      unmakeModerCommand(message);
    }
  }
  if (message.content.match(/-added/)) {
    getAddedPlayersCommand(message);
  }
  if (message.content.match(/-invited/)) {
    getInvitedPlayersCommand(message);
  }
  if (message.content.match(/-banned/)) {
    getBannedPlayersCommand(message);
  }
  if (message.content.match(/-gather/)) {
    gatherPlayerCommand(message);
  }
  if (message.content.match(/-maps/)) {
    showMaps(message);
  }
});

discord.client.login(configs.token);
