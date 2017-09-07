const fs = require("fs");

const Discord = require('discord.js');
const SteamUser = require('steam-user');

const config = require("./config");

const bot = {};

bot.discordBot = new Discord.Client();
bot.steamBot = new SteamUser()
bot.steamBot.setOptions(config.steamOptions)

require("./botUtils.js")(bot);
require("./botCommands.js")(bot);
require("./discordEvents.js")(bot);
require("./steamEvents.js")(bot);


//dry run or start the bots
if (process.argv[2] === "dry") {
    bot.discordBot.destroy();
    bot.steamBot.logOff();
	bot.steamBot.disconnect();
    process.exit();
} else {
    bot.steamBot.logOn(config.steamConfig);
    bot.discordBot.login(config.discordToken);
}
