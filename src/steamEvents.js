const bot = require("./initBots.js")
const utils = require("./utils");
const bind = require("./bind.js");
const config = require("./config.js");

const SteamUser = require('steam-user');

const discordBot = bot.discordBot;
const steamBot = bot.steamBot;

steamBot.on('loggedOn', details => {
    steamBot.setPersona(SteamUser.EPersonaState.Online);

    setTimeout(function() {
        utils.log("Logged into Steam as " + steamBot.accountInfo.name);

        bot.isSteamReady = true;

        if (bot.isDiscordReady && bot.isSteamReady) {
            utils.checkBinds();
        }
    }, 1000);


});

steamBot.on('error', e => {
    // Some error occurred during logon
    utils.log(e);
});

steamBot.on('accountInfo', (name, country, authedMachines, flags, facebookID, facebookName) => {
    let accountInfo = {
        "name":name,
        "country":country,
        "authedMachines":authedMachines,
        "flags":flags,
        "facebookID":facebookID,
        "facebookName":facebookName,
    };

    steamBot.accountInfo = accountInfo;
});

steamBot.on('friendMessage', async function(senderID, message) {
    let steamID = senderID.getSteamID64();
    let account = bind.getBindSteamAcc(steamID);

    let channelID = account.channelID;
    let server = discordBot.guilds.array()[0]; 

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
            if (_channel.name === config.botChannel) {
                channel = _channel;
                return false;
            }

            return true;
        });

        if (channel) {
            let name = account.steam.player_name;
            if (name === config.botChannel) name += "_"

            channel.guild.createChannel(name, "text").then(newChannel => {
                let str = utils.discordCode(config.channelName) + " -> Recived message on steam from " + name + " but bind is broken " + utils.format("Broken ID", name, true, false) +  "\n" +
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
        let username = utils.toChannelName(utils.getSteamName(steamID));

        if (username.length < 2) {
            username += "_";
        }

        let cAccount = bind.getBindChannelAccName(server, username);
        let channel;
        
        if (!cAccount.channelID || cAccount.steamID) {
            await server.createChannel(username, "text").then(ch => {
                channel = ch;
            });
        } else {
            channel = cAccount.channel;
        }
        
        bind.bind(channel.id, steamID);
        channel.send(message);
    }
});

steamBot.on('friendTyping', senderID => {
    if (!config.receiveTyping) return;
    let account = bind.getBindSteamAcc(senderID.getSteamID64());
    let channelID = account.channelID;

    if (account.channel) {
        account.channel.startTyping();

        setTimeout(function() {
            account.channel.stopTyping(true);
        }, 5000);
    }
});

steamBot.on('friendMessageEcho', (senderID, message) => {
    let account = bind.getBindSteamAcc(senderID.getSteamID64());
    let channelID = account.channelID;

    if (account.channel) {
        let steamName =  account.steam.player_name;
        account.channel.send(utils.discordCode(steamBot.accountInfo.name) + " -> " + message + "\n.");
    }
});

steamBot.on('friendRelationship', (steamID, relationship) => {
    if (relationship !== SteamUser.EFriendRelationship.Friend) {
        bind.unbindSteam(steamID.getSteamID64());
    }
});
