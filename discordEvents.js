const bind = require("./bind.js");
const config = require("./config");

module.exports = function(bot) {
    bot.discordBot.on('ready', () => {
        console.log('Logged into Discord as ' + bot.discordBot.user.username);
    });

    bot.discordBot.on('message', message => {
        if (message.channel.name === "bot") {
            bot.callCommand(message);
        }

        if (message.author.id !== bot.discordBot.user.id) {
            let channelID = message.channel.id;
            let steamID = bind.getBindChannel(channelID);

            if (steamID) {
                if (message.content) {
                    bot.steamBot.chatMessage(steamID, message.content);
                }

                message.attachments.forEach( attachment => {
                    bot.steamBot.chatMessage(steamID, attachment.url);
                });
            }
        }


    });
    
    bot.discordBot.on("typingStart", (channel, user) => {
        if (user.id === bot.discordBot.user.id) return;
        if (!config.sendTyping) return;    
        
        let steamID = bind.getBindChannel(channel.id);
        
        if (steamID) {
            bot.steamBot.chatTyping(steamID);
        }
        
    });
    
    bot.discordBot.on("channelDelete", channel => {
        bind.unbindChannel(channel.id)
    });
    
    bot.discordBot.on("messageUpdate", (oldMessage, newMessage) => {
        let channel = newMessage.channel;
        
        if (channel.lastMessageID === newMessage.id) {
            let steamID = bind.getBindChannel(channel.id);

            if (steamID) {
                if (newMessage.content) {
                    bot.steamBot.chatMessage(steamID, newMessage.content) + "*";
                }
            }   
        }
    });
}