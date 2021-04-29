const db = require('./dbPlayerManager');
const discord = require('./discordPlayerManager');
const configs = require('./configs');
const banner = require('./bannerManager');
const mapm = require('./mapManager');
const local = require('./localization');
const moment = require('moment');
const messagem = require('./messageManager')
const commandsf = require('./commands')

exports.commands = {
    gather: {
        args: [
                {
                    type: 'int',
                    min: 2,
                    max: 8,
                    optional: true
                },
                {
                    type: 'int',
                    min: 1,
                    max: 500,
                    optional: true,
                    dependences: [
                        0
                    ]
                },
                {
                    type: 'int',
                    min: 3,
                    max: 500,
                    optional: true
                },
                {
                    type: 'string',
                    min: 3,
                    max: 256,
                    optional: true
                }
        ],
        rules: {
            bot: null,
            banned: false,
            added: true,
            invited: false,
            moderator: null,
            superuser: null,
            channel: 'common',
            name: 'user'
        },
        func: commandsf.gatherPlayersCommand
    },
    cancel: {
        args: [
                {
                    type: 'player',
                    number: 64,
                    bot: false,
                    banned: null,
                    added: false,
                    invited: true,
                    superuser: false,
                    moderator: false,
                    name: 'target'
                }
        ],
        rules: {
            bot: false,
            banned: false,
            added: true,
            invited: false,
            moderator: true,
            superuser: null,
            channel: 'common',
            name: 'user'
        },
        func: commandsf.cancelPlayerInvitationCommand
    },
    banned: {
        args: [],
        rules: {
            bot: false,
            banned: false,
            added: true,
            invited: false,
            moderator: null,
            superuser: null,
            channel: 'common',
            name: 'user'
        },
        func: commandsf.getBannedPlayersCommand
    },
    ban: {
        args: [
                {
                    type: 'player',
                    number: 1,
                    bot: null,
                    banned: false,
                    added: null,
                    invited: null,
                    superuser: false,
                    moderator: false,
                    name: 'target'
                },
                {
                    type: 'string',
                    min: 3,
                    max: 256,
                    optional: true
                }
        ],
        rules: {
            bot: false,
            banned: false,
            added: true,
            invited: false,
            moderator: true,
            superuser: null,
            channel: 'common',
            name: 'user'
        },
        func: commandsf.banPlayerCommand
    },
    unban: {
        args: [
                {
                    type: 'player',
                    number: 1,
                    bot: null,
                    banned: true,
                    added: null,
                    invited: null,
                    superuser: false,
                    moderator: false,
                    name: 'target'
                }
        ],
        rules: {
            bot: false,
            banned: false,
            added: true,
            invited: false,
            moderator: true,
            superuser: null,
            channel: 'common',
            name: 'user'
        },
        func: commandsf.unbanPlayerCommand
    },
    invited: {
        args: [],
        rules: {
            bot: false,
            banned: false,
            added: true,
            invited: false,
            moderator: null,
            superuser: null,
            channel: 'common',
            name: 'user'
        },
        func: commandsf.getInvitedPlayersCommand
    },
    invite: {
        args: [
                {
                    type: 'player',
                    number: 64,
                    bot: false,
                    banned: false,
                    added: false,
                    invited: false,
                    superuser: null,
                    moderator: null,
                    name: 'target'
                }
        ],
        rules: {
            bot: null,
            banned: false,
            added: true,
            invited: false,
            moderator: null,
            superuser: null,
            channel: 'common',
            name: 'user'
        },
        func: commandsf.invatePlayerCommand
    },
    remove: {
        args: [
                {
                    type: 'player',
                    number: 64,
                    bot: false,
                    banned: false,
                    added: true,
                    invited: false,
                    superuser: false,
                    moderator: false,
                    name: 'target'
                }
        ],
        rules: {
            bot: false,
            banned: false,
            added: true,
            invited: false,
            moderator: true,
            superuser: null,
            channel: 'common',
            name: 'user'
        },
        func: commandsf.removePlayerCommand
    },
    user: {
        args: [
                {
                    type: 'player',
                    number: 1,
                    bot: null,
                    banned: null,
                    added: null,
                    invited: null,
                    superuser: null,
                    moderator: null,
                    name: 'target'
                }
        ],
        rules: {
            bot: false,
            banned: false,
            added: true,
            invited: false,
            moderator: true,
            superuser: null,
            channel: 'common',
            name: 'user'
        },
        func: commandsf.getUserCommand
    },
    makemoderator: {
        args: [
                {
                    type: 'player',
                    number: 1,
                    bot: false,
                    banned: false,
                    added: true,
                    invited: false,
                    superuser: null,
                    moderator: false,
                    name: 'target'
                }
        ],
        rules: {
            bot: false,
            banned: false,
            added: true,
            invited: false,
            moderator: true,
            superuser: true,
            channel: 'common',
            name: 'user'
        },
        func: commandsf.makeModeratorCommand
    },
    unmakemoderator: {
        args: [
                {
                    type: 'player',
                    number: 1,
                    bot: false,
                    banned: false,
                    added: true,
                    invited: false,
                    superuser: null,
                    moderator: true,
                    name: 'target'
                }
        ],
        rules: {
            bot: false,
            banned: false,
            added: true,
            invited: false,
            moderator: true,
            superuser: true,
            channel: 'common',
            name: 'user'
        },
        func: commandsf.unmakeModeratorCommand
    },
    added: {
        args: [],
        rules: {
            bot: false,
            banned: false,
            added: true,
            invited: false,
            moderator: null,
            superuser: null,
            channel: 'common',
            name: 'user'
        },
        func: commandsf.getAddedPlayersCommand
    },
    add: {
        args: [
                {
                    type: 'player',
                    number: 1,
                    bot: false,
                    banned: false,
                    added: false,
                    invited: null,
                    superuser: null,
                    moderator: null,
                    name: 'target'
                }
        ],
        rules: {
            bot: false,
            banned: false,
            added: true,
            invited: false,
            moderator: true,
            superuser: null,
            channel: 'common',
            name: 'user'
        },
        func: commandsf.addCommand
    },
    
    maps: {
        args: [
            {
                type: 'int',
                min: 2,
                max: 8,
                optional: true
            },
        ],
        rules: {
            bot: false,
            banned: false,
            added: true,
            invited: false,
            moderator: null,
            superuser: null,
            channel: 'common',
            name: 'user'
        },
        func: commandsf.showMapsCommand
    },
    map: {
        args: [
            {
                type: 'int',
                min: 2,
                max: 8,
                optional: true
            },
            {
                type: 'int',
                min: 1,
                max: 500,
                optional: true
            },
        ],
        rules: {
            bot: false,
            banned: false,
            added: true,
            invited: false,
            moderator: null,
            superuser: null,
            channel: 'common',
            name: 'user'
        },
        func: commandsf.showMapCommand
    },
    join: {
        args: [],
        rules: {
            bot: false,
            banned: false,
            added: false,
            invited: null,
            moderator: null,
            superuser: null,
            channel: 'private',
            name: 'user'
        },
        func: commandsf.joinCommand
    },
    leave: {
        args: [],
        rules: {
            bot: false,
            banned: false,
            added: true,
            invited: null,
            moderator: null,
            superuser: null,
            channel: 'private',
            name: 'user'
        },
        func: commandsf.leaveCommand
    },
    help: {
        args: [],
        rules: {
            bot: false,
            banned: false,
            added: true,
            invited: null,
            moderator: null,
            superuser: null,
            channel: 'private',
            name: 'user'
        },
        func: commandsf.helpCommand
    },
    makemaps: {
        args: [],
        rules: {
            bot: false,
            banned: false,
            added: true,
            invited: null,
            moderator: true,
            superuser: null,
            channel: 'comman',
            name: 'user'
        },
        func: commandsf.makeMapsCommand
    },
    breaks: {
        args: [],
        rules: {
            bot: false,
            banned: false,
            added: true,
            invited: false,
            moderator: null,
            superuser: null,
            channel: 'cummon',
            name: 'user'
        },
        func: commandsf.getBreaksCommand
    },
    break: {
        args: [
            {
                type: 'int',
                min: 2,
                max: 999,
                optional: true
            },
        ],
        rules: {
            bot: false,
            banned: false,
            added: true,
            invited: false,
            moderator: null,
            superuser: null,
            channel: 'private',
            name: 'user'
        },
        func: commandsf.breakCommand
    },
    unbreak: {
        args: [],
        rules: {
            bot: false,
            banned: false,
            added: true,
            invited: false,
            moderator: null,
            superuser: null,
            channel: 'private',
            name: 'user'
        },
        func: commandsf.unbreakCommand
    },
    set_index: {
        args: [],
        rules: {
            bot: false,
            banned: false,
            added: true,
            invited: false,
            moderator: true,
            superuser: null,
            channel: 'common',
            name: 'user'
        },
        func: commandsf.setIndexesCommand
    },
    set_en_role: {
        args: [
            {
                type: 'role',
                optional: false
            }
        ],
        rules: {
            bot: false,
            banned: false,
            added: true,
            invited: false,
            moderator: true,
            superuser: null,
            channel: 'common',
            name: 'user'
        },
        func: commandsf.setEnRoleCommand
    },
    set_ru_role: {
        args: [
            {
                type: 'role',
                optional: false
            }
        ],
        rules: {
            bot: false,
            banned: false,
            added: true,
            invited: false,
            moderator: true,
            superuser: null,
            channel: 'common',
            name: 'user'
        },
        func: commandsf.setRuRoleCommand
    },
    set_moderator_role: {
        args: [
            {
                type: 'role',
                optional: false
            }
        ],
        rules: {
            bot: false,
            banned: false,
            added: true,
            invited: false,
            moderator: true,
            superuser: null,
            channel: 'common',
            name: 'user'
        },
        func: commandsf.setModeratorRoleCommand
    },
    evict: {
        args: [],
        rules: {
            bot: false,
            banned: false,
            added: true,
            invited: false,
            moderator: true,
            superuser: null,
            channel: 'common',
            name: 'user'
        },
        func: commandsf.leaveBotChannelCommand
    },
    home: {
        args: [],
        rules: {
            bot: false,
            banned: false,
            added: true,
            invited: false,
            moderator: true,
            superuser: null,
            channel: null,
            name: 'user'
        },
        func: commandsf.setBotChannelCommand
    },
    download: {
        args: [
            {
                type: 'int',
                min: 2,
                max: 8,
                optional: true
            },
            {
                type: 'int',
                min: 1,
                max: 500,
                optional: true
            },
        ],
        rules: {
            bot: false,
            banned: false,
            added: true,
            invited: false,
            moderator: null,
            superuser: null,
            channel: 'common',
            name: 'user'
        },
        func: commandsf.downloadMap
    },
}

