const fs = require("fs");
const utils = require("./utils.js");
const bindConfigPath = "./bindconfig";


//make sure the file exists
fs.appendFileSync(bindConfigPath, '');
if (fs.readFileSync(bindConfigPath).toString() === "") {
    fs.writeFileSync(bindConfigPath, "{}");
}

var binds;
loadFile();

function loadFile() {
    var data = fs.readFileSync(bindConfigPath);
    binds = JSON.parse(data);
}

function saveFile() {
    var jsonBinds = JSON.stringify(binds);

    fs.writeFileSync(bindConfigPath, jsonBinds);
}

exports.bind = function(channelID, steamID) {
    binds[channelID] = steamID;
    saveFile();
}

exports.unbindChannel = function(channelID) {
    delete binds[channelID];
    saveFile()
}

exports.unbindSteam = function(steamID) {
    var key = utils.keyOf(steamID);

    if (key) delete binds[key];

    saveFile()
}

exports.getBindChannel = function(channelID) {
    return binds[channelID];
}

exports.getBindSteam = function(steamID) {
    return utils.keyOf(binds, steamID);
}

exports.getBinds = function() {
    return binds;
}

exports.unbindAll = function() {
    binds = {};
    saveFile()
}
