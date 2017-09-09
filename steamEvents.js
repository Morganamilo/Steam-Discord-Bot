const utils = require("./utils");
const bind = require("./bind.js");
const config = require("./config");

const SteamUser = require('steam-user');

module.exports = function(bot) {
    bot.steamBot.on('loggedOn', function(details) {
        bot.steamBot.setPersona(SteamUser.EPersonaState.Online);

        setTimeout(function() {
           console.log("Logged into Steam as " + bot.steamBot.accountInfo.name);
        }, 1000);

    });

    bot.steamBot.on('error', function(e) {
        // Some error occurred during logon
        console.log(e);
    });

    bot.steamBot.on('accountInfo', function(name, country, authedMachines, flags, facebookID, facebookName) {
        let accountInfo = {
            "name":name,
            "country":country,
            "authedMachines":authedMachines,
            "flags":flags,
            "facebookID":facebookID,
            "facebookName":facebookName,
        };

        bot.steamBot.accountInfo = accountInfo;
    });

    bot.steamBot.on('friendMessage', function(senderID, message) {
        let steamID = senderID.getSteamID64();
        let account = bot.getBindSteamAcc(steamID);
        
        let channelID = account.channelID;

        if (account.channel) {
            account.channel.send(message);
        } else {
            let server = bot.discordBot.guilds.array()[0]; //just get the first server
            let username = utils.toChannelName(bot.getSteamName(steamID).substr(1, 100));

            if (username.length < 2) {
                username += "_";
            }
            
            server.createChannel(username, "text").then(channel => {
                bind.bind(channel.id, steamID);
                channel.send(message);
            });
        }
    });
    
    bot.steamBot.on('friendTyping', function(senderID) {
        if (!config.receiveTyping) return;
        let account = bot.getBindSteamAcc(senderID.getSteamID64());
        let channelID = account.channelID;
            
        if (account.channel) {
            account.channel.startTyping();

            setTimeout(function() {
                account.channel.stopTyping(true);
            }, 5000);
        }
    });
    
    bot.steamBot.on('friendMessageEcho', function(senderID, message) {
        let account = bot.getBindSteamAcc(senderID.getSteamID64());
        let channelID = account.channelID;
            
        if (account.channel) {
            let steamName =  account.steam.player_name;
            account.channel.send(utils.discordCode(stamName) + " -> " + message);
        }
    });
}