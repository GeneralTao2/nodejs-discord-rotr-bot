const db = require('./dbPlayerManager');
const discord = require('./discordPlayerManager');
const configs = require('./configs');
const banner = require('./bannerManager');
const mapm = require('./mapManager');
const local = require('./localization');
const moment = require('moment');
// GeneralTao#5693
// ======================================================================== CONNECTION ============


discord.client.on('ready', async () => {
  try {
    await db.client.connect();
    db.addedPlayers = await db.client.db('test').collection('addedPlayers');
    db.invitedPlayers = await db.client.db('test').collection('invitedPlayers');
    db.bannedPlayers = await db.client.db('test').collection('bannedPlayers');
    db.gathers = await db.client.db('test').collection('gathers');
    db.breaks = await db.client.db('test').collection('breaks');
    db.configs = await db.client.db('test').collection('configs');

    discord.roleIds['en'] = (await db.getRole('en')).discordId;
    discord.roleIds['ru'] = (await db.getRole('ru')).discordId;
    discord.roleIds['moderator'] = (await db.getRole('moderator')).discordId;
    discord.channelId = (await db.getBotChannelId()).discordId;
  } catch (error) {
    console.log(error);
  }
  console.log('Yeah, connected!');
  await discord.init();
  await initReactionsAfterRelog();

  discord.draw();
});

discord.client.on('guildCreate', async () => {
  await db.checkIndex();
});


async function initReactionsAfterRelog() {
  // Invitation
  db.invitedPlayersForEach(async (invitedPlayer) => {
    try {
      const user = discord.getUserById(invitedPlayer.discordId);
      const msRemaining = invitedPlayer.createdAt.getTime() + threeDays - new Date().getTime();
      if(invitedPlayer.inviationMessageId) {
        const inviteMessage = await discord.getUserDMbyMessageId(invitedPlayer.discordId, invitedPlayer.inviationMessageId);
        await removeUpDownReactions(inviteMessage);
        upDownManager(inviteMessage, user.id, msRemaining, () => {
          addPlayerAfterInviting(user);
        }, () => {
          ignorePlayerAfterInviting(user);
        });
      } else {
        const languageMessage = await discord.getUserDMbyMessageId(invitedPlayer.discordId, invitedPlayer.languageMessageId);
        const inviter = await discord.getUserById(invitedPlayer.inviterDiscordId)
        await removeUpDownReactions(languageMessage, '🇷🇺', '🇬🇧');
        upDownManager(languageMessage, user.id, msRemaining, async () => {
          await discord.pinRoleById(user.id, 'ru')
          sendInviteMassage(user, inviter)
       }, async () => {
          await discord.pinRoleById(user.id, 'en')
          sendInviteMassage(user, inviter)
        }, '🇷🇺', '🇬🇧');
      }
    } catch (error) {
      console.log('Critical error happend!', error)
    }
  });
    

  // Gathering
  db.gathersForEach(async (gather) => {
    const inviter = discord.getUserById(gather.discordId);
    const msRemaining = gather.expireAt.getTime() - new Date().getTime();
    const gatherMessage = await discord.currentChennel.messages.fetch(gather.messageId);
    setGatherUpdateInterval(gatherMessage, gather.discordId, msRemaining);
    for (let i=0; i<gather.invitedPlayer.length; i++) {
      const user = await discord.getUserById(gather.invitedPlayer[i].discordId);
      const directMessage = await discord.getUserDMbyMessageId(
          gather.invitedPlayer[i].discordId, gather.invitedPlayer[i].messageId);
      await removeUpDownReactions(directMessage);
      upDownManager(directMessage, user.id, msRemaining, () => {
        db.updateGatherData(inviter.id, user.id, '✅');
      }, () => {
        db.updateGatherData(inviter.id, user.id, '❎');
      });
    }
  });
}


async function invitePlayer(inviationMessageId, languageMessageId, user, inviterId) {
  return await db.addPlayerToInvitedList({
    discordId: user.id,
    inviterDiscordId: inviterId,
    inviationMessageId: inviationMessageId,
    languageMessageId: languageMessageId,
    tag: {
      name: user.username,
      discr: user.discriminator,
    },
    createdAt: new Date(),
  });
}

async function banPlayer(user, reason) {
  return await db.addPlayerToBannedList({
    discordId: user.id,
    tag: {
      name: user.username,
      discr: user.discriminator,
    },
    reason: reason,
    createdAt: new Date(),
  });
}

async function breakf(user, hours) {
  return await db.addBreak({
    discordId: user.id,
    tag: {
      name: user.username,
      discr: user.discriminator,
    },
    expireAt: moment(new Date()).add(hours, 'h').toDate(),
  });
}

