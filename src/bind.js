const fs = require("fs");

const bot = require("./initBots.js");
const bindConfigPath = require("./config.js").bindConfigPath;

const discordBot = bot.discordBot;
const steamBot = bot.steamBot;

const bind = {};
let binds;

//make sure the file exists
fs.appendFileSync(bindConfigPath, '');
if (fs.readFileSync(bindConfigPath).toString() === "") {
    fs.writeFileSync(bindConfigPath, "{}");
}

loadFile();

function loadFile() {
    let data = fs.readFileSync(bindConfigPath);
    binds = JSON.parse(data);
}

function saveFile() {
    let jsonBinds = JSON.stringify(binds, null, '\t');

    fs.writeFileSync(bindConfigPath, jsonBinds);
}

bind.bind = function(channelID, steamID) {
    if (binds[channelID]) {
        return;
    }
    
    if (utils.keyOf(binds, steamID)) {
        return;
    }
    
    binds[channelID] = steamID;
    saveFile();
    
    utils.log("Bound:");
    utils.log("\t[" + channelID +"] <-> [" + steamID + "]\n")
    
    return true;
}

bind.unbindChannel = function(channelID) {
    let steamID = binds[channelID]
    if (!steamID) {
        return;
    }
    
    delete binds[channelID];
    saveFile()
    
    utils.log("Unbound using channelID:");
    utils.log("\t[" + channelID +"] <-> [" + steamID + "]\n")
    
    return steamID;
}

bind.unbindSteam = function(steamID) {
    let key = utils.keyOf(binds, steamID);
    
    if (!key) {
        return;
    }
    
    let value = binds[key]
    delete binds[key];
    saveFile()
    
    utils.log("Unbound using steamID:");
    utils.log("\t[" + key +"] <-> [" + steamID + "]\n")
    
    return key
}

bind.getBindChannel = function(channelID) {
    return binds[channelID];
}

bind.getBindSteam = function(steamID) {
    return utils.keyOf(binds, steamID);
}

bind.getBinds = function() {
    return binds;
}

bind.unbindAll = function() {
    utils.log("All binds deleted")
    binds = {};
    saveFile()
}

bind.getBindSteamAcc = function(steamID) {
    let channelID = bind.getBindSteam(steamID);
    let accounts = utils.getAccounts(channelID, steamID);

    return accounts;
}

bind.getBindChannelAcc = function(channelID) {
    let steamID = bind.getBindChannel(channelID);
    let accounts = utils.getAccounts(channelID, steamID);

    return accounts;
}

bind.getBindChannelAccName = function(server, channelName) {
    let id = utils.getChannelID(server, channelName)

    let accounts = bind.getBindChannelAcc(id);

    if (channelName)  {
        accounts.channelName = channelName;
    }

    return accounts;
}

bind.getBindSteamAccName = function (steamName) {

    let id = utils.getSteamID(steamName)
    let accounts = bind.getBindSteamAcc(id);

    if (steamName) {
        accounts.steamName = steamName;
    }

    return accounts;
}

module.exports = bind;
const utils = require("./utils.js");