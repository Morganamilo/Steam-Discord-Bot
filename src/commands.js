const bot = require("./initBots.js");
const utils = require("./utils.js");
const bind = require("./bind.js");
const config = require("./config.js");
const help = require("./help.js");

const discordBot = bot.discordBot;
const steamBot = bot.steamBot;

const messageSettings = {
    split: true
};

const commands = {};

let _sortChannel = function(a, b) {
        return utils.strCompare(a.name, b.name);
}

let _sortPositions = function(a, b) {
    if (a.position > b.position) return 1;
    if (a.position < b.position) return -1;
    return 0;
}

let _friends = function(message, showIDs, searches) {
    let reply = [];

    if (searches.length === 0 ) {
        searches[0] = "*";
    }

    for (let id in steamBot.users) {
        if (!utils.isFriend(id)) continue;

        let account = bind.getBindSteamAcc(id);

        let channelID = account.channelID;
        let steamID = account.steamID;
        let channelName = account.channel && account.channel.name;
        let steamName = account.steam && account.steam.player_name;

        for (let k in searches) {
            let search = searches[k];

            if (!utils.matches(search, [channelID, steamID, channelName, steamName])) continue;

            let left;
            let right;
            let underlineRight = false;

            if (!showIDs) {
                left = steamName;
                right = channelName;

                if (channelID && !channelName) {
                    right = "Broken ID";
                    underlineRight = true;
                }
            } else {
                left = steamID;
                right = channelID;
            }



            let r = utils.format(left, right, false, underlineRight);

            if (r) {
                reply.push(r);
            }

            break;
        }
    }

    reply.sort(utils.strCompare);

    if (reply.length === 0) {
        reply = ["No matches"];
    }

    message.reply("\n" + reply.join("\n"), messageSettings);
}

let _channels = function(message, showIDs, searches) {
    let reply = [];

    if (searches.length === 0 ) {
        searches[0] = "*";
    }

    message.guild.channels.forEach(channel => {
        let account = bind.getBindChannelAcc(channel.id);

        let channelID = account.channelID;
        let steamID = account.steamID;
        let channelName = account.channel && account.channel.name;
        let steamName = account.steam && account.steam.player_name;

        for (let k in searches) {
            let search = searches[k];
            if (!utils.matches("*" + search + "*", [channelID, steamID, channelName, steamName])) continue;

            let left;
            let right;
            let underlineRight = false;

            if (!showIDs) {
                left = channelName;
                right = steamName;

                if (steamID && !steamName) {
                    right = "Broken ID";
                    underlineRight = true;
                }
            } else {
                left = channelID;
                right = steamID;
            }



            let r = utils.format(left, right, false, underlineRight);

            if (r) {
                reply.push(r);
            }

            break;
        }
    });

    reply.sort(utils.strCompare);

    if (reply.length === 0) {
        reply = ["No matches"];
    }

    message.reply("\n" + reply.join("\n"), messageSettings);
}

let _binds = function(message, showIDs, searches) {
    let reply = [];

    if (searches.length === 0 ) {
        searches[0] = "*";
    }

    for (let cID in bind.getBinds()) {

        let account = bind.getBindChannelAcc(cID);

        let channelID = account.channelID;
        let steamID = account.steamID;
        let channelName = account.channel && account.channel.name;
        let steamName = account.steam && account.steam.player_name;

        for (let k in searches) {
            let search = searches[k];

            if (!utils.matches("*" + search + "*", [channelID, steamID, channelName, steamName])) continue;

            let left;
            let right;
            let underlineRight = false;
            let underlineLeft = false;

            if (!showIDs) {
                left = channelName;
                right = steamName;

                if (steamID && !steamName) {
                    right = "Broken ID";
                    underlineRight = true;
                }

                if (channelID && !channelName) {
                    left = "Broken ID";
                    underlineLeft = true;
                }
            } else {
                left = channelID;
                right = steamID;
            }



            let r = utils.format(left, right, underlineLeft, underlineRight);

            if (r) {
                reply.push(r);
            }

            break;
        }
    }

    reply.sort(utils.strCompare);

    if (reply.length === 0) {
        reply = ["No matches"];
    }

    message.reply("\n" + reply.join("\n"), messageSettings);
}