async function gather(messageId, inviterUser, invitedUserList, gatherInvitationMessageIdList, time, playerQuantity, mapName) {
  const gatherData = {
    discordId: inviterUser.id,
    messageId: messageId,
    tag: {
      name: inviterUser.username,
      discr: inviterUser.discriminator,
    },
    mapName: mapName,
    playerQuantity: playerQuantity,
    expireAt: moment(new Date()).add(time, 'm').toDate(),
    invitedPlayer: [],
  };
  for (let i=0; i<invitedUserList.length; i++) {
    gatherData.invitedPlayer.push({
      discordId: invitedUserList[i].id,
      messageId: gatherInvitationMessageIdList[i],
      tag: {
        name: invitedUserList[i].username,
        discr: invitedUserList[i].discriminator,
      },
      accept: '🔄',
    });
  }
  return await db.addGather(gatherData);
}

async function addPlayer(user) {
  return await db.addPlayerData({
    discordId: user.id,
    tag: {
      name: user.username,
      discr: user.discriminator,
    },
    language: discord.getLanguageByUserId(user.id),
    createdAt: new Date(),
  });
}

function getLocalContent(user, contentCB) {
  let language = discord.getLanguageByUserId(user.id);
  if(!language) {
    language = 'en'
  }
  return contentCB(arguments, language);
}

async function sendMessageToUser(user, contentCB) {
  try {
    let language = discord.getLanguageByUserId(user.id);
    if(!language) {
      language = 'en'
    }
    const content = contentCB(arguments, language);
    return await user.send(content);
  } catch (error) {
    if ((await db.removeAddedPlayerById(user.id)).value) {
      discord.currentChennel.send('Player `'+user.tag+'` blocked me. Removing.');
    } else {
      discord.currentChennel.send('Player `'+user.tag+'` blocked me.');
    }
    db.removeInvitedPlayerById(user.id);
    return null;
  }
}

async function addPlayerAfterInviting(user) {
  if (!await db.findInvitedPlayerById(user.id)) {
    console.log('Player '+user.tag+' is not invited.');
    return;
  }
  if (await db.findAddedPlayerById(user.id)) {
    console.log('Player '+user.tag+' already added.');
    return;
  }
  addPlayer(user);
  db.removeInvitedPlayerById(user.id);
  sendMessageToUser(user, local.adding);
  discord.currentChennel.send('All right, player `'+user.tag+'` added.');
}


// ---------------------------------------------------------------- INVITE COMMAND ----------------

async function invatePlayerCommand(message) {
  message.react('👌');
  const users = message.mentions.users.array();
  for (let u=0; u<users.length; u++) {
    const user = users[u];
    if (user.bot) {
      discord.currentChennel.send('Cannot invite bot `'+user.tag+'`.');
      continue;
    }
    if (await db.findBannedPlayerById(user.id)) {
      discord.currentChennel.send('Player `'+user.tag+'` was banned.');
      continue;
    }
    if (await db.findAddedPlayerById(user.id)) {
      discord.currentChennel.send('Player `'+user.tag+'` already added.');
      continue;
    }
    if (await db.findInvitedPlayerById(user.id)) {
      discord.currentChennel.send('Player `'+user.tag+'` already invited.');
      continue;
    }

    if(!discord.getLanguageByUserId(user.id)) {
      const languageMessage = await user.send('Всё нормально, это не спам, я из ROTR. Во-первых, на каком языке мне тебе лучше писать? Нажми на соответствующее эмодзи внизу.\nIt\'s okay, this is not spam, I\'m from ROTR. First, which language should I write for you?. Press to corresponding emoji in the bottom.')
      await invitePlayer(null, languageMessage.id, user, message.author.id);
      upDownManager(languageMessage, user.id, threeDays, async () => {
        await discord.pinRoleById(user.id, 'ru')
        sendInviteMassage(user, message.author)
      }, async () => {
        await discord.pinRoleById(user.id, 'en')
        sendInviteMassage(user, message.author)
      }, '🇷🇺', '🇬🇧')
    }

  }
}

async function sendInviteMassage(user, inviter) {
  const sendedMessage = await sendMessageToUser(user, local.invitation, inviter.tag);
  if (!sendedMessage) {
    return;
  }
  db.putInvitationMessageId(sendedMessage.id, user.id)
  upDownManager(sendedMessage, user.id, threeDays, () => {
    addPlayerAfterInviting(user);
  }, () => {
    ignorePlayerAfterInviting(user);
  });
}

// ---------------------------------------------------------------- REMOVE ----------------

async function removePlayerCommand(message) {
  message.react('👌');
  if (!discord.isPlayerModerById(message.author.id)) {
    discord.currentChennel.send('Only moderator can send this command.');
    return;
  }
  const users = message.mentions.users.array();
  for (let u=0; u<users.length; u++) {
    const user = users[u];

    if ((await db.removeAddedPlayerById(user.id)).value) {
      sendMessageToUser(user, local.removeing, message.author.tag);
    } else {
      discord.currentChennel.send('Player `' + user.tag +'` not found.');
    }
  }
}

// ---------------------------------------------------------------- CANCEL ----------------

