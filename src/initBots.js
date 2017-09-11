const Discord = require('discord.js');
const SteamUser = require('steam-user');

const config = require("./config.js");

let discordBot = new Discord.Client();
let steamBot = new SteamUser();

let isSteamReady = false;
let isDiscordReady = false

steamBot.setOptions(config.steamOptions);
//steamBot.getPersonas(Object.keys(steamBot.myFriends));

module.exports.discordBot = discordBot;
module.exports.steamBot = steamBot;

require("./discordEvents.js");
require("./steamEvents.js");

//dry run or start the bots
if (process.argv[2] === "dry") {
    discordBot.destroy();
    steamBot.logOff();
    steamBot.disconnect();
    process.exit();
} else {
    steamBot.logOn(config.steamLogon);
    discordBot.login(config.discordToken);
}
