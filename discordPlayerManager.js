const configs = require('./configs')

const { Client, MessageEmbed, MessageAttachment, Attachment } = require('discord.js');

const Canvas = require('canvas');

const client = new Client();

const enUserRoleId = '726406438142083133';
const ruUserRoleId = '449178005353267201';

const guildId = '448934652992946176';
const chennelId = '726026506869932043';

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
    if(hasRoleByUserIdAndRoleId(id, enUserRoleId)) {
        return 'en';
    }
    if(hasRoleByUserIdAndRoleId(id, ruUserRoleId)) {
        return 'ru'
    }
    return null;
}

async function init() {
    exports.currentGuild = await client.guilds.cache.get(guildId);
    exports.currentChennel = await client.channels.cache.get(chennelId);
    await exports.currentGuild.members.fetch();
    await exports.currentGuild.roles.fetch()
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
    await user.createDM()
    await user.dmChannel.messages.fetch(user.dmChannel.lastMessageID);
    return user.dmChannel.messages.cache.array()[0];
}

function isPlayerModerById(id) {
    const roleArray = exports.currentGuild.roles.cache.filter(role => role.name === "Bot Moderator").array()
    if(!roleArray.length) {
        return
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

async function pinModerRoleById(id) {
	const role = findRoleByName(botModeratorRoleData.name)
	if(role) {
		const member = getGuildMemberByUserId(id)
		member.roles.add(role.id)
	} else {
		await exports.currentGuild.roles.create({
			data: botModeratorRoleData,
			reason: 'These pepale has access to dangerous RotrManager bot'
		})
	}
}

function unpinModerRoleById(id) {
	const role = findRoleByName(botModeratorRoleData.name)
	if(role) {
		const member = getGuildMemberByUserId(id)
		member.roles.remove(role.id)
	} else {
		return
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

exports.isOnlineById = isOnlineById
exports.isPlayerModerById = isPlayerModerById
exports.unpinModerRoleById = unpinModerRoleById
exports.findRoleByName = findRoleByName
exports.pinModerRoleById = pinModerRoleById
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
exports.init = init;
exports.client = client;
exports.enUserRoleId = enUserRoleId;
exports.ruUserRoleId = ruUserRoleId;
exports.guildId = guildId;
exports.chennelId = chennelId;
exports.botUserId = botUserId;
exports.MessageAttachment = MessageAttachment
exports.MessageEmbed = MessageEmbed