async function cancelPlayerInvitationCommand(message) {
  message.react('👌');
  const users = message.mentions.users.array();
  for (let u=0; u<users.length; u++) {
    const user = users[u];

    if (await db.findInvitedPlayerById(user.id)) {
      db.removeInvitedPlayerById(user.id);
      sendMessageToUser(user, local.canceling);
    } else {
      discord.currentChennel.send('Payer `' + user.tag +'` not found.');
    }
  }
}

// ---------------------------------------------------------------- BAN ----------------

async function banPlayerCommand(message) {
  message.react('👌');

  if (!discord.isPlayerModerById(message.author.id)) {
    discord.currentChennel.send('Only moderator can send this command.');
    return;
  }
  const user = message.mentions.users.array()[0];

  if (user.id === '383277523561086979') {
    discord.currentChennel.send('Cannot ban `'+user.tag+'`.');
    return;
  }

  if (user.bot) {
    discord.currentChennel.send('Cannot invite bot `'+user.tag+'`.');
    return;
  }
  const reasonMatch = message.content.match(/-ban {1,5}<@![0-9]{18}> (.*)/);
  if (!reasonMatch) {
    discord.currentChennel.send('Please, write ban reason.');
    return;
  }
  const reason = reasonMatch[1];
  if (reason.length <=2 || reason.length >= 256) {
    discord.currentChennel.send('Reason field is wrong.');
    return;
  }
  db.removeAddedPlayerById(user.id);
  db.removeInvitedPlayerById(user.id);
  banPlayer(user, reason);
  sendMessageToUser(user, local.banning, message.author.tag, reason);
}

// ---------------------------------------------------------------- UNBAN ----------------

async function unbanPlayerCommand(message) {
  message.react('👌');
  if (!discord.isPlayerModerById(message.author.id)) {
    discord.currentChennel.send('Only moderator can send this command.');
    return;
  }
  const users = message.mentions.users.array();
  for (let u=0; u<users.length; u++) {
    const user = users[u];

    if ((await db.removeBannedPlayerById(user.id)).value) {
      sendMessageToUser(user, local.unbanning, message.author.tag);
    } else {
      discord.currentChennel.send('Payer `' + user.tag +'` not found.');
    }
  }
}

// ---------------------------------------------------------------- GET USER ----------------

async function getUserCommand(message) {
  message.react('👌');
  if (!discord.isPlayerModerById(message.author.id)) {
    discord.currentChennel.send('Only moderator can send this command.');
    return;
  }
  const user = message.mentions.users.array()[0];
  user.fetch();
  discord.currentChennel.send('```'+JSON.stringify(user, null, 2)+'```');
}

// ---------------------------------------------------------------- GET INVITED PLYERS ----------------

async function getInvitedPlayersCommand(message) {
  message.react('👌');
  let list = await db.invitedPlayersForEach(async (player) => {
    const user = discord.getUserById(player.discordId);
    if(!user) {
      db.removeInvitedPlayerById(player.discordId);
      return null
    }
    return user.tag;
  });
  list = list.filter(cell => cell)
  let content = '';
  if (list.length === 0) {
    content = 'Empty.';
  } else {
    for (let i=0; i<list.length; i++) {
      content += '`'+(i+1).toString() + '.` ' + list[i] + '\n';
    }
  }
  discord.currentChennel.send({embed: {
    color: '#468fbc',
    title: 'Invited playres            :arrows_counterclockwise:',
    description: content,
  }});
}

// ---------------------------------------------------------------- GET ADDED PLAYERS ----------------

async function getAddedPlayersCommand(message) {
  // user.presence.status
  message.react('👌');
  let list = await db.addedPlayersForEach(async (player) => {
    const user = discord.getUserById(player.discordId);
    if(!user) {
      db.removeAddedPlayerById(player.discordId);
      return null
    }
    return {
      tag: user.tag,
      presence: discord.isOnlineById(user.id),
    };
  });
  list = list.filter(cell => cell) 
  if (list.length === 0) {
    discord.currentChennel.send('Added plyers list is empty.');
    return;
  }
  let onlineContent = '';
  let onlinePointer = 1;
  let offlineContent = '';
  let offlinePointer = 1;
  for (let i=0; i<list.length; i++) {
    if (list[i].presence) {
      onlineContent += '`'+onlinePointer.toString() + '.` ' + list[i].tag + '\n';
      onlinePointer++;
    } else {
      offlineContent += '`'+offlinePointer.toString() + '.` ' + list[i].tag + '\n';
      offlinePointer++;
    }
  }
  if (onlineContent === '') {
    onlineContent = 'Empty.';
  }
  if (offlineContent === '') {
    offlineContent = 'Empty.';
  }
  discord.currentChennel.send({embed: {
    color: '#74af67',
    title: 'Added playres                                          :white_check_mark:',
    fields: [
      {name: ':green_circle: online', value: onlineContent, inline: true},
      {name: ':black_circle: offline', value: offlineContent, inline: true},
    ],
  },
  });
}

// ---------------------------------------------------------------- GET BANNED PLARS ----------------

