const fs = require('fs')
const fsPromises = fs.promises;
const { createCanvas, loadImage, Image } = require('canvas')
const mapm = require('./mapManager')
//const discord = require('./discordPlayerManager')

//22 margin
//h 172
//w 619
async function getGameBanner(mapName, inviter) {
	const canvas = createCanvas(619, 172)
	const ctx = canvas.getContext('2d')
	const bg = await loadImage('images/bg1.jpg')
	const map = await loadImage('maked_maps/'+mapName+'.png')
	const spawnImage = await loadImage('images/spawn.png');
  	const techImage = await loadImage('images/tech.png');
	const supplyImage = await loadImage('images/supply.png');
	const bordersImage = await loadImage('images/borders.png');
	const mapInfo = await mapm.getMapInfo(mapName);
	const avatar = await loadImage(inviter.displayAvatarURL({ format: 'jpg' }));

	const bannerWidth = 619;
	const bannerHeight = 172;

	ctx.drawImage(bg, 0, 0, 619, 172)
	ctx.drawImage(map, 22, 22)

	const marginTop = -5;
	const marginLeft = 5;

	ctx.font = '16px sans-serif';
	ctx.fillStyle = '#ffffff';
	ctx.fillText(mapName, 172, 38+marginTop);

	ctx.drawImage(bordersImage, 172, 50+marginTop, 20, 20)
	ctx.fillText(mapInfo.size.x.toString()+' x '+mapInfo.size.y.toString(), 192+marginLeft, 65+marginTop);
	ctx.drawImage(techImage, 172, 80+marginTop, 20, 20)
	ctx.fillText(mapInfo.techPosition.length.toString(), 192+marginLeft, 95+marginTop);
	ctx.drawImage(supplyImage, 172, 110+marginTop, 20, 20)
	ctx.fillText(mapInfo.supplyPosition.length.toString(), 192+marginLeft, 125+marginTop);
	ctx.drawImage(spawnImage, 172, 140+marginTop, 20, 20)
	ctx.fillText(mapInfo.playerStrats.length.toString(), 192+marginLeft, 155+marginTop);

	const canvasAvatar = createCanvas(172, 172)
	const ctxAvatar = canvasAvatar.getContext('2d')
	ctxAvatar.drawImage(avatar, 0, 0, 172, 172)
	ctxAvatar.globalCompositeOperation = "destination-out";
	gradient = ctxAvatar.createLinearGradient(0, 86, 128, 86);
	gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
	gradient.addColorStop(1, "rgba(255, 255, 255, 0.8)");
	ctxAvatar.fillStyle = gradient;
	ctxAvatar.fillRect(0, 0, 172, 172);
	
	ctx.drawImage(canvasAvatar, 447, 0, 172, 172)

	ctx.font = '20px sans-serif';
	const inviterTegString = inviter.tag;
	const textWidth = ctx.measureText(inviterTegString).width;
	ctx.fillText(inviterTegString, bannerWidth - textWidth - 22, bannerHeight - 22);

	//const buffer = canvas.toBuffer('image/png')
	//fs.writeFileSync('test.png', buffer)
	return canvas.toBuffer()
}

async function getMapCollageByPlayer(playerQuantity) {
	const mapInfos = await mapm.getMapsByPlayerQuantity(playerQuantity)
	const collageSize = (Math.sqrt(mapInfos.length) | 0) + 1;
	const mapQonY = mapInfos.length / collageSize
	const mapQonX = mapInfos.length % collageSize
	const canvas = createCanvas(128*collageSize, 128*collageSize)
	const ctx = canvas.getContext('2d')
	let mapXcaunter = 0;
	let mapYcaunter = 0;

	for(let i=0; i<mapInfos.length; i++) {
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
	return canvas.toBuffer()
}

exports.getMapCollageByPlayer = getMapCollageByPlayer;
exports.getGameBanner = getGameBanner;