const {MessageEmbed} = require('discord.js');



exports.about = function about(language) {
	const ru = new MessageEmbed({
		color: '#b6cbd1',
		title: "~~О боте~~ (обо мне)", 
		description: "Здравствуй, друг. Я - бот. Моя задача - облегчить сбор игроков в игры. Делается это посредством вызова специальной команды, о которой ты можешь узнать, набрав `-help` и последующей рассылки сообщений с приглашаниями. Для более комфортного использования моих услуг, были придуманы так же команды для админестрирования, чтобы злюки не спамили ботом всё и вся. Я всё ещё росту, поэтому сейчас нахожусь под наблюдением тестеров и разработчика.",               
		fields: [
			{
				name: 'Хочешь звать своих знакомых одной командой?', 
				value: 'Для этого тебе надо пригласить своего друга ко мне. Просто набери `-invite <player>...` и он уже сам решит, принять или отклонить.'
			},
			{
				name: 'Разработчик? Интересно?', 
				value: 'Если ты хочешь узнать, из чего я состою и как работаю, то можешь набрать команду `-superabout`.'
			},
		]
	  })
	const en = new MessageEmbed({
		color: '#b6cbd1',
		title: "~~About bot~~ about me", 
		description: "Hello Friend. I am a bot. My task is to facilitate the gathering of players into games. This is done by calling a special command, which you can find out about by typing `-help` and then sending messages with invitations. For a more comfortable use of my services, commands for administration were also invented, so that the spammers would not spam everything and everyone with the bot. I'm still growing, so I'm under the supervision of testers and a developer right now. ",               
		fields: [
			{
				name: 'Do you want to call your friends by one command? ', 
				value: 'To do this, you need to invite your friend to me. Just type `-invite <player> ...` and it will decide whether to accept or reject. '
			},
			{
				name: 'Developer? Intresting?', 
				value: 'If you want to know what I am made of and how I work, you can type the command `-superabout`.'
			},
		]
	  })

	return returnMessage(language, en, ru);
}

exports.superabout = function superabout(language) {
	const ru = new MessageEmbed({
		color: '#b6cbd1',
		title: "Так, ты реально заинтересовался", 
		description: "Меня разработал один... *пшш..*\nТак-с, тут я разберусь. На связи `GeneralTao#5693`. Этот бот - мой первый боле-менее средний проект, в котором я хотел бы получит опыт разработки ботов, программирования на js. Разумеется, чтобы в конце получить что-то полезное. Разрабатываю бота, наверное, с начала 2021 года. ",               
		fields: [
			{
				name: 'Язык программирования', 
				value: 'Как уже написал, написал бота на nodejs. Пока-что мой проект лишен нормального стиля и комментариев, поэтому разбираться в нём пока бесполезно.'
			},
			{
				name: 'База данных', 
				value: 'Использую mongodb в качестве базы данных. Там хранятся списки игроков, пометки и конфигурация. Пока-что использую бесплатные 220 Кб. Думаю, на первое время хватит.'
			},
			{
				name: 'Сервер', 
				value: 'Купил сервер на FirstByte за 55 руб. в месяц. Intel Xeon E5-2650, 512 Мб RAM, 7 Гб SSD, трафик 7 Тб, Ubuntu 20.04. Самый дешёвый сервер.'
			},
			{
				name: 'Карты', 
				value: 'Частично реализован менеджер карт. Можно выводит картинку и информацию о карте в сообщения. На сервер предварительно загружен набор карт и MapCache.ini с их информацией.'
			},
			{
				name: 'GitHub', 
				value: 'Проект можно найти по ссылке на GitHub: https://github.com/GeneralTao2/nodejs-discord-rotr-bot .'
			},
			{
				name: 'Помощь', 
				value: 'Пока-что мой проект не имеет презентабельного вида, поэтому помощи в разработке не прошу.'
			},
		]
	  })
	  const en = new MessageEmbed({
		color: '#b6cbd1',
		title: "So, you're really interested", 
		description: "I was developed by one... *pshh..*\n So, I'll figure it out here. This is `GeneralTao#5693`. This bot is my first more or less average project, in which I would like to gain experience in developing bots, programming in js. Of course, in order to get something useful at the end. I have been developing a bot, probably since the beginning of 2021.",               
		fields: [
			{
				name: 'Programming language', 
				value: 'As I already wrote, I wrote a bot on nodejs. So far, my project is devoid of normal style and comments, so it is useless to understand it yet.'
			},
			{
				name: 'Data base', 
				value: 'I use mongodb as a database. It stores player lists, notes, and configuration. So far, I use free 220 Kb. I think that\'s enough for the first time.'
			},
			{
				name: 'Server', 
				value: 'I bought a server on FirstByte for 55 rubles a month. Intel Xeon E5-2650, 512 MB RAM, 7 GB SSD, 7 TB traffic, Ubuntu 20.04. The cheapest server.'
			},
			{
				name: 'Maps', 
				value: 'Partially implemented by the card Manager. You can display a picture and information about the map in messages. A set of maps and MapCache.ini with their information are preloaded to the server.'
			},
			{
				name: 'GitHub', 
				value: 'The project can be found at the link on GitHub: https://github.com/GeneralTao2/nodejs-discord-rotr-bot .'
			},
			{
				name: 'Contribution', 
				value: 'So far, my project does not have a presentable appearance, so I do not ask for help in developing it yet.'
			},
		]
	  })
	  return returnMessage(language, en, ru);
}

