const utils = require("./utils");
const bind = require("./bind.js");
const config = require("./config");

const SteamUser = require('steam-user');

module.exports = function(bot) {
    bot.steamBot.on('loggedOn', details => {
        bot.steamBot.setPersona(SteamUser.EPersonaState.Online);

        setTimeout(function() {
            utils.log("Logged into Steam as " + bot.steamBot.accountInfo.name);

            bot.isSteamReady = true;

            if (bot.isDiscordReady && bot.isSteamReady) {
                bot.checkBinds();
            }
        }, 1000);

        
    });

    bot.steamBot.on('error', e => {
        // Some error occurred during logon
        utils.log(e);
    });

    bot.steamBot.on('accountInfo', (name, country, authedMachines, flags, facebookID, facebookName) => {
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

    bot.steamBot.on('friendMessage', (senderID, message) => {
        let steamID = senderID.getSteamID64();
        let account = bot.getBindSteamAcc(steamID);
        
        let channelID = account.channelID;
        let server = bot.discordBot.guilds.array()[0]; 
        
        if (account.channel) {
            account.channel.send(message);
        } else if (account.channelID) {
            let channel;
            let date = new Date();
            
            utils.log("Recived message from steam but bind is broken:");
            utils.log("\tBind: " + utils.simpleFormat("Broken ID", account.steam.playerName));
            utils.log("\tBind ID: " + utils.simpleFormat(account.discordID, account.steamID));
            utils.log("\tTime: " + date);
                        
            server.channels.every(_channel => {
                if (_channel.name === "bot") {
                    channel = _channel;
                    return false;
                }
                
                return true;
            });
            
            if (channel) {
                let name = account.steam.player_name;
                channel.guild.createChannel(name, "text").then(newChannel => {
                    let str = "`bot` -> Recived message on steam from " + name + " but bind is broken " + utils.format("Broken ID", name, true, false) +  "\n" +
                    "Binding to new channel " + utils.format(newChannel.name, account.steam.player_name) + "\n."; 

                    utils.log("Created replacment channel: " + newChannel.name);
                    utils.log("Binding to this instead:");
                    
                    bind.unbindSteam(account.steamID);
                    bind.bind(newChannel.id, account.steamID);
                    
                    newChannel.send(str);
                    newChannel.send(message);
                });
            }
        } else {
            //just get the first server
            let username = utils.toChannelName(bot.getSteamName(steamID).substr(0, 100));
            
            if (username.length < 2) {
                username += "_";
            }
            
            let cAccount = bot.getBindChannelAccName(server, username);
            if (cAccount.channelID && !cAccount.steamID) {
                bind.bind(cAccount.channelID, steamID);
                cAccount.channel.send(message);
            } else {
                server.createChannel(username, "text").then(channel => {
                    bind.bind(channel.id, steamID);
                    channel.send(message);
                });
            }
        }
    });
    
    bot.steamBot.on('friendTyping', senderID => {
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
    
    bot.steamBot.on('friendMessageEcho', (senderID, message) => {
        let account = bot.getBindSteamAcc(senderID.getSteamID64());
        let channelID = account.channelID;
            
        if (account.channel) {
            let steamName =  account.steam.player_name;
            account.channel.send(utils.discordCode(bot.steamBot.accountInfo.name) + " -> " + message + "\n.");
        }
    });
    
    bot.steamBot.on('friendRelationship', (steamID, relationship) => {
        if (relationship !== SteamUser.EFriendRelationship.Friend) {
            bind.unbindSteam(steamID.getSteamID64());
        }
    });
}