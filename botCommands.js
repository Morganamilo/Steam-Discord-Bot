const utils = require("./utils");
const bind = require("./bind.js");

module.exports = function(bot) {
    const commands = {};

    commands["!help"] = function(message, command = "help") {
        let help = bot.help[command];
        
        if (!help) {
            help = "No help entry for that command";
        }
        
        message.reply(help);
    }
    
    commands["!bind"] = function(message, channelName, steamName) {
        if (!channelName) {
            message.reply("Missing channel name");
            return;
        }
        
        if (!steamName) {
            steamName = channelName;
        }
        
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
            let cNameB = utils.discordCode(bot.getChannelName(message.guild, steamBind));
            let sNameB = utils.discordCode(bot.getSteamName(bind.getBindChannel(steamBind)), true);
            message.reply("Steam user " + sNameB + " is already bound to channel " + cNameB);
            return;
        }

        //if channel is bound
        if (channelBind) {
            let sNameB = utils.discordCode(bot.getSteamName(channelBind), true);
            let cNameB = utils.discordCode(bot.getChannelName(message.guild, bind.getBindSteam(channelBind)), true);
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
        if (!channelName) {
            message.reply("Missing channel name");
            return;
        }
        
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
        if (!steamName) {
            message.reply("Missing steam name");
            return;
        }
        
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
        if (!channelName) {
            message.reply("Missing channel name");
            return;
        }
        
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
        if (!channelName) {
            message.reply("Missing channel name");
            return;
        }
        
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

    commands["!sname"] = function(message, steamID) {
        if (!steamID) {
            message.reply("Missing steam ID");
            return;
        }
        
        let name = bot.getSteamName(steamID);
        
        if (name) {
            message.reply(utils.discordCode(name));
        } else {
            message.reply("Cant find steam user with ID " + utils.discordCode(steamID));
        }
    }

    commands["!sid"] = function(message, steamName) {
        if (!steamName) {
            message.reply("Missing steam name");
            return;
        }
        
        let id = bot.getSteamID(steamName);
        
        if (id) {
            message.reply(utils.discordCode(id));
        } else {
            message.reply("Cant find steam user " + utils.discordCode(steamName));
        }
    }

    commands["!cname"] = function(message, channelID) {
        if (!channelID) {
            message.reply("Missing channel ID");
            return;
        }
        
        let name = bot.getChannelName(message.guild, channelID);
        
        if (name) {
            message.reply(utils.discordCode(name));
        } else {
            message.reply("Cant find channel with ID " + utils.discordCode(channelID));
        }
    }
    
     commands["!cid"] = function(message, channelName) {
        if (!channelName) {
            message.reply("Missing channel name");
            return;
        }
         
        channelName = utils.toChannelName(channelName);
        let id = bot.getChannelID(message.guild, channelName);
        
        if (id) {
            message.reply(utils.discordCode(id));
        } else {
            message.reply("Cant find channel " + utils.discordCode(channelName));
        }
    }

    commands["!friends"] = function(message, search) {     
        let str = "\n";
        
        if (search) search = search.toLowerCase();
        
        for (id in bot.steamBot.users) {
            let user = bot.steamBot.users[id];
            
            if (bot.isFriend(id)) {
                let channelName = bot.getChannelName(message.guild, bind.getBindSteam(id));
                let steamName = user.player_name;
                let lSteamName = steamName.toLowerCase();
                
                let thisMessage = utils.discordCode(steamName)
                
                if (channelName) {
                    thisMessage += " <-> " + utils.discordCode(channelName);
                }
                
                if (!search) {
                    str += thisMessage + "\n";
                } else if(lSteamName.includes(search)) {
                    str += thisMessage + "\n";
                } else if (channelName && channelName.includes(search)) {
                    str += thisMessage + "\n";
                }
            }
        }
        
         message.reply(str);        
    }
    
    commands["!channels"] = function(message, search) {     
        let str = "\n";
        let server = message.guild;
        
        if (search) search = search.toLowerCase();
        
        server.channels.forEach(channel => {
            let channelName = channel.name;
            let channelID = channel.id;
            let steamName = bot.getSteamName(bind.getBindChannel(channelID));

            let thisMessage = utils.discordCode(channelName)
            let lSteamName;
            
            if (steamName) {
                lSteamName = steamName.toLowerCase();
                thisMessage += " <-> " + utils.discordCode(steamName);
            }

            if (!search) {
                str += thisMessage + "\n";
            } else if(steamName && lSteamName.includes(search)) {
                str += thisMessage + "\n";
            } else if (channelName.includes(search)) {
                str += thisMessage + "\n";
            }
        });
        
         message.reply(str);        
    }
    
    commands["!idchannels"] = function(message, search) {     
        let str = "\n";
        
        if (search) search = search.toLowerCase();
        
        bot.discordBot.channels.forEach(channel => {
            let channelID = channel.id;
            let steamID = bind.getBindChannel(channel.id);

            let thisMessage = utils.discordCode(channelID)
            
            if (steamID) {
                thisMessage += " <-> " + utils.discordCode(steamID);
            }

            if (!search) {
                str += thisMessage + "\n";
            } else if(steamID && lSteamID.includes(search)) {
                str += thisMessage + "\n";
            } else if (channelID.includes(search)) {
                str += thisMessage + "\n";
            }
        });
        
         message.reply(str);        
    }

    commands["!binds"] = function(message, search) {
        let binds = bind.getBinds();
        let nameBinds = "\n"
        
        if (search) search = search.toLowerCase();

        for (channelID in binds) {
            let steamID = binds[channelID];

            let channelName = bot.getChannelName(message.guild, channelID);
            let steamName = bot.getSteamName(steamID);

            let thisBind =  utils.discordCode(channelName) + " <-> " + utils.discordCode(steamName) + "\n";
            
            if (!search) {
                nameBinds += thisBind;
            } else if(channelName.includes(search)) {
                nameBinds += thisBind;
            } else if(steamName.includes(search)) {
                nameBinds += thisBind;
            }
        }

        message.reply(nameBinds);
    }

    commands["!idbinds"] = function(message, search) {
        let binds = bind.getBinds();
        let nameBinds = "\n"
        
        if (search) search = search.toLowerCase();

        for (channelID in binds) {
            let steamID = binds[channelID];

            let thisBind =  utils.discordCode(channelID) + " <-> " + utils.discordCode(steamID) + "\n";
            
            if (!search) {
                nameBinds += thisBind;
            } else if(channelID.includes(search)) {
                nameBinds += thisBind;
            } else if(steamID.includes(search)) {
                nameBinds += thisBind;
            }
        }

        message.reply(nameBinds);

    }

    commands["!unbindall"] = function(message) {
        bind.unbindAll();
        
        message.reply("Reset binds");
    }
    
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
    
    commands["!sort"] = function(message) {
        let channelCollection = message.guild.channels;
        let channels = [];
        let noCount = 0;
        
        function compare(a,b) {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
            return 0;
        }
        
        channelCollection.forEach(channel => {
            if (channel.constructor.name === "TextChannel") {
                if (bind.getBindChannel(channel.id)) {
                    channels.push(channel);    
                } else {
                    noCount++;
                }
            }
        });
        
        channels.sort(compare);
        
        for (k = 0; k < channels.length; k++) {
            let channel = channels[k];
            
            channel.setPosition(k + noCount);
        }
        
    }
}