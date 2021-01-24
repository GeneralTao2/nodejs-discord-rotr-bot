const db = require('./dbPlayerManager')
const discord = require('./discordPlayerManager')
const configs = require('./configs')
const banner = require("./bannerManager")
const mapm = require("./mapManager")
const local = require("./localization")
const moment = require("moment")
//GeneralTao#5693
// ======================================================================== CONNECTION ============

discord.client.on('ready',async () => {
  try {
    await db.client.connect();
    db.addedPlayers = await db.client.db("test").collection("addedPlayers");
    db.invitedPlayers = await db.client.db("test").collection("invitedPlayers");
    db.bannedPlayers = await db.client.db("test").collection("bannedPlayers");
    db.gathers = await db.client.db("test").collection("gathers");
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

  discord.draw();

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
    upDownManager(lastMessage, user.id, threeDays, () => {
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

async function gather(inviterUser, invitedUserList, time, playerQuantity, mapName){
  let gatherData = {
    discordId: inviterUser.id,
    tag: {
      name: inviterUser.username,
      discr: inviterUser.discriminator
    },
    mapName: mapName,
    playerQuantity: playerQuantity,
    expireAt: moment(new Date()).add(time, 'm').toDate(),
    invitedPlayer: [] 
  }
  for(let i=0; i<invitedUserList.length; i++) {
    gatherData.invitedPlayer.push({
      discordId: invitedUserList[i].id,
      tag: {
        name: invitedUserList[i].username,
        discr: invitedUserList[i].discriminator
      },
      accept: '🔄'
    })
  }
  return await db.addGather(gatherData)
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

function getLocalContent(user, contentCB) {
  const language = discord.getLanguageByUserId(user.id);
  return contentCB(arguments, language)
}

async function sendMessageToUser(user, contentCB) {
	try {
    const content = getLocalContent(user, contentCB)
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
  sendMessageToUser(user, local.adding)
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
    upDownManager(sendedMessage, user.id, threeDays, () => {
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

  if(user.id === "383277523561086979") {
    discord.currentChennel.send("Cannot ban `"+user.tag+"`.")
    return
  }

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
  let content = '#468fbc'
  if(list.length === 0) {
    content = "Empty."
  } else {
    for(let i=0; i<list.length; i++) {
      content += (i+1).toString() + '. ' + list[i] + '\n';
    }
  }
  discord.currentChennel.send({embed: {
    color: 3447003,
    title: "Invited playres            :arrows_counterclockwise:",
    description: content
  }})
}

//---------------------------------------------------------------- GET ADDED PLAYERS ----------------

async function getAddedPlayersCommand(message) {
  //user.presence.status
  message.react('👌');
  let list = await db.addedPlayersForEach(async player => {
    const user = discord.getUserById(player.discordId)
    return {
      tag: user.tag,
      presence: discord.isOnlineById(user.id)
    }
  })
  if(list.length === 0) {
    discord.currentChennel.send("Added plyers list is empty.")
    return
  }
  let onlineContent = ''
  let onlinePointer = 1;
  let offlineContent = ''
  let offlinePointer = 1;
  for(let i=0; i<list.length; i++) {
    if(list[i].presence) {
      onlineContent += onlinePointer.toString() + '. ' + list[i].tag + '\n'
      onlinePointer++
    } else {
      offlineContent += offlinePointer.toString() + '. ' + list[i].tag + '\n'
      offlinePointer++
    }
  }
  if(onlineContent === '') {
    onlineContent = 'Empty.'
  }
  if(offlineContent === '') {
    offlineContent = "Empty."
  }
  discord.currentChennel.send({embed: {
    color: '#74af67',
    title: "Added playres                                          :white_check_mark:",
    fields: [
      { name: ':green_circle: online', value: onlineContent, inline: true },
      { name: ':black_circle: offline', value: offlineContent, inline: true },
    ]
  }
})
}

//---------------------------------------------------------------- GET BANNED PLARS ----------------

async function getBannedPlayersCommand(message) {
  message.react('👌');
  let list = await db.bannedPlayersForEach(async player => {
    const user = discord.getUserById(player.discordId)
    return user.tag
  })
  let content = ''
  if(list.length === 0) {
    content = "Empty."
  } else {
    for(let i=0; i<list.length; i++) {
      content += (i+1).toString() + '. ' + list[i] + '\n';
    }
  }
  discord.currentChennel.send({embed: {
    color: '#d5952f',
    title: "Banned playres            :hammer:",
    description: content
  }})
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

async function showMapsCommand(message) {
  const match = message.content.match(/^-maps ([2-8])$/)
  if(match) {
    const buffer = await banner.getMapCollageByPlayer(parseInt(match[1]));
    if(buffer) {
      const attachment = new discord.MessageAttachment(buffer, 'map.png');
      await discord.currentChennel.send('', attachment);
    } else {
      discord.currentChennel.send("Oh, dont't have such maps.")
    }
  } else {
    discord.currentChennel.send("Wrong players quantity.")
  }
}

//---------------------------------------------------------------- SHOW MAP ----------------

async function showMapCommand(message) {
  if(!message.content.match(/^-map ([2-8])/)) {
    discord.currentChennel.send("Wrong players quantity.")
    return
  }
  const match = message.content.match(/^-map ([2-8]) ([0-9]{1,3})$/)
  if(match) {
    const map = await banner.getMapInfoByPlayerAndIndex(parseInt(match[1]), parseInt(match[2]));
    const attachment = new discord.MessageAttachment(buffer, 'map.png');
    console.log(map.info.name)
    await discord.currentChennel.send(map.info.name+"\nSize: "+ map.info.size.x + "x"+map.info.size.y, attachment);
  } else {
    discord.currentChennel.send("Wrong map number.")
  }
}

//---------------------------------------------------------------- JOIN ----------------

async function joinCommand(message) {
  const user = message.author
  if(await db.findAddedPlayerById(user.id)) {
    sendMessageToUser(user, local.addingTwice)
    return
  }
  addPlayer(user);
  sendMessageToUser(user, local.adding)
  db.removeInvitedPlayerById(user.id)
  discord.currentChennel.send("All right, player `"+user.tag+"` added.");
}

//---------------------------------------------------------------- LEAVE ----------------

async function leaveCommand(message) {
  message.react('👌');
  const user = message.author
  sendMessageToUser(user, local.rejection)
  db.removeAddedPlayerById(user.id)
}

//---------------------------------------------------------------- GATHER ----------------

async function gatherPlayersCommand(message) {
  const user = message.author
  const gatherDataByUserId = await db.findGatherById(user.id)
  if(gatherDataByUserId) {
    const m = (gatherDataByUserId.expireAt.getTime() - new Date().getTime())/60000
    const mRemaining = m|0
    const sRemaining = ((((m*100)|0)%100)*0.6)|0
    discord.currentChennel.send("You already gathered players. Wait `"+mRemaining.toString()+":"+sRemaining+"` minutes.");
    return;
  }

  let gatherBanner
  let comment;
  let playerQuantity
  let time
  let success = false;
  const match = message.content.match(/^-gather (.{1}) (.{1,3}) (.{1,2}) (.*)$/)
  if(match) {
    message.react('👌');
    success = true

    if(match[1] === "-" && match[2] === "-") {
      playerQuantity = null
      gatherBanner = await banner.getGatherByUser(user)
    } 
    if(match[1] != "-" && match[2] === "-") {
      if(!match[1].match(/^[2-8]$/)) {
        discord.currentChennel.send("Wrong player quantity.")
        return
      }
      playerQuantity = parseInt(match[1])
      gatherBanner = await banner.getGatherByPlayerQuantityAndUser(
      playerQuantity, user)
    } 
    if(match[1] != "-" && match[2] != "-") {
      if(!match[1].match(/^[2-8]$/)) {
        discord.currentChennel.send("Wrong player quantity.")
        return
      }
      if(!match[2].match(/^[0-9]{1,3}$/)) {
        discord.currentChennel.send("Wrong map number.")
        return
      }
      playerQuantity = parseInt(match[1])
      gatherBanner = await banner.getGatherByPlayerQuantityPointerAndUser(
      playerQuantity, parseInt(match[2]), user)
      if(!gatherBanner) {
        discord.currentChennel.send("Wrong map number.")
        return
      }
    }
    
    if(await db.findGatherByPlayerQuantityAndMapName(playerQuantity, gatherBanner.mapInfo.name)) {
      discord.currentChennel.send("The same gather already exists.")
      return
    }

    if(match[3] != "-") {
      if(!match[3].match(/^[0-9]{1,2}$/)) {
        discord.currentChennel.send("Wrong time.")
        return
      }
      time = parseInt(match[3])
      if(time < 2 || time > 60) {
        discord.currentChennel.send("Wrong time.")
        return
      }
    } else {
      time = 10
    }

    if(match[4] != "-") {
      if(match[4].length < 3 && match[4].length > 256) {
        discord.currentChennel.send("Wrong comment.")
        return
      }
      comment = match[4]
    } else {
      comment = '-'
    }

  } else {
    console.log("fuck")
    return;
  }
   
  if(success) {
    
    let list = await db.addedPlayersForEach(async player => {
      const user = discord.getUserById(player.discordId)
      return user
    })

    
    let gatheredUserList = []
    for(let i=0; i<list.length; i++) {
      if(list[i].id === user.id) {
        continue
      }
      if(discord.isOnlineById(list[i].id)) {
        gatheredUserList.push(list[i])
      }
    }

    const gatheredListLenth = gatheredUserList.length.toString().length
    let onlineContent = ''
    let states = ''
    for(let i=0; i<gatheredUserList.length; i++) {
      let iString = (i+1).toString() + '.'
      const iStringLength = iString.length
      for(let j=iStringLength; j<gatheredListLenth+1; j++) {
        iString += ' '
      }
      states += "`"+iString+'` :arrows_counterclockwise:\n'
      onlineContent += "`"+iString+'` ' + gatheredUserList[i].tag + '\n'
    }

    if(onlineContent === '') {
      discord.currentChennel.send("No players to gather.")
      return
    }
    
    const attachment = new discord.MessageAttachment(gatherBanner.buffer, 'help.png');
    let embed = new discord.MessageEmbed({
      color: '#b6cbd1',
      title: "Gathering                                                                                         :incoming_envelope:",
      files: [
        attachment
      ],
      image: {
        url: 'attachment://help.png'
      },
      fields: [
        { name: 'Gathered players', value: onlineContent, inline: true},
        { name: 'State', value: states, inline: true},
        { name: 'Your invitation will look like', value: comment === '-' ? "No comment." : comment },
      ],
      timestamp: moment(new Date()).add(time, 'm').toDate(),
      footer: {
        text: "Vote ✅ or ❎ to continue or cancel. Gathering is valid until"
      }
    })
    let gatherMessage = await discord.currentChennel.send(embed)
    upDownManager(gatherMessage, user.id, 2*60*1000, async () => {
      const gatherDataByUserId = await db.findGatherById(user.id)
      if(gatherDataByUserId) {
        const m = (gatherDataByUserId.expireAt.getTime() - new Date().getTime())/60000
        const mRemaining = m|0
        const sRemaining = ((((m*100)|0)%100)*0.6)|0
        discord.currentChennel.send("You already gathered players. Wait `"+mRemaining.toString()+":"+sRemaining+"` minutes.");
        return;
      }

      if(await db.findGatherByPlayerQuantityAndMapName(playerQuantity, gatherBanner.mapInfo.name)) {
        discord.currentChennel.send("The same gather already exists.")
        return
      }

      message.react('👌');
      gather(user, gatheredUserList, time, playerQuantity, 
        gatherBanner.mapInfo ? gatherBanner.mapInfo.name : null)
      for(let i=0; i<gatheredUserList.length; i++) {
        sendInvitationToGathered(gatheredUserList[i], user, attachment, comment, time);
      }
      let interval = setInterval( async () => {
        let newGatherData = await db.findGatherById(user.id)
        let newStates = ''
        for(let i=0; i<newGatherData.invitedPlayer.length; i++) {
          let iString = (i+1).toString() + '.'
          const iStringLength = iString.length
          for(let j=iStringLength; j<gatheredListLenth+1; j++) {
            iString += ' '
          }
          newStates += '`'+iString+'` '+newGatherData.invitedPlayer[i].accept+'\n'
        }
        embed.fields[1].value = newStates
        gatherMessage.edit(embed)

      }, 3000)
      setTimeout(() => {
        clearInterval(interval)
      }, time*60*1000);
    }, () => {
      gatherMessage.react('🙅🏼‍♀️');
    })
  }
}

async function sendInvitationToGathered(user, inviter, attachment, comment, time) {
  let embed = new discord.MessageEmbed({
    color: '#b6cbd1',
    title: getLocalContent(user, local.gather)+"                                                                                         :incoming_envelope:",
    files: [
      attachment
    ],
    image: {
      url: 'attachment://help.png'
    },
    fields: [
      { name: getLocalContent(user, local.wasInvitedToGame), value: comment === '-' ? getLocalContent(user, local.noComment) : comment },
    ],
    timestamp: moment(new Date()).add(time, 'm').toDate(),
    footer: {
      text: getLocalContent(user, local.gatherMessageFooter)
    }
  })

  let message = await user.send(embed)
  upDownManager(message, user.id, time*60*1000, () => {
    db.updateGatherData(inviter.id, user.id, '✅')
  }, () => {
    db.updateGatherData(inviter.id, user.id, '❎')
  })
}

//---------------------------------------------------------------- LEAVE ----------------


//---------------------------------------------------------------- LEAVE ----------------


//---------------------------------------------------------------- LEAVE ----------------

const threeDays = 3*24*60*60*1000;
function upDownManager(message, userId, ttl, upFunction, downFunction, endFunction) {
  message.react('✅');
  message.react('❎');
  const upFilter = (reaction, user) => reaction.emoji.name === '✅' && user.id === userId;
  const downFilter = (reaction, user) => reaction.emoji.name === '❎' && user.id === userId;
  const upCollector = message.createReactionCollector(upFilter, { time: ttl });
  const downCollector = message.createReactionCollector(downFilter, { time: ttl });
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
    removeUpDownReactions(message);
    if(endFunction) {
      endFunction()
    }
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
    sendMessageToUser(user, local.rejection)
    discord.currentChennel.send("Payer `" + userTag +"` rejected invitation.");
  }
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
    if(message.content.match(/-join/)) {
      joinCommand(message)
    }
  }

  if(!await db.findAddedPlayerById(message.author.id)) {
    return
  }

  if(!message.guild) {
    if(message.content.match(/-leave/)) {
      leaveCommand(message)
    }
    return;
  }

  let chennel = message.guild.channels.cache.find(ch => ch.name === 'bot');
  if (!chennel) {
    return;
  }
  if(message.mentions.users.array().length) {
    if (message.content.match(/^-invite {1,5}<@![0-9]{18}>/)) {
      invatePlayerCommand(message);
    }
    if (message.content.match(/^-remove {1,5}<@![0-9]{18}>/)) {
      removePlayerCommand(message);
    }
    if (message.content.match(/^-cancel {1,5}<@![0-9]{18}>/)) {
      cancelPlayerInvitationCommand(message);
    }
    if (message.content.match(/^-ban {1,5}<@![0-9]{18}>/)) {
      banPlayerCommand(message);
    }
    if (message.content.match(/^-unban {1,5}<@![0-9]{18}>/)) {
      unbanPlayerCommand(message);
    }
    if (message.content.match(/^-user {1,5}<@![0-9]{18}>/)) {
      getUserCommand(message);
    }
    if (message.content.match(/^-add {1,5}<@![0-9]{18}>/)) {
      addCommand(message);
    }
    if (message.content.match(/^-moder {1,5}<@![0-9]{18}>/)) {
      makeModerCommand(message);
    }
    if (message.content.match(/^-unmoder {1,5}<@![0-9]{18}>/)) {
      unmakeModerCommand(message);
    }
  }
  if (message.content.match(/^-added/)) {
    getAddedPlayersCommand(message);
  }
  if (message.content.match(/^-invited/)) {
    getInvitedPlayersCommand(message);
  }
  if (message.content.match(/^-banned/)) {
    getBannedPlayersCommand(message);
  }
  if (message.content.match(/^-maps /)) {
    showMapsCommand(message);
  }
  if (message.content.match(/^-map /)) {
    showMapCommand(message);
  }
  if (message.content.match(/^-gather/)) {
    gatherPlayersCommand(message);
  }
});

discord.client.login(configs.token);
