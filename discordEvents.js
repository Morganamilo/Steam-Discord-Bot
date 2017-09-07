const bind = require("./bind.js");

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

}