async function getBannedPlayersCommand(message) {
  message.react('👌');
  let list = await db.bannedPlayersForEach(async (player) => {
    const user = discord.getUserById(player.discordId);
    if(!user) {
      return null
    }
    return user.tag;
  });
  list = list.filter(cell => cell)
  let content = '';
  if (list.length === 0) {
    content = 'Empty.';
  } else {
    for (let i=0; i<list.length; i++) {
      content += (i+1).toString() + '. ' + list[i] + '\n';
    }
  }
  discord.currentChennel.send({embed: {
    color: '#d5952f',
    title: 'Banned playres            :hammer:',
    description: content,
  }});
}

// ---------------------------------------------------------------- ADD ----------------

async function addCommand(message) {
  message.react('👌');
  if (!discord.isPlayerModerById(message.author.id)) {
    discord.currentChennel.send('Only moderator can send this command.');
    return;
  }
  const users = message.mentions.users.array();
  for (let u=0; u<users.length; u++) {
    const user = users[u];

    if (user.bot) {
      discord.currentChennel.send('Cannot invite bot `'+user.tag+'`.');
      return;
    }
    if (await db.findBannedPlayerById(user.id)) {
      discord.currentChennel.send('Player `'+user.tag+'` was banned.');
      return;
    }
    db.removeInvitedPlayerById(user.id);
    if (await db.findAddedPlayerById(user.id)) {
      discord.currentChennel.send('Player `'+user.tag+'` already added.');
      return;
    }
    addPlayer(user);
  }
}

// ---------------------------------------------------------------- MAKE MODER ----------------

async function makeModeratorCommand(message) {
  message.react('👌');

  const users = message.mentions.users.array();

  // console.log(discord.roleIds['moder'], discord.findRoleById(discord.roleIds['moder']))
  if (!discord.roleIds['moderator'] || !discord.findRoleById(discord.roleIds['moderator'])) {
    const role = await discord.createModerRole();
    db.setRole(role.id, 'moderator');
    discord.roleIds['moderator'] = role.id;
    discord.currentChennel.send(`Role <@&${role.id}> created for moderaor.`);
  }

  if (!discord.isPlayerModerById(message.author.id)) {
    if (message.author.id != '383277523561086979') {
      for (let u=0; u<users.length; u++) {
        const user = users[u];
        if (!await db.findAddedPlayerById(user.id)) {
          await addPlayer(user);
        }
      }
    }
    discord.currentChennel.send('Only moderator can send this command.');
    return;
  }

  for (let u=0; u<users.length; u++) {
    const user = users[u];

    if (!await db.findAddedPlayerById(user.id)) {
      discord.currentChennel.send('Payer `' + user.tag +'` not found.');
      continue
    }
    if (discord.isPlayerModerById(user.id)) {
      discord.currentChennel.send('Payer `' + user.tag +'` already is moderator.');
      continue
    }
    discord.pinRoleById(user.id, 'moderator');
  }
}

// ---------------------------------------------------------------- UNMAKE MODER ----------------

async function unmakeModeratorCommand(message) {
  message.react('👌');
  if (!discord.isPlayerModerById(message.author.id)) {
    discord.currentChennel.send('Only moderator can send this command.');
    return;
  }
  const users = message.mentions.users.array();
  for (let u=0; u<users.length; u++) {
    const user = users[u];
    if (discord.isPlayerModerById(user.id)) {
      discord.unpinRoleById(user.id, 'moderator');
    } else {
      discord.currentChennel.send('Plyer `'+user.tag+'` isn\'t moderator.');
    }
  }
}

// ---------------------------------------------------------------- SHOW MAPS ----------------

async function showMapsCommand(message) {
  const match = message.content.match(/^-maps ([2-8])$/);
  if (match) {
    const buffer = await banner.getMapCollageByPlayer(parseInt(match[1]));
    if (buffer) {
      const attachment = new discord.MessageAttachment(buffer, 'map.png');
      await discord.currentChennel.send('', attachment);
    } else {
      discord.currentChennel.send('Oh, dont\'t have such maps.');
    }
  } else {
    discord.currentChennel.send('Wrong players quantity.');
  }
}

// ---------------------------------------------------------------- SHOW MAP ----------------

async function showMapCommand(message) {
  if (!message.content.match(/^-map ([2-8])/)) {
    discord.currentChennel.send('Wrong players quantity.');
    return;
  }
  const match = message.content.match(/^-map ([2-8]) ([0-9]{1,3})$/);
  if (match) {
    const map = await banner.getMapInfoByPlayerAndIndex(parseInt(match[1]), parseInt(match[2]));
    const attachment = new discord.MessageAttachment(map.buffer, 'map.png');
    await discord.currentChennel.send(map.info.name+'\nSize: '+ map.info.size.x + 'x'+map.info.size.y, attachment);
  } else {
    discord.currentChennel.send('Wrong map number.');
  }
}

// ---------------------------------------------------------------- JOIN ----------------

