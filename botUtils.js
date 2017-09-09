const utils = require("./utils.js");
const bind = require("./bind.js")

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
    
    bot.getAccounts = function(channelID, steamID) {
        let accounts = {}; //make empty object
        let steam = bot.steamBot.users[steamID]; //get steam acount object (contains all data about a user)
        
        if (channelID) { //if channelID was input as an argument
            accounts.channel = bot.discordBot.channels.get(channelID); //set accounts.channel to the channel object
            accounts.channelID = channelID
        }
        
        if (steamID) { //if steamId was input as an argument
            accounts.steam = steam; ////set accounts.steam to the channel object
            accounts.steamID = steamID; //the steam object doesnt actually contain the steamID so we add it ourselfs
        }
    
        
        return accounts //return the object
    }
    
    bot.getBindSteamAcc = function(steamID) {
        let channelID = bind.getBindSteam(steamID);
        
        let accounts = bot.getAccounts(channelID, steamID);
        
        if (!channelID) {
            accounts.missingBind = true;
        }
        
        return accounts;
    }
    
    bot.getBindChannelAcc = function(channelID) {
        let steamID = bind.getBindChannel(channelID);
        
        let accounts = bot.getAccounts(channelID, steamID);
        
        if (!steamID) {
            accounts.missingBind = true;
        }
        
        return accounts;
    }
    
    bot.getBindChannelAccName = function(server, channelName) {
        let id = bot.getChannelID(server, channelName)
        
        let accounts = bot.getBindChannelAcc(id);
        
        if (channelName)  {
            accounts.channelName = channelName;
        }
        
        return accounts;
    }
    
    bot.getBindSteamAccName = function(steamName) {
        let id = bot.getSteamID(steamName)
        let accounts = bot.getBindSteamAcc(id);
        
        if (steamName) {
            accounts.steamName = steamName;
        }
        
        return accounts;
    }
}