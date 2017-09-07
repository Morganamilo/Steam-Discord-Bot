const utils = require("./utils");
const bind = require("./bind.js");

module.exports = function(bot) {
    const commands = {};

    commands["!bind"] = function(message, channelName, steamName) {
        channelName = utils.toChannelName(channelName);
        
        let channelID = bot.getChannelID(message.guild, channelName);
        let steamID = bot.getSteamID(steamName);

        let steamBind = bind.getBindSteam(steamID);
        let channelBind = bind.getBindChannel(channelID);

        let cName = utils.discordCode(channelName);
        let sName = utils.discordCode(steamName);
        
    
        if (channelName === "bot") {
            message.reply("`bot` is reserved for commands and can not be bound");
            return;
        }

        if (!steamID) {
            let sName = utils.discordCode(steamName);
            message.reply("Can't find Steam user " + sName);
            return;
        }

        //if steam user is bount
        if (steamBind) {
            let cNameB = utils.discordCode(bot.getChannelName(steamBind));
            let sNameB = utils.discordCode(bot.getSteamName(bind.getBindChannel(steamBind)), true);
            message.reply("Steam user " + sNameB + " is already bound to channel " + cNameB);
            return;
        }

        //if channel is bount
        if (channelBind) {
            let sNameB = utils.discordCode(bot.getSteamName(channelBind), true);
            let cNameB = utils.discordCode(bot.getChannelName(bind.getBindSteam(channelBind)), true);
            message.reply("Channel " + cNameB + " is already bound to Steam user " + sNameB);
            return;
        }


        if (!channelID) {
            let server = message.guild;

            server.createChannel(channelName, "text").then(channel => {
                bind.bind(channel.id, steamID);
                message.reply(
                    "Created channel " + utils.discordCode(channelName) + "\n" +
                    cName + " <-> " + sName
                );
            }).catch(e => {
                console.log(e);
                message.reply(e);
            }); } else {
                bind.bind(channelID, steamID);
                message.reply(cName + " <-> " + sName);
        }
    }

    commands["!cubind"] = function(message, channelName) {
        channelName = utils.toChannelName(channelName);
        
        let channelID = bot.getChannelID(message.guild, channelName);
        let steamID = bind.getBindChannel(channelID);
        
        channelName = utils.discordCode(channelName);
        
        if (!steamID) {
            message.reply(channelName + " is not bound");
        } else {
            bind.unbindChannel(channelID);
            message.reply("Unbound " + channelName)
        }
    }

    commands["!subind"] = function(message, steamName) {        
        let steamID = bot.getSteamID(steamName);
        let channelID = bind.getBindSteam(steamID);
        
        steamName = utils.discordCode(steamName);
        
        if (!channelID) {
            message.reply(steamName + " is not bound");
        } else {
            bind.unbindSteam(steamID);
            message.reply("Unbound " + steamName)
        }
    }

    commands["!mkchannel"] = function(message, channelName) {
        channelName = utils.toChannelName(channelName);
        
        let server = message.guild
        server.createChannel(channelName, "text").catch(e => {
            message.reply("Failed to make channel");
            console.log(e);
        }).then(channel => {
            message.reply("Created channel " + utils.discordCode(channelName));
        });
    }
    
    commands["!rmchannel"] = function(message, channelName) {
        channelName = utils.toChannelName(channelName);
        let reply = "";
        
        let server = message.guild;
        let channelID = bot.getChannelID(server, channelName);
        
        if (channelID) {
            let channel = server.channels.get(channelID);
            let channelBind = bind.getBindChannel(channelID);
            
            if (channelBind && bind.unbindChannel(channelID) == bind.SUCCESS) {
                reply = "Unbound " + utils.discordCode(channelName) + "\n";
            }
            
            channel.delete().then(channel => {
                reply += "Deleted channel " + utils.discordCode(channel.name);
                message.reply(reply);
            });
        } else {
            reply += "Can't find channel " + utils.discordCode(channelName);
            message.reply(reply);
        }
    }

    commands["!sname"] = function(message, id) {
        message.reply(bot.getSteamName(id));
    }

    commands["!sid"] = function(message, name) {
        message.reply(bot.getSteamID(name));
    }

    commands["!cid"] = function(message, name) {
        message.reply(getChannelID(message.guild, name));
    }

    commands["!cname"] = function(message, id) {
        message.reply(bot.getChannelName(id));
    }

    commands["!friends"] = function(message, search) {
        let friends = [];

        if (search) search = search.toLowerCase();

        for (id in bot.steamBot.users) {
            let name = bot.steamBot.users[id].player_name;

            let friendBind = bot.getChannelName(bind.getBindSteam(id));
            if (friendBind) name = name + " -> " + friendBind;
            if (bot.steamBot.steamID.getSteamID64() === id) name += " -> bot";

            if (!search || name.toLowerCase().includes(search) || (friendBind && friendBind.toLowerCase().includes(search))) {
                friends.push(name);
            }
        }

        message.reply("\n" + friends.join("\n"));
    }

    commands["!binds"] = function(message, search) {
        let binds = bind.getBinds();
        let nameBinds = "\n"
        if (search) search = search.toLowerCase();

        for (channelID in binds) {
            let steamID = binds[channelID];

            let channelName = bot.getChannelName(channelID);
            let steamName = bot.getSteamName(steamID);

            if (!search || channelName.toLowerCase().includes(search) || steamName.toLowerCase().includes(search)) {
                nameBinds = nameBinds + channelName + " -> " + steamName + "\n";
            }
        }

        message.reply(nameBinds);

    }

    commands["!idbinds"] = function(message) {
        let binds = bind.getBinds();
        let nameBinds = "\n"
        for (channelID in binds) {
            let steamID = binds[channelID];

            nameBinds = nameBinds + channelID + " -> " + steamID + "\n";
        }

        message.reply(nameBinds);

    }

    commands["!unbindall"] = function() {
        bind.unbindAll();
    }


    commands["!echo"] = function(message, str) {
        console.log(str);
        message.reply(str);
    }
    
    commands["!eval"] = function(message, block) {
        message.reply(eval(block));
    }
    
    commands["!test"] = function(message, block) {
        console.log(bot.steamBot.myFriends);
    }

    commands["!channelname"] = commands["!cname"];
    commands["!channelid"] = commands["!cid"];
    commands["!steamname"] = commands["!sname"];
    commands["!steamid"] = commands["!sid"];
    
    bot.commands = commands;
    
    bot.callCommand = function(message) {
        let tokens = utils.tokenize(message.content);
        let command = tokens[0];
        let commandFunc = commands[command];

        tokens[0] = message;

        if (commandFunc) {
            commandFunc.apply(this, tokens);
        }
    }
}