let _unbind = function(message, names) {
    if (names.length === 0) {
        message.reply("\n" + "Missing Name or ID", messageSettings);
        return;
    }
    
    let reply = "";
    let binds = bind.getBinds();
    
    for (let channelID in binds) {
        let steamID = binds[channelID]
        let cAccount = bind.getBindChannelAcc(channelID)
        let sAccount = bind.getBindSteamAcc(steamID)
        
        let channelName = cAccount.channel && cAccount.channel.name;
        let steamName = sAccount.steam && sAccount.steam.player_name;
        
        let matched = false;
        
        for (let k in names) {
            let name = names[k];
            
            if (utils.matches(name, [channelName, steamName, channelID, steamID])) {
                matched = true;
            }
        }
        
        if (!matched) {
            continue;
        }
        
        let left;
        let right;
        let underlineLeft;
        let underlineRight
        
        if (channelName) {
            left = channelName;
            underlineLeft = false;
        } else {
            left = "Broken ID";
            underlineLeft = true;
        }
        
        if (steamName) {
            right = steamName;
            underlineRight = false;
        } else {
            right = "Broken ID";
            underlineRight = true;
        }
        
        reply += "Unbinded " + utils.format(left, right, underlineLeft, underlineRight) + "\n";
        
        bind.unbindChannel(channelID);
    }
    
    if (!reply) {
        reply = "Nothing to unbind";
    }
    
    message.reply("\n" + reply, messageSettings);
}

commands.callCommand = function(message) {
    let tokens = utils.tokenize(message.content);
    let command = tokens[0];
    let commandFunc = commands[command];

    tokens[0] = message;

    if (commandFunc) {
        utils.log("Command executed: ");
        utils.log("\tCommand: " + message.content);
        utils.log("\tUser: " + message.author.username);
        utils.log("\tServer: " + message.guild.name);
        utils.log("\tTime: " + message.createdAt.toString());

        lastCommand = message.content;
        commandFunc(...tokens);
        return true;
    }

    return false;
}

commands["!eval"] = function(message, str) {
    if (!config.debug) return;

    let res = eval(str);
    utils.log(res);
    message.reply("\n" + toString(res), messageSettings);
}

commands["!help"] = function(message, command = "help") {
    let h = help[command];

    if (!h) {
        h = "No help entry for that command";
    }

    message.reply("\n" + h, messageSettings);
}

commands["!bind"] = async function(message, channelName, steamName) {
    let cAccount;
    let sAccount;

    let channelID;
    let steamID;

    let cName;
    let sName;

    if (!channelName) {
        message.reply("\n" + "Missing channel name", messageSettings);
        return;
    }

    if(!steamName) {
        sName = channelName
    } else {
        sName = steamName
    }

    steamID = utils.matchSteam(false, [sName], [sName]);

    if (!steamID) {
        message.reply("\n" + "Can't find Steam user" + utils.discordCode(sName), messageSettings)
        return;
    }

    sAccount = bind.getBindSteamAcc(steamID);

    if (steamName) {
        channelID = utils.matchChannel(false, message.guild, [channelName], [channelName]);

        if (!channelID && (channelName.includes("*") || channelName.includes("?"))) {
            message.reply("\n" + "No match for channel " + utils.discordCode(channelName), messageSettings);
            return;
        }
    } else {
        channelID = utils.matchChannel(false, message.guild, null, [utils.toChannelName(sAccount.steam.player_name)]);
        channelName = sAccount.steam.player_name
    }

    channelName = utils.toChannelName(channelName);
    cAccount = bind.getBindChannelAcc(channelID);

    //if steam user is bound
    if (sAccount.channelID) {
        let left;
        let right = sAccount.steam.player_name;

        if (sAccount.channel) {
            left = sAccount.channel.name;
            underlineLeft = false
        } else {
            left= "Broken ID";
            underlineLeft = true
        }

        message.reply("\n" + "Steam already bound " + utils.format(left, right, underlineLeft, false), messageSettings);
        return;
    }

    //if channel is bound
     if (cAccount.steamID) {
        let left;
        let right;
        let underlineLeft;
        let underlineRight;

        if (cAccount.channel) {
            left = cAccount.channel.name;
            underlineLeft = false
        } else {
            left = "Broken ID";
            underlineLeft = true
        }

        if (cAccount.steam) {
            right = cAccount.steam.player_name;
            underlineRight = false
        } else {
            right = "Broken ID";
            underlineRight = true
        }

        message.reply("\n" + "Channel already bound " + utils.format(left, right, underlineLeft, underlineRight), messageSettings);
        return;
    }

    let reply = "";
    let channel;
    
    //if channel doesnt already exist
    if (!cAccount.channel) {
        let server = message.guild;
        
        await server.createChannel(channelName, "text").then(ch => {
            reply += "Created channel " + utils.discordCode(ch.name) + "\n";
            channel = ch;
        }).catch(e => {
            utils.log(e);
        });
    } else {
        channel = cAccount.channel
    }
    
    bind.bind(channel.channelID, sAccount.steamID);
    reply += "Bound " + utils.format(channel.name, sAccount.steam.player_name);
    
    message.reply("\n" + reply, messageSettings);
}