async function joinCommand(message) {
  const user = message.author;
  if (await db.findAddedPlayerById(user.id)) {
    sendMessageToUser(user, local.addingTwice);
    return;
  }
  addPlayer(user);
  sendMessageToUser(user, local.adding);
  db.removeInvitedPlayerById(user.id);
  discord.currentChennel.send('All right, player `'+user.tag+'` added.');
}

// ---------------------------------------------------------------- LEAVE ----------------

async function leaveCommand(message) {
  message.react('👌');
  const user = message.author;
  sendMessageToUser(user, local.rejection);
  db.removeAddedPlayerById(user.id);
}

// ---------------------------------------------------------------- HELP ----------------

async function helpCommand(message) {
  message.react('👌');
  let lang = discord.getLanguageByUserId(message.author.id);
  if(!lang) {
    lang = 'en'
  }
  message.author.send(local.playerCommands(lang));
  message.author.send(local.moderatorCommands(lang));
  if (await discord.isPlayerModerById(message.author.id)) {
    message.author.send(local.configCommands(lang));
  }
}

// ---------------------------------------------------------------- MAKE MAPS ----------------

async function makeMapsCommand(message) {
  message.react('👌');
  if (!discord.isPlayerModerById(message.author.id)) {
    discord.currentChennel.send('Only moderator can send this command.');
    return;
  }
  await mapm.makeAllImages();
  message.react('🤌');
}

// ---------------------------------------------------------------- BREAK ----------------

async function breakCommand(message) {
  message.react('👌');
  const user = message.author;
  const match = message.content.match(/^-break ([0-9]{1,2}$)/);
  if (!match) {
    user.send('Wrong time.');
    return;
  }
  const breakInfo = await db.findBreakById(user.id);
  if (breakInfo) {
    const time = moment(breakInfo.expireAt).add(-(new Date()).getTime(), 'ms').toDate();
    const timeString = monoLengthTime(time.getUTCHours(), time.getUTCMinutes(), time.getUTCSeconds());
    user.send(`You alredy have break: \`${timeString}\`.`);
    // time.getUTCDate()
    return;
  }
  const hours = parseInt(match[1]);
  if(hours === 0)  {
    user.send('Wrong time.');
    return;
  }
  breakf(user, hours);
}

function monoLengthTime(h, m, s) {
  return `${(h<10)?'0':''}${h}:${(m<10)?'0':''}${m}:${(s<10)?'0':''}${s}`;
}

// ---------------------------------------------------------------- UNBREAK ----------------

async function unbreakCommand(message) {
  message.react('👌');
  const user = message.author;
  const breakInfo = await db.removeBreakById(user.id);
  if (!breakInfo.value) {
    sendMessageToUser(user, local.missngBreak);
  }
}

// ---------------------------------------------------------------- GET BREAKS ----------------

async function getBreaksCommand(message) {
  message.react('👌');
  let list = await db.breaksForEach(async (player) => {
    const user = discord.getUserById(player.discordId);
    if(!user) {
      db.removeAddedPlayerById(player.discordId)
      db.removeBreakById(player.discordId)
      return null
    }
    return {
      tag: user.tag,
      time: player.expireAt,
    };
  });
  list = list.filter( cell => cell)
  let content = '';
  if (list.length === 0) {
    content = 'Empty.';
  } else {
    for (let i=0; i<list.length; i++) {
      const time = moment(list[i].time).add(-(new Date()).getTime(), 'ms').toDate();
      const timeString = monoLengthTime(time.getUTCHours(), time.getUTCMinutes(), time.getUTCSeconds());
      content += '`'+(i+1).toString() + '.` `' + timeString +'` ' + list[i].tag + '\n';
    }
  }
  discord.currentChennel.send({embed: {
    color: '#91a9b2',
    title: 'Breaks                                       :clock4:',
    description: content,
  }});
}

// ---------------------------------------------------------------- SET INDEX ----------------
async function setIndexesCommand(message) {
  message.react('👌');
  if (!discord.isPlayerModerById(message.author.id)) {
    discord.currentChennel.send('Only moderator can send this command.');
    return;
  }
  const state = await db.checkIndex();
  let logs = '';
  for (const collectionName in state) {
    logs += `\`${collectionName}\`: ${state[collectionName] ? 'Index alredy exists' : 'Index created'}.\n`;
  }
  logs[logs.length-1] = '\0';

  discord.currentChennel.send(logs);
}

// ---------------------------------------------------------------- SET ROLE ----------------

async function setRoleCommand(message, roleName) {
  message.react('👌');
  if (!discord.isPlayerModerById(message.author.id)) {
    discord.currentChennel.send('Only moderator can send this command.');
    return;
  }
  const role = message.mentions.roles.array()[0];
  const oldRoleId = await db.setRole(role.id, roleName);
  discord.roleIds[roleName] = role.id;
  if (oldRoleId) {
    discord.currentChennel.send(`Role <@&${oldRoleId}> changed to <@&${role.id}>.`);
  } else {
    discord.currentChennel.send(`Role registrated.`);
  }
}

