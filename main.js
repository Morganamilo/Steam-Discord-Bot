const Discord = require('discord.js');
const discordBot = new Discord.Client();

const ChatBot = require("steam-chat-bot").ChatBot;

const config = require("./config")


//init steam bot
var steamBot = new ChatBot(config.steamUsername, config.steamPassword, config.steamOptions);
steamBot.addTriggers(config.triggers);


//discord stuff
discordBot.on('ready', () => {
  console.log('I am ready!');
});

discordBot.on('message', message => {
  if (message.content === 'ping') {
    message.reply('pong');
  }
});


//dry run or start the bots
if (process.argv[2] === "dry") {
	discordBot.destroy();
	process.exit();
} else {
	var dicordPromise = new Promise((resolve, reject) => {
		//start discord bot
		discordBot.login(config.discordToken);
	});

	var steamPromise = new Promise((resolve, reject) => {
		//start steam bot
		steamBot.connect();
	});
}
