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


exports.getPlayers = async (players, selector) => {
	// get list of required players
	let list = await db.forEach(players, async (player) => {
		const user = discord.getUserById(player.discordId);
		if(!user) {
			return null
		}
		if (selector(user)) {
			return user;
		} else {
			return null;
		}
	});
	// filter null elements
	list = list.filter(cell => cell)
	if (list.length === 0) {
		return null;
	}
	return list;
}

exports.getPlayerColumn = async (players, selector, clusterSize = 20) => {
	let list = await exports.getPlayers(players, selector)
	return await exports.getColumn(list, clusterSize);
}

exports.getColumn = async (list, clusterSize = 20) => {
	const maxTagLength = 20;
	// build cluster string
	let pointer = 1;
	let contentClusters = [];
	// for every cluster
	if(!list) {
		return ['Empty.'];
	}
	for(let i=0; i<list.length; i+=clusterSize) {
		let content = '';
		// for every cluster row
		for (let j = i; j < i+clusterSize && j<list.length; j++) {
			let tag = list[j].tag;
			tag = exports.cutBackTag(tag, maxTagLength);
			tag = exports.backSlashTag(tag)
			const iString = exports.tabString(j, list.length.toString().length);
			// finaly conact string parts
			content += '`' + iString + '` ' + tag + '\n';
			pointer++;
		}
		contentClusters.push(content);
	}
	return contentClusters;
}

exports.getEmojiColumn = async (list, clusterSize = 20) => {
	let pointer = 1;
	let contentClusters = [];
	if(!list) {
		return ['Empty.'];
	}
	// for every cluster
	for(let i=0; i<list.length; i+=clusterSize) {
		let content = '';
		// for every cluster row
		for (let j = i; j < i+clusterSize && j<list.length; j++) {
			const iString = exports.tabString(j, list.length.toString().length);
			content += '`' + iString + '` ' + list[j] + '\n';
			pointer++;
		}
		contentClusters.push(content);
	}
	return contentClusters;
}

// cut back lang strings 
exports.cutBackTag = (tag, maxTagLength) => {
	const length = tag.length
	if(length > maxTagLength) {
		const discriminator = tag.substr(length-5, length-1);
		const namePart = tag.substr(0, 14)
		tag = namePart + '..' + discriminator;
	}
	return tag;
}

// calcualting index part length for text alignment
exports.tabString = (j, listLenth) => {
	let iString = (j + 1).toString() + '.';
	const iStringLength = iString.length;
	for (let g = iStringLength; g < listLenth + 1; g++) {
		iString += ' ';
	}
	return iString;
}

// place backslash before every discord special character 
exports.backSlashTag = (tag) => {
	tag = tag.replace(/_/g, "\\_")
	return tag;
}

exports.clasters2fields = (claster1, claster2) => {
	let fields = [];
	const maxLength = Math.max(claster1.array.length, claster2.array.length);
	for(let i=0; i<maxLength; i++) {
		if(claster1.array[i]) {
			fields.push({
				name: claster1.title, 
				value: claster1.array[i], inline: true
			});
		} else {
			fields.push({
				name: "Empty", 
				value: "Empty", inline: true
			});
		}
		if(claster2.array[i]) {
			fields.push({
				name: claster2.title, 
				value: claster2.array[i], inline: true
			});
		} else {
			fields.push({
				name: "Empty", 
				value: "Empty", inline: true
			});
		}
		fields.push({
			name: '\u200B', value: '\u200B', inline: true
		});
	}
	return fields
}