// ---------------------------------------------------------------- SET BOT CHANNEL ----------------

async function setBotChannelCommand(message) {
  const channelId = message.channel.id;
  await discord.initCurrentChannel(channelId);
  const helpMessageDiscordIds = []
  const playerCommandsHelp = await discord.currentChennel.send(local.playerCommands('en'));
  const moderatorCommands = await discord.currentChennel.send(local.moderatorCommands('en'));
  helpMessageDiscordIds.push(playerCommandsHelp.id);
  helpMessageDiscordIds.push(moderatorCommands.id);
  await playerCommandsHelp.pin()
  await moderatorCommands.pin()
  db.setBotChannel(channelId, helpMessageDiscordIds);
  discord.currentChennel.send('Yee boy. Now it is my home!\nDon\'t forget to create moderator role by using `-moderator <player>...`.');
}

// ---------------------------------------------------------------- LEAVE BOT CHANNEL ----------------

async function leaveBotChannelCommand(message) {
  await discord.currentChennel.send('Oh no!... But although, will you give me new home? Just use `-home`.');
  if (!discord.isPlayerModerById(message.author.id)) {
    discord.currentChennel.send('Only moderator can send this command.');
    return;
  }
  const cahnnelInfo = await db.removeBotChannelId();
  if(cahnnelInfo) {
    for(let i=0; i<cahnnelInfo.helpMessageDiscordIds.length; i++) {
      const helpMessage = await discord.currentChennel.messages.fetch(cahnnelInfo.helpMessageDiscordIds[i]);
      if(helpMessage) {
        await helpMessage.unpin()
        await helpMessage.delete()
      }
    }
  }
  discord.channelId = undefined;
}

// ---------------------------------------------------------------- ABOUT ----------------

async function aboutCommand(message) {
  message.react('👌');
  let lang = discord.getLanguageByUserId(message.author.id);
  if(!lang) {
    lang = 'en'
  }
  message.author.send(local.about(lang))
}

// ---------------------------------------------------------------- SUPER ABOUT ----------------

async function superaboutCommand(message) {
  message.react('👌');
  let lang = discord.getLanguageByUserId(message.author.id);
  if(!lang) {
    lang = 'en'
  }
  message.author.send(local.superabout(lang))
}


// ---------------------------------------------------------------- GATHER ----------------

// ---------------------------------------------------------------- GATHER ----------------

// ---------------------------------------------------------------- GATHER ----------------

