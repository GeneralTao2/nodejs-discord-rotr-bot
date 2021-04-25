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
const {loadImage} = require('canvas')
const fs = require('fs')

exports.invatePlayerCommand = async function invatePlayerCommand(user, args, message) {
	await dbinserter.invitePlayer(null, null, user, message.author.id);
    if (!discord.getLanguageByUserId(user.id)) {
        askLanguage(user, sendInviteMassage, message.author)
    } else {
        sendInviteMassage(user, message.author)
    }
}

exports.removePlayerCommand = async function removePlayerCommand(user, args, message) {
	db.removeAddedPlayerById(user.id)
}

exports.cancelPlayerInvitationCommand = async function cancelPlayerInvitationCommand(user, args, message) {
	db.removeInvitedPlayerById(user.id);
	messagem.sendMessageToUser(user, 'titleCanceling', 'canceling');
}

exports.banPlayerCommand = async function banPlayerCommand(user, args, message) {
	db.removeAddedPlayerById(user.id);
	db.removeInvitedPlayerById(user.id);
	dbinserter.banPlayer(user, args[1]);
	messagem.sendMessageToUser(user, 'titleBan', 'banning', message.author.tag, args[1]);
}

exports.unbanPlayerCommand = async function unbanPlayerCommand(user, args, message) {
	db.removeBannedPlayerById(user.id)
	messagem.sendMessageToUser(user, 'titleBegin', 'unbanning', message.author.tag);
}

exports.getUserCommand = async function getUserCommand(user, args, message) {
	discord.currentChennel.send('```' + JSON.stringify(user, null, 2) + '```');
}

exports.addCommand = async function addCommand(user, args, message) {
	dbinserter.addPlayer(user);
	messagem.sendMessageToUser(user, 'titleBegin', 'adding');
}

exports.makeModeratorCommand = async function makeModeratorCommand(user, args, message) {
	if (!discord.roleIds['moderator'] || !discord.findRoleById(discord.roleIds['moderator'])) {
		const role = await discord.createModerRole();
		db.setRole(role.id, 'moderator');
		discord.roleIds['moderator'] = role.id;
		messagem.sendSystemMessage('moderRoleCreated', role.id);
	}

	discord.pinRoleById(user.id, 'moderator');
}

exports.unmakeModeratorCommand = async function unmakeModeratorCommand(user, args, message) {
	discord.unpinRoleById(user.id, 'moderator');
}

exports.joinCommand = async function joinCommand(args, message) {
	if (!discord.getLanguageByUserId(message.author.id)) {
		askLanguage(message.author, addPlayerAfterInviting, message.author)
	} else {
		addPlayerProcess(message.author)
	}
}

exports.leaveCommand = async function leaveCommand(args, message) {
	messagem.sendMessageToUser(message.author, 'titleRejection', 'rejection')
	messagem.sendSystemMessage('leaved', message.author.tag)
	db.removeAddedPlayerById(message.author.id);
}

exports.helpCommand = async function helpCommand(args, message) {
	let lang = discord.getLanguageByUserId(message.author.id);
	if (!lang) {
		lang = 'en'
	}
	message.author.send(local.translateHelpEmbed('playerCommands', lang));
	if (await discord.isPlayerModerById(message.author.id)) {
		message.author.send(local.translateHelpEmbed('moderatorCommands', lang));
		message.author.send(local.translateHelpEmbed('configCommands', lang));
	}
}

exports.makeMapsCommand = async function makeMapsCommand(args, message) {
	await mapm.makeAllImages();
	message.react('🤌');
}

exports.breakCommand = async function breakCommand(args, message) {
	const breakInfo = await db.findBreakById(message.author.id);
	if (breakInfo) {
		const time = moment(breakInfo.expireAt).add(-(new Date()).getTime(), 'ms').toDate();
		const timeString = monoLengthTime((time.getUTCDate()-1)*24 + time.getUTCHours(), time.getUTCMinutes(), time.getUTCSeconds());
		messagem.sendMessageToUser(message.author, 'titleCanceling', 'haveBreak', timeString)
		return;
	}
	dbinserter.breakf(message.author, args[0]);
}

exports.unbreakCommand = async function unbreakCommand(args, message) {
	const breakInfo = await db.removeBreakById(message.author.id);
	if (!breakInfo.value) {
		messagem.sendMessageToUser(message.author, 'titleCanceling', 'missngBreak')
	}
}

