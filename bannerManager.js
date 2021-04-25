const fs = require('fs')
const fsPromises = fs.promises;
const { createCanvas, loadImage, Image } = require('canvas')
const mapm = require('./mapManager')
//const discord = require('./discordPlayerManager')

//22 margin
//h 172
//w 619
async function getGatherByPlayerQuantityPointerAndUser(playerQuantity, pointer, user) {
	const bannerWidth = 619;
	const bannerHeight = 172;
	
	const canvas = createCanvas(bannerWidth, bannerHeight)
	const mapInfos = await mapm.getMapInfo(mapInfo => mapInfo.playerStarts.length === playerQuantity)
	if(pointer < 1 || pointer > mapInfos-1) {
		return null
	}
	const mapInfo = mapInfos[pointer-1]
	const ctx = canvas.getContext('2d')
	const bg = await loadImage('images/bg1.jpg')
	const map = await loadImage('maked_maps/'+mapInfo.name+'.png')
	const spawnImage = await loadImage('images/spawn.png');
  	const techImage = await loadImage('images/tech.png');
	const supplyImage = await loadImage('images/supply.png');
	const bordersImage = await loadImage('images/borders.png');
	const avatar = await loadImage(user.displayAvatarURL({ format: 'jpg' }));

	const padding = 22;

	ctx.drawImage(bg, 0, 0, bannerWidth, bannerHeight)
	ctx.drawImage(map, padding, padding)

	const mapTextLineQuantity = 5;
	const mapTextHeight = 16
	const mapTextMarginTop = 13
	const iconMarginLeft = 172
	const mapTextLineSpacing = (bannerHeight - 2*padding + mapTextHeight/2)/mapTextLineQuantity

	const iconsMarginTop = -2
	const iconSize = 20
	const mapTextMarginLeft = iconMarginLeft + iconSize + 5

	ctx.font = mapTextHeight.toString() + 'px sans-serif';
	ctx.fillStyle = '#ffffff';

	ctx.fillText(mapInfo.name, iconMarginLeft, mapTextLineSpacing*0 + padding + mapTextMarginTop);
	
	ctx.drawImage(bordersImage, iconMarginLeft, mapTextLineSpacing*1 + padding + iconsMarginTop, iconSize, iconSize)
	ctx.fillText(mapInfo.size.x.toString()+' x '+mapInfo.size.y.toString(), mapTextMarginLeft, mapTextLineSpacing*1 + padding + mapTextMarginTop);
	
	ctx.drawImage(techImage, iconMarginLeft, mapTextLineSpacing*2 + padding + iconsMarginTop, iconSize, iconSize)
	ctx.fillText(mapInfo.techPosition.length.toString(), mapTextMarginLeft, mapTextLineSpacing*2 + padding + mapTextMarginTop);
	
	ctx.drawImage(supplyImage, iconMarginLeft, mapTextLineSpacing*3 + padding + iconsMarginTop, iconSize, iconSize)
	ctx.fillText(mapInfo.supplyPosition.length.toString(), mapTextMarginLeft, mapTextLineSpacing*3 + padding + mapTextMarginTop);
	
	ctx.drawImage(spawnImage, iconMarginLeft, mapTextLineSpacing*4 + padding + iconsMarginTop, iconSize, iconSize)
	ctx.fillText(mapInfo.playerStarts.length.toString(), mapTextMarginLeft, mapTextLineSpacing*4 + padding + mapTextMarginTop)
	
	const canvasAvatar = createCanvas(bannerHeight, bannerHeight)
	const ctxAvatar = canvasAvatar.getContext('2d')
	ctxAvatar.drawImage(avatar, 0, 0, bannerHeight, bannerHeight)
	ctxAvatar.globalCompositeOperation = "destination-out";
	gradient = ctxAvatar.createLinearGradient(0, 86, 128, 86);
	gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
	gradient.addColorStop(1, "rgba(255, 255, 255, 0.8)");
	ctxAvatar.fillStyle = gradient;
	ctxAvatar.fillRect(0, 0, bannerHeight, bannerHeight);
	ctx.drawImage(canvasAvatar, 447, 0, bannerHeight, bannerHeight)

	const tegTextHeight = 20;
	ctx.font = tegTextHeight.toString() + 'px sans-serif';
	const tagTextWidth = ctx.measureText(user.tag).width;
	ctx.fillText(user.tag, bannerWidth - tagTextWidth - padding, bannerHeight - padding);

	ctx.font = '30px sans-serif';
	ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
	const inv = "INVITATION BY"
	const invTextWidth = ctx.measureText(inv).width;
	ctx.fillText(inv, bannerWidth - invTextWidth - padding, bannerHeight - (tegTextHeight + padding));

	return {
		buffer: canvas.toBuffer(),
		mapInfo: mapInfo
	}
}

