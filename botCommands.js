const utils = require("./utils");
const bind = require("./bind.js");

const messageSettings = {
  split: true  
};

function logCmd(message) {
    console.log("\nCommand executed: ");
    console.log("\tUser: " + message.author.username);
    console.log("\tCommand: " + message.content);
    console.log("\tServer: " + message.guild.name);
    console.log("\tTime: " + message.createdAt.toString());
}

module.exports = function(bot) {
    const commands = {};

    let _search = function(terms, search) {
        if (!search) return true;
        
        search = search.toLowerCase();
        
        for (key in terms) {
            let term = terms[key];
            
            if (term) {
                if (term.toLowerCase().includes(search)) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    

    let _friends = function(message, search, showIDs) {
        let reply = [];

        for (id in bot.steamBot.users) {
            if (!bot.isFriend(id)) continue;

            let account = bot.getBindSteamAcc(id);

            let channelID = account.channelID;
            let steamID = account.steamID;
            let channelName = account.channel && account.channel.name;
            let steamName = account.steam && account.steam.player_name;

            if (!_search([channelID, steamID, channelName, steamName], search)) continue;

            let left;
            let right;
            let underlineRight = false;

            if (!showIDs) {
                left = steamName;
                right = channelName;

                if (channelID && !channelName) {
                    right = "Broken ID";
                    underlineRight = true
                }
            } else {
                left = steamID;
                right = channelID;
            }



            let r = utils.format(left, right, false, underlineRight);

            if (r) {
                reply.push(r);
            }
        }

        reply.sort(utils.strCompare);
        message.reply(reply.join("\n"), messageSettings);
    }

    let _channels = function(message, search, showIDs) {
        let reply = [];

        message.guild.channels.forEach(channel => {
            let account = bot.getBindChannelAcc(channel.id);

            let channelID = account.channelID;
            let steamID = account.steamID;
            let channelName = account.channel && account.channel.name;
            let steamName = account.steam && account.steam.player_name;

            if (!_search([channelID, steamID, channelName, steamName], search)) return;

            let left;
            let right;
            let underlineRight = false;

            if (!showIDs) {
                left = channelName;
                right = steamName;

                if (steamID && !steamName) {
                    right = "Broken ID";
                    underlineRight = true
                }
            } else {
                left = channelID;
                right = steamID;
            }



            let r = utils.format(left, right, false, underlineRight);

            if (r) {
                reply.push(r);
            }
        });

        reply.sort(utils.strCompare);
        message.reply(reply.join("\n"), messageSettings);
    }

    let _binds = function(message, search, showIDs) {
        let reply = [];

        for (cID in bind.getBinds()) {
            let account = bot.getBindChannelAcc(cID);

            let channelID = account.channelID;
            let steamID = account.steamID;
            let channelName = account.channel && account.channel.name;
            let steamName = account.steam && account.steam.player_name;

            if (!_search([channelID, steamID, channelName, steamName], search)) return;

            let left;
            let right;
            let underlineRight = false;
            let underlineLeft = false;

            if (!showIDs) {
                left = channelName;
                right = steamName;

                if (steamID && !steamName) {
                    right = "Broken ID";
                    underlineRight = true
                }

                if (channelID && !channelName) {
                    left = "Broken ID";
                    underlineLeft = true
                }
            } else {
                left = channelID;
                right = steamID;
            }



            let r = utils.format(left, right, underlineLeft, underlineRight);

            if (r) {
                reply.push(r);
            }
        }

        reply.sort(utils.strCompare);
        message.reply(reply.join("\n"), messageSettings);
    }

    bot.commands = commands;
        
    bot.callCommand = function(message) {
        let tokens = utils.tokenize(message.content);
        let command = tokens[0];
        let commandFunc = commands[command];

        tokens[0] = message;

        if (commandFunc) {
            logCmd(message);
            commandFunc.apply(this, tokens);
            return true;
        }
        
        return false;
    }
    
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
                    "Created channel " + utils.discordCode(channelName) + "\n Bound" +
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

    commands["!ubind"] = function(message, name) {
        if (!name) {
            message.reply("Missing channel name or Steam name");
            return;
        }
        
        let cAccount = bot.getBindChannelAccName(message.guild, name);
        let sAccount = bot.getBindSteamAccName(name);
        
        if (!cAccount.channelID && !sAccount.steamID) {
            message.reply(utils.discordCode(channelName) + " is not bound");
            return;
        }
        
        if (cAccount.channelID) {
            commands["!cubind"](message, name);
        } else if (sAccount.steamID) {
            commands["!subind"](message, name);
        }
    }
    
    commands["!cubind"] = function(message, channelName) {
        if (!channelName) {
            message.reply("Missing channel name");
            return;
        }
        
        let account = bot.getBindChannelAccName(message.guild, channelName);
        let from;
        
        if (account.steam) {
            from = account.steam.player_name;
        } else {
            from = "Broken ID";
        }
        
        if (!account.steamID) {
            message.reply(utils.discordCode(channelName) + " is not bound");
        } else {
            bind.unbindChannel(account.channelID); 
            message.reply("Unbound " + utils.discordCode(channelName) + " <-> " + utils.discordCode(from));
        }
    }

    commands["!subind"] = function(message, steamName) {
        if (!steamName) {
            message.reply("Missing steam name");
            return;
        }
        
        let account = bot.getBindSteamAccName(steamName);
        let from;
        
        if (account.channel) {
            from = account.channel.name;
        } else {
            from = "Broken ID";
        }
        
        if (!account.channelID) {
            message.reply(utils.discordCode(steamName) + " is not bound");
        } else {
            bind.unbindSteam(account.steamID); 
            message.reply("Unbound " + utils.discordCode(from) + " <-> " + utils.discordCode(steamName));
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
        let reply = "";
        
        if (!channelName) {
            message.reply("Missing channel name");
            return;
        }
        
        let account = bot.getBindChannelAccName(message.guild, channelName);
        
        if (account.channel) {
            if (bind.unbindChannel(account.channelID)) {
                let from;
                
                if (account.steam) {
                    from = account.steam.player_name
                } else {
                    from = "Broken ID"
                }
                
                reply += "Unbound " + utils.discordCode(channelName) + " <-> " + utils.discordCode(from) + "\n";
            }
            
            account.channel.delete().then(channel => {
                reply += "Deleted channel " + utils.discordCode(channelName);
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
        _friends(message, search, false);
    }
    
    commands["!idfriends"] = function(message, search) {
        _friends(message, search, true);
    }
    
    commands["!channels"] = function(message, search) {     
        _channels(message, search, false);
    }
    
    commands["!idchannels"] = function(message, search) {     
        _channels(message, search, true);
 
    }

    commands["!binds"] = function(message, search) {
       _binds(message, search, false);
    }

    commands["!idbinds"] = function(message, search) {
       _binds(message, search, false);
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
                    reply += t3 + utils.discordUnderline("Does not exist on Steam") + "\n";
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
                    reply += t3 + utils.discordUnderline("Does not exist on Discord") + "\n";
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
                reply += "IDs " + utils.discordUnderline(utils.discordCode(channelID)) + " <-> " + utils.discordUnderline(utils.discordCode(steamID)) + "\n";
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
    
    commands["!unbindall"] = function(message) {
        bind.unbindAll();
        
        message.reply("Reset binds");
    }
    
    commands["!sort"] = function(message) {
        let channelCollection = message.guild.channels;
        let channels = [];
        let noCount = 0;
        
           
        channelCollection.forEach(channel => {
            if (channel.constructor.name === "TextChannel") {
                if (bind.getBindChannel(channel.id)) {
                    channels.push(channel);    
                } else {
                    noCount++;
                }
            }
        });
        
        channels.sort(utils.strCompare);
        let k = channels.length;
       
        function next() {
            k--;
            
            if (k < 0) return;
            
            channels[k].setPosition(k + noCount).then(next)
        }
        
        next()
    }
}