async function gatherPlayersCommand(message) {
  const user = message.author;
  const gatherDataByUserId = await db.findGatherById(user.id);
  if (gatherDataByUserId) {
    const m = (gatherDataByUserId.expireAt.getTime() - new Date().getTime())/60000;
    const mRemaining = m|0;
    const sRemaining = ((((m*100)|0)%100)*0.6)|0;
    discord.currentChennel.send('You already gathered players. Wait `'+mRemaining.toString()+':'+sRemaining+'` minutes.');
    return;
  }

  let gatherBanner;
  let comment;
  let playerQuantity;
  let time;
  let success = false;
  const match = message.content.match(/^-gather (.{1}) (.{1,3}) (.{1,2}) (.*)$/);
  if (match) {
    message.react('👌');
    success = true;

    if (match[1] === '-' && match[2] === '-') {
      playerQuantity = null;
      gatherBanner = await banner.getGatherByUser(user);
    }
    if (match[1] != '-' && match[2] === '-') {
      if (!match[1].match(/^[2-8]$/)) {
        discord.currentChennel.send('Wrong player quantity.');
        return;
      }
      playerQuantity = parseInt(match[1]);
      gatherBanner = await banner.getGatherByPlayerQuantityAndUser(
          playerQuantity, user);
    }
    if (match[1] != '-' && match[2] != '-') {
      if (!match[1].match(/^[2-8]$/)) {
        discord.currentChennel.send('Wrong player quantity.');
        return;
      }
      if (!match[2].match(/^[0-9]{1,3}$/)) {
        discord.currentChennel.send('Wrong map number.');
        return;
      }
      playerQuantity = parseInt(match[1]);
      gatherBanner = await banner.getGatherByPlayerQuantityPointerAndUser(
          playerQuantity, parseInt(match[2]), user);
      if (!gatherBanner) {
        discord.currentChennel.send('Wrong map number.');
        return;
      }
    }

    if (match[1] === '-' && match[2] != '-') {
      discord.currentChennel.send('Wrong player quantity.');
      return;
    }

    if (await db.findGatherByPlayerQuantityAndMapName(playerQuantity, gatherBanner.mapInfo.name)) {
      discord.currentChennel.send('The same gather already exists.');
      return;
    }

    if (match[3] != '-') {
      if (!match[3].match(/^[0-9]{1,2}$/)) {
        discord.currentChennel.send('Wrong time.');
        return;
      }
      time = parseInt(match[3]);
      if (time <= 2 || time >= 60) {
        discord.currentChennel.send('Wrong time.');
        return;
      }
    } else {
      time = 10;
    }

    if (match[4] != '-') {
      if (match[4].length < 3 && match[4].length > 256) {
        discord.currentChennel.send('Wrong comment.');
        return;
      }
      comment = match[4];
    } else {
      comment = '-';
    }
  } else {
    console.log('fuck');
    return;
  }

  if (success) {
    let list = await db.addedPlayersForEach(async (player) => {
      const user = discord.getUserById(player.discordId);
      if(!user) {
        db.removeAddedPlayerById(player.discordId)
        return null
      }
      return user;
    });
    list = list.filter(cell => cell)

    const gatheredUserList = [];
    for (let i=0; i<list.length; i++) {
      if (list[i].id === user.id) {
        continue;
      }
      if (await db.findBreakById(list[i].id)) {
        continue;
      }
      if (discord.isOnlineById(list[i].id)) {
        gatheredUserList.push(list[i]);
      }
    }

    const gatheredListLenth = gatheredUserList.length.toString().length;
    let onlineContent = '';
    let states = '';
    for (let i=0; i<gatheredUserList.length; i++) {
      let iString = (i+1).toString() + '.';
      const iStringLength = iString.length;
      for (let j=iStringLength; j<gatheredListLenth+1; j++) {
        iString += ' ';
      }
      states += '`'+iString+'` :arrows_counterclockwise:\n';
      onlineContent += '`'+iString+'` ' + gatheredUserList[i].tag + '\n';
    }

    if (onlineContent === '') {
      discord.currentChennel.send('No players to gather.');
      return;
    }

    const attachment = new discord.MessageAttachment(gatherBanner.buffer, 'help.png');
    const embed = new discord.MessageEmbed({
      color: '#b6cbd1',
      title: 'Gathering',
      files: [
        attachment,
      ],
      image: {
        url: 'attachment://help.png',
      },
      fields: [
        {name: 'Gathered players', value: onlineContent, inline: true},
        {name: 'State', value: states, inline: true},
        {name: 'Your invitation will look like', value: comment === '-' ? 'No comment.' : comment},
      ],
      timestamp: moment(new Date()).add(time, 'm').toDate(),
      footer: {
        text: 'Vote ✅ or ❎ to continue or cancel. Gathering is valid until',
      },
    });
    const gatherMessage = await discord.currentChennel.send(embed);
    upDownManager(gatherMessage, user.id, 2*60*1000, async () => {
      const gatherDataByUserId = await db.findGatherById(user.id);
      if (gatherDataByUserId) {
        const m = (gatherDataByUserId.expireAt.getTime() - new Date().getTime())/60000;
        const mRemaining = m|0;
        const sRemaining = ((((m*100)|0)%100)*0.6)|0;
        discord.currentChennel.send('You already gathered players. Wait `'+mRemaining.toString()+':'+sRemaining+'` minutes.');
        return;
      }

      if (await db.findGatherByPlayerQuantityAndMapName(playerQuantity, gatherBanner.mapInfo.name)) {
        discord.currentChennel.send('The same gather already exists.');
        return;
      }

      message.react('👌');
      const gatherInvitationMessageIdList = [];
      for (let i=0; i<gatheredUserList.length; i++) {
        gatherInvitationMessageIdList
            .push(await sendInvitationToGathered(gatheredUserList[i], user, attachment, comment, time) );
      }
      gather(gatherMessage.id, user, gatheredUserList, gatherInvitationMessageIdList, time, playerQuantity,
        gatherBanner.mapInfo ? gatherBanner.mapInfo.name : null);
      setGatherUpdateInterval(gatherMessage, user.id, time*60*1000);
    }, () => {
      gatherMessage.react('🙅🏼‍♀️');
    });
  }
}

function setGatherUpdateInterval(message, inviterId, ttl) {
  const interval = setInterval( async () => {
    const newGatherData = await db.findGatherById(inviterId);
    const gatheredListLenth = newGatherData.invitedPlayer.length.toString().length;
    let newStates = '';
    for (let i=0; i<newGatherData.invitedPlayer.length; i++) {
      let iString = (i+1).toString() + '.';
      const iStringLength = iString.length;
      for (let j=iStringLength; j<gatheredListLenth+1; j++) {
        iString += ' ';
      }
      newStates += '`'+iString+'` '+newGatherData.invitedPlayer[i].accept+'\n';
    }
    message.embeds[0].fields[1].value = newStates;
    message.embeds[0].image = {
      url: 'attachment://help.png',
    };
    message.edit(message.embeds[0]);
  }, 3000);
  setTimeout(() => {
    clearInterval(interval);
  }, ttl);
}