commands["!autobind"] = function(message) {
    let users = steamBot.users;
    let channels = message.guild.channels;
    let reply = "";

    for (let steamID in users) {
        if (!utils.isFriend(steamID)) continue;
        let steamName = steamBot.users[steamID].player_name
        let channelName = utils.toChannelName(steamName);

        channels.every(channel => {
            if (channel.name === config.botChannel) return true;

            if (channel.name === channelName) {
                let result = bind.bind(channel.id, steamID);

                if (result) {
                    reply += "binded " + utils.format(channel.name, steamName) + "\n";
                }

                return false;
            }

            return true
        });
    }

    if (!reply) {
        reply = "No binds changed";
    }

    message.reply("\n" + reply, messageSettings);
}

commands["!ubind"] = function(message, ...names) {
    _unbind(message, names)
}

commands["!mkchannel"] = async function(message, ...names) {
    let reply = "";
    let server = message.guild;
    
    if (names.length === 0) {
        message.reply("\n" + "Missing channel name", messageSettings);
        return;
    }
    
    for (let k in names) {
        let name = names[k];
        
        name = utils.toChannelName(name);
        
        if (name.length < 2 || name.length > 100) {
            reply += utils.discordCode(name) + " must be between 2 and 100 characters\n";
            continue;
        }

        let res = await server.createChannel(name, "text").then(channel => {
            reply += "Created channel " + utils.discordCode(name) + "\n"
        }).catch(e => {
            utils.log(e);
            reply += "Could not make channel " + utils.discordCode(name) + "\n";
        });
    }
    
    message.reply("\n" + reply, messageSettings);
}

commands["!rmchannel"] = async function(message, ...channelNames) {
    let reply = "";

    if (channelNames.length === 0) {
        message.reply("\n" + "Missing channel name", messageSettings);
        return;
    }
    
    for (let k in channelNames) {
        let channelName = channelNames[k];
        let account = bind.getBindChannelAccName(message.guild, channelName);

        if (!account.channel) {
            reply += "Can't find channel " + utils.discordCode(channelName) + "\n";
            continue
        }

        if (bind.unbindChannel(account.channelID)) {
            let left;
            let right;
            let underlineLeft;
            let underlineRight;

            if (account.steam) {
                left = account.steam.player_name
                underlineLeft = false;
            } else {
                left = "Broken ID"
                underlineLeft = true;
            }

            if (account.channel) {
                right = account.channel.name;
                underlineRight = false;
            } else {
                right = "Broken ID";
                underlineRight = true;
            }

            reply += "Unbound " + utils.format(left, right, underlineLeft, underlineRight) + "\n";
        }

        await account.channel.delete().then(channel => {
            reply += "Deleted channel " + utils.discordCode(channelName) + "\n";
        }).catch(e => {
            utils.log(e);
            reply += "Couldn't delete channel " + utils.discordCode(channelName) + "\n";
        });
    }
        
    message.reply("\n" + reply, messageSettings);
}

commands["!sid"] = function(message) {
    message.channel.send(utils.format(message.guild.name, message.guild.id, false, false, "->"));
}

commands["!fid"] = function(message, ...searches) {
    let reply = "";

    if (searches.length === 0 ) {
        searches[0] = "*";
    }

    let matches = utils.matchSteam(true, searches, searches);

    for (let k in matches) {
        let steamID = matches[k];

        let name = utils.getSteamName(steamID);

        if (name) {
            reply += utils.format(name, steamID, false, false, "->") + "\n";
        }
    }

    if (!reply) {
        reply = "Nothing to show";
    }

    message.reply("\n" + reply, messageSettings);
}

