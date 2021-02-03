

function returnMessage(language, en, ru) {
	switch(language) {
		case 'en':
			return en
		case 'ru': 
			return ru
		default:
			return en
		}
}
exports.invitation = function invitation(args, language) {
	const ru = 'Привет! Я - менеджер сообщества ROTR BP. Моя главная задача - собирать людей на игры. **'+args[2]+'** пригласил тебя. Ты можешь принять или отклонить приглашение. Если ты примешь тогда сможешь собирать и быть собранным другими игроками.\nПроголосуй ✅ или ❎ чтобы принять или отказаться.'
	const en = 'Hello! I am ROTR BP community player manager. My main goal is to gover players from ROTR discord network to game. \n**'+args[2]+'** invited you, so you can accept or refuce. If you accept you will be able to gather peaple and be gathered to games.\nVote ✅ or ❎ to accept or reject.'
	return returnMessage(language, en, ru);
}

exports.removeing = function removeing(args, language) {
	const ru = 'Игрок `' + args[2] +'` удалил тебя из пользователей бота.'
	const en = 'Player `' + args[2] +'` removed you from bot users.'
	return returnMessage(language, en, ru);
}

exports.canceling = function canceling(args, language) {
	const ru = 'Приглашение было отменено.'
	const en = 'Your invitation was canceled.'
	return returnMessage(language, en, ru);
}

exports.banning = function banning(args, language) {
	const ru = 'Ты был забанен игроком `'+args[2]+'`. Причина: '+args[3]
	const en = 'You was banned by `'+args[2]+'`. Reason: '+args[3]
	return returnMessage(language, en, ru);
}

exports.unbanning = function unbanning(args, language) {
	const ru = 'Ты был разбанен игроком `'+args[2]+'`. Теперь ты можешь вступить к нам набрав `-join`.'
	const en = 'You was unbanned by `'+args[2]+'`. Now you can join us, typing `-join`.'
	return returnMessage(language, en, ru);
}

exports.adding = function adding(args, language) {
	const ru = 'Отлично, теперь ты вступил в наши ряды. Чтобы просмотреть набор комманд набери `-help`.'
	const en = 'Excellent, now you joined to us. To show my commands type `-help`.'
	return returnMessage(language, en, ru);
}

exports.rejection = function rejection(args, language) {
	const ru = 'Очень жаль, но ничего страшного. Если передумаешь, то просто набери `-join`.'
	const en = 'I\'m sorry, but it\'s okay. If you change your mind, just type ` - join`'
	return returnMessage(language, en, ru);
}

exports.addingTwice = function addingTwice(args, language) {
	const ru = 'Нельзя добавить себя дважды.'
	const en = 'You can\'t add yourself twice.'
	return returnMessage(language, en, ru);
}

exports.wasInvitedToGame = function wasInvitedToGame(args, language) {
	const ru = 'Ты был приглашён в игру!'
	const en = 'You was invited to game!'
	return returnMessage(language, en, ru);
}

exports.noComment = function noComment(args, language) {
	const ru = 'Комментария нет.'
	const en = 'No comment.'
	return returnMessage(language, en, ru);
}

exports.gatherMessageFooter = function gatherMessageFooter(args, language) {
	const ru = 'Жми на ✅ или ❎ чтобы принять или отказаться. До'
	const en = 'Vote ✅ or ❎ to accept or cancel. Gathering is valid until'
	return returnMessage(language, en, ru);
}

exports.gather = function gather(args, language) {
	const ru = 'Собрание'
	const en = 'Gather'
	return returnMessage(language, en, ru);
}


