const db = require('./dbPlayerManager');
const discord = require('./discordPlayerManager');
const configs = require('./configs');
const banner = require('./bannerManager');
const mapm = require('./mapManager');
const local = require('./localization');
const moment = require('moment');
const commandm = require('./commandManager');
const dbinserter = require('./dbinserter')
const messagem = require('./messageManager')

exports.invatePlayerCommand = async function invatePlayerCommand(user, args, message) {
    if (!discord.getLanguageByUserId(user.id)) {
        askLanguage(user, sendInviteMassage, message.author)
    } else {
        await dbinserter.invitePlayer(null, null, user, message.author)
        sendInviteMassage(user, message.author)
    }
}

exports.removePlayerCommand = async function removePlayerCommand(user, args, message) {
	db.removeAddedPlayerById(user.id)
}














async function askLanguage(user, imojiPressCallback, inviter) {
	const languageMessage = await messagem.sendMessageToChannel(user, 'titleLangConfirmation', 'langConfirmation')
	await dbinserter.invitePlayer(null, languageMessage.id, user, inviter.id);
	upDownManager(languageMessage, user.id, threeDays, async () => {
		await discord.pinRoleById(user.id, 'ru')
		if (imojiPressCallback) {
			imojiPressCallback(user, inviter)
		}
	}, async () => {
		await discord.pinRoleById(user.id, 'en')
		if (imojiPressCallback) {
			imojiPressCallback(user, inviter)
		}
	}, '🇷🇺', '🇬🇧')
}

const threeDays = 3 * 24 * 60 * 60 * 1000;
function upDownManager(message, userId, ttl, upFunction, downFunction, ok = '✅', nok = '❎') {
	message.react(ok);
	message.react(nok);
	const upFilter = (reaction, user) => reaction.emoji.name === ok && user.id === userId;
	const downFilter = (reaction, user) => reaction.emoji.name === nok && user.id === userId;
	const upCollector = message.createReactionCollector(upFilter, { time: ttl });
	const downCollector = message.createReactionCollector(downFilter, { time: ttl });
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
        messagem.sendMessageToUser(user, 'titleRejection', 'rejection')
        messagem.sendSystemMessage('systemInviteRejection', user.tag)
	}
}

async function sendInviteMassage(user, inviter) {
	const sendedMessage = await messagem.sendMessageToUser(user, 'titleInvitation', 'invitation', inviter.tag);
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

async function addPlayerAfterInviting(user) {
	if (!await db.findInvitedPlayerById(user.id)) {
		console.log('Player ' + user.tag + ' is not invited.');
		return;
	}
	if (await db.findAddedPlayerById(user.id)) {
		console.log('Player ' + user.tag + ' already added.');
		return;
	}
	db.removeInvitedPlayerById(user.id);
	addPlayerProcess(user)
}

async function addPlayerProcess(user) {
	dbinserter.addPlayer(user);
	sendMessageToUser(user, 'adding');
	discord.currentChennel.send('All right, player `' + user.tag + '` added.');
}