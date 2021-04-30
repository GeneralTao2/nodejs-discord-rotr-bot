const db = require('./dbPlayerManager');
const discord = require('./discordPlayerManager');
const configs = require('./configs');
const command = require('./commandManager');
const vote = require('./voteManager');
const gatherc = require('./gatherCommandTools')
const commands = require('./commands')

// GeneralTao#5693
// ======================================================================== CONNECTION ============

async function checkCollection(name) {
	const ans = await db.client.db(configs.dbName).listCollections({name: name}).next();
	if(!ans) {
		await db.client.db(configs.dbName).createCollection(name)
	}
}

discord.client.on('ready', async () => {
	try {
		await db.client.connect();
		/*if(!await db.configs.findOne({})) {
			return;
		}*/
		//await db.client.db(configs.dbName).createCollection('invitedPlayers')
		await checkCollection('configs')
		await checkCollection('addedPlayers')
		await checkCollection('invitedPlayers')
		await checkCollection('bannedPlayers')
		await checkCollection('gathers')
		await checkCollection('breaks')
		db.configs = await db.client.db(configs.dbName).collection('configs');
		db.addedPlayers = await db.client.db(configs.dbName).collection('addedPlayers');
		db.invitedPlayers = await db.client.db(configs.dbName).collection('invitedPlayers');
		db.bannedPlayers = await db.client.db(configs.dbName).collection('bannedPlayers');
		db.gathers = await db.client.db(configs.dbName).collection('gathers');
		db.breaks = await db.client.db(configs.dbName).collection('breaks');
		const enDoc = await db.getRole('en');
		const ruDoc = await db.getRole('ru');
		const modDoc = await db.getRole('moderator');
		if(enDoc) {
			discord.roleIds['en'] = enDoc.discordId;
		}
		if(ruDoc) {
			discord.roleIds['ru'] = ruDoc.discordId;
		}
		if(modDoc) {
			discord.roleIds['moderator'] = modDoc.discordId;
		}
		if (configs.ltsChannelId) {
			discord.channelId = configs.ltsChannelId
		} else {
			discord.channelId = (await db.getBotChannelId()).discordId;
		}
	} catch (error) {
		console.log(error);
	}
	console.log('Yeah, connected!');
	await discord.init();
	await initReactionsAfterRelog();
	filterAddedPLayers();

	//await discord.currentChennel.send('-download 2 2')
	//await discord.currentChennel.send('-home')
});

async function init() {

}

discord.client.on('guildCreate', async (guild) => {
	console.log(guild.id)
	discord.guildId = guild.id
	await discord.init();
	await db.checkIndex();
});

discord.client.on('guildMemberAdd', member => {
	commands.invatePlayerCommand(member.user, [], {author: discord.getUserById(configs.superUserId)})
});

discord.client.on('guildMemberRemove', async (member) => {
	db.removeAddedPlayerById(member.user.id)
});

const threeDays = 3 * 24 * 60 * 60 * 1000;
const oneDay = 24 * 60 * 60 * 1000;
function filterAddedPLayers() {
	setInterval(async () => {
		db.forEach(db.addedPlayers, (doc) => {
			const user = discord.getUserById(doc.discordId);
			if(!user) {
				db.removeAddedPlayerById(user.id);
			}
		})
	}, oneDay);
}

async function initReactionsAfterRelog() {
	// Invitation
	db.invitedPlayersForEach(async (invitedPlayer) => {
		try {
			const user = discord.getUserById(invitedPlayer.discordId);
			const msRemaining = invitedPlayer.createdAt.getTime() + threeDays - new Date().getTime();
			if (invitedPlayer.inviationMessageId) {
				const inviteMessage = await discord.getUserDMbyMessageId(invitedPlayer.discordId, invitedPlayer.inviationMessageId);
				await vote.removeUpDownReactions(inviteMessage);
				vote.upDownManager(inviteMessage, user.id, msRemaining, () => {
					addPlayerAfterInviting(user);
				}, () => {
					ignorePlayerAfterInviting(user);
				});
			} else {
				//console.log(invitedPlayer)
				const languageMessage = await discord.getUserDMbyMessageId(invitedPlayer.discordId, invitedPlayer.languageMessageId);
				const inviter = await discord.getUserById(invitedPlayer.inviterDiscordId)
				await vote.removeUpDownReactions(languageMessage, '🇷🇺', '🇬🇧');
				vote.upDownManager(languageMessage, user.id, msRemaining, async () => {
					await discord.pinRoleById(user.id, 'ru')
					commands.sendInviteMassage(user, inviter)
				}, async () => {
					await discord.pinRoleById(user.id, 'en')
					commands.sendInviteMassage(user, inviter)
				}, '🇷🇺', '🇬🇧');
			}
		} catch (error) {
			console.log('Critical error happend!', error)
			db.removeInvitedPlayerById(invitedPlayer.discordId)
		}
	});


	// Gathering
	db.gathersForEach(async (gather) => {  
		const inviter = discord.getUserById(gather.discordId);
		const msRemaining = gather.expireAt.getTime() - new Date().getTime();
		const gatherMessage = await discord.currentChennel.messages.fetch(gather.messageId);
		gatherc.setGatherUpdateInterval(gatherMessage, gather.discordId, msRemaining);
		for (let i = 0; i < gather.invitedPlayer.length; i++) {
			const user = await discord.getUserById(gather.invitedPlayer[i].discordId);
			const directMessage = await discord.getUserDMbyMessageId(
				gather.invitedPlayer[i].discordId, gather.invitedPlayer[i].messageId);
			await vote.removeUpDownReactions(directMessage); 
			vote.upDownManager(directMessage, user.id, msRemaining, () => {
				db.updateGatherData(inviter.id, user.id, '✅');
			}, () => {
				db.updateGatherData(inviter.id, user.id, '❎');
			});
		}
	});
}


// ================================================================ DISCORD EVENT HANDLING =========

// Handle message types
discord.client.on('message', async (message) => {
	command.handleCommand(message);
});

discord.client.login(configs.token);
