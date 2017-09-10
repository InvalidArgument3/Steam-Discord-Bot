const fs = require("fs");
const utils = require("./utils.js");
const bindConfigPath = require("./config").bindConfigPath;

module.exports.SUCCESS = 0;
module.exports.CHANNEL_ALEADY_BOUND = 1;
module.exports.STEAM_ALREADY_BOUND = 2;
module.exports.CHANNEL_NOT_BOUND = 3;
module.exports.STEAM_NOT_BOUND = 4;

//make sure the file exists
fs.appendFileSync(bindConfigPath, '');
if (fs.readFileSync(bindConfigPath).toString() === "") {
    fs.writeFileSync(bindConfigPath, "{}");
}

let binds;
loadFile();

function loadFile() {
    let data = fs.readFileSync(bindConfigPath);
    binds = JSON.parse(data);
}

function saveFile() {
    let jsonBinds = JSON.stringify(binds, null, '\t');

    fs.writeFileSync(bindConfigPath, jsonBinds);
}

module.exports.bind = function(channelID, steamID) {
    if (binds[channelID]) {
        return module.exports.CHANNEL_ALEADY_BOUND;
    }
    
    if (utils.keyOf(binds, steamID)) {
        return module.exports.STEAM_ALREADY_BOUND;    
    }
    
    binds[channelID] = steamID;
    saveFile();
    
    console.log("Bound:");
    console.log("\t[" + channelID +"] <-> [" + steamID + "]\n")
    return module.exports.SUCCESS;
}

module.exports.unbindChannel = function(channelID) {
    let steamID = binds[channelID]
    if (!steamID) {
        return;
    }
    
    delete binds[channelID];
    saveFile()
    
    console.log("Unbound using channelID:");
    console.log("\t[" + channelID +"] <-> [" + steamID + "]\n")
    
    return steamID;
}

module.exports.unbindSteam = function(steamID) {
    let key = utils.keyOf(binds, steamID);
    
    if (!key) {
        return module.exports.STEAM_NOT_BOUND;
    }
    
    let value = binds[key]
    delete binds[key];
    saveFile()
    
    console.log("Unbound using steamID:");
    console.log("\t[" + key +"] <-> [" + steamID + "]\n")
    
    return key
}

module.exports.getBindChannel = function(channelID) {
    return binds[channelID];
}

module.exports.getBindSteam = function(steamID) {
    return utils.keyOf(binds, steamID);
}

module.exports.getBinds = function() {
    return binds;
}

module.exports.unbindAll = function() {
    console.log("All binds deleted")
    binds = {};
    saveFile()
}
