const db = require('./dbPlayerManager');
const discord = require('./discordPlayerManager');
const messagem = require('./messageManager')


exports.upDownManager = function upDownManager(message, userId, ttl, upFunction, downFunction, ok = '✅', nok = '❎') {
	message.react(ok);
	message.react(nok);
	const upFilter = (reaction, user) => reaction.emoji.name === ok && user.id === userId;
	const downFilter = (reaction, user) => reaction.emoji.name === nok && user.id === userId;
	const upCollector = message.createReactionCollector(upFilter, { time: ttl });
	const downCollector = message.createReactionCollector(downFilter, { time: ttl });
	upCollector.on('collect', (r) => {
		exports.removeUpDownReactions(message, ok, nok);
		message.react('👌');
		upFunction();
	});
	downCollector.on('collect', (r) => {
		exports.removeUpDownReactions(message, ok, nok);
		downFunction();
	});
	downCollector.on('end', (collected) => {
		exports.removeUpDownReactions(message, ok, nok);
	});
}

exports.removeUpDownReactions = async function removeUpDownReactions(message, ok = '✅', nok = '❎') {
	if (message.reactions.cache.has(ok)) {
		await message.reactions.cache.get(ok).users.remove();
	}
	if (message.reactions.cache.has(nok)) {
		await message.reactions.cache.get(nok).users.remove();
	}
}