const {MessageEmbed} = require('discord.js');
exports.playerCommands = function playerCommands(language) {
	const ru = new MessageEmbed({
		color: '#51cf70',
		title: "Игроки", 
		description: "Эти команды доступны всем игрокам в группе.",               
		fields: [
			{
				name: '-invite `<player>...`', 
				value: 'Пригласить одного или несколькоих игроков в группу.'
			},
			{
				name: '`<player>`', 
				value: 'Упоминание о игроке в формате @никнейм.'
			},
			{
				name: '-gather `<player_quantity>` `<map_number>` `<time>` `<comment>`', 
				value: 'Собрать игроков в игру, отправив им приглошения.'
			},
			{
				name: '`<player_quantity>`', 
				value: 'Количество игроков на карте от 2 до 8, либо `-`, если `map_number` тоже `-`.',
				inline: true
			},
			{
				name: '`<map_number>`', 
				value: 'Порядковый намер карты из списка карт с определённым количеством игроков.',
				inline: true
			},
			{
				name: '`<time>`', 
				value: 'Время, которое собрание будет действительным. В минутах, от 2 до 60.',
				inline: true
			},
			{
				name: '`<comment>`', 
				value: 'Комментарий, который будет приложен к приглашению. От 3 до 256 символов.',
				inline: true
			},
			{
				name: '-maps `<player_quantity>`', 
				value: 'Выводит коллаж из имеющихся карт на определённое количество игроков.'
			},
			{
				name: '`<player_quantity>`', 
				value: 'Количество игроков на карте от 2 до 8.',
				inline: true
			},
			{
				name: '-map `<player_quantity>` `<map_number>`', 
				value: 'Выводит картинку и информацию о карте.'
			},
			{
				name: '`<player_quantity>`', 
				value: 'Количество игроков на карте от 2 до 8.',
				inline: true
			},
			{
				name: '`<map_number>`', 
				value: 'Порядковый намер карты из списка карт с определённым количеством игроков.',
				inline: true
			},
			{
				name: '-added', 
				value: 'Показывает список добавленных в группу игроков.'
			},
			{
				name: '-invited', 
				value: 'Показывает список приглошённых в группу игроков.'
			},
			{
				name: '-banned', 
				value: 'Показывает список забаненых в группе игроков.'
			},
			{
				name: '-join', 
				value: 'Вступить в группу. Команда работает только в личных сообщениях с ботом.'
			},
			{
				name: '-leave', 
				value: 'Покинуть группу. Команда работает только в личных сообщениях с ботом.'
			},
		]
	  })
	const en = new MessageEmbed({
		color: '#51cf70',
		title: "Players", 
		description: "These commands can use any group member.",                  
		fields: [
			{
				name: '-invite `<player>...`', 
				value: 'Invite on or more players to group.'
			},
			{
				name: '`<player>`', 
				value: 'Mention about player in format @nickname.'
			},
			{
				name: '-gather `<player_quantity>` `<map_number>` `<time>` `<comment>`', 
				value: 'Gather players to the game, sending them invitation message.'
			},
			{
				name: '`<player_quantity>`', 
				value: 'Player quantity on the map from 2 to 8, or `-`, if `map_number` also `-`.',
				inline: true
			},
			{
				name: '`<map_number>`', 
				value: 'The sequential number of the map from the list of maps with a certain number of players.',
				inline: true
			},
			{
				name: '`<time>`', 
				value: 'The time that the meeting will be valid. In minutes, from 2 to 60.',
				inline: true
			},
			{
				name: '`<comment>`', 
				value: 'The comment that will be attached to the invitation. From 3 to 256 characters.',
				inline: true
			},
			{
				name: '-maps `<player_quantity>`', 
				value: 'Displays a collage of available maps by certain number of players.'
			},
			{
				name: '`<player_quantity>`', 
				value: 'Player quantity on the map from 2 to 8.',
				inline: true
			},
			{
				name: '-map `<player_quantity>` `<map_number>`', 
				value: 'Dispay picture and information of map.'
			},
			{
				name: '`<player_quantity>`', 
				value: 'Player quantity on the map from 2 to 8.',
				inline: true
			},
			{
				name: '`<map_number>`', 
				value: 'The sequential number of the map from the list of maps with a certain number of players.',
				inline: true
			},
			{
				name: '-added', 
				value: 'Show the list of added players.'
			},
			{
				name: '-invited', 
				value: 'Show the list of invited players.'
			},
			{
				name: '-banned', 
				value: 'Show the list of banned players.'
			},
			{
				name: '-join', 
				value: 'Join to group. Command works only in dirrect messages.'
			},
			{
				name: '-leave', 
				value: 'Leave from group. Command works only in dirrect messages.'
			},
		]
	  })
	return returnMessage(language, en, ru);
}


