const utils = require("./utils");
const bind = require("./bind.js");

const messageSettings = {
  split: true  
};

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

        //if steam user is bound
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
        
        if (channelName.length < 2 || channelName.length > 100) {
            message.reply("Channel name must be between 2 and 100 characters");
            return;
        }
        
        channelName = utils.toChannelName(channelName);
        
        let server = message.guild
        server.createChannel(channelName, "text").then(channel => {
            message.reply("Created channel " + utils.discordCode(channelName));
        }).catch(e => {
            message.reply("Failed to make channel");
            console.log(e);
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
                reply += "Unbound " + utils.discordCode(channelName) + "\n";
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
        
         message.reply(str, messageSettings);        
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

            if (!channelName) {
                channelName = "Missing"
            }
            
            if (!steamName) {
                steamName = "Missing"
            }
            
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
        
        for (k = channels.length -1; k > 0; k--) {
            let channel = channels[k];
            
            channel.setPosition(k + noCount);
        }
    }
    
    commands["!vbinds"] = function(message, search, name = "") {
        let binds;
        let acc;
        
        if (search == "cid") {
            acc = bot.getBindChannelAcc(name)
        }
        
        if (search == "cname") {
            acc = bot.getBindChannelAccName(bot.discordBot, name)
        }
       
        if (search == "sid") {
            acc = bot.getBindSteamAcc(name)
        }
        
        if (search == "sname") {
            acc = bot.getBindSteamAccName(name)
        }
        
        if (acc) {
            binds = {};
            binds[acc.channelID] = acc.steamID;
        } else {
            binds = bind.getBinds();
        }
        
        
        let reply = ""
        
        let t1 = "        ";
        let t2 = t1 + t1;
        let t3 = t2 + t1
        
        for (channelID in binds) {
            let steamID = binds[channelID];
            
            let cAccount = bot.getBindChannelAcc(channelID);
            let sAccount = bot.getBindSteamAcc(steamID)
            
            reply += utils.discordBold("Bind " + utils.discordCode(channelID) + " <-> " + utils.discordCode(steamID) + " ->") + "\n";
            
            reply += t1 + utils.discordBold("Discord Channel ->") + "\n";
            
            if (cAccount.channelID) {
                reply += t2 + "ID " + utils.discordCode(cAccount.channelID) + "\n";
                
                if (cAccount.channel) {
                    reply += t2 + "Exists on Discord as " + utils.discordCode(cAccount.channel.name) + "\n";
                    reply += t2 + "In server " + utils.discordCode(cAccount.channel.guild.name) + "\n";
                } else {
                    reply += t2 + utils.discordUnderline("Does not exist on Discord") + "\n";
                }
                
                reply += t2 + utils.discordBold("Bound to Steam user ->") + "\n";
                
                if (cAccount.steamID) {
                    reply += t3 + "ID " + utils.discordCode(cAccount.steamID) + "\n"; 
                } else {
                    reply += t3 + utils.discordUnderline("Could not find Steam ID") + "\n"; //this should be impossible
                }
                
                if (cAccount.steam) {
                    reply += t3 + "Exists on Steam as" + utils.discordCode(cAccount.steam.player_name) + "\n";
                } else {
                    reply += t3 + utils.discordUnderline("Does not exit on Steam") + "\n";
                }
                
            } else {
                reply += t2 + utils.discordUnderline("Could not find ID") + "\n"; //this should be impossible
            }
            
            reply += "\n";            
            
            reply += t1 + utils.discordBold("Steam user ->") + "\n";
            
            if (sAccount.steamID) {
                reply += t2 + "ID " + utils.discordCode(sAccount.steamID) + "\n";
                
                if (sAccount.steam) {
                    reply += t2 + "Exists on Steam as " + utils.discordCode(sAccount.steam.player_name) + "\n";
                } else {
                    reply += t2 + utils.discordUnderline("Does not exist on Steam") + "\n";
                }
                
                reply += t2 + utils.discordBold("Bound to Discord channel ->") + "\n";
                
                if (sAccount.channelID) {
                    reply += t3 + "ID " + utils.discordCode(sAccount.channelID) + "\n"; 
                } else {
                    reply += t3 + utils.discordUnderline("Could not find ID") + "\n"; //this should be impossible
                }
                
                if (sAccount.channel) {
                    reply += t3 + "Exists on Discord as" + utils.discordCode(sAccount.channel.name) + "\n";
                    reply += t3 + "In server " + utils.discordCode(sAccount.channel.guild.name) + "\n";
                } else {
                    reply += t3 + utils.discordUnderline("does not exit on Discord") + "\n";
                }
                
            } else {
                reply += t2 + utils.discordUnderline("Could not find ID") + "\n"; //this should be impossible
            }            
        
            reply += "\n";            
            reply += "\n"; 
            
        
        }
        
        message.reply(reply, messageSettings);
    }
    
    commands["!fixbinds"] = function(message) {
        let binds = bind.getBinds();
        let reply = "";
        
        for (channelID in binds) {
            let steamID = binds[channelID];
            
            let account = bot.getAccounts(channelID, steamID);
            
            if (!account.channel || !account.steam) {
                let channelName;
                let steamName;
              
                if (!account.channel) {
                    channelName = utils.discordUnderline(utils.discordCode("Broken ID"));
                } else {
                    channelName = utils.discordCode(account.channel.name);
                }
                
                if (!account.steam) {
                    steamName = utils.discordUnderline("Broken ID");
                } else {
                    steamName = account.steam.player_name
                }
                
                reply += "Unbinded " + channelName + " <-> " + steamName + "\n";
                reply += "Unbinded " + utils.discordUnderline(utils.discordCode(channelID)) + " <-> " + utils.discordUnderline(utils.discordCode(steamID)) + "\n";
                reply += "\n"
                
                bind.unbindChannel(channelID);
                bind.unbindSteam(steamID);
            }
        }
        
        if (reply === "") {
            reply = "Nothing to fix :D";
        }
        
        message.reply(reply);
    }
        
    bot.commands = commands;
        
    bot.callCommand = function(message) {
        let tokens = utils.tokenize(message.content);
        let command = tokens[0];
        let commandFunc = commands[command];

        tokens[0] = message;

        if (commandFunc) {
            commandFunc.apply(this, tokens);
            return true;
        }
        
        return false;
    }
    
}