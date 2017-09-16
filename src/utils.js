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
    if (str === config.botChannel) {
        str += "_";
    }
    
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
    return "[" + left + "] " + arrow + " [" + right + "]";
}

utils.log = function(...args) {
    let date = new Date();

    if (config.logging) {
        console.log("[" + date + "]", ...args)
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
    let channel = server.channels.find(ch => {
        return ch.constructor.name === "TextChannel" && ch.name === name;
    });
    
    return channel && channel.id;
}

utils.getChannelName = function(server, channelID) {
    let channel = server.channels.find( ch => {
        return ch.id === channelID && ch.constructor.name === "TextChannel";
    });

    return channel && channel.name;
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

utils.search = function(str, searchThrough) {
    if (!str) return true;

    str = str.toLowerCase();

    for (let  key in searchThrough) {
        let srch = searchThrough[key];

        if (srch) {
            if (srch.toLowerCase().includes(str)) {
                return true;
            }
        }
    }

    return false;
}

utils.match = function(pattern, match, n = 0, s = 0) {
    //console.log(n);
    //console.log(s);
    //console.log("match " + pattern.substr(n) + "\t")
    //console.log(" with " + match.substr(s) + "\n")
    if (!pattern || !match) return false;

    for (; n <= Math.max(pattern.length, match.length); n++, s++) {
        let c = pattern[n];
        let mc = match[s];

        if (c === "?") {
            if (!mc) return false;
            continue;
        }

        if (c === "*") {
            while(pattern[n + 1] === "*") {
                n++
            }

            if (!pattern[n+1]) return true;

            for (let _s = s; _s < Math.max(pattern.length, match.length); _s++) {
                let m = utils.match(pattern, match, n + 1, _s);

                if (m) {
                    return true;
                }
            }

            return false;
        }

        if (c !== mc) {
            return false;
        }
    }

    return true;
}

utils.matches = function(pattern, matches) {
    for (let k in matches) {
        let match = matches[k];
        
        if (match && utils.match(pattern, match)) return match;
    }
}

utils.matchSteam = function(allowMultiple, steamNames, steamIDs) {
    let users = steamBot.users
    let matches = [];
    
    let _sortSteam = function(a, b) {
        return utils.strCompare(utils.getSteamName(a), utils.getSteamName(b));
    }
    
    userLoop:
    for (let id in users) {
        let user = users[id];
        
        if (!utils.isFriend(id)) continue;
        
        for  (let k in steamIDs) {
            let steamID = steamIDs[k];

            if (utils.match(steamID, id)) {
                matches.push(id);
                if (!allowMultiple) break userLoop;
                continue userLoop
            }
        }
        
        for (let k in steamNames) {
            let steamName = steamNames[k];
            
            if (utils.match(steamName, user.player_name)) {
                matches.push(id);
                if (!allowMultiple) break userLoop;
                continue userLoop
            }
            
        }
    }

    if (!allowMultiple) return matches[0];

    matches.sort(_sortSteam);
    
    return matches;
}

utils.matchChannel = function(allowMultiple, server, channelIDs, channelNames) {
    let channels = server.channels;
    let matches = [];
    
    let _sortChan = function(a, b) {
        return utils.strCompare(utils.getChannelName(server, a), utils.getChannelName(server, b))
    }
    
    channels.every(channel => {
        if (channel.constructor.name !== "TextChannel") return true;
        
        for (let k in channelIDs) {
            let channelID = channelIDs[k];
            
            if (utils.match(channelID, channel.id)) {
                matches.push(channel.id);
                return allowMultiple;
            }
        }
        
        for (let k in channelNames) {
            let channelName = channelNames[k];
            
            if ( utils.match(channelName, channel.name)) {
                matches.push(channel.id);
                return allowMultiple;

            }
        }
        
        return true;
    });
    
    if (!allowMultiple) return matches[0];

    matches.sort(_sortChan);
    
    return matches;
}


module.exports = utils;
const bind = require("./bind.js");