exports.moderatorCommands = function moderatorCommands(language) {
	const ru = new MessageEmbed({
		color: [212, 102, 59],
		title: "Модераторы", 
		description: "Эти команды доступны только игрокам с ролью `Bot Moderator`.",               
		fields: [
			{
				name: '-remove `<player>...`', 
				value: 'Удалить одного или нескольких игроков из группу.'
			},
			{
				name: '`<player>`', 
				value: 'Упоминание о игроке в формате @никнейм.'
			},
			{
				name: '-cancel `<player>...`', 
				value: 'Отменить приглошения в группу одного или нескольких игроков.'
			},
			{
				name: '`<player>`', 
				value: 'Упоминание о игроке в формате @никнейм.'
			},
			{
				name: '-ban `<player>` `<reason>`', 
				value: 'Забанить одного или нескольких игроков из группы. Игроки будут удалены из группы и не смогут в неё вступить.'
			},
			{
				name: '`<player>`', 
				value: 'Упоминание о игроке в формате @никнейм.',
				inline: true
			},
			{
				name: '`<reason>`', 
				value: 'Причина бана игрока в текстовой форме. От 2 до 256 символов.',
				inline: true
			},
			{
				name: '-unbun `<player>...`', 
				value: 'Разбанить одного или нескольких игроков.'
			},
			{
				name: '`<player>`', 
				value: 'Упоминание о игроке в формате @никнейм.'
			},
			{
				name: '-add `<player>...`', 
				value: 'Добавляет одного или несколько игроков в группу.'
			},
			{
				name: '`<player>`', 
				value: 'Упоминание о игроке в формате @никнейм.'
			},
			{
				name: '-moder `<player>...`', 
				value: 'Даёт одному или нескольким игрокам роль модератора бота.'
			},
			{
				name: '`<player>`', 
				value: 'Упоминание о игроке в формате @никнейм.'
			},
			{
				name: '-unmoder `<player>...`', 
				value: 'Забирает у одного или нескольких игроков роль модератора бота.'
			},
			{
				name: '`<player>`', 
				value: 'Упоминание о игроке в формате @никнейм.'
			},
			{
				name: '-user `<player>`', 
				value: 'Выводит JSON объект пользователя'
			},
			{
				name: '`<player>`', 
				value: 'Упоминание о игроке в формате @никнейм.'
			},
		]
	  })
	  const en = new MessageEmbed({
		color: [212, 102, 59],
		title: "Moderators", 
		description: "These commands can use only members that have `Bot Moderator` role.",               
		fields: [
			{
				name: '-remove `<player>...`', 
				value: 'Remove one or more players from group.'
			},
			{
				name: '`<player>`', 
				value: 'Mention about player in format @nickname.'
			},
			{
				name: '-cancel `<player>...`', 
				value: 'Cancel invitiation of one or more users.'
			},
			{
				name: '`<player>`', 
				value: 'Mention about player in format @nickname.'
			},
			{
				name: '-ban `<player>` `<reason>`', 
				value: 'Bun one or more players from group. Players will be also removed from group.'
			},
			{
				name: '`<player>`', 
				value: 'Mention about player in format @nickname.',
				inline: true
			},
			{
				name: '`<reason>`', 
				value: 'Ban reason of players. From 2 to 256 characters.',
				inline: true
			},
			{
				name: '-unbun `<player>...`', 
				value: 'Unbun one or more players.'
			},
			{
				name: '`<player>`', 
				value: 'Mention about player in format @nickname.'
			},
			{
				name: '-add `<player>...`', 
				value: 'Add onw or more users to group.'
			},
			{
				name: '`<player>`', 
				value: 'Mention about player in format @nickname.'
			},
			{
				name: '-moder `<player>...`', 
				value: 'Give for one or more players moderator role.'
			},
			{
				name: '`<player>`', 
				value: 'Mention about player in format @nickname.'
			},
			{
				name: '-unmoder `<player>...`', 
				value: 'Take away from one or more players moderator role.'
			},
			{
				name: '`<player>`', 
				value: 'Mention about player in format @nickname.'
			},
			{
				name: '-user `<player>`', 
				value: 'Outputs user JSON object.'
			},
			{
				name: '`<player>`', 
				value: 'Mention about player in format @nickname.'
			},
		]
	  })
	return returnMessage(language, en, ru);
}