exports.getBreaksCommand = async function getBreaksCommand(args, message) {
	let list = await db.breaksForEach(async (player) => {
		const user = discord.getUserById(player.discordId);
		if (!user) {
			db.removeAddedPlayerById(player.discordId)
			db.removeBreakById(player.discordId)
			return null
		}
		return {
			tag: user.tag,
			time: player.expireAt,
		};
	});
	list = list.filter(cell => cell)
	let content = '';
	if (list.length === 0) {
		content = 'Empty.';
	} else {
		for (let i = 0; i < list.length; i++) {
			const time = moment(list[i].time).add(-(new Date()).getTime(), 'ms').toDate();
			const timeString = monoLengthTime((time.getUTCDate()-1)*24 + time.getUTCHours(), time.getUTCMinutes(), time.getUTCSeconds());
			content += '`' + (i + 1).toString() + '.` `' + timeString + '` ' + list[i].tag + '\n';
		}
	}
	discord.currentChennel.send({
		embed: {
			color: '#91a9b2',
			title: 'Breaks',
			files: [
				"images/breaks_icon_grey.png"
			],
			thumbnail: {
				url: 'attachment://breaks_icon_grey.png',
			},
			description: content,
		}
	});
}

exports.setIndexesCommand = async function setIndexesCommand(args, message) {
	const state = await db.checkIndex();
	let logs = '';
	for (const collectionName in state) {
		logs += `\`${collectionName}\`: ${state[collectionName] ? 'Index alredy exists' : 'Index created'}.\n`;
	}
	logs[logs.length - 1] = '\0';
	messagem.sendSystemMessage('indexLogs', logs)
}

exports.setEnRoleCommand = (args, message) => setRoleCommand(args[0], 'en')
exports.setRuRoleCommand = (args, message) => setRoleCommand(args[0], 'ru')
exports.setModeratorRoleCommand = (args, message) => setRoleCommand(args[0], 'moderator')

exports.setBotChannelCommand = async function setBotChannelCommand(args, message) {
	if(discord.channelId) {
		messagem.sendSystemMessage('haveHome');
		return;
	}
	if(!message.guild) {
		messagem.sendMessageToUser(message.author, 'titleCanceling', 'notInPersonal');
		return;
	}
	const channelId = message.channel.id;
	await discord.initCurrentChannel(channelId);
	const helpMessageDiscordIds = []
	const playerCommandsHelp = await discord.currentChennel.send(local.translateHelpEmbed('playerCommands'));
	helpMessageDiscordIds.push(playerCommandsHelp.id);
	await playerCommandsHelp.pin()
	db.setBotChannel(channelId, helpMessageDiscordIds);
	messagem.sendSystemMessage('toHome');
}

exports.leaveBotChannelCommand = async function leaveBotChannelCommand(args, message) {
	if(!discord.channelId) {
		messagem.sendSystemMessage('dontHaveHome');
		return;
	}
	messagem.sendSystemMessage('fromHome');
	const cahnnelInfo = await db.removeBotChannelId();
	if (cahnnelInfo) {
		for (let i = 0; i < cahnnelInfo.helpMessageDiscordIds.length; i++) {
			const helpMessage = await discord.currentChennel.messages.fetch(cahnnelInfo.helpMessageDiscordIds[i]);
			if (helpMessage) {
				await helpMessage.unpin()
				await helpMessage.delete()
			}
		}
	}
	discord.channelId = undefined;
}











exports.showMapsCommand = async function showMapsCommand(args, message) {
	const buffers = await banner.getMapCollage(
		mapInfo => mapInfo.playerStarts.length === args[0]);
	if (buffers.length) {
		for (let i = 0; i < buffers.length; i++) {
			const attachment = new discord.MessageAttachment(buffers[i], `map${i.toString}.png`);
			await discord.currentChennel.send('', attachment);
		}
	} else {
		messagem.sendMessageToChannel(message.author, 'titleCanceling', 'noSushMap');
	}
}

exports.showMapCommand = async function showMapCommand(args, message) {
	const map = await banner.getMapBufferAndInfo(
		mapInfo => mapInfo.playerStarts.length === args[0], args[1] - 1)
	if(!map) {
		messagem.sendMessageToChannel(message.author, 'titleCanceling', 'noSushMap');
		return;
	}
	const attachment = new discord.MessageAttachment(map.buffer, 'map.png');
	//console.log(map.buffer)
	await discord.currentChennel.send(
		map.info.name + '\nSize: ' + map.info.size.x + 'x' + map.info.size.y, attachment);
}

