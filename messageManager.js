const db = require('./dbPlayerManager');
const discord = require('./discordPlayerManager');
const local = require('./localization');


exports.sendMessageToUser = async function sendMessageToUser(user, title, phrase, ...args) {
    const lang = exports.getLang(user);

    const embed = new discord.MessageEmbed({
		color: '#b37700',
		title: local.translatePhrase(title, args, lang), 
		description: local.translatePhrase(phrase, args, lang),               
	});

    try {
        return await user.send(embed);
    } catch (error) {
        sendMessage(user, 'titleBadPlayer', 'errorBlocked', 'common')
        db.removeAddedPlayerById(user.id)
        db.removeInvitedPlayerById(user.id);
        return null;
    }
}

exports.sendMessageToChannel = async function sendMessageToChannel(user, title, phrase, ...args) {
    const lang = exports.getLang(user);

    const embed = new discord.MessageEmbed({
		color: '#b37700',
		title: local.translatePhrase(title, args, lang), 
		description: local.translatePhrase(phrase, args, lang),               
	});

    return await discord.currentChennel.send(embed);
}

exports.sendMessage = async function sendMessage(user, title, phrase, target, ...args) {
    const lang = exports.getLang(user);

    const embed = new discord.MessageEmbed({
		color: '#b37700',
		title: local.translatePhrase(title, args, lang), 
		description: local.translatePhrase(phrase, args, lang),               
	});

    switch(target) {
        case 'common': {
            discord.currentChennel.send(embed);
            break;
        }
        case 'private': {
            try {
                await user.send(embed);
            } catch (error) {
                sendMessage(user, 'titleBadPlayer', 'errorBlocked', 'common')
                db.removeAddedPlayerById(user.id)
                db.removeInvitedPlayerById(user.id);
            }
        }
    }

}

exports.sendSystemMessage = async function sendSystemMessage(phrase, ...args) {
    const embed = new discord.MessageEmbed({
		color: '#b55d3f',
		title: 'System message', 
		description: local.translatePhrase(phrase, args),               
	});

    return await discord.currentChennel.send(embed);
}

exports.sendCommandHint = async function sendCommandHint(user, commandName, target, error, ...args) {
    const language = exports.getLang(user);

    const embed = local.commandHint(commandName, language, error, args);
    switch(target) {
        case 'common': {
            discord.currentChennel.send(embed);
            break;
        }
        case 'private': {
            try {
                await user.send(embed);
            } catch (error) {
                sendMessage(user, 'titleBadPlayer', 'errorBlocked', 'common')
                db.removeAddedPlayerById(user.id)
                db.removeInvitedPlayerById(user.id);
            }
        }
    }
}

exports.getLang = function getLang(user) {
    let language = discord.getLanguageByUserId(user.id);
    if(!language) {
      language = 'en'
    }
    return language;
}