exports.configCommands = function configCommands(language) {
	const ru = new MessageEmbed({
		color: '#a80000',
		title: "Конфиграции", 
		description: "Эти команды доступны только игрокам с ролью `Bot Moderator`. Предназначены для первоначальной настройки бота после вступлнения в сеть.",               
		fields: [
			{
				name: '-set_indexes', 
				value: 'Проводит некоторую настройку базы данных. Обычно настраивается само, если бот был приглошён в сеть будучи онлайн. В противном случае необходимо вызвать эту команду.'
			},
			{
				name: '-set_ru_role `<role>`', 
				value: 'Регистрирует либо заменяет роль для русскоязычных пользователей. В случае отсутсвия все сообщения будут на английском языке.'
			},
			{
				name: '`<role>`', 
				value: 'Упоминание роли в формате @роль.'
			},
			{
				name: '-set_en_role `<role>`', 
				value: 'Регистрирует либо заменяет роль для англоязычных пользователей. В случае отсутсвия все сообщения будут на английском языке.'
			},
			{
				name: '`<role>`', 
				value: 'Упоминание роли в формате @роль.'
			},
			{
				name: '-set_moderator_role `<role>`', 
				value: 'Заменяет роль для модераторов. Регистрация возможна только автору бота.'
			},
			{
				name: '`<role>`', 
				value: 'Упоминание роли в формате @роль.'
			},
			{
				name: '-home', 
				value: 'Прикрепляет бота к определённому текстовому каналу, где им можно пользоваться. Возможно только если у бота нет зарегистрированного текстовго канала.'
			},
			{
				name: '-evict', 
				value: 'Открепляет бота от текстовго канала. После вызова команды бота можно вновь прикрепить к какому-то текстовому каналу.'
			}
		]
	  })
	  const en = new MessageEmbed({
		color: '#a80000',
		title: "Confogurations", 
		description: "These commands are only available to players with the `Bot Moderator` role. Designed for initial configuration of the bot after joining the network. ",               
		fields: [
			{
				name: '-set_indexes', 
				value: 'Performs some configuration of the database. Usually it is configured on its own if the bot was invaded into the network while online. Otherwise, you must invoke this command. '
			},
			{
				name: '-set_ru_role `<role>`', 
				value: 'Registers or replaces the role for Russian-speaking users. If missing, all messages will be in English. '
			},
			{
				name: '`<role>`', 
				value: 'Mention role in format @role.'
			},
			{
				name: '-set_en_role `<role>`', 
				value: 'Registers or replaces a role for English speaking users. If missing, all messages will be in English.'
			},
			{
				name: '`<role>`', 
				value: 'Mention role in format @role.'
			},
			{
				name: '-set_moderator_role `<role>`', 
				value: 'Replaces the role for moderators. Registration is possible only for the author of the bot.'
			},
			{
				name: '`<role>`', 
				value: 'Mention role in format @role.'
			},
			{
				name: '-home', 
				value: 'Attaches the bot to a specific text channel where it can be used. This is possible only if the bot does not have a registered text channel.'
			},
			{
				name: '-evict', 
				value: 'Detaches the bot from the text channel. After calling the command, the bot can be reattached to some text channel.'
			}
		]
	  })
	return returnMessage(language, en, ru);
}



exports.about = function about(language) {
	const ru = new MessageEmbed({
		color: '#b6cbd1',
		title: "Игроки", 
		description: "Эти команды доступны всем игрокам в группе.",               
		fields: [
			{
				name: '-invite `<player>...`', 
				value: 'Пригласить одного или несколькоих игроков в группу.'
			},
		]
	  })
	const en = new MessageEmbed({
		color: '#b6cbd1',
		title: "Players", 
		description: "These commands can use any group member.",                  
		fields: [
			{
				name: '-invite `<player>...`', 
				value: 'Invite on or more players to group.'
			},
		]
	  })
	return returnMessage(language, en, ru);
}