exports.getAddedPlayersCommand = async function getAddedPlayersCommand(user, args, message) {
	let list = await db.addedPlayersForEach(async (player) => {
		const user = discord.getUserById(player.discordId);
		if (!user) {
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
	for (let i = 0; i < list.length; i++) {
		if (list[i].presence) {
			onlineContent += '`' + onlinePointer.toString() + '.` ' + list[i].tag + '\n';
			onlinePointer++;
		} else {
			offlineContent += '`' + offlinePointer.toString() + '.` ' + list[i].tag + '\n';
			offlinePointer++;
		}
	}
	if (onlineContent === '') {
		onlineContent = 'Empty.';
	}
	if (offlineContent === '') {
		offlineContent = 'Empty.';
	}
	discord.currentChennel.send({
		embed: {
			color: '#74af67',
			title: 'Added playres',
			files: [
				"images/added_icon_grey.png"
			],
			thumbnail: {
				url: 'attachment://added_icon_grey.png',
			},
			fields: [
				{ name: ':green_circle: online', value: onlineContent, inline: true },
				{ name: ':black_circle: offline', value: offlineContent, inline: true },
			],
		},
	});
}

exports.getInvitedPlayersCommand = async function getInvitedPlayersCommand(user, args, message) {
	let list = await db.invitedPlayersForEach(async (player) => {
		const user = discord.getUserById(player.discordId);
		if (!user) {
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
		for (let i = 0; i < list.length; i++) {
			content += '`' + (i + 1).toString() + '.` ' + list[i] + '\n';
		}
	}
	discord.currentChennel.send({
		embed: {
			color: '#468fbc',
			title: 'Invited playres',
			files: [
				"images/invited_icon_grey.png"
			],
			thumbnail: {
				url: 'attachment://invited_icon_grey.png',
			},
			description: content,
		}
	});
}

exports.getBannedPlayersCommand = async function getBannedPlayersCommand(user, args, message) {
	let list = await db.bannedPlayersForEach(async (player) => {
		const user = discord.getUserById(player.discordId);
		if (!user) {
			return null
		}
		return user.tag;
	});
	list = list.filter(cell => cell)
	let content = '';
	if (list.length === 0) {
		content = 'Empty.';
	} else {
		for (let i = 0; i < list.length; i++) {
			content += (i + 1).toString() + '. ' + list[i] + '\n';
		}
	}
	discord.currentChennel.send({
		embed: {
			color: '#d5952f',
			title: 'Banned playres',
			files: [
				"images/banned_icon_grey.png"
			],
			thumbnail: {
				url: 'attachment://banned_icon_grey.png',
			},
			description: content,
		}
	});
}


exports.gatherPlayersCommand = async function gatherPlayersCommand(args, message) {
	const user = message.author;
	const gatherDataByUserId = await db.findGatherById(user.id);
	// check if player already gathered 
	console.log(gatherDataByUserId)
	if (gatherDataByUserId) {
		const m = (gatherDataByUserId.expireAt.getTime() - new Date().getTime()) / 60000;
		const mRemaining = m | 0;
		const sRemaining = ((((m * 100) | 0) % 100) * 0.6) | 0;
		messagem.sendMessageToChannel(message.author, 
			'titleCanceling', 'alreadyGathered', mRemaining.toString(), sRemaining.toString)
		return;
	}

	let gatherBanner;
	let comment = args[3];
	let playerQuantity = args[0];
	let time;

	if(!args[2]) {
		time = 10;
	}


	if(!args[0] && !args[1]) {
		gatherBanner = await banner.getGatherByUser(user);
	}
	if(args[0] && !args[1]) {
		gatherBanner = await banner.getGatherByPlayerQuantityAndUser(
			playerQuantity, user);
	}
	if(args[0] && args[1]) {
		gatherBanner = await banner.getGatherByPlayerQuantityPointerAndUser(
			playerQuantity, args[1], user);
		if (!gatherBanner) {
			messagem.sendMessageToChannel(message.author, 'titleCanceling', 'noSushMap');
			return;
		}
	}

	if (await db.findGatherByPlayerQuantityAndMapName(playerQuantity, gatherBanner.mapInfo.name)) {
		messagem.sendMessageToChannel(message.author, 'titleCanceling', 'sameGather');
		return;
	}

	let list = await db.addedPlayersForEach(async (player) => {
		const user = discord.getUserById(player.discordId);
		if (!user) {
			db.removeAddedPlayerById(player.discordId)
			return null
		}
		return user;
	});
	list = list.filter(cell => cell)

	const gatheredUserList = [];
	for (let i = 0; i < list.length; i++) {
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
	for (let i = 0; i < gatheredUserList.length; i++) {
		let iString = (i + 1).toString() + '.';
		const iStringLength = iString.length;
		for (let j = iStringLength; j < gatheredListLenth + 1; j++) {
			iString += ' ';
		}
		states += '`' + iString + '` :arrows_counterclockwise:\n';
		onlineContent += '`' + iString + '` ' + gatheredUserList[i].tag + '\n';
	}

	if (onlineContent === '') {
		discord.currentChennel.send('No players to gather.');
		return;
	}

	const attachment = new discord.MessageAttachment(gatherBanner.buffer, 'help.png');
	const embed = new discord.MessageEmbed({
		color: '#b6cbd1',
		title: local.EnRuPhrase('gather'),
		files: [
			attachment,
		],
		image: {
			url: 'attachment://help.png',
		},
		fields: [
			{ name: local.EnRuPhrase('gatheredPlayers'), value: onlineContent, inline: true },
			{ name: local.EnRuPhrase('state'), value: states, inline: true },
			{ name: local.EnRuPhrase('gatherPrew'), value: comment ? comment : local.EnRuPhrase('noComment') },
		],
		timestamp: moment(new Date()).add(time, 'm').toDate(),
		footer: {
			text: local.EnRuPhrase('vote'),
		},
	});
	const gatherMessage = await discord.currentChennel.send(embed);
	upDownManager(gatherMessage, user.id, 2 * 60 * 1000, async () => {
		const gatherDataByUserId = await db.findGatherById(user.id);
		if (gatherDataByUserId) {
			const m = (gatherDataByUserId.expireAt.getTime() - new Date().getTime()) / 60000;
			const mRemaining = m | 0;
			const sRemaining = ((((m * 100) | 0) % 100) * 0.6) | 0;
			messagem.sendMessageToChannel(message.author, 
				'titleCanceling', 'alreadyGathered', mRemaining.toString(), sRemaining.toString)
			return;
		}

		if (await db.findGatherByPlayerQuantityAndMapName(playerQuantity, gatherBanner.mapInfo.name)) {
			messagem.sendMessageToChannel(message.author, 'titleCanceling', 'sameGather');
			return;
		}

		message.react('👌');
		const gatherInvitationMessageIdList = [];
		for (let i = 0; i < gatheredUserList.length; i++) {
			gatherInvitationMessageIdList
				.push(await sendInvitationToGathered(gatheredUserList[i], user, attachment, comment, time));
		}
		dbinserter.gather(gatherMessage.id, user, gatheredUserList, gatherInvitationMessageIdList, time, playerQuantity,
			gatherBanner.mapInfo ? gatherBanner.mapInfo.name : null);
		setGatherUpdateInterval(gatherMessage, user.id, time * 60 * 1000);
	}, () => {
		gatherMessage.react('🙅🏼‍♀️');
	});
}

function setGatherUpdateInterval(message, inviterId, ttl) {
	const interval = setInterval(async () => {
		const newGatherData = await db.findGatherById(inviterId);
		const gatheredListLenth = newGatherData.invitedPlayer.length.toString().length;
		let newStates = '';
		for (let i = 0; i < newGatherData.invitedPlayer.length; i++) {
			let iString = (i + 1).toString() + '.';
			const iStringLength = iString.length;
			for (let j = iStringLength; j < gatheredListLenth + 1; j++) {
				iString += ' ';
			}
			newStates += '`' + iString + '` ' + newGatherData.invitedPlayer[i].accept + '\n';
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
	const lang = messagem.getLang(user)
	const embed = new discord.MessageEmbed({
		color: '#b6cbd1',
		title: local.translatePhrase('gather', lang),
		files: [
			attachment,
		],
		image: {
			url: 'attachment://help.png',
		},
		fields: [
			{ name: local.translatePhrase('wasInvitedToGame', lang), value: comment ? comment : local.translatePhrase('noComment', lang) },
		],
		timestamp: moment(new Date()).add(time, 'm').toDate(),
		footer: {
			text: local.translatePhrase('vote', lang),
		},
	});

	const message = await user.send(embed);
	upDownManager(message, user.id, time * 60 * 1000, () => {
		db.updateGatherData(inviter.id, user.id, '✅');
	}, () => {
		db.updateGatherData(inviter.id, user.id, '❎');
	});
	return message.id;
}






async function setRoleCommand(role, roleName) {
	const oldRoleId = await db.setRole(role.id, roleName);
	discord.roleIds[roleName] = role.id;
	if (oldRoleId) {
		messagem.sendSystemMessage('roleChanged', oldRoleId, role.id);
	} else {
		messagem.sendSystemMessage('roleRegistered');
	}
}


function monoLengthTime(h, m, s) {
	return `${(h < 10) ? '0' : ''}${h}:${(m < 10) ? '0' : ''}${m}:${(s < 10) ? '0' : ''}${s}`;
}


async function askLanguage(user, imojiPressCallback, inviter) {
	const languageMessage = await messagem.sendMessageToUser(user, 'titleLangConfirmation', 'langConfirmation')
	await db.putLanguageMessageId(languageMessage.id, user.id)
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
	await db.putInvitationMessageId(sendedMessage.id, user.id)
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
	messagem.sendMessageToUser(user, 'titleBegin', 'adding');
	messagem.sendSystemMessage('systemInviteAcception', user.tag)
}