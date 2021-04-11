const db = require('./dbPlayerManager');
const moment = require('moment');

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