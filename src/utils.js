const config = require("./config.js");
const bot = require("./initBots.js");

const steamUser = require("steam-user");

const discordBot = bot.discordBot;
const steamBot = bot.steamBot;

const utils = {};
utils.tokenize = function(str) {
    let inQuotes = false;
    let letters = str.split("");
    let words = [];
    let wordcount = 0;

    for (let  n = 0; n < letters.length; n++) {
        let letter = letters[n];

        if (letter === "\\") {
            n++;
            letter = letters[n];
            words[wordcount] += letter;
            continue;
        }

        if (letter === "\"") {
            inQuotes = !inQuotes;
            n++;
            letter = letters[n];
            if (!letter) break;
        }

        if (!words[wordcount]) {
            words[wordcount] = "";
        }

        if (letter === " " && !inQuotes) {
            if (words[wordcount] === "") {
                continue;
            } else {
                wordcount++;
                continue;
            }
        }

        words[wordcount] += letter;

    }

    return words;
}

utils.begins = function(str, begin) {
    return str.substr(0, begin.length) === begin;
}

utils.keyOf = function(obj, value) {
    for (let  key in obj) {
        if (obj[key] === value) {
            return key;
        }
    }
}

utils.toChannelName = function(str){
    str = str.replace(/[^0-9a-z_\-]/gi, "_").toLowerCase();
    return str;
}

utils.discordEscape = function(str) {
    let controls = "\\*_`~";
    
    for (let  key in controls) {
        let control = controls[key];
        
        str = str.replace(control, "\\" + control)
    }
    
    return str
}

utils.discordCode = function(str) {
    str = str.replace("`", "'")
    str = "`" + str + "`";
    return str;
}

utils.discordUnderline = function(str) {
    str = str.replace("_", "\\_")
    str = "__" + str + "__";
    return str;
}

utils.discordBold = function(str) {
    str = str.replace("**", "\\**")
    str = "**" + str + "**";
    return str;
}

utils.strCompare = function(_a, _b) {
    for (let  k in _a) {
        let A = _a[k];
        let B = _b[k];
        
        if (!A) {
            return 1;
        }
        
        if (!B) {
            return -1;
        }
        
        let a = A.toLowerCase();
        let b = B.toLowerCase();
        
        if (a > b) return 1;
        if (a < b) return -1;
        
        if (a !== A && b === B) {
            return -1;
        }
        
        if (b !== B && a === A) {
            return 1;
        }
    }
    
    return 0;
}
utils.format = function (left, right, underlineLeft = false, underlineRight = false, arrow = " <-> ") {
    let list = "";

    if (!left) {
        return list;
    }

    left = utils.discordCode(left);
    if (underlineLeft) {
        left = utils.discordUnderline(left);
    }

    list += left;

    if (!right) {
        return list
    }

    right = utils.discordCode(right);
    if (underlineRight) {
        right = utils.discordUnderline(right);
    }

    list += " " + arrow + " " + right;

    return list;
}

utils.simpleFormat = function(left, right, arrow = "<->") {
    return "[" + left + "] " + arrow + " [" + right;
}

utils.log = function(...args) {
    if (config.logging) {
        console.log(...args)
    }
}



utils.getSteamName = function(steamID) {
    let user = steamBot.users[steamID];

    if (utils.isFriend(steamID)) {
        return user.player_name;
    }
}

utils.getSteamID = function(name) {
    for (let  userID in steamBot.users) {    
        if (!utils.isFriend(userID)) continue;

        let user = steamBot.users[userID];
        if (user.player_name === name) return userID;
    }
}

utils.getChannelID = function(server, name) {
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

utils.getChannelName = function(server, channelID) {
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

 utils.isFriend = function(steamID) {
    let user = steamBot.users[steamID];

    if (user) {
        return steamBot.myFriends[steamID] === steamUser.EFriendRelationship.Friend;
    }
}

utils.getAccounts = function(channelID, steamID) {
    let accounts = {}; //make empty object
    let steam = steamBot.users[steamID]; //get steam acount object (contains all data about a user)

    if (channelID) { //if channelID was input as an argument
        accounts.channel = discordBot.channels.get(channelID); //set accounts.channel to the channel object
        accounts.channelID = channelID
    }

    if (steamID) { //if steamId was input as an argument
        if (utils.isFriend(steamID)) {
            accounts.steam = steam; ////set accounts.steam to the channel object
        }

        accounts.steamID = steamID; //the steam object doesnt actually contain the steamID so we add it ourselfs
    }


    return accounts //return the object
}

utils.checkBinds = function () {
    let currentBinds = bind.getBinds();
    let errors = "";

    utils.log("\nChecking binds: ");

    for (let  channelID in currentBinds) {
        let steamID = currentBinds[channelID];

        let account = bind.getBindChannelAcc(channelID);
        let left;
        let right;

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
            //utils.log(utils.format(left, right, leftUnderline, rightUnderline))
            errors += "\t[" + left + "] <-> [" + right + "]" + "\n";

        }
    }
    if (errors) {
        utils.log("\tErrors were found: ");
        utils.log(errors);
    }

    if (!errors) {
        utils.log("\tNo errors found.");
    }
}

module.exports = utils;
const bind = require("./bind.js");