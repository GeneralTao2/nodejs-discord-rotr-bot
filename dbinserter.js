const db = require('./dbPlayerManager');
const moment = require('moment');

exports.addPlayer = async function addPlayer(user) {
	return await db.addPlayerData({
		discordId: user.id,
		tag: {
			name: user.username,
			discr: user.discriminator,
		},
		createdAt: new Date(),
	});
}

exports.invitePlayer = async function invitePlayer(inviationMessageId, languageMessageId, user, inviterId) {
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

exports.banPlayer = async function banPlayer(user, reason) {
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

exports.breakf = async function breakf(user, hours) {
    return await db.addBreak({
        discordId: user.id,
        tag: {
            name: user.username,
            discr: user.discriminator,
        },
        expireAt: moment(new Date()).add(hours, 'h').toDate(),
    });
}

exports.gather = async function gather(messageId, inviterUser, invitedUserList, gatherInvitationMessageIdList, time, playerQuantity, mapName) {
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
	for (let i = 0; i < invitedUserList.length; i++) {
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