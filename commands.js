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
const vote = require('./voteManager');
const gather = require('./gatherCommandTools')
const columnm = require('./columnManager')
const zipdir = require('zip-dir');

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
	messagem.sendMessageToUser(user, 'titleRejection', 'rejection')
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
			try {
				const helpMessage = await discord.currentChennel.messages.fetch(cahnnelInfo.helpMessageDiscordIds[i]);
				if (helpMessage) {
					await helpMessage.unpin()
					await helpMessage.delete()
				}
			} catch (error) {
				console.log("OMG, super ERROR!!!!")
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

exports.getAddedPlayersCommand = async function getAddedPlayersCommand(args, message) {
	const onlinePlayerClusters = await columnm.getPlayerColumn(db.addedPlayers, 
		(user) => discord.isOnlineById(user.id) );

	const offlinePlayerClusters = await columnm.getPlayerColumn(db.addedPlayers, 
		(user) => !discord.isOnlineById(user.id) );

	const fields = columnm.clasters2fields({
		array: onlinePlayerClusters, 
		title: ":green_circle: online",
	}, {
		array: offlinePlayerClusters,
		title: ":black_circle: offline"
	} );
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
			fields: fields,
		},
	});
}

exports.getInvitedPlayersCommand = async function getInvitedPlayersCommand(args, message) {
	const invitedClusters = await columnm.getPlayerColumn(db.invitedPlayers, 
		(user) => user, 40);

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
			description: invitedClusters[0],
		}
	});
}

exports.getBannedPlayersCommand = async function getBannedPlayersCommand(args, message) {
	const bannedClusters = await columnm.getPlayerColumn(db.invitedPlayers, 
		(user) => user, 40);

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
			description: bannedClusters[0],
		}
	});
}

exports.downloadMap = async function downloadMap(args, message) {
	const mapInfos = await mapm.getMapInfo(
		mapInfo => mapInfo.playerStarts.length === args[0]);
	if(mapInfos.length < args[1]) {
		messagem.sendMessageToChannel(message.author, 'titleCanceling', 'noSushMap');
		return;
	}
	const mapInfo = mapInfos[args[1] - 1]
	const buffer = await zipdir(`Maps/${mapInfo.name}`);
	const attachment = new discord.MessageAttachment(buffer, `${mapInfo.name}.zip`);
	discord.currentChennel.send(attachment);
}


exports.aboutCommand = async function aboutCommand(args, message) {
	let lang = messagem.getLang(message.author)
	message.author.send(local.translateInfoEmbed('about', lang))
}


exports.superaboutCommand = async function superaboutCommand(args, message) {
	let lang = messagem.getLang(message.author)
	message.author.send(local.translateInfoEmbed('superabout', lang))
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

	const userList = await columnm.getPlayers(db.addedPlayers, 
		async (user) => !(await db.findBreakById(user.id)) && discord.isOnlineById(user.id));
	//const userList = [discord.getUserById('798964404447739994'),]
	const userColumn = await columnm.getColumn(userList);
	const userListLength = userList.length;
	const emojiList = new Array(userListLength).fill(':arrows_counterclockwise:');
	const emojiColumn = await columnm.getEmojiColumn(emojiList);
	const clasters = columnm.clasters2fields({
		array: userColumn,
		title: local.EnRuPhrase('gatheredPlayers')
	}, {
		array: emojiColumn,
		title: local.EnRuPhrase('state')
	});
	clasters.push({ 
		name: local.EnRuPhrase('gatherPrew'), 
		value: comment ? comment : local.EnRuPhrase('noComment') 
	});

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
		fields: clasters,
		timestamp: moment(new Date()).add(time, 'm').toDate(),
		footer: {
			text: local.EnRuPhrase('vote'),
		},
	});
	const gatherMessage = await discord.currentChennel.send(embed);
	vote.upDownManager(gatherMessage, user.id, 2 * 60 * 1000, async () => {
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
		for (let i = 0; i < userListLength; i++) {
			gatherInvitationMessageIdList
				.push(await gather.sendInvitationToGathered(userList[i], user, attachment, comment, time));
		}
		dbinserter.gather(gatherMessage.id, user, userList, gatherInvitationMessageIdList, time, playerQuantity,
			gatherBanner.mapInfo ? gatherBanner.mapInfo.name : null);
		gather.setGatherUpdateInterval(gatherMessage, user.id, time * 60 * 1000);
	}, () => {
		gatherMessage.react('🙅🏼‍♀️');
	});
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



const threeDays = 3 * 24 * 60 * 60 * 1000;



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
	vote.upDownManager(sendedMessage, user.id, threeDays, () => {
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
	db.removeInvitedPlayerById(user.id);
	messagem.sendMessageToUser(user, 'titleBegin', 'adding');
	messagem.sendSystemMessage('systemInviteAcception', user.tag)
}

async function askLanguage(user, imojiPressCallback, inviter) {
	const languageMessage = await messagem.sendMessageToUser(user, 'titleLangConfirmation', 'langConfirmation')
	await db.putLanguageMessageId(languageMessage.id, user.id)
	vote.upDownManager(languageMessage, user.id, threeDays, async () => {
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

exports.sendInviteMassage = sendInviteMassage;