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

exports.translateHelpEmbed = function translateHelpEmbed(embed, lang = 'en') {
    return helpEmbeds[embed](lang)
}

exports.translateInfoEmbed = function translateInfoEmbed(embed, lang = 'en') {
    return infoEmbeds[embed][lang]
}

function commandField(group, command, lang = 'en', inline = false) {
    return {
		name: group[command]['command'],
		value: group[command][lang],
		inline: inline
	}
}

const moderatorCommands = {
	remove: {
		command: '-remove `<player>...`',
		ru: "Удалить одного или нескольких игроков из группу.",
		en: "Remove one or more players from group."
	},
	remove_player: {
		command: '`<player>`',
		ru: "Упоминание о игроке в формате @никнейм.",
		en: "Mention about player in format @nickname."
	},
	cancel: {
		command: '-cancel `<player>...`',
		ru: "Отменить приглашения в группу одного или нескольких игроков.",
		en: "Cancel invitiation of one or more users."
	},
	cancel_player: {
		command: '`<player>`',
		ru: "Упоминание о игроке в формате @никнейм.",
		en: "Mention about player in format @nickname."
	},
	ban: {
		command: '-ban `<player>` `<reason>`',
		ru: "Забанить одного или нескольких игроков из группы. Игроки будут удалены из группы и не смогут в неё вступить.",
		en: "Bun one or more players from group. Players will be also removed from group."
	},
	ban_player: {
		command: '`<player>`',
		ru: "Упоминание о игроке в формате @никнейм.",
		en: "Mention about player in format @nickname."
	},
	ban_reason: {
		command: '`<reason>`',
		ru: "Причина бана игрока в текстовой форме. От 2 до 256 символов.",
		en: "Ban reason of players. From 2 to 256 characters."
	},
	unban: {
		command: '-unbun `<player>...`',
		ru: "Разбанить одного или нескольких игроков.",
		en: "Unbun one or more players."
	},
	unban_player: {
		command: '`<player>`',
		ru: "Упоминание о игроке в формате @никнейм.",
		en: "Mention about player in format @nickname."
	},
	add: {
		command: '-add `<player>...`',
		ru: "Добавляет одного или несколько игроков в группу.",
		en: "Add onw or more users to group."
	},
	add_player: {
		command: '`<player>`',
		ru: "Упоминание о игроке в формате @никнейм.",
		en: "Mention about player in format @nickname."
	},
	moderator: {
		command: '-moderator `<player>...`',
		ru: "Даёт одному или нескольким игрокам роль модератора бота.",
		en: "Give for one or more players moderator role."
	},
	moderator_player: {
		command: '`<player>`',
		ru: "Упоминание о игроке в формате @никнейм.",
		en: "Mention about player in format @nickname."
	},
	unmoderator: {
		command: '-unmoderator `<player>...`',
		ru: "Забирает у одного или нескольких игроков роль модератора бота.",
		en: "Take away from one or more players moderator role."
	},
	unmoderator_player: {
		command: '`<player>`',
		ru: "Упоминание о игроке в формате @никнейм.",
		en: "Mention about player in format @nickname."
	},
	user: {
		command: '-user `<player>`',
		ru: "Выводит JSON объект пользователя",
		en: "Outputs user JSON object."
	},
	user_player: {
		command: '`<player>`',
		ru: "Упоминание о игроке в формате @никнейм.",
		en: "Mention about player in format @nickname."
	}
}