exports.translatePhrase = function translatePhrase(phrase, data, lang = 'en') {
    return phrases[phrase][lang](data)
}
exports.EnRuPhrase = function translatePhrase(phrase, data) {
    return phrases[phrase]['en'](data) + ' | '+ phrases[phrase]['ru'](data)
}

exports.translateHelpEmbed = function translateHelpEmbed(embed, lang = 'en') {
    return helpEmbeds[embed](lang)
}

exports.translateInfoEmbed = function translateInfoEmbed(embed, lang = 'en') {
    return infoEmbeds[embed][lang]
}

function commandField(command, lang = 'en', inline = false) {
	let array = [
		{
			name: commands[command]['command'],
			value: commands[command][lang],
			inline: false
		}
	];
	if(commands[command].args) {
		for(const arg in commands[command].args) {
			array.push(
				{
					name: commands[command]['args'][arg]['command'],
					value:  commands[command]['args'][arg][lang],
					inline: true
				}
			)
		}
	}
    return array;
}

exports.commandHint = function commandHint(commandName, lang, error, args) {
	return new MessageEmbed({
		color: '#b37700',
		title: phrases['hint'][lang](), 
		description: phrases[error][lang](args) + '\n' + phrases['hintDescription'][lang](),               
		fields: commandField(commandName, lang),
	})
}