const ruleCheckerMetaData = {
    superuser: {
        ruleName: "superuser",
        yes: "superuser",
        no: "notSuperuser",
        selector: async (user, rules) => (user.id === configs.superUserId) != rules.superuser
    },
    bot: {
        ruleName: "bot",
        yes: "bot",
        no: "notBot",
        selector: async (user, rules) => !!user.bot != rules.bot
    },
    banned: {
        ruleName: "banned",
        yes: "banned",
        no: "notBanned",
        selector: async (user, rules) => !!await db.findBannedPlayerById(user.id) != rules.banned
    },
    added: {
        ruleName: "added",
        yes: "added",
        no: "notAdded",
        selector: async (user, rules) => !!await db.findAddedPlayerById(user.id) != rules.added
    },
    invited: {
        ruleName: "invited",
        yes: "invitedot",
        no: "notInvited",
        selector: async (user, rules) => !!await db.findInvitedPlayerById(user.id) != rules.invited
    },
    moderator: {
        ruleName: "moderator",
        yes: "moderator",
        no: "notModerator",
        selector: async (user, rules) => discord.isPlayerModerById(user.id) != rules.moderator
    },
}
async function checkTargetPlayer(user, author, rules, channel) {
    for(metaName in ruleCheckerMetaData) {
        const meta = ruleCheckerMetaData[metaName];
        if(rules[meta.ruleName] != null && await meta.selector(user, rules)) {
            if(rules[meta.ruleName]) {
                messagem.sendMessage(author, 'titleBadPlayer', local.ruleMessagesSet.target[meta.yes], channel, user.tag);
                return 0;
            } else {
                messagem.sendMessage(author, 'titleBadPlayer', local.ruleMessagesSet.target[meta.no], channel, user.tag);
                return 0;
            }
        }
    }
    return 1;
}

