const fs = require('fs')
const fsPromises = fs.promises;
const { createCanvas, loadImage, Image } = require('canvas')
const tga2png = require('tga2png');
const lineReader = require('line-reader');
const readline = require('readline');
//  c:/users/ar725/documents/command and conquer generals zero hour data/maps/<map_name>/<map_name>.map
// _28 (
// _29 )
// _20 space
// _3A :
// _5C / (\)
// _2E .
// _5B [
// _5C ]
// _2D -
// ASCII

function stringToASCII(str) {
  let ASCIIstr = "";
  let ASCIIstrIndex = 0;
  str = str.toLowerCase();
  for (let i = 0; i < str.length; i++) {
    //console.log(str[i]);
    if( (str[i] >= '0' && str[i]  <= '9') || (str[i] >= 'a' && str[i]  <= 'z')) {
      ASCIIstr += str[i];
    } else {
      const hexStr = (str[i].charCodeAt(0)).toString(16).toUpperCase();
      ASCIIstr += '_' + hexStr;
    }
  }
  return ASCIIstr
}
function isSpecialCaracter(ch) {
  for(let i=0; i<specialMatchCaracters.length; i++) {
    if(ch === specialMatchCaracters[i]) {
      return true;
    }
  }
  return false;
}
const specialMatchCaracters = '[\\^$.|?*+()'
function escapeSpecialMatchCharacters(reg) {
  let esapedStr = ""
  for(let i=0; i<reg.length; i++) {
    if(isSpecialCaracter(reg[i])) {
      esapedStr += '\\' + reg[i];
    } else {
      esapedStr += reg[i]
    }
  }
  return esapedStr
}


async function getMapInfoByASCIIstr(mapNameASCII) {
  mapNameASCII = escapeSpecialMatchCharacters(mapNameASCII);
  let mapInfo = {
    name: null,
    size: null,
    isMultiplayer: null,
    numPlayers: null,
    playerStrats: [],
    techPosition: [],
    supplyPosition: []
  }
  let foudMapInfo = false;
  const readStream = fs.createReadStream('Maps/MapCache.ini')
  const lineStream = readline.createInterface(readStream)
  const stream = new Promise(resolve => {
    lineStream.on('line', line => {
      if(line) {
        const regex = new RegExp(mapNameASCII, "g");
        if(line.match(regex)) {
          foudMapInfo = true;
        }
        if(foudMapInfo) {
          if(line.match(/isMultiplayer/)) {
            mapInfo.isMultiplayer = line.match(/yes/) ? true : false;
          }
          if(line.match(/numPlayers/)) {
            mapInfo.numPlayers = parseInt(line.match(/.$/g)[0]);
          }
          if(line.match(/extentMax/)) {
            const extentMinMatch = line.match(/[+-]?\d+(?:\.\d+)?/g).map(Number);
            mapInfo.size = {
              x: extentMinMatch[0],
              y: extentMinMatch[1]
            }
          }
          if(line.match(/Player_._Start/)) {
            const playerStartMatch = line.match(/[+-]?\d+(?:\.\d+)?/g).map(Number);
            mapInfo.playerStrats.push({
              x: playerStartMatch[1],
              y: playerStartMatch[2]
            })
          }
          if(line.match(/techPosition/)) {
            const techPositionMatch = line.match(/[+-]?\d+(?:\.\d+)?/g).map(Number);
            mapInfo.techPosition.push({
              x: techPositionMatch[0],
              y: techPositionMatch[1]
            })
          }
          if(line.match(/supplyPosition/)) {
            const supplyPositionMatch = line.match(/[+-]?\d+(?:\.\d+)?/g).map(Number);
            mapInfo.supplyPosition.push({
              x: supplyPositionMatch[0],
              y: supplyPositionMatch[1]
            })
          }
          if(line.match(/END/)) {
            lineStream.close()
            lineStream.removeAllListeners();
            return;
          }
        }
      }
    })

    lineStream.on('close', (...args) => {
      //console.log(args)
      resolve()
    })

  })
  await stream;
  return mapInfo;
}
async function makeMakeImage(mapInfo) {
  const canvas = createCanvas(128, 128)
  const ctx = canvas.getContext('2d')
  const spawnImage = await loadImage('images/spawn.png');
  const techImage = await loadImage('images/tech.png');
  const supplyImage = await loadImage('images/supply.png');
  const mapBuffer = await tga2png('Maps/'+mapInfo.name+'/'+mapInfo.name+'.tga')
  const mapImage = new Image();
  mapImage.src = mapBuffer;
  ctx.drawImage(mapImage, 0, 0)
  const x_scale = 128/mapInfo.size.x;
  const y_scale = 128/mapInfo.size.y;
  for(let i=0; i<mapInfo.playerStrats.length; i++) {
    const x = mapInfo.playerStrats[i].x * x_scale;
    const y = mapInfo.playerStrats[i].y * y_scale;
    ctx.drawImage(spawnImage, x-8, y-8, 20, 20)
  }
  for(let i=0; i<mapInfo.supplyPosition.length; i++) {
    const x = mapInfo.supplyPosition[i].x * x_scale;
    const y = mapInfo.supplyPosition[i].y * y_scale;
    ctx.drawImage(supplyImage, x-10, y-10, 20, 20)
  }
  for(let i=0; i<mapInfo.techPosition.length; i++) {
    const x = mapInfo.techPosition[i].x * x_scale;
    const y = mapInfo.techPosition[i].y * y_scale;
    ctx.drawImage(techImage, x-10, y-10, 20, 20)
  }
  const buffer = canvas.toBuffer('image/png')
  fs.writeFileSync('maked_maps/'+mapInfo.name+'.png', buffer)
}