async function getGatherByPlayerQuantityAndUser(playerQuantity, user) {
	const bannerWidth = 619;
	const bannerHeight = 172;
	
	const canvas = createCanvas(bannerWidth, bannerHeight)
	const ctx = canvas.getContext('2d')
	const bg = await loadImage('images/bg1.jpg')
	const map = await loadImage('images/nomap'+playerQuantity.toString()+'.png')
	const spawnImage = await loadImage('images/spawn.png');
  	const techImage = await loadImage('images/tech.png');
	const supplyImage = await loadImage('images/supply.png');
	const bordersImage = await loadImage('images/borders.png');
	const avatar = await loadImage(user.displayAvatarURL({ format: 'jpg' }));

	const padding = 22;

	ctx.drawImage(bg, 0, 0, bannerWidth, bannerHeight)
	ctx.drawImage(map, padding, padding, 128, 128)

	const mapTextLineQuantity = 5;
	const mapTextHeight = 16
	const mapTextMarginTop = 13
	const iconMarginLeft = 172
	const mapTextLineSpacing = (bannerHeight - 2*padding + mapTextHeight/2)/mapTextLineQuantity

	const iconsMarginTop = -2
	const iconSize = 20
	const mapTextMarginLeft = iconMarginLeft + iconSize + 5

	ctx.font = mapTextHeight.toString() + 'px sans-serif';
	ctx.fillStyle = '#ffffff';

	ctx.fillText("???", iconMarginLeft, mapTextLineSpacing*0 + padding + mapTextMarginTop);
	
	ctx.drawImage(bordersImage, iconMarginLeft, mapTextLineSpacing*1 + padding + iconsMarginTop, iconSize, iconSize)
	ctx.fillText('"???" x "???"', mapTextMarginLeft, mapTextLineSpacing*1 + padding + mapTextMarginTop);
	
	ctx.drawImage(techImage, iconMarginLeft, mapTextLineSpacing*2 + padding + iconsMarginTop, iconSize, iconSize)
	ctx.fillText("???", mapTextMarginLeft, mapTextLineSpacing*2 + padding + mapTextMarginTop);
	
	ctx.drawImage(supplyImage, iconMarginLeft, mapTextLineSpacing*3 + padding + iconsMarginTop, iconSize, iconSize)
	ctx.fillText("???", mapTextMarginLeft, mapTextLineSpacing*3 + padding + mapTextMarginTop);
	
	ctx.drawImage(spawnImage, iconMarginLeft, mapTextLineSpacing*4 + padding + iconsMarginTop, iconSize, iconSize)
	ctx.fillText(playerQuantity.toString(), mapTextMarginLeft, mapTextLineSpacing*4 + padding + mapTextMarginTop)
	
	const canvasAvatar = createCanvas(bannerHeight, bannerHeight)
	const ctxAvatar = canvasAvatar.getContext('2d')
	ctxAvatar.drawImage(avatar, 0, 0, bannerHeight, bannerHeight)
	ctxAvatar.globalCompositeOperation = "destination-out";
	gradient = ctxAvatar.createLinearGradient(0, 86, 128, 86);
	gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
	gradient.addColorStop(1, "rgba(255, 255, 255, 0.8)");
	ctxAvatar.fillStyle = gradient;
	ctxAvatar.fillRect(0, 0, bannerHeight, bannerHeight);
	ctx.drawImage(canvasAvatar, 447, 0, bannerHeight, bannerHeight)

	const tegTextHeight = 20;
	ctx.font = tegTextHeight.toString() + 'px sans-serif';
	const tagTextWidth = ctx.measureText(user.tag).width;
	ctx.fillText(user.tag, bannerWidth - tagTextWidth - padding, bannerHeight - padding);

	ctx.font = '30px sans-serif';
	ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
	const inv = "INVITATION BY"
	const invTextWidth = ctx.measureText(inv).width;
	ctx.fillText(inv, bannerWidth - invTextWidth - padding, bannerHeight - (tegTextHeight + padding));

	return {
		buffer: canvas.toBuffer(),
		mapInfo: {
			name: null
		}
	}
}