const commands = {
	//==================== MODERATOR========================================================
	remove: {
		command: '-remove `<player>...`',
		ru: "Удалить одного или нескольких игроков из группу.",
		en: "Remove one or more players from group.",
		args: {
			player: {
				command: '`<player>`',
				ru: "Упоминание о игроке в формате @никнейм.",
				en: "Mention about player in format @nickname."
			},
		}
	},
	cancel: {
		command: '-cancel `<player>...`',
		ru: "Отменить приглашения в группу одного или нескольких игроков.",
		en: "Cancel invitiation of one or more users.",
		args: {
			player: {
				command: '`<player>`',
				ru: "Упоминание о игроке в формате @никнейм.",
				en: "Mention about player in format @nickname."
			}
		}
	},
	ban: {
		command: '-ban `<player>` `<reason>`',
		ru: "Забанить одного или нескольких игроков из группы. Игроки будут удалены из группы и не смогут в неё вступить.",
		en: "Bun one or more players from group. Players will be also removed from group.",
		args: {
			player: {
				command: '`<player>`',
				ru: "Упоминание о игроке в формате @никнейм.",
				en: "Mention about player in format @nickname."
			},
			reason: {
				command: '`<reason>`',
				ru: "Причина бана игрока в текстовой форме. От 2 до 256 символов.",
				en: "Ban reason of players. From 2 to 256 characters."
			},
		}
	},
	unban: {
		command: '-unban `<player>...`',
		ru: "Разбанить одного или нескольких игроков.",
		en: "Unban one or more players.",
		args: {
			player: {
				command: '`<player>`',
				ru: "Упоминание о игроке в формате @никнейм.",
				en: "Mention about player in format @nickname."
			},
		}
	},
	add: {
		command: '-add `<player>...`',
		ru: "Добавляет одного или несколько игроков в группу.",
		en: "Add onw or more users to group.",
		args: {
			player: {
				command: '`<player>`',
				ru: "Упоминание о игроке в формате @никнейм.",
				en: "Mention about player in format @nickname."
			},
		}
	},
	moderator: {
		command: '-moderator `<player>...`',
		ru: "Даёт одному или нескольким игрокам роль модератора бота.",
		en: "Give for one or more players moderator role.",
		args: {
			player: {
				command: '`<player>`',
				ru: "Упоминание о игроке в формате @никнейм.",
				en: "Mention about player in format @nickname."
			},
		}
	},
	unmoderator: {
		command: '-unmoderator `<player>...`',
		ru: "Забирает у одного или нескольких игроков роль модератора бота.",
		en: "Take away from one or more players moderator role.",
		args: {
			player: {
				command: '`<player>`',
				ru: "Упоминание о игроке в формате @никнейм.",
				en: "Mention about player in format @nickname."
			},
		}
	},
	user: {
		command: '-user `<player>`',
		ru: "Выводит JSON объект пользователя",
		en: "Outputs user JSON object.",
		args: {
			player: {
				command: '`<player>`',
				ru: "Упоминание о игроке в формате @никнейм.",
				en: "Mention about player in format @nickname."
			}
		}
	},

	//==================== PLAYER =========================================================
	gather: {
		command: '-gather `<player_quantity>` `<map_number>` `<time>` `<comment>`',
		ru: "Собрать игроков в игру, отправив им приглашения.",
		en: "Gather players to the game, sending them invitation message.",
		args: {
			player_quantity: {
				command: '`<player_quantity>`',
				ru: "Количество игроков на карте от 2 до 8, либо `-`, если `map_number` тоже `-`.",
				en: "Player quantity on the map from 2 to 8, or `-`, if `map_number` also `-`."
			},
			map_number: {
				command: '`<map_number>`',
				ru: "Порядковый намер карты из списка карт с определённым количеством игроков, либо `-`.",
				en: "The sequential number of the map from `-maps` with a certain number of players, or `-`. You can find it using"
			},
			time: {
				command: '`<time>`',
				ru: "Время, которое собрание будет действительным. В минутах, от 2 до 60, либо `-`.",
				en: "The time that the meeting will be valid. In minutes, from 2 to 60, or `-`."
			},
			comment: {
				command: '`<comment>`',
				ru: "Комментарий, который будет приложен к приглашению. От 3 до 256 символов, либо `-`.",
				en: "The comment that will be attached to the invitation. From 3 to 256 characters, or `-`."
			},
		}
	},
	maps: {
		command: '-maps `<player_quantity>`',
		ru: "Выводит коллаж из имеющихся карт на определённое количество игроков.",
		en: "Displays a collage of available maps by certain number of players.",
		args: {
			player_quantity: {
				command: '`<player_quantity>`',
				ru: "Количество игроков на карте от 2 до 8.",
				en: "Player quantity on the map from 2 to 8."
			},
		}
	},
	map: {
		command: '-map `<player_quantity>` `<map_number>`',
		ru: "Выводит картинку и информацию о карте.",
		en: "Dispay picture and information of map.",
		args: {
			player_quantity: {
				command: '`<player_quantity>`',
				ru: "Количество игроков на карте от 2 до 8.",
				en: "Player quantity on the map from 2 to 8."
			},
			map_number: {
				command: '`<map_number>`',
				ru: "Порядковый намер карты из списка карт с определённым количеством игроков.",
				en: "The sequential number of the map from the list of maps with a certain number of players."
			},
		}
	},
	download: {
		command: '-download `<player_quantity>` `<map_number>`',
		ru: "Отправляет архив с картой для скачивания.",
		en: "Send archive with map for downloading.",
		args: {
			player_quantity: {
				command: '`<player_quantity>`',
				ru: "Количество игроков на карте от 2 до 8.",
				en: "Player quantity on the map from 2 to 8."
			},
			map_number: {
				command: '`<map_number>`',
				ru: "Порядковый намер карты из списка карт с определённым количеством игроков.",
				en: "The sequential number of the map from the list of maps with a certain number of players."
			},
		}
	},
	invite: {
		command: '-invite `<player>...`',
		ru: "Пригласить одного или несколькоих игроков в группу для использования бота.",
		en: "Invite one or more players to group, for bot using.",
		args: {
			player: {
				command: '`<player>`',
				ru: "Упоминание о игроке в формате @никнейм.",
				en: "Mention about player in format @nickname."
			},
		}
	},
	added: {
		command: '-added',
		ru: "Показывает список добавленных в группу игроков.",
		en: "Show the list of added players."
	},
	invited: {
		command: '-invited',
		ru: "Показывает список приглашённых в группу игроков.",
		en: "Show the list of invited players."
	},
	banned: {
		command: '-banned',
		ru: "Показывает список забаненых в группе игроков.",
		en: "Show the list of banned players."
	},
	breaks: {
		command: '-breaks',
		ru: "Показывает список игроков в группе с перерывом.",
		en: "Shows a list of players in a group with a break."
	},
	break: {
		command: '🔸-break `<hours>`',
		ru: "Нужен перерыв? Отключает возможность звать тебя в игры на определённое количество часов.",
		en: "Need a break? Disables the ability to invite you to games for a specified number of hours. Command only works in private messages with a bot. "
	},
	breack_hours: {
		command: '`<hours>`',
		ru: "Количество часов от 1 до 99.",
		en: "The number of hours is from 1 to 99. "
	},
	unbreak: {
		command: '🔸-unbreak',
		ru: "Отменяет текущий перерыв.",
		en: "Cancels the current break. "
	},
	join: {
		command: '🔸-join',
		ru: "Вступить в группу.",
		en: "Join to group. "
	},
	leave: {
		command: '🔸-leave',
		ru: "Покинуть группу.",
		en: "Leave from group. "
	},
	help: {
		command: '🔸-help',
		ru: "Показывает список команд, которые можно использовать.",
		en: "Show list of commands you can use. "
	},
	about: {
		command: '🔸-about',
		ru: "Выодит информацию о боте.",
		en: "Displays information about the bot. "
	},
	superabout: {
		command: '🔸-superabout',
		ru: "Выводит более детальную информацию о боте.",
		en: "Displays more detailed information about the bot. "
	},

	//==================== CONFIGS ========================================================
	set_indexes: {
		command: "-set_indexes",
		ru: "Проводит некоторую настройку базы данных. Обычно настраивается само, если бот был приглашён в сеть будучи онлайн. В противном случае необходимо вызвать эту команду.",
		en: "Performs some configuration of the database. Usually it is configured on its own if the bot was invaded into the network while online. Otherwise, you must invoke this command. "
	},
	set_ru_role: {
		command: "-set_ru_role `<role>`",
		ru: "Регистрирует либо заменяет роль для русскоязычных пользователей. В случае отсутсвия все сообщения будут на английском языке.",
		en: "Registers or replaces the role for Russian-speaking users. If missing, all messages will be in English. ",
		args: {
			role: {
				command: "`<role>`",
				ru: "Упоминание роли в формате @роль.",
				en: "Mention role in format @role."
			},
		}
	},
	set_en_role: {
		command: "-set_en_role `<role>`",
		ru: "Регистрирует либо заменяет роль для англоязычных пользователей. В случае отсутсвия все сообщения будут на английском языке.",
		en: "Registers or replaces a role for English speaking users. If missing, all messages will be in English.",
		args: {
			role: {
				command: "`<role>`",
				ru: "Упоминание роли в формате @роль.",
				en: "Mention role in format @role."
			},
		}
	},
	set_moderator_role: {
		command: "-set_moderator_role `<role>`",
		ru: "Заменяет роль для модераторов. Регистрация возможна только автору бота.",
		en: "Replaces the role for moderators. Registration is possible only for the author of the bot.",
		args: {
			role: {
				command: "`<role>`",
				ru: "Упоминание роли в формате @роль.",
				en: "Mention role in format @role."
			},
		}
	},
	home: {
		command: "-home",
		ru: "Прикрепляет бота к определённому текстовому каналу, где им можно пользоваться. Возможно только если у бота нет зарегистрированного текстовго канала.",
		en: "Attaches the bot to a specific text channel where it can be used. This is possible only if the bot does not have a registered text channel."
	},
	evict: {
		command: "-evict",
		ru: "Открепляет бота от текстовго канала. После вызова команды бота можно вновь прикрепить к какому-то текстовому каналу.",
		en: "Detaches the bot from the text channel. After calling the command, the bot can be reattached to some text channel."
	}
}


