//https://discord.com/oauth2/authorize?client_id=726008192425001011&scope=bot&permissions=8
const discord = require('discord.js');
const token = 'NzI2MDA4MTkyNDI1MDAxMDEx.XvXMYA.y_40azZtW-OiU8ozPjgr1FnLUhM';
const playerList = require('./player_manager')

const client = new discord.Client();

//console.log(playerList.players);
function logGuiildCannels() {
  console.log(client.guilds);
  console.log(client.channels);
}
const englishUserRoleID = '726406438142083133';

let currentGuild;
let currentChennel;
let englishUserRole;
client.on('ready', () => {
    console.log("Yeah, connected!");
    currentGuild = client.guilds.cache.get('448934652992946176');
    currentChennel = client.channels.cache.get('726026506869932043');
    englishUserRole = currentGuild.roles.cache.get(englishUserRoleID);
    playerList.init();
});

client.on('message', message => {
  if(!message.guild)
  return;
  let chennel = message.guild.channels.cache.find(ch => ch.name === 'bot');
  if (!chennel) return;
  if (message.content.match(/-add [a-zA-Z0-9_-]*#\d{4}/)) {
    let nameId = String(message.content.match(/[a-zA-Z0-9_-]*#\d{4}/));
    let inviter = message.author.username;
    addPlayer(nameId, inviter);
  }
  if (message.content.match(/-remove [a-zA-Z0-9_-]*#\d{4}/)) {
    let nameId = String(message.content.match(/[a-zA-Z0-9_-]*#\d{4}/));
    removePlayer(nameId);
  }
  if (message.content.match(/-req `.*`/) ) {
    let userMail = message.content.match(/`.*`/);
    requestConfirming(userMail);
  }
  if (message.content.match(/-print [a-zA-Z0-9_-]*#\d{4}/)) {
    let nameId = String(message.content.match(/[a-zA-Z0-9_-]*#\d{4}/));
    printPlayer(nameId);
  } else if (message.content.match(/-print/)) {
    printPlayerList();
  }
});

function requestConfirming(userMail) {
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
}

function requestMailing(userMail) {
  let nameId = 'GeneralTao#5693';
  let playerIndex = playerList.findByName(nameId);
  playerIndex--;
  let playerDiskr = playerList.players[playerIndex].id;
  let mail = 'Hello, **' + nameId + '**! Want to play?\n`' + userMail + '`';
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

function printPlayer(nameId) {
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

function removePlayer(nameId) {
  let playerIndex = playerList.findByName(nameId);
  if(!playerIndex) {
    currentChennel.send("Player `" + nameId +"` not found.");
    return;
  }
  playerIndex--;
  playerList.removeByIndex(playerIndex);
  currentChennel.send("Player `" + nameId +"` removed.");
  playerList.save();
}

function addPlayer(nameId, inviter) {
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


function defineMember(nameId) {
  let name = nameId.match(/^[a-zA-Z0-9_-]*/);
  let discr = nameId.match(/[0-9]*$/);
  currentChennel.send("Defined: " + name + "#" + discr);
  for(let player of currentGuild.members.cache.values()) {
    if(name == player.user.username && discr == player.user.discriminator) {
      currentChennel.send("id = " + player.user.id);
      return player;
    }
  }
  return null;
}
  

client.login(token);

//playerList.save();