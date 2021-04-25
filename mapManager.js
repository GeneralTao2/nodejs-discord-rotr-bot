const fs = require('fs')
const fsPromises = fs.promises;
const { createCanvas, loadImage, Image } = require('canvas')
const tga2png = require('tga2png');
const readline = require('readline');

function stringToASCII(str) {
  let ASCIIstr = "";
  str = str.toLowerCase();
  for (let i = 0; i < str.length; i++) {
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


async function makeMapInfo(mapName) {
  let mapNameASCII = stringToASCII(mapName);
  mapNameASCII = escapeSpecialMatchCharacters(mapNameASCII);
  let mapInfo = {
    name: null,
    size: null,
    isMultiplayer: null,
    numPlayers: null,
    playerStarts: [],
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
            mapInfo.playerStarts.push({
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
      resolve()
    })

  })
  await stream;
  return mapInfo;
}

async function makeImage(mapInfo) {
  const spawnImage = await loadImage('images/spawn.png');
  const techImage = await loadImage('images/tech.png');
  const supplyImage = await loadImage('images/supply.png');
  const mapBuffer = await tga2png('Maps/'+mapInfo.name+'/'+mapInfo.name+'.tga')
  const mapImage = new Image();
  mapImage.src = mapBuffer;

  const canvas_x = 128
  const canvas_y = 128
  const canvas = createCanvas(canvas_x, canvas_y)
  const ctx = canvas.getContext('2d')

  let x_size
  let y_size
  if(mapInfo.size.x > mapInfo.size.y) {
    x_size = canvas_x
    y_size = (canvas_x/mapInfo.size.x)*mapInfo.size.y
  } else if(mapInfo.size.x < mapInfo.size.y) {
    x_size = (canvas_y/mapInfo.size.y)*mapInfo.size.x
    y_size = canvas_y
  } else {
    x_size = canvas_x
    y_size = canvas_y
  }
  const x_pos = canvas_x/2 - x_size/2
  const y_pos = canvas_y/2 - y_size/2
  ctx.drawImage(mapImage, x_pos, y_pos, x_size, y_size)
  const x_scale = x_size/mapInfo.size.x;
  const y_scale = y_size/mapInfo.size.y;
  for(let i=0; i<mapInfo.playerStarts.length; i++) {
    const x = mapInfo.playerStarts[i].x * x_scale + x_pos;
    const y = (mapInfo.size.y - mapInfo.playerStarts[i].y) * y_scale + y_pos;
    ctx.drawImage(spawnImage, x-8, y-8, 20, 20)
  }
  for(let i=0; i<mapInfo.supplyPosition.length; i++) {
    const x = mapInfo.supplyPosition[i].x * x_scale + x_pos;
    const y = (mapInfo.size.y - mapInfo.supplyPosition[i].y )* y_scale + y_pos;
    ctx.drawImage(supplyImage, x-7, y-7, 14, 14)
  }
  for(let i=0; i<mapInfo.techPosition.length; i++) {
    const x = mapInfo.techPosition[i].x * x_scale + x_pos;
    const y = (mapInfo.size.y - mapInfo.techPosition[i].y) * y_scale + y_pos;
    ctx.drawImage(techImage, x-7, y-7, 14, 14)
  }
  const buffer = canvas.toBuffer('image/png')
  fs.writeFileSync('maked_maps/'+mapInfo.name+'.png', buffer)
}

async function doesMapExists(mapName) {
  try {
    await fsPromises.access('Maps/'+mapName);
    return true;
  } catch (error) {
    if(error) {
      return false
    }
  }
}

async function isMapNotGood(mapName) {
  let errors = {
    tga: null,
    map: null
  }
  try {
    errors.tga = await fsPromises.access('Maps/'+mapName+'/'+mapName+'.tga');
  } catch (error) {
    errors.tga = error
  }

  try {
    errors.map = await fsPromises.access('Maps/'+mapName+'/'+mapName+'.map');
  } catch (error) {
    errors.map = error
  }

  if(errors.tga || errors.map) {
    return errors
  }
  return null
} 

function getMapInfo(separator) {
  const mapInfos = JSON.parse(fs.readFileSync('Maps/MapCach.json'));
  const mapInfoArr = mapInfos.filter(separator);
  //console.log(mapInfoArr)
  if(mapInfoArr.length === 1) {
    return mapInfoArr[0]
  } else if(mapInfoArr.length > 1) {
    return mapInfoArr
  } else {
    return null
  }
}

async function filterMaps() {
  const mapDirs = await fsPromises.readdir('Maps');
  for(let i=0; i<mapDirs.length; i++) {
    if(mapDirs[i] === "MapCache.ini") {
      continue
    }
    const isMapNotGoodResult = await isMapNotGood(mapDirs[i])
    if(isMapNotGoodResult) {
      await fsPromises.rmdir('Maps/'+mapDirs[i], {recursive: true})
    }
  }
}

async function makeAllImages() {
  if (!await fs.existsSync('maked_maps')){
    await fsPromises.mkdir('maked_maps');
  }
  let mapInfos = []
  try {
    await filterMaps();
    const maps = await fsPromises.readdir('Maps');
    for(let i=0; i<maps.length; i++) {
      if(maps[i] === "MapCache.ini") {
        continue
      }
      let mapInfo = await makeMapInfo(maps[i]);
      mapInfo.name = maps[i]
      if(mapInfo.size === null) {
        await fsPromises.rmdir('Maps/'+maps[i], {recursive: true})
        continue
      }
      mapInfos.push(mapInfo)
      const makedMap = await makeImage(mapInfo)
    }
  } catch(error) {
    console.log(error);
  }
  fs.writeFile('Maps/MapCach.json', JSON.stringify(mapInfos), (error) => {
    if (error) throw error;
  });
}


async function getMaps() {
  return await fsPromises.readdir('Maps');
}

async function getMapInfosByPlayerQuantity(playerQuantity) {
  const maps = await getMaps();
  const separatedMapInfos = []
  for(let i=0; i<maps.length; i++) {
    if(maps[i] === "MapCache.ini") {
      continue
    }
    let mapInfo = getMapInfo(maps[i]);
    console.log(mapInfo.playerStarts)
    if(mapInfo.playerStarts.length === playerQuantity) {
      separatedMapInfos.push(mapInfo);
    }
  }
  return separatedMapInfos
}


exports.getMapInfosByPlayerQuantity = getMapInfosByPlayerQuantity;
exports.getMaps = getMaps;
exports.makeAllImages = makeAllImages;
exports.getMapInfo = getMapInfo;
exports.makeImage = makeImage;
exports.filterMaps = filterMaps;
exports.doesMapExists = doesMapExists;
exports.isMapNotGood = isMapNotGood;
