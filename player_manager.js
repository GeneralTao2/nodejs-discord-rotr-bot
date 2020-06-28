const fs = require('fs');

function init() {
    let playersData = fs.readFileSync('targets.json');
    exports.players = JSON.parse(playersData);
}

function save() {
    let playersNewData = JSON.stringify(exports.players);
    fs.writeFileSync('targets.json', playersNewData);
}

function push(obj) {
    exports.players.push(obj);
}

function findByName(name) {
    for(let i=0; i<exports.players.length; i++) {
        if(exports.players[i].username == name) {
            return i+1;
        }
    }
    return null;
}

function removeByIndex(index) {
    exports.players.splice(index, 1);
}

function textPlayerList() {
    if(exports.players.length == 0)
        return "Player list is empty."
    let text = '```';
    for(let i=0; i<exports.players.length; i++) {
        text += i+1 + '. ' + exports.players[i].username + '\n';
    }
    text += '```'
    return text;
}

function textPlayer(index) {
    console.log(index)
    let text = '```'+
    "Nickname: \t" + exports.players[index].username +
    "\nLanguage: \t" + exports.players[index].language +
    '```';
    return text;
}
exports.textPlayer = textPlayer;
exports.textPlayerList = textPlayerList; 
exports.removeByIndex = removeByIndex; 
exports.findByName = findByName; 
exports.init = init; 
exports.push = push; 
exports.save = save;