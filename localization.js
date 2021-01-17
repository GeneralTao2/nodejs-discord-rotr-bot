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
	const ru = 'Ты был разбанен игроком `'+args[2]+'`. Теперь ты можешь пользоваться моими командами.'
	const en = 'You was unbanned by `'+args[2]+'`. Now you can use my commands.'
	return returnMessage(language, en, ru);
}