const playerCommand = {
	gather: {
		command: '-gather `<player_quantity>` `<map_number>` `<time>` `<comment>`',
		ru: "Собрать игроков в игру, отправив им приглашения.",
		en: "Gather players to the game, sending them invitation message."
	},
	gather_player_quantity: {
		command: '`<player_quantity>`',
		ru: "Количество игроков на карте от 2 до 8, либо `-`, если `map_number` тоже `-`.",
		en: "Player quantity on the map from 2 to 8, or `-`, if `map_number` also `-`."
	},
	gather_map_number: {
		command: '`<map_number>`',
		ru: "Порядковый намер карты из списка карт с определённым количеством игроков, либо `-`.",
		en: "The sequential number of the map from `-maps` with a certain number of players, or `-`. You can find it using"
	},
	gather_time: {
		command: '`<time>`',
		ru: "Время, которое собрание будет действительным. В минутах, от 2 до 60, либо `-`.",
		en: "The time that the meeting will be valid. In minutes, from 2 to 60, or `-`."
	},
	gather_comment: {
		command: '`<comment>`',
		ru: "Комментарий, который будет приложен к приглашению. От 3 до 256 символов, либо `-`.",
		en: "The comment that will be attached to the invitation. From 3 to 256 characters, or `-`."
	},
	maps: {
		command: '-maps `<player_quantity>`',
		ru: "Выводит коллаж из имеющихся карт на определённое количество игроков.",
		en: "Displays a collage of available maps by certain number of players."
	},
	maps_player_quantity: {
		command: '`<player_quantity>`',
		ru: "Количество игроков на карте от 2 до 8.",
		en: "Player quantity on the map from 2 to 8."
	},
	map: {
		command: '-map `<player_quantity>` `<map_number>`',
		ru: "Выводит картинку и информацию о карте.",
		en: "Dispay picture and information of map."
	},
	maps_player_quantity: {
		command: '`<player_quantity>`',
		ru: "Количество игроков на карте от 2 до 8.",
		en: "Player quantity on the map from 2 to 8."
	},
	maps_map_number: {
		command: '`<map_number>`',
		ru: "Порядковый намер карты из списка карт с определённым количеством игроков.",
		en: "The sequential number of the map from the list of maps with a certain number of players."
	},
	invite: {
		command: '-invite `<player>...`',
		ru: "Пригласить одного или несколькоих игроков в группу для использования бота.",
		en: "Invite one or more players to group, for bot using."
	},
	invite_player: {
		command: '`<player>`',
		ru: "Упоминание о игроке в формате @никнейм.",
		en: "Mention about player in format @nickname."
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
		command: '🔸-break <hours>',
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
		en: (args) => `You was invited to game!`
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
		ru: (args) => '🔸 - команда доступна только в личных сообщениях с ботом.',
		en: (args) => '🔸 - the command is only available in private messages with bot.'
	},
}

