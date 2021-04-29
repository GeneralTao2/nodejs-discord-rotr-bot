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
const columnm = require('./columnManager')


exports.setGatherUpdateInterval = function setGatherUpdateInterval(message, inviterId, ttl) {
	const interval = setInterval(async () => {
		const newGatherData = await db.findGatherById(inviterId);
		let imejiList = [];
		for(let i=0; i<newGatherData.invitedPlayer.length; i++) {
			imejiList.push(newGatherData.invitedPlayer[i].accept);
		}
		const emojiColumn = await columnm.getEmojiColumn(imejiList);
		for(let i=0; i<emojiColumn.length; i++) {
			message.embeds[0].fields[i*2 + 1].value = emojiColumn[i];
		}
		message.embeds[0].image = {
			url: 'attachment://help.png',
		};
		message.edit(message.embeds[0]);
	}, 3000);
	setTimeout(() => {
		clearInterval(interval);
	}, ttl);
}

exports.sendInvitationToGathered = async function sendInvitationToGathered(user, inviter, attachment, comment, time) {
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
	vote.upDownManager(message, user.id, time * 60 * 1000, () => {
		db.updateGatherData(inviter.id, user.id, '✅');
	}, () => {
		db.updateGatherData(inviter.id, user.id, '❎');
	});
	return message.id;
}