async function checkUserPlayer(user, rules, channel) {
    for(metaName in ruleCheckerMetaData) {
        const meta = ruleCheckerMetaData[metaName];
        if(user.id === configs.superUserId) {
            return 1;
        }
        if(rules[meta.ruleName] != null && await meta.selector(user, rules)) {
            if(rules[meta.ruleName]) {
                messagem.sendMessage(user, 'titleBadAccess', local.ruleMessagesSet.user[meta.yes], channel);
                return 0;
            } else {
                messagem.sendMessage(user, 'titleBadAccess', local.ruleMessagesSet.user[meta.no], channel);
                return 0;
            }
        }
    }
    return 1;
}

function getLocalContent(user, translatePhrase, ...args) {
    let language = discord.getLanguageByUserId(user.id);
    if(!language) {
      language = 'en'
    }
    return local.translatePhrase(translatePhrase, args, language);
  }
  

function parseArguments(message, commandName, command, channelType) {
    let args = [];
    const content = message.content;
    const userMentions = message.mentions.users.array();
    // check for player arg passing
    if(command.args.length && command.args[0].name === 'player') {
        if(userMentions.length === 0) {
            messagem.sendCommandHint(message.author, commandName, channelType, 'hintArgAbsence');
            return 0;
        }
        if(userMentions > command.args[0].length) {
            messagem.sendCommandHint(message.author, commandName, channelType, 'hintManyPlayers');
            return 0;
        }
        if(userMentions.length > 1) {
            args = userMentions;
        }
    } 
    // do next if passed 1 or 0 player args
    if(userMentions.length < 2) {
        // processing args string
        let words = content.trim().split(" ");
        words = words.filter(item => item !== '');
        words.shift();
        // chaeck if args is enough
        if( (words.length != command.args.length && 
            command.args[command.args.length-1].type != "string") ||
            (words.length < command.args.length && 
            command.args[command.args.length-1].type === "string") ) {
            messagem.sendCommandHint(message.author, commandName, channelType, 'hintArgsNotEnough');
            return 0;
        }

        for(let i=0; i<command.args.length; i++) {
            // check if arg can be skipped
            if(command.args[i].optional === true) {
                if(words[i] === '-') {
                    args[i] = null;
                    continue;
                }
            }
            // check in one of previous arg can be required
            if(command.args[i].dependences) {
                for(let j=0; j<command.args[i].dependences.length; j++) {
                    if(!args[command.args[i].dependences[j]]) {
                        messagem.sendCommandHint(message.author, commandName, 
                            channelType, 'hintWrongAndRequiredArg', i+1, command.args[i].dependences[j]+1);
                        return 0;
                    }
                }
            }
            // check if passed one player
            if(command.args[i].type === "player") {
                if(!userMentions[0]) {
                    messagem.sendCommandHint(message.author, commandName, channelType, 'hintWrongArg', i+1);
                    return 0;
                }
                args[i] = userMentions[0];
            }
            // check if passed one role
            if(command.args[i].type === "role") {
                if(!message.mentions.roles.array()[0]) {
                    messagem.sendCommandHint(message.author, commandName, channelType, 'hintWrongArg', i+1);
                    return 0;
                }
                args[i] = message.mentions.roles.array()[0];
            }
            // check if passed int
            if(command.args[i].type === "int") {
                if(isNaN(words[i])) {
                    messagem.sendCommandHint(message.author, commandName, channelType, 'hintWrongArg', i+1);
                    return 0;
                }
                args[i] = parseInt(words[i]);
                if(args[i] < command.args[i].min || args[i] > command.args[i].max) {
                    messagem.sendCommandHint(message.author, commandName, channelType, 'hintWrongArg', i+1);
                    return 0;
                }
                args[i] = parseInt(words[i]);
            } else 
            // check if passed string
            if(command.args[i].type === "string") {
                function checkStringWordLength() {
                    if(args[i].length < command.args[i].min || args[i].length > command.args[i].max) {
                        messagem.sendCommandHint(message.author, commandName, channelType, 'hintWrongArg', i+1);
                        return 0;
                    }
                    return 1;
                }
                // check if string is in the end
                if(i === command.args.length - 1) {
                    if(i <= words.length - 1) {
                        args[i] = "";

                        for(let j=i; j < words.length; j++) {
                            args[i] += words[j] + ' ';
                        }
                        if(!checkStringWordLength()) {
                            return 0;
                        }
                    }
                // if string isnt in the end
                } else {
                    args[i] = words[i];
                    if(!checkStringWordLength()) {
                        return 0;
                    }
                }
            }
        }
    }
    return args;
}