const configCommands = {
	set_indexes: {
		commands: "-set_indexes",
		ru: "Проводит некоторую настройку базы данных. Обычно настраивается само, если бот был приглашён в сеть будучи онлайн. В противном случае необходимо вызвать эту команду.",
		en: "Performs some configuration of the database. Usually it is configured on its own if the bot was invaded into the network while online. Otherwise, you must invoke this command. "
	},
	set_ru_role: {
		commands: "-set_ru_role `<role>`",
		ru: "Регистрирует либо заменяет роль для русскоязычных пользователей. В случае отсутсвия все сообщения будут на английском языке.",
		en: "Registers or replaces the role for Russian-speaking users. If missing, all messages will be in English. "
	},
	set_ru_role_role: {
		commands: "`<role>`",
		ru: "Упоминание роли в формате @роль.",
		en: "Mention role in format @role."
	},
	set_en_role: {
		commands: "-set_en_role `<role>`",
		ru: "Регистрирует либо заменяет роль для англоязычных пользователей. В случае отсутсвия все сообщения будут на английском языке.",
		en: "Registers or replaces a role for English speaking users. If missing, all messages will be in English."
	},
	set_en_role_role: {
		commands: "`<role>`",
		ru: "Упоминание роли в формате @роль.",
		en: "Mention role in format @role."
	},
	set_moderator_role: {
		commands: "-set_moderator_role `<role>`",
		ru: "Заменяет роль для модераторов. Регистрация возможна только автору бота.",
		en: "Replaces the role for moderators. Registration is possible only for the author of the bot."
	},
	set_moderator_role_role: {
		commands: "`<role>`",
		ru: "Упоминание роли в формате @роль.",
		en: "Mention role in format @role."
	},
	home: {
		commands: "-home",
		ru: "Прикрепляет бота к определённому текстовому каналу, где им можно пользоваться. Возможно только если у бота нет зарегистрированного текстовго канала.",
		en: "Attaches the bot to a specific text channel where it can be used. This is possible only if the bot does not have a registered text channel."
	},
	evict: {
		commands: "-evict",
		ru: "Открепляет бота от текстовго канала. После вызова команды бота можно вновь прикрепить к какому-то текстовому каналу.",
		en: "Detaches the bot from the text channel. After calling the command, the bot can be reattached to some text channel."
	}
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

const helpEmbeds = {
	playerCommands: (lang) => new MessageEmbed({
		color: '#51cf70',
		title: phrases['playerCommandName'][lang], 
		description: phrases['playerCommandDescription'][lang],               
		fields: [
			commandField(playerCommand, 'gather', lang),
			commandField(playerCommand, 'gather_player_quantity', lang, true),
			commandField(playerCommand, 'gather_map_number', lang, true),
			commandField(playerCommand, 'gather_time', lang, true),
			commandField(playerCommand, 'gather_comment', lang, true),
			commandField(playerCommand, 'maps', lang),
			commandField(playerCommand, 'maps_player_quantity', lang),
			commandField(playerCommand, 'map', lang),
			commandField(playerCommand, 'maps_player_quantity', lang, true),
			commandField(playerCommand, 'maps_map_number', lang, true),
			commandField(playerCommand, 'invite', lang),
			commandField(playerCommand, 'invite_player', lang),
			commandField(playerCommand, 'invited', lang),
			commandField(playerCommand, 'breaks', lang),
			commandField(playerCommand, 'break', lang),
			commandField(playerCommand, 'breack_hours', lang),
			commandField(playerCommand, 'unbreak', lang),
			commandField(playerCommand, 'join', lang),
			commandField(playerCommand, 'leave', lang),
			commandField(playerCommand, 'help', lang),
			commandField(playerCommand, 'about', lang),
			commandField(playerCommand, 'superabout', lang),
		],
		footer: {
			text: phrases['playerCommandFooter'][lang],
		  },
	  }),
	moderatorCommands: (lang) => new MessageEmbed({
		color: [212, 102, 59],
		title: phrases['moderatorCommandName'][lang], 
		description: phrases['moderatorCommandDescription'][lang],               
		fields: [
			commandField(moderatorCommands, 'remove', lang),
			commandField(moderatorCommands, 'remove_player', lang),
			commandField(moderatorCommands, 'cancel', lang),
			commandField(moderatorCommands, 'cancel_player', lang),
			commandField(moderatorCommands, 'ban', lang),
			commandField(moderatorCommands, 'ban_player', lang, true),
			commandField(moderatorCommands, 'ban_reason', lang, true),
			commandField(moderatorCommands, 'unban', lang),
			commandField(moderatorCommands, 'unban_player', lang),
			commandField(moderatorCommands, 'add', lang),
			commandField(moderatorCommands, 'add_player', lang),
			commandField(moderatorCommands, 'moderator', lang),
			commandField(moderatorCommands, 'moderator_player', lang),
			commandField(moderatorCommands, 'user', lang),
			commandField(moderatorCommands, 'user_player', lang),
		],
	}),
	configCommands: (lang) => new MessageEmbed({
		color: '#a80000',
		title: phrases['configCommandName'][lang], 
		description: phrases['configCommandName'][lang],               
		fields: [
			commandField(configCommands, 'set_indexes', lang),
			commandField(configCommands, 'set_ru_role', lang),
			commandField(configCommands, 'set_ru_role_role', lang),
			commandField(configCommands, 'set_en_role', lang),
			commandField(configCommands, 'set_en_role_role', lang),
			commandField(configCommands, 'set_moderator_role', lang, true),
			commandField(configCommands, 'set_moderator_role_role', lang, true),
			commandField(configCommands, 'home', lang),
			commandField(configCommands, 'evict', lang),
		],
	})
}