async function getGatherByUser(user) {
	const bannerWidth = 619;
	const bannerHeight = 172;
	
	const canvas = createCanvas(bannerWidth, bannerHeight)
	const ctx = canvas.getContext('2d')
	const bg = await loadImage('images/bg1.jpg')
	const map = await loadImage('images/nomap.png')
	const spawnImage = await loadImage('images/spawn.png');
  	const techImage = await loadImage('images/tech.png');
	const supplyImage = await loadImage('images/supply.png');
	const bordersImage = await loadImage('images/borders.png');
	const avatar = await loadImage(user.displayAvatarURL({ format: 'jpg' }));

	const padding = 22;

	ctx.drawImage(bg, 0, 0, bannerWidth, bannerHeight)
	ctx.drawImage(map, padding, padding, 128, 128)

	const mapTextLineQuantity = 5;
	const mapTextHeight = 16
	const mapTextMarginTop = 13
	const iconMarginLeft = 172
	const mapTextLineSpacing = (bannerHeight - 2*padding + mapTextHeight/2)/mapTextLineQuantity

	const iconsMarginTop = -2
	const iconSize = 20
	const mapTextMarginLeft = iconMarginLeft + iconSize + 5

	ctx.font = mapTextHeight.toString() + 'px sans-serif';
	ctx.fillStyle = '#ffffff';

	ctx.fillText("???", iconMarginLeft, mapTextLineSpacing*0 + padding + mapTextMarginTop);
	
	ctx.drawImage(bordersImage, iconMarginLeft, mapTextLineSpacing*1 + padding + iconsMarginTop, iconSize, iconSize)
	ctx.fillText('"???" x "???"', mapTextMarginLeft, mapTextLineSpacing*1 + padding + mapTextMarginTop);
	
	ctx.drawImage(techImage, iconMarginLeft, mapTextLineSpacing*2 + padding + iconsMarginTop, iconSize, iconSize)
	ctx.fillText("???", mapTextMarginLeft, mapTextLineSpacing*2 + padding + mapTextMarginTop);
	
	ctx.drawImage(supplyImage, iconMarginLeft, mapTextLineSpacing*3 + padding + iconsMarginTop, iconSize, iconSize)
	ctx.fillText("???", mapTextMarginLeft, mapTextLineSpacing*3 + padding + mapTextMarginTop);
	
	ctx.drawImage(spawnImage, iconMarginLeft, mapTextLineSpacing*4 + padding + iconsMarginTop, iconSize, iconSize)
	ctx.fillText("???", mapTextMarginLeft, mapTextLineSpacing*4 + padding + mapTextMarginTop)
	
	const canvasAvatar = createCanvas(bannerHeight, bannerHeight)
	const ctxAvatar = canvasAvatar.getContext('2d')
	ctxAvatar.drawImage(avatar, 0, 0, bannerHeight, bannerHeight)
	ctxAvatar.globalCompositeOperation = "destination-out";
	gradient = ctxAvatar.createLinearGradient(0, 86, 128, 86);
	gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
	gradient.addColorStop(1, "rgba(255, 255, 255, 0.8)");
	ctxAvatar.fillStyle = gradient;
	ctxAvatar.fillRect(0, 0, bannerHeight, bannerHeight);
	ctx.drawImage(canvasAvatar, 447, 0, bannerHeight, bannerHeight)

	const tegTextHeight = 20;
	ctx.font = tegTextHeight.toString() + 'px sans-serif';
	const tagTextWidth = ctx.measureText(user.tag).width;
	ctx.fillText(user.tag, bannerWidth - tagTextWidth - padding, bannerHeight - padding);

	ctx.font = '30px sans-serif';
	ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
	const inv = "INVITATION BY"
	const invTextWidth = ctx.measureText(inv).width;
	ctx.fillText(inv, bannerWidth - invTextWidth - padding, bannerHeight - (tegTextHeight + padding));

	return {
		buffer: canvas.toBuffer(),
		mapInfo: {
			name: null
		}
	}
}



