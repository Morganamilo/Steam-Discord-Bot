const utils = require("./utils.js");
const bind = require("./bind.js");
const steamUser = require("steam-user");

module.exports = function(bot) {
    bot.getSteamName = function(steamID) {
        let user = bot.steamBot.users[steamID];
        
        if (bot.isFriend(steamID)) {
            return user.player_name;
        }
    }

    bot.getSteamID = function(name) {
        for (userID in bot.steamBot.users) {    
            if (!bot.isFriend(userID)) continue;
            
            let user = bot.steamBot.users[userID];
            if (user.player_name === name) return userID;
        }
    }

    bot.getChannelID = function(server, name) {
        let channelID;

        server.channels.every(channel => {
            if (channel.constructor.name === "TextChannel") {
                if (channel.name === name) {
                    channelID = channel.id;
                    return false;
                }
            }
            
            return true;
        });

        return channelID;
    }

    bot.getChannelName = function(server, channelID) {
        let channelName;

        server.channels.every( channel => {
            if (channel.id === channelID && channel.constructor.name === "TextChannel") {
                channelName = channel.name;
                return false;
            }
            
            return true;
        });

        return channelName;
    }
    
     bot.isFriend = function(steamID) {
        let user = bot.steamBot.users[steamID];

        if (user) {
            return bot.steamBot.myFriends[steamID] === steamUser.EFriendRelationship.Friend;
        }
    }
    
    bot.getAccounts = function(channelID, steamID) {
        let accounts = {}; //make empty object
        let steam = bot.steamBot.users[steamID]; //get steam acount object (contains all data about a user)
        
        if (channelID) { //if channelID was input as an argument
            accounts.channel = bot.discordBot.channels.get(channelID); //set accounts.channel to the channel object
            accounts.channelID = channelID
            accounts.channelBoundTo = bind.getBindChannel(channelID);
        }
        
        if (steamID) { //if steamId was input as an argument
            if (bot.isFriend(steamID)) {
                accounts.steam = steam; ////set accounts.steam to the channel object
            }
            
            accounts.steamID = steamID; //the steam object doesnt actually contain the steamID so we add it ourselfs
            accounts.steamBoundTo = bind.getBindSteam(steamID);
        }
    
        
        return accounts //return the object
    }
    
    bot.getBindSteamAcc = function(steamID) {
        let channelID = bind.getBindSteam(steamID);
        let accounts = bot.getAccounts(channelID, steamID);
        
        return accounts;
    }
    
    bot.getBindChannelAcc = function(channelID) {
        let steamID = bind.getBindChannel(channelID);
        let accounts = bot.getAccounts(channelID, steamID);
        
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
    
    bot.getBindSteamAccName = function (steamName) {
        
        let id = bot.getSteamID(steamName)
        let accounts = bot.getBindSteamAcc(id);
        
        if (steamName) {
            accounts.steamName = steamName;
        }
        
        return accounts;
    }

    bot.checkBinds = function () {
        let currentBinds = bind.getBinds();
        let errors = "";

        console.log("\nChecking binds: ");

        for (channelID in currentBinds) {
            let steamID = currentBinds[channelID];

            let account = bot.getBindChannelAcc(channelID);
            let left;
            let right;

            //let sAccount = bot.getBindSteamAcc(steamID);

            if (!account.channel) {
                left = "Broken ID";
            } else {
                left = account.channel.name;
            }

            if (!account.steam) {
                right = "Broken ID";
            } else {
                right = account.steam.player_name;
            }

            
            if (!account.channel || !account.steam) {
                //console.log(utils.format(left, right, leftUnderline, rightUnderline))
                errors += "\t[" + left + "] <-> [" + right + "]" + "\n";

            }
        }
        if (errors) {
            console.log("\tErrors were found: ");
            console.log(errors);
        }

        if (!errors) {
            console.log("\tNo errors found.");
        }
    }
}