commands["!cid"] = function(message, ...searches) {
    let reply = "";

    if (searches.length === 0 ) {
        searches[0] = "*";
    }

    let matches = utils.matchChannel(true, message.guild, searches, searches);

    for (let k in matches) {
        let channelID = matches[k];

        let name = utils.getChannelName(message.guild, channelID);

        if (name) {
            reply += utils.format(name, channelID, false, false, "->") + "\n";
        }
    }

    if (!reply) {
        reply = "Nothing to show";
    }

    message.reply("\n" + reply, messageSettings);
}

commands["!friends"] = function(message, ...searches) {
    _friends(message, false, searches);
}

commands["!idfriends"] = function(message, ...searches) {
    _friends(message, true, searches);
}

commands["!channels"] = function(message, ...searches) {
    _channels(message, false, searches);
}

commands["!idchannels"] = function(message, ...searches) {
    _channels(message, true, searches);

}

commands["!binds"] = function(message, ...searches) {
    _binds(message, false, searches);
}

commands["!idbinds"] = function(message, ...searches) {
   _binds(message, true, searches);
}

commands["!vbinds"] = function(message, ...searches) {
    let binds = bind.getBinds();
    let acc;
    
    if (searches.length === 0) {
        searches[0] = "*";
    }
    

    let reply = ""

    let t1 = "        ";
    let t2 = t1 + t1;
    let t3 = t2 + t1

    for (let channelID in binds) {
        let matched = false
        let steamID = binds[channelID];

        let cAccount = bind.getBindChannelAcc(channelID);
        let sAccount = bind.getBindSteamAcc(steamID)

        let channelName = cAccount.channel && cAccount.channel.name;
        let steamName = sAccount.steam && sAccount.steam.player_name;
        
        for (let k in searches) {
            let search = searches[k];
            
            if (utils.matches(search, [channelID, steamID, channelName, steamName])) matched = true;
        }
        
        if (!matched) continue;
        
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

    message.reply("\n" + reply, messageSettings);
}

commands["!fixbinds"] = function(message) {
    let binds = bind.getBinds();
    let reply = "";

    for (let channelID in binds) {
        let steamID = binds[channelID];

        let account = utils.getAccounts(channelID, steamID);

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

    message.reply("\n" + reply, messageSettings);
}

commands["!unbindall"] = function(message) {
    _unbind(message, ["*"]);
}

commands["!sort"] = function(message) {
    let server = message.guild;
    let channelCollection = server.channels;
    
    let channels = [];
    let noChannels = []
    let channelPositions = [];
    let noCount = 0;


    channelCollection.forEach(channel => {
        if (channel.constructor.name === "TextChannel") {
            if (bind.getBindChannel(channel.id)) {
                channels.push(channel);
            } else {
                noCount++
                noChannels.push(channel)
            }
        }
    });

    noChannels.sort(_sortPositions);
    channels.sort(_sortChannel);
    
    for (let pos in noChannels) {
        let channel = noChannels[pos]
        channelPositions.push({
            channel: channel.id,
            position: pos
        });
    }

    for (let index = 0; index < channels.length; index++) {
        channelPositions.push({
            channel: channels[index].id,
            position: index + noCount
        });
    }
    
    server.setChannelPositions(channelPositions).then(_ => {
        message.reply("\n" + "Sorted channels", messageSettings)
    });
}

commands["!autorename"] = function(message, ...searches) {
    if (searches.length === 0) {
        searches[0] = "*";
    }
    
    let channels = utils.matchChannel(true, message.guild, searches, searches);
    let reply = "";
    
    for (let n in channels) {
        let channelID = channels[n];
        let acc = bind.getBindChannelAcc(channelID);

        if (acc.steamID) {
            if (acc.steam) {
                let sName = utils.toChannelName(acc.steam.player_name);
                let cName = acc.channel.name;

                if (cName !== sName) {
                    if (cName === config.botChannel) cName += "_"
                    acc.channel.setName(sName);
                    reply += "Renamed " + utils.format(cName, sName, false, false, "->") + "\n";
                }
            } else {
                reply += "Can't rename broken bind " + utils.format(acc.channel.name, "Broken ID", false, true);
            }
        }
    }

    if (!reply) {
        reply = "Nothing to rename";
    }

    message.reply("\n" + reply, messageSettings);
}

module.exports = commands;