const phrases = {
	invitation: {
		ru: (args) => `Привет! Я - менеджер сообщества ROTR BP. Моя главная задача - собирать людей на игры. **${args[0]}** пригласил тебя. Ты можешь принять или отклонить приглашение. Если ты примешь, тогда сможешь собирать и быть собранным другими игроками.\nПроголосуй ✅ или ❎ чтобы принять или отказаться.`,
		en: (args) => `Hello! I am ROTR BP community player manager. My main goal is to gover players from ROTR discord network to game. \n**${args[0]}** invited you, so you can accept or refuce. If you accept you will be able to gather peaple and be gathered to games.\nVote ✅ or ❎ to accept or reject.`
	},
	removeing: {
		ru: (args) => `Игрок \`${args[0]}\` удалил тебя из пользователей бота.`,
		en: (args) => `Player \`${args[0]}\` removed you from bot users.`
	},
	canceling: {
		ru: (args) => `Приглашение было отменено.`,
		en: (args) => `Your invitation was canceled.`
	},
	banning: {
		ru: (args) => `Ты был забанен игроком \`${args[0]}\`. Причина: \`${args[1]}\`.`,
		en: (args) => `You was banned by \`${args[0]}\`. Reason: \`${args[1]}\`.`
	},
	unbanning: {
		ru: (args) => `Ты был разбанен игроком \`${args[0]}\`. Теперь ты можешь вступить к нам набрав \`-join\`.`,
		en: (args) => `You was unbanned by \`${args[0]}\`. Now you can join us, typing \`-join\`.`	
	},
	adding: {
		ru: (args) => `Отлично, теперь ты вступил в наши ряды. Чтобы просмотреть набор комманд набери \`-help\`.`,
		en: (args) => `Excellent, now you joined to us. To show my commands type \`-help\`.`	
	},
	titleRejection: {
		ru: (args) => `Печаль`,
		en: (args) => `Sadness`
	},
	rejection: {
		ru: (args) => `Очень жаль, но ничего страшного. Если передумаешь, то просто набери \`-join\`.`,
		en: (args) => `I\'m sorry, but it's okay. If you change your mind, just type \` -join\``
	},
	addingTwice: {
		ru: (args) => `Нельзя добавить себя дважды.`,
		en: (args) => `You can't add yourself twice.`
	},
	wasInvitedToGame: {
		ru: (args) => `Ты был приглашён в игру!`,
		en: (args) => `You were invited to the game!`
	},
	noComment: {
		ru: (args) => `Комментария нет.`,
		en: (args) => `No comment.`
	},
	gatherMessageFooter: {
		ru: (args) => `Жми на ✅ или ❎ чтобы принять или отказаться. До`,
		en: (args) => `Vote ✅ or ❎ to accept or cancel. Gathering is valid until`
	},
	gather: {
		ru: (args) => `Собрание`,
		en: (args) => `Gather`
	},
	missngBreak: {
		ru: (args) => `У тебя нет перерывов.`,
		en: (args) => `You don't have breaks.`
	},
	playerCommandName: {
		ru: (args) => "Игроки",
		en: (args) => "Players"
	},
	playerCommandDescription: {
		ru: (args) => "Эти команды доступны всем игрокам в группе.",
		en: (args) => "These commands can use any group member."
	},
	moderatorCommandName: {
		ru: (args) => "Модераторы",
		en: (args) => "Moderators"
	},
	moderatorCommandDescription: {
		ru: (args) => "Эти команды доступны только игрокам с ролью `Bot Moderator`.",
		en: (args) => "These commands can use only members that have `Bot Moderator` role."
	},
	configCommandName: {
		ru: (args) => "Конфигурации",
		en: (args) => "Configurations"
	},
	configCommandDescription: {
		ru: (args) => "Эти команды доступны только игрокам с ролью `Bot Moderator`. Предназначены для первоначальной настройки бота после вступлнения в сеть.",
		en: (args) => "These commands are only available to players with the `Bot Moderator` role. Designed for initial configuration of the bot after joining the network. "
	},
	playerCommandFooter: {
		ru: (args) => '🔸 - команда доступна только в личных сообщениях с ботом.\nПри наборе команды писать `<` и `>` не надо.\nЭту информацию можно так же найти в закреплённых сообщения текстового канала.',
		en: (args) => '🔸 - the command is only available in private messages with bot.\nUsing a command no need to write `<` and `>`.\nYou can alco find this information in the text channel pinned messages.'
	},
	onlyGuildChannel: {
		ru: (args) => `Команда может быть вызвана только на сервере, в текстовом канале для бота.`,
		en: (args) => `Command can be invoked only in server, in bot's text channel.`
	},
	onlyPrivateChannel: {
		ru: (args) => `Команда может быть вызвана только в личных сообщениях с ботом.`,
		en: (args) => `Command can be invoked only in personal messages with bot.`
	},
	userAdded: {
		ru: (args) => `Ты не вступил в группу бота, поэтому не можешь вызвать команду. Чтобы увступить напиши \`-join\` мне в личные сообщения.`,
		en: (args) => `You have not joined the bot group, so you can't invoke the command. To join, write \`-join\` to me in private messages.`
	},
	userNotAdded: {
		ru: (args) => `Эту команду может вызывать только игрок, не находящийся в группе бота.`,
		en: (args) => `Only not added player can invoke this command.`
	},
	userInvited: {
		ru: (args) => `Только приглашённые в группу бота игроки могут вызвать эту команду`,
		en: (args) => `Only players invited to the bot group can call this team.`
	},
	userNotInvited: {
		ru: (args) => `Только не приглашённые в группу бота игроки могут вызвать эту команду`,
		en: (args) => `Only players not invited to the bot group can call this command.`
	},
	userBot: {
		ru: (args) => `Эту команду могут вызвать только боты.`,
		en: (args) => `Only bots can invoke this command.`
	},
	userNotBot: {
		ru: (args) => `Эту команду не могут вызывать боты.`,
		en: (args) => `Bots can not invoke this command.`
	},
	userBanned: {
		ru: (args) => `Эту команду могут вызвать только забаненные игроки.`,
		en: (args) => `Only banned players can invoke this command.`
	},
	userNotBanned: {
		ru: (args) => `Эту команду могут вызвать только не забаненные игроки.`,
		en: (args) => `Only not banned players can invoke this command.`
	},
	userModerator: {
		ru: (args) => `Эту команду могут вызвать только модераторы.`,
		en: (args) => `Only moderators can invoke this command.`
	},
	userNotModerator: {
		ru: (args) => `Эту команду не могут вызвать модераторы.`,
		en: (args) => `Moderators can not invoke this command.`
	},
	userSuperuser: {
		ru: (args) => `Эту команду могут вызвать только суперпользователь.`,
		en: (args) => `Only superuser can invoke this command.`
	},
	userNotSuperuser: {
		ru: (args) => `Эту команду может вызвать суперпользователь.`,
		en: (args) => `Superuser can not invoke this command.`
	},
	targetAdded: {
		ru: (args) => `Эта команда может быть произведена только над добавленными игрокам. Игрок \`${args[0]}\` не добавлен.`,
		en: (args) => `This command can only be performed on the added players. Player \`${args[0]}\` not added.`
	},
	targetNotAdded: {
		ru: (args) => `Эта команда не может быть произведена над добавленными игрокам. Игрок \`${args[0]}\` добавлен.`,
		en: (args) => `This command cannot be performed on the added players. Player \`${args[0]}\` added.`
	},
	targetInvited: {
		ru: (args) => `Эта команда может быть произведена только над приглашенными игрокам. Игрок \`${args[0]}\` не приглашён.`,
		en: (args) => `This command can only be performed on the invited players. Player \`${args[0]}\` not invited.`
	},
	targetNotInvited: {
		ru: (args) => `Эта команда не может быть произведена над приглашенными игрокам. Игрок \`${args[0]}\` приглашён.`,
		en: (args) => `This command cannot be performed on the invited players. Player \`${args[0]}\` invited.`
	},
	targetBot: {
		ru: (args) => `Эта команда может быть произведена только над ботами. Игрок \`${args[0]}\` не бот.`,
		en: (args) => `This command can only be performed on the bot. Player \`${args[0]}\` is not bot.`
	},
	targetNotBot: {
		ru: (args) => `Эта команда не может быть произведена над ботами. Игрок \`${args[0]}\` бот.`,
		en: (args) => `This command cannot be performed on the bot. Player \`${args[0]}\` is bot.`
	},
	targetBanned: {
		ru: (args) => `Эта команда может быть произведена только над забаненными игрокам. Игрок \`${args[0]}\` не забанен.`,
		en: (args) => `This command can only be performed on the banned players. Player \`${args[0]}\` not banned.`
	},
	targetNotBanned: {
		ru: (args) => `Эта команда не может быть произведена над приглашенными игрокам. Игрок \`${args[0]}\` забанен.`,
		en: (args) => `This command cannot be performed on the banned players. Player \`${args[0]}\` banned.`
	},
	targetModerator: {
		ru: (args) => `Эта команда может быть произведена только над модераторами. Игрок \`${args[0]}\` не модератор.`,
		en: (args) => `This command can only be performed on the moderators. Player \`${args[0]}\` is not moderator.`
	},
	targetNotModerator: {
		ru: (args) => `Эта команда не может быть произведена над модераторами игрокам. Игрок \`${args[0]}\` модератор.`,
		en: (args) => `This command cannot be performed on the moderators. Player \`${args[0]}\` is moderator.`
	},
	targetSuperuser: {
		ru: (args) => `Эта команда может быть произведена только над суперпользователь. Игрок \`${args[0]}\` не суперпользователь.`,
		en: (args) => `This command can only be performed on the superuser. Player \`${args[0]}\` is not superuser.`
	},
	targetNotSuperuser: {
		ru: (args) => `Эта команда не может быть произведена над суперпользователем. Игрок \`${args[0]}\` суперпользователь.`,
		en: (args) => `This command cannot be performed on the superuser. Player \`${args[0]}\` is superuser.`
	},
	hint: {
		ru: (args) => `Подсказка`,
		en: (args) => `Hint`
	},
	hintDescription: {
		ru: (args) => `Вот описание команды:`,
		en: (args) => `Here is description of command:`
	},
	hintArgAbsence: {
		ru: (args) => `Где аргументы? А ну ка..`,
		en: (args) => `Where are arguments? Add them!`
	},
	hintManyPlayers: {
		ru: (args) => `Слишком много игроков. ...Или ты спамер?!`,
		en: (args) => `Too many players. ...Or ara you spammer?!`
	},
	hintArgsNotEnough: {
		ru: (args) => `Недостаточно аргументов. Давай ещё больше!`,
		en: (args) => `Not enough arguments. Give me more!`
	},
	hintWrongArg: {
		ru: (args) => `Неверный ${args[0]} аргумент.`,
		en: (args) => `Wrong ${args[0]} argument.`
	},
	hintWrongAndRequiredArg: {
		ru: (args) => `Аргумент ${args[0]} не может быть использован, если отсутствует аргумент ${args[1]}.`,
		en: (args) => `Argument ${args[0]} can't be used, beacouse argument ${args[1]} is abscent.`
	},
	errorBlocked: {
		ru: (args) => `Игрок \`${args[0]}\` заблокировал меня. Почему бы и мне его не заблокировать?).`,
		en: (args) => `Player \`${args[0]}\` have blocked me. So, I will block him to)..`
	},
	titleBadAccess: {
		ru: (args) => `Ошибка доступа`,
		en: (args) => `Access error`
	},
	titleBadPlayer: {
		ru: (args) => `Ошибка цели`,
		en: (args) => `Target error`
	},
	langConfirmation: {
		ru: (args) => `Error`,
		en: (args) => `Всё нормально, это не спам, я из ROTR. Во-первых, на каком языке мне тебе лучше писать? Нажми на соответствующее эмодзи внизу.\n\nI\'m from ROTR. First, which language should I write for you? Press to corresponding emoji in the bottom.`
	},
	titleLangConfirmation: {
		ru: (args) => `Error`,
		en: (args) => `Подтверждение языка | Language confirmation`
	},
	systemInviteRejection: {
		ru: (args) => `Error`,
		en: (args) => `Player \`${args[0]}\` rejected invitation to gruop.`
	},
	systemInviteAcception: {
		ru: (args) => `Error`,
		en: (args) => `Player \`${args[0]}\` added to gruop.`
	},
	titleInvitation: {
		ru: (args) => `Есть кто дома?`,
		en: (args) => `Anyone home?`
	},
	titleBadChannel: {
		ru: (args) => `Плохой канал`,
		en: (args) => `Bad channel`
	},
	titleBegin: {
		ru: (args) => `Давай же начнём!`,
		en: (args) => `Let's begin!`
	},
	titleCanceling: {
		ru: (args) => `Упс..`,
		en: (args) => `Oops..`
	},
	titleBan: {
		ru: (args) => `Очень плохо`,
		en: (args) => `Vary bad`
	},
	moderRoleCreated: {
		ru: (args) => `Error`,
		en: (args) => `Role <@&${args[0]}> created for moderaor.`
	},
	noSushMap: {
		ru: (args) => `Мда, похоже, у меня нет такой карты.`,
		en: (args) => `Oh, I dont\'t have so map.`
	},
	haveBreak: {
		ru: (args) => `У тебя уже есть время перерыва: \`${args[0]}\`.`,
		en: (args) => `You alredy have break time: \`${args[0]}\`.`
	},
	indexLogs: {
		ru: (args) => `Error`,
		en: (args) => args[0]
	},
	roleChanged: {
		ru: (args) => `Error`,
		en: (args) => `Role <@&${args[0]}> changed to <@&${args[1]}>.`
	},
	roleRegistered: {
		ru: (args) => `Error`,
		en: (args) => `Role registrated.`
	},
	toHome: {
		ru: (args) => `Error`,
		en: (args) => `Yee boy. Now it is my home!\nDon't forget to create moderator role by using \`-makemoderator <player>...\`.`
	},
	dontHaveHome: {
		ru: (args) => `Error`,
		en: (args) => `Man, I event don't have home.`
	},
	haveHome: {
		ru: (args) => `Error`,
		en: (args) => `Man, I already have home. But actually to have two homes is not so bad :)`
	},
	fromHome: {
		ru: (args) => `Error`,
		en: (args) => `Oh no!... But although, will you give me the new home? Just use \`-home\`.`
	},
	notInPersonal: {
		ru: (args) => `Лучше набрать эту команду на канале сервера.`,
		en: (args) => `Better enter this command in the server channel.`
	},
	alreadyGathered: {
		ru: (args) => `Ты уже собрал игроков. Подожди \`${args[0]}:${args[0]}\` минут.`,
		en: (args) => `You already gathered players. Wait \`${args[0]}:${args[0]}\` minutes.`
	},
	sameGather: {
		ru: (args) => `Кто-то уже создал такое-же собрание.`,
		en: (args) => `The same gather already exists.`
	},
	gatheredPlayers: {
		ru: (args) => `Собираемые игроки`,
		en: (args) => `Gathered players`
	},
	state: {
		ru: (args) => `Состояние`,
		en: (args) => `State`
	},
	gatherPrew: {
		ru: (args) => `Твое собрание будет выглядеть так:`,
		en: (args) => `Your invitation will look like`
	},
	vote: {
		ru: (args) => `Нажми ✅ или ❎ чтобы продолжить или отменить.`,
		en: (args) => `Vote ✅ or ❎ to continue or cancel.`
	},
	leaved: {
		ru: (args) => `Error`,
		en: (args) => `Player \`${args[0]}\` left from bot group.`
	},
}