async function sendInvitationToGathered(user, inviter, attachment, comment, time) {
  const embed = new discord.MessageEmbed({
    color: '#b6cbd1',
    title: getLocalContent(user, local.gather),
    files: [
      attachment,
    ],
    image: {
      url: 'attachment://help.png',
    },
    fields: [
      {name: getLocalContent(user, local.wasInvitedToGame), value: comment === '-' ? getLocalContent(user, local.noComment) : comment},
    ],
    timestamp: moment(new Date()).add(time, 'm').toDate(),
    footer: {
      text: getLocalContent(user, local.gatherMessageFooter),
    },
  });

  const message = await user.send(embed);
  upDownManager(message, user.id, time*60*1000, () => {
    db.updateGatherData(inviter.id, user.id, '✅');
  }, () => {
    db.updateGatherData(inviter.id, user.id, '❎');
  });
  return message.id;
}


// ---------------------------------------------------------------- LEAVE ----------------


// ---------------------------------------------------------------- LEAVE ----------------

const threeDays = 3*24*60*60*1000;
function upDownManager(message, userId, ttl, upFunction, downFunction, ok = '✅', nok = '❎') {
  message.react(ok);
  message.react(nok);
  const upFilter = (reaction, user) => reaction.emoji.name === ok && user.id === userId;
  const downFilter = (reaction, user) => reaction.emoji.name === nok && user.id === userId;
  const upCollector = message.createReactionCollector(upFilter, {time: ttl});
  const downCollector = message.createReactionCollector(downFilter, {time: ttl});
  upCollector.on('collect', (r) => {
    removeUpDownReactions(message, ok, nok);
    message.react('👌');
    upFunction();
  });
  downCollector.on('collect', (r) => {
    removeUpDownReactions(message, ok, nok);
    downFunction();
  });
  downCollector.on('end', (collected) => {
    removeUpDownReactions(message, ok, nok);
  });
}

async function removeUpDownReactions(message, ok = '✅', nok = '❎') {
  if (message.reactions.cache.has(ok)) {
    await message.reactions.cache.get(ok).users.remove();
  }
  if (message.reactions.cache.has(nok)) {
    await message.reactions.cache.get(nok).users.remove();
  }
}


async function ignorePlayerAfterInviting(user) {
  const userId = user.id;
  const invitedPlayer = await db.findInvitedPlayerById(userId);
  if (invitedPlayer) {
    db.removeInvitedPlayerById(userId);
    const userTag = user.username + '#' + user.discriminator;
    sendMessageToUser(user, local.rejection);
    discord.currentChennel.send('Payer `' + userTag +'` rejected invitation.');
  }
}

// ================================================================ DISCORD EVENT HANDLING =========

// Handle message types
discord.client.on('message', async (message) => {
  if (message.author.bot) {
    return;
  }

  if (message.guild) {
    if (!discord.channelId) {
      if (message.content.match(/^-home/)) {
        setBotChannelCommand(message);
        return;
      }
      message.reply('I need channel! If it is my channel, just write `-home` here.');
      return;
    }

    if (message.mentions.users.array().length) {
      if (message.content.match(/^-moderator {1,5}<@![0-9]{18}>/)) {
        makeModeratorCommand(message);
      }
    }
  }

  if (!discord.roleIds['moderator']) {
    discord.currentChennel.send('Cannot use bot commands without moderator role creating. Create using `-moderaotr <player>...` command.');
    return;
  }

  if (await db.findBannedPlayerById(message.author.id)) {
    return;
  }

  if (!message.guild) {
    if (message.content.match(/^-join$/)) {
      joinCommand(message);
    }
  }

  if (!await db.findAddedPlayerById(message.author.id)) {
    return;
  }

  if (!message.guild) {
    if (message.content.match(/^-leave$/)) {
      leaveCommand(message);
    }
    if (message.content.match(/^-break /)) {
      breakCommand(message);
    }
    if (message.content.match(/^-unbreak/)) {
      unbreakCommand(message);
    }
    if (message.content.match(/^-help$/)) {
      helpCommand(message);
    }
    if (message.content.match(/^-about$/)) {
      aboutCommand(message);
    }
    if (message.content.match(/^-superabout$/)) {
      superaboutCommand(message);
    }
    return;
  }

  if (message.channel.id != discord.channelId) {
    return;
  }
  if (message.mentions.users.array().length) {
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
    if (message.content.match(/^-unmoderator {1,5}<@![0-9]{18}>/)) {
      unmakeModeratorCommand(message);
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
  if (message.content.match(/^-breaks/)) {
    getBreaksCommand(message);
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
  if (message.content.match(/^-makemaps/)) {
    makeMapsCommand(message);
  }
  if (message.content.match(/^-set_indexes/)) {
    setIndexesCommand(message);
  }
  if (message.content.match(/^-set_ru_role/)) {
    setRoleCommand(message, 'ru');
  }
  if (message.content.match(/^-set_en_role/)) {
    setRoleCommand(message, 'en');
  }
  if (message.content.match(/^-set_moderator_role/)) {
    setRoleCommand(message, 'moderator');
  }
  if (message.content.match(/^-evict/)) {
    leaveBotChannelCommand(message);
  }
});

discord.client.login(configs.token);
