const utils = require("./utils.js");

module.exports = function(bot) {
    bot.getSteamName = function(steamID) {
        if (bot.steamBot.users[steamID])
            return bot.steamBot.users[steamID].player_name;
    }

    bot.getSteamID = function(name) {
        for (user in bot.steamBot.users) {
            if (bot.steamBot.users[user].player_name === name) {
                return user;
            }
        }
    }

    bot.getChannelID = function(server, name) {
        let channelID;

        server.channels.forEach(channel => {
            if (channel.constructor.name === "TextChannel") {
                if (channel.name === name) {
                    channelID = channel.id;
                    return;
                }
            }
        });

        return channelID;
    }

    bot.getChannelName = function(server, channelID) {
        let channelName;

        server.channels.forEach( channel => {
            if (channel.id === channelID && channel.constructor.name === "TextChannel") {
                channelName = channel.name;
                return;
            }
        });

        return channelName;
    }
    
    bot.isFriend = function(steamID) {
        return !!bot.steamBot.myFriends[steamID];
    }
}