async function main() {
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  try {
    const maps = await fsPromises.readdir('Maps');
    for(let i=0; i<3; i++) {
      const encodedMap = stringToASCII(maps[i]);
      let mapInfo = await getMapInfoByASCIIstr(encodedMap);
      mapInfo.name = maps[i]
      //console.log(mapInfo)
      //console.log(maps[i]);
      const makedMap = await makeMakeImage(mapInfo)
    }
    //escapeSpecialMatchCharacters('l')
    //const mapCash = await fsPromises.readFile('Maps/MapCache.ini', 'UTF-8');
    
  } catch(error) {
    console.log(error);
  }
  
}
main();
/*.then( buff => {
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0)
    img.onerror = err => { throw err }
    img.src = buff
    const buffer = canvas.toBuffer('image/png')
    fs.writeFileSync('./image.png', buffer)
}, err => {
    console.log('error', err);
});*/

// Draw cat with lime helmet
//loadImage('Maps/[RANK] [NMC 2x2] Ghostly Rocks/[RANK] [NMC 2x2] Ghostly Rocks.tga').then((image) => {
  //ctx.drawImage(image, 50, 0, 70, 70)
  //const buffer = canvas.toBuffer('image/png')
  //fs.writeFileSync('./image.png', buffer)
  
  //console.log('<img src="' + canvas.toDataURL() + '" />')
//})

/*
const readLine = require('readline')
const fs = require('fs')
const events = require('events')

const readStream = fs.createReadStream('./tsconfig.json')
const lineStream = readLine.createInterface(readStream)

async function readLines(cb) {
	let counter = 0
	const stream = readLine.createInterface({
		input: fs.createReadStream('./package-lock.json'),
		crlfDelay: Infinity
	})

	stream.on('line', line => {
		cb(line, stream.close.bind(stream))
	})

	await events.once(stream, 'close')
}


;(async () => {
	let counter = 0

	try {
		await readLines((line, close) => {
			if (counter > 3) {
				return close()
			}

			console.log(line)
			counter++
		})
	} catch(err) {
		console.log('ошибка :(')
		console.error(err)
	}
})()
//--------------------------
const readLine = require('readline')
const fs = require('fs')
const events = require('events')

const readStream = fs.createReadStream('./tsconfig.json')
const lineStream = readLine.createInterface(readStream)

async function readLines() {
	let counter = 0
	const stream = readLine.createInterface({
		input: fs.createReadStream('./package.json'),
		crlfDelay: Infinity
	})

	stream.on('line', line => {
		if (counter > 3) {
			return stream.close()
		}

		console.log(line)
		counter++
	})

	await events.once(stream, 'close')
}


;(async () => {
	try {
		await readLines()
	} catch(err) {
		console.log('ошибка :(')
		console.error(err)
	}
})()
//------------------
const readLine = require('readline')
const fs = require('fs')

const readStream = fs.createReadStream('./tsconfig.json')
const lineStream = readLine.createInterface(readStream)

;(async () => {
	let counter = 0

	for await (const line of lineStream) {
		if (counter > 3) {
			break
		}

		console.log(line)
		counter++
	}
})()
//---------------------
const readLine = require('readline')
const fs = require('fs')

const readStream = fs.createReadStream('./tsconfig.json')
const lineStream = readLine.createInterface(readStream)
const stream = new Promise(resolve => {
	lineStream.on('line', line => {
		if (5 == 2) {
			lineStream.close()
		}
	})

	lineStream.on('close', (...args) => {
		console.log(args)
		resolve()
	})
})

;(async () => {
	await stream
})()
*/