const infoEmbeds = {
	about: {
		ru: new MessageEmbed({
			color: '#b6cbd1',
			title: "~~О боте~~ (обо мне)", 
			description: "Здравствуй, друг. Я - бот. Моя задача - облегчить сбор игроков в игры. Делается это посредством вызова специальной команды, о которой ты можешь узнать, набрав `-help` и последующей рассылки сообщений с приглашаниями. Для более комфортного использования моих услуг, были придуманы так же команды для админестрирования, чтобы злюки не спамили ботом всё и вся. Я всё ещё росту, поэтому сейчас нахожусь под наблюдением тестеров и разработчика.",               
			fields: [
				{
					name: 'Хочешь звать своих знакомых одной командой?', 
					value: 'Для этого тебе надо пригласить своего друга ко мне. Просто набери `-invite <player>...` и он уже сам решит, принять или отклонить.'
				},
				{
					name: 'Разработчик? Интересно?', 
					value: 'Если ты хочешь узнать, из чего я состою и как работаю, то можешь набрать команду `-superabout`.'
				},
			]
		  }),
		en: new MessageEmbed({
			color: '#b6cbd1',
			title: "~~About bot~~ about me", 
			description: "Hello Friend. I am a bot. My task is to facilitate the gathering of players into games. This is done by calling a special command, which you can find out about by typing `-help` and then sending messages with invitations. For a more comfortable use of my services, commands for administration were also invented, so that the spammers would not spam everything and everyone with the bot. I'm still growing, so I'm under the supervision of testers and a developer right now. ",               
			fields: [
				{
					name: 'Do you want to call your friends by one command? ', 
					value: 'To do this, you need to invite your friend to me. Just type `-invite <player> ...` and it will decide whether to accept or reject. '
				},
				{
					name: 'Developer? Intresting?', 
					value: 'If you want to know what I am made of and how I work, you can type the command `-superabout`.'
				},
			]
		})
	},
	superabout: {
		ru: new MessageEmbed({
			color: '#b6cbd1',
			title: "Так, ты реально заинтересовался", 
			description: "Меня разработал один... *пшш..*\nТак-с, тут я разберусь. На связи `GeneralTao#5693`. Этот бот - мой первый боле-менее средний проект, в котором я хотел бы получить опыт разработки ботов, программирования на js. Разумеется, чтобы в конце получить что-то полезное. Разрабатываю бота, наверное, с начала 2021 года. ",               
			fields: [
				{
					name: 'Язык программирования', 
					value: 'Как уже написал, написал бота на nodejs. Пока-что мой проект лишен нормального стиля и комментариев, поэтому разбираться в нём пока бесполезно.'
				},
				{
					name: 'База данных', 
					value: 'Использую mongodb в качестве базы данных. Там хранятся списки игроков, пометки и конфигурация. Пока-что использую бесплатные 220 Кб. Думаю, на первое время хватит.'
				},
				{
					name: 'Сервер', 
					value: 'Купил сервер на FirstByte за 55 руб. в месяц. Intel Xeon E5-2650, 512 Мб RAM, 7 Гб SSD, трафик 7 Тб, Ubuntu 20.04. Самый дешёвый сервер.'
				},
				{
					name: 'Карты', 
					value: 'Частично реализован менеджер карт. Можно выводит картинку и информацию о карте в сообщения. На сервер предварительно загружен набор карт и MapCache.ini с их информацией.'
				},
				{
					name: 'GitHub', 
					value: 'Проект можно найти по ссылке на GitHub: https://github.com/GeneralTao2/nodejs-discord-rotr-bot .'
				},
				{
					name: 'Помощь', 
					value: 'Пока-что мой проект не имеет презентабельного вида, поэтому помощи в разработке не прошу.'
				},
			]
		}),
		en: new MessageEmbed({
			color: '#b6cbd1',
			title: "So, you're really interested", 
			description: "I was developed by one... *pshh..*\n So, I'll figure it out here. This is `GeneralTao#5693`. This bot is my first more or less average project, in which I would like to gain experience in developing bots, programming in js. Of course, in order to get something useful at the end. I have been developing a bot, probably since the beginning of 2021.",               
			fields: [
				{
					name: 'Programming language', 
					value: 'As I already wrote, I wrote a bot on nodejs. So far, my project is devoid of normal style and comments, so it is useless to understand it yet.'
				},
				{
					name: 'Data base', 
					value: 'I use mongodb as a database. It stores player lists, notes, and configuration. So far, I use free 220 Kb. I think that\'s enough for the first time.'
				},
				{
					name: 'Server', 
					value: 'I bought a server on FirstByte for 55 rubles a month. Intel Xeon E5-2650, 512 MB RAM, 7 GB SSD, 7 TB traffic, Ubuntu 20.04. The cheapest server.'
				},
				{
					name: 'Maps', 
					value: 'Partially implemented by the card Manager. You can display a picture and information about the map in messages. A set of maps and MapCache.ini with their information are preloaded to the server.'
				},
				{
					name: 'GitHub', 
					value: 'The project can be found at the link on GitHub: https://github.com/GeneralTao2/nodejs-discord-rotr-bot .'
				},
				{
					name: 'Contribution', 
					value: 'So far, my project does not have a presentable appearance, so I do not ask for help in developing it yet.'
				},
			]
		})
	}
}