exports.handleCommand = async function handleCommand(message) {
    // check for command -------------------------------------------------------
    for(const commandName in exports.commands) {
        //console.log(commandName)
        const commandString = `^-${commandName}`;
        const commandReg = new RegExp(commandString);
        if(message.content.match(commandReg)) {
            const command = exports.commands[commandName];
            let channelType;
            if(message.channel.id === discord.channelId) {
                channelType = 'common';
            } else if(!message.guild) {
                channelType = 'private';
            }
            // check for user access --------------------------------------------------
            if(!await checkUserPlayer(message.author, command.rules,  channelType)) {
                return;
            }
            // check for channel ----------------------------------------------------
            if(command.rules.channel != null) {
                switch(command.rules.channel) {
                    case 'common': {
                        if(channelType != 'common') {
                            messagem.sendMessage(message.author, 'titleBadChannel', 'onlyGuildChannel', channelType);
                            return;
                        }
                        break;
                    }
                    case 'private': {
                        if(channelType != 'private') {
                            messagem.sendMessage(message.author, 'titleBadChannel', 'onlyPrivateChannel', channelType);
                            return;
                        }
                        break;
                    }
                }
            }
            // parsing arguments ---------------------------------------------------
            const userMentions = message.mentions.users.array();
            const args = parseArguments(message, commandName, command, channelType);
            if(args === 0) {
                return;
            }
            //chack for target access
            for(let j=0; j<userMentions.length; j++) {
                if(!await checkTargetPlayer(userMentions[j], message.author, command.args[0], channelType)) {
                    return;
                }

            }

            console.log(args)
            if(userMentions.length) {
                for(let j=0; j<userMentions.length; j++) {
                    command.func(userMentions[j], args, message)
                }
            } else {
                message.react('👌');
                command.func(args, message)
            }

            break;
            
        }
    }
}