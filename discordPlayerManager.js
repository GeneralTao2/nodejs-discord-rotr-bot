const configs = require('./configs')

const { Client, MessageEmbed, MessageAttachment } = require('discord.js');

const Canvas = require('canvas');

const client = new Client();

let roleIds = {
    en: null,
    ru: null,
    moderator: null
  }

//const enUserRoleId = '726406438142083133';
//const ruUserRoleId = '449178005353267201';

exports.guildId = '382234807003906061';
//let channelId = '726026506869932043';
exports.channelId = undefined

const botUserId = '726008192425001011';

const botModeratorRoleData = {
	name: "Bot Moderator",
	color: [212, 102, 59]
}

function logGuildCannels() {
    console.log(client.guilds);
    console.log(client.channels);
}

function matchTagStringByCommand(command) {
    return String(command.match(/[a-zA-Z0-9_-]*#\d{4}/));
}
function matchTagObjByTagString(tagString) {
    return {
        name: String(tagString.match(/^[a-zA-Z0-9_-]*/)),
        discr: String(tagString.match(/\d{4}$/))
    }
}

function getUserByTagObj(tag) {
    let array = exports.currentGuild.members.cache.filter(
        member => (member.user.username === tag.name) && (member.user.discriminator === tag.discr) ).array();
    if(array.length) {
        return array[0].user;
    }
    return null;
}

function getGuildMemberByUserId(id) {
    let array = exports.currentGuild.members.cache.filter(
        member => (member.user.id === id)).array();
    if(array.length) {
        return array[0];
    }
    return null;
}

function getUserById(id) {
    const member = getGuildMemberByUserId(id);
    if(member) {
        return member.user;
    }
    return null;
}

function hasRoleByUserIdAndRoleId(userId, roleId) {
    return getGuildMemberByUserId(userId).roles.cache.has(roleId);
}

function getLanguageByUserId(id) {
    if(hasRoleByUserIdAndRoleId(id, roleIds['en'])) {
        return 'en';
    }
    if(hasRoleByUserIdAndRoleId(id, roleIds['ru'])) {
        return 'ru'
    }
    return null;
}

async function initCurrentChannel(channelId) {
	exports.channelId = channelId
	exports.currentChennel = await client.channels.cache.get(exports.channelId);
}

async function init() {
    exports.currentGuild = await client.guilds.cache.get(exports.guildId);
    if(exports.currentGuild) {
        await exports.currentGuild.members.fetch()
        await exports.currentGuild.roles.fetch()
        if(exports.channelId) {
            await initCurrentChannel(exports.channelId)
        }
    }
}

function getTagByUserId(id) {
    const user = getUserById(id);
    if(user) {
        return {
            name: user.username,
            discr: user.discriminator
        }
    }
    return null;
}

function ErrorMessage(content) {
    return new MessageEmbed()
        .setTitle('Error')
        .setColor(0xbd4242)
        .setDescription(content);
}

function draw() {
    
}


async function getLastUserDMbyId(id) {
    const user = getUserById(id)
    if(!user.dmChannel) {
        await user.createDM()
    }
    return await user.dmChannel.messages.fetch(user.dmChannel.lastMessageID)
}

async function getUserDMbyMessageId(userId, messageId) {
    const user = getUserById(userId)
    if(!user.dmChannel) {
        await user.createDM()
    }
    console.log(messageId)
    return await user.dmChannel.messages.fetch(messageId)
}


function isPlayerModerById(id) {
    if(!roleIds['moderator']) {
        return false;
    }
    const roleArray = exports.currentGuild.roles.cache.filter(
			role => role.id === roleIds['moderator']).array()
    if(!roleArray.length) {
        return false
    }
    const role = roleArray[0]
    return getGuildMemberByUserId(id).roles.cache.has(role.id)
}

function findRoleByName(name) {
    const roleArray = exports.currentGuild.roles.cache.filter(role => role.name === name).array()
    if(roleArray.length === 0) {
        return null
    }
    return roleArray[0]
}

async function createModerRole() {
    return await exports.currentGuild.roles.create({
        data: botModeratorRoleData,
        reason: 'These pepale has access to dangerous RotrManager bot'
    })
}

function findRoleById(id) {
	const roleArray = exports.currentGuild.roles.cache.filter(role => role.id === id).array()
    if(roleArray.length === 0) {
        return null
    }
  return roleArray[0]
}

async function pinRoleById(id, roleName) {
    const role = findRoleById(exports.roleIds[roleName])
	if(role) {
		const member = getGuildMemberByUserId(id)
        await member.roles.add(role.id)
	}
}

async function unpinRoleById(id, roleName) {
	const role = findRoleById(exports.roleIds[roleName])
	if(role) {
		const member = getGuildMemberByUserId(id)
		await member.roles.remove(role.id)
	}
}

function isOnlineById(id) {
    const user = getUserById(id)
    if(user.presence.status === 'offline') {
        return false
    } else {
        return true
    }
} 

exports.findRoleById = findRoleById
exports.createModerRole = createModerRole
exports.getUserDMbyMessageId = getUserDMbyMessageId
exports.isOnlineById = isOnlineById
exports.isPlayerModerById = isPlayerModerById
exports.unpinRoleById = unpinRoleById
exports.findRoleByName = findRoleByName
exports.pinRoleById = pinRoleById
exports.getLastUserDMbyId = getLastUserDMbyId;
exports.draw = draw; 
exports.ErrorMessage = ErrorMessage;
exports.getTagByUserId = getTagByUserId;
exports.getLanguageByUserId = getLanguageByUserId;
exports.hasRoleByUserIdAndRoleId = hasRoleByUserIdAndRoleId;
exports.getGuildMemberByUserId = getGuildMemberByUserId;
exports.getUserById = getUserById;
exports.getUserByTagObj = getUserByTagObj;
exports.matchTagObjByTagString = matchTagObjByTagString;
exports.matchTagStringByCommand = matchTagStringByCommand;
exports.initCurrentChannel = initCurrentChannel
exports.init = init;
exports.client = client;
exports.botUserId = botUserId;
exports.roleIds = roleIds
exports.MessageAttachment = MessageAttachment
exports.MessageEmbed = MessageEmbed