async function getMapCollage(separator) {
	const mapInfos = await mapm.getMapInfo(separator)
	if(mapInfos.length === 0) {
		return null
	}

	let buffers = []
	for(let map = 0; map < mapInfos.length; map+=100) {
		let collageSize
		let mapQuantity = mapInfos.length - map
		if(mapQuantity <= 100) {
			collageSize = (Math.sqrt(mapQuantity) | 0) + 1;
		} else {
			collageSize = 10
			mapQuantity = 100
		}
		const canvas = createCanvas(128*collageSize, 128*collageSize)
		const ctx = canvas.getContext('2d')
		let mapXcaunter = 0;
		let mapYcaunter = 0;
		console.log(map, mapQuantity+map, )
		for(let i=map; i<mapQuantity+map; i++) {
			const x = mapXcaunter*128;
			const y = mapYcaunter*128

			const map = await loadImage('maked_maps/'+mapInfos[i].name+'.png')
			ctx.drawImage(map, x, y)

			const pointerSize = 32;
			ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
			ctx.fillRect(x, y, pointerSize, pointerSize)

			ctx.font = '16px sans-serif';
			const textWidth = ctx.measureText((i+1).toString()).width;
			const textHeight = 16;
			ctx.fillStyle = "rgb(255, 255, 255)"
			ctx.fillText((i+1).toString(), x + pointerSize/2 - textWidth/2, y + pointerSize/2 + textHeight/2);

			mapXcaunter++
			if(mapXcaunter == collageSize) {
				mapXcaunter = 0
				mapYcaunter++
			}
		}
		//console.log(canvas.toBuffer())
		buffers.push(canvas.toBuffer())
	}
	
	return buffers
}

async function getMapBufferAndInfo(separator, mapNumber) {
	const mapInfos = mapm.getMapInfo(separator)
	if(mapNumber > mapInfos.length - 1) {
		return null
	}
	if(mapInfos.length) {
		const mapInfo = mapInfos[mapNumber]
		const canvas = createCanvas(128, 128)
		const map = await loadImage('maked_maps/'+mapInfo.name+'.png')
		const ctx = canvas.getContext('2d')
		ctx.drawImage(map, 0, 0)
		return {
			buffer: canvas.toBuffer(),
			info: mapInfo
		}
	}
	return null
}

exports.getGatherByUser = getGatherByUser
exports.getGatherByPlayerQuantityAndUser = getGatherByPlayerQuantityAndUser;
exports.getMapBufferAndInfo = getMapBufferAndInfo;
exports.getMapCollage = getMapCollage;
exports.getGatherByPlayerQuantityPointerAndUser = getGatherByPlayerQuantityPointerAndUser;