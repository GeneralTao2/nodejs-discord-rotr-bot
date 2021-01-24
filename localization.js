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
	const ru = 'Привет! Я - менеджер сообщества ROTR BP. Моя главная задача - собирать людей на игры. **'+args[2]+'** приглосил тебя. Ты можешь принять или отклонить приглошение. Если ты примешь тогда сможешь собирать и быть собранным другими игроками.\nПроголосуй ✅ или ❎ чтобы принять или отказаться.'
	const en = 'Hello! I am ROTR BP community player manager. My main goal is to gover players from ROTR discord network to game. \n**'+args[2]+'** invited you, so you can accept or refuce. If you accept you will be able to gather peaple and be gathered to games.\nVote ✅ or ❎ to accept or reject.'
	return returnMessage(language, en, ru);
}

exports.removeing = function removeing(args, language) {
	const ru = 'Игрок `' + args[2] +'` удалил тебя из пользователей бота.'
	const en = 'Player `' + args[2] +'` removed you from bot users.'
	return returnMessage(language, en, ru);
}

exports.canceling = function canceling(args, language) {
	const ru = 'Приглошение было отменено.'
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

exports.gather = function gatherMessageFooter(args, language) {
	const ru = 'Собрание'
	const en = 'Gathering'
	return returnMessage(language, en, ru);
}

