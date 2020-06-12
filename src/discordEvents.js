const bot = require("./initBots.js")
const bind = require("./bind.js");
const config = require("./config.js");
const utils = require("./utils.js")
const commands = require("./commands.js")

const discordBot = bot.discordBot;
const steamBot = bot.steamBot;

discordBot.on('ready', () => {
    utils.log('Logged into Discord as ' + discordBot.user.username);
    discordBot.user.setGame("<3");
    
    
    bot.isDiscordReady = true; 
    if (bot.isDiscordReady && bot.isSteamReady) {
        utils.checkBinds();
    }
});

discordBot.on('message', message => {
    if (message.channel.name === config.botChannel) {
        commands.callCommand(message);
    }

    if (message.author.id !== discordBot.user.id) {
        let channelID = message.channel.id;
        let accounts = bind.getBindChannelAcc(message.channel.id)
        let steamID = accounts.steamID

        if (accounts.steam) {
            if (message.content) {
                steamBot.chatMessage(steamID, message.content);
            }

            message.attachments.forEach( attachment => {
                steamBot.chatMessage(steamID, attachment.url);
            });
        } else if (accounts.steamID) {
            utils.log("Sent discord message but bind is broken:");
            utils.log("\tBind: " + utils.simpleFormat(message.channel.name, "Broken ID"));
            utils.log("\tBind ID: " + utils.simpleFormat(message.channel.id, accounts.steamID));
            utils.log("\tUser: " + message.author.username);
            utils.log("\tServer: " + message.guild.name);
            utils.log("\tTime: " + message.createdAt.toString());

            let reply = utils.discordCode(config.channelName) + " -> Broken bind " + utils.format(message.channel.name, "BrokenID", false, true);
            message.reply("\n" + reply);
        }
    }


});

discordBot.on("typingStart", (channel, user) => {
    if (user.id === discordBot.user.id) return;
    if (!config.sendTyping) return;    

    let account = bind.getBindChannelAcc(channel.id);
    let steamID = account.steamID;

    if (account.steam) {
        steamBot.chatTyping(steamID);
    }

});

discordBot.on("channelDelete", channel => {
    bind.unbindChannel(channel.id)
});

discordBot.on("messageUpdate", (oldMessage, newMessage) => {
    if (oldMessage.author.id === discordBot.user.id) return;
    let channel = newMessage.channel;

    if (channel.lastMessageID === newMessage.id) {
        let account = bind.getBindChannelAcc(channel.id);
        let steamID = account.steamID;

        if (account.steam) {
            if (newMessage.content) {
                steamBot.chatMessage(steamID, newMessage.content + "*");
            }
        }
    }
});

discordBot.on('error', (err) => {
   console.log(err.message);
});