exports.ruleMessagesSet = ruleMessagesSet = {
	user: {
		added: 'userAdded',
		notAdded: 'userNotAdded',
		invited: 'userInvited',
		notInvited: 'userNotInvited',
		bot: 'userBot',
		notBot: 'userNotBot',
		banned: 'userBanned',
		notBanned: 'userNotBanned',
		moderator: 'userModerator',
		notModerator: 'userNotModerator',
		superuser: 'userSuperuser',
		notSuperuser: 'userNotSuperuser',
	},
	target: {
		added: 'targetAdded',
		notAdded: 'targetNotAdded',
		invited: 'targetInvited',
		notInvited: 'targetNotInvited',
		bot: 'targetBot',
		notBot: 'targetNotBot',
		banned: 'targetBanned',
		notBanned: 'targetNotBanned',
		moderator: 'targetModerator',
		notModerator: 'targetNotModerator',
		superuser: 'targetSuperuser',
		notSuperuser: 'targetNotSuperuser',
	}
}

const helpEmbeds = {
	playerCommands: (lang) => new MessageEmbed({
		color: '#51cf70',
		title: phrases['playerCommandName'][lang](), 
		description: phrases['playerCommandDescription'][lang](),               
		fields: [].concat(
			commandField('gather', lang),
			commandField('maps', lang),
			commandField('map', lang),
			commandField('download', lang),
			commandField('invite', lang),
			commandField('invited', lang),
			commandField('breaks', lang),
			commandField('break', lang),
			commandField('unbreak', lang),
			commandField('join', lang),
			commandField('leave', lang),
			commandField('help', lang),
			commandField('about', lang),
			commandField('superabout', lang),
		),
		footer: {
			text: phrases['playerCommandFooter'][lang](),
		  },
	  }),
	moderatorCommands: (lang) => new MessageEmbed({
		color: [212, 102, 59],
		title: phrases['moderatorCommandName'][lang](), 
		description: phrases['moderatorCommandDescription'][lang](),               
		fields: [].concat(
			commandField('remove', lang),
			commandField('cancel', lang),
			commandField('ban', lang),
			commandField('unban', lang),
			commandField('add', lang),
			commandField('moderator', lang),
			commandField('user', lang),
		),
	}),
	configCommands: (lang) => new MessageEmbed({
		color: '#a80000',
		title: phrases['configCommandName'][lang](), 
		description: phrases['configCommandName'][lang](),               
		fields: [].concat(
			commandField('set_indexes', lang),
			commandField('set_ru_role', lang),
			commandField('set_en_role', lang),
			commandField('set_moderator_role', lang, true),
			commandField('home', lang),
			commandField('evict', lang),
		),
	})
}




