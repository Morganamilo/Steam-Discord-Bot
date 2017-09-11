const bind = require("./bind.js");
const config = require("./config");
const utils = require("./utils")

module.exports = function(bot) {
    bot.discordBot.on('ready', () => {
        utils.log('Logged into Discord as ' + bot.discordBot.user.username);
        bot.isDiscordReady = true; 
        if (bot.isDiscordReady && bot.isSteamReady) {
            bot.checkBinds();
        }
    });

    bot.discordBot.on('message', message => {
        if (message.channel.name === "bot") {
            bot.callCommand(message);
        }

        if (message.author.id !== bot.discordBot.user.id) {
            let channelID = message.channel.id;
            let accounts = bot.getBindChannelAcc(message.channel.id)
            let steamID = accounts.steamID

            if (accounts.steam) {        
                if (message.content) {
                    bot.steamBot.chatMessage(steamID, message.content);
                }

                message.attachments.forEach( attachment => {
                    bot.steamBot.chatMessage(steamID, attachment.url);
                });
            } else if (accounts.steamID) {
                utils.log("Sent discord message but bind is broken:");
                utils.log("\tBind: " + utils.simpleFormat(message.channel.name, "Broken ID"));
                utils.log("\tBind ID: " + utils.simpleFormat(message.channel.id, accounts.steamID));
                utils.log("\tUser: " + message.author.username);
                utils.log("\tServer: " + message.guild.name);
                utils.log("\tTime: " + message.createdAt.toString());
                
                let reply = "`bot` -> Broken bind " + utils.format(message.channel.name, "BrokenID", false, true);
                message.reply(reply);
            }
        }


    });
    
    bot.discordBot.on("typingStart", (channel, user) => {
        if (user.id === bot.discordBot.user.id) return;
        if (!config.sendTyping) return;    
        
        let account = bot.getBindChannelAcc(channel.id);
        let steamID = account.steamID;
        
        if (account.steam) {
            bot.steamBot.chatTyping(steamID);
        }
        
    });
    
    bot.discordBot.on("channelDelete", channel => {
        bind.unbindChannel(channel.id)
    });
    
    bot.discordBot.on("messageUpdate", (oldMessage, newMessage) => {
        if (oldMessage.author.id === bot.discordBot.user.id) return;
        let channel = newMessage.channel;
        
        if (channel.lastMessageID === newMessage.id) {
            let account = bot.getBindChannelAcc(channel.id);
            let steamID = account.steamID;

            if (account.steam) {
                if (newMessage.content) {
                    bot.steamBot.chatMessage(steamID, newMessage.content + "*");
                }
            }   
        }
    });
}