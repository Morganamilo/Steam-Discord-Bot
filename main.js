const fs = require("fs");
const Discord = require('discord.js');
const discordBot = new Discord.Client();

//const ChatBot = require("steam-chat-bot").ChatBot;
const SteamUser = require('steam-user');


const config = require("./config");
const utils = require("./utils");
const bind = require("./bind.js");


//init steam bot
var steamBot = new SteamUser()
var commands = {};

steamBot.setOptions(config.steamOptions)
var sentryFile = fs.readFileSync("./steamdata/sentry.morganamilo.bin");
steamBot.setSentry(sentryFile);


function getSteamName(steamID) {
    if (steamBot.users[steamID])
        return steamBot.users[steamID].player_name;
}

function getSteamID(name) {
    for (user in steamBot.users) {
        if (steamBot.users[user].player_name === name) {
            return user;
        }
    }
}

function getChannelID(name) {
    var channelID;

    discordBot.channels.forEach(channel => {
        if (channel.constructor.name === "TextChannel") {
            if (channel.name === name) {
                channelID = channel.id;
                return;
            }
        }
    });

    return channelID;
}

function getChannelName(channelID) {
    var channel = discordBot.channels.get(channelID)
    if (channel) return channel["name"];
}

function callCommand(message) {
    var tokens = utils.tokenize(message.content);
    var command = tokens[0];
    var commandFunc = commands[command];

    tokens[0] = message;

    if (commandFunc) {
        commandFunc.apply(this, tokens);
    }
}

function makeChannel(message){
    var server = message.guild;
    var usrname = message.author.username;

    server.createChannel(usrname, "text");
}



commands["!bind"] = function(message, channelName, steamName) {
    var channelID = getChannelID(channelName);
    var steamID = getSteamID(steamName);

    if (channelName === "bot") {
        message.reply("bot is reserved for commands and can not be bound");
        return;
    }

    if (!steamID) {
        message.reply("Invalid Steam Name");
        return;
    }

    if (!channelID) {
        message.reply("Invalid Channel Name");
        return;
    }


    bind.bind(channelID, steamID);
    message.reply("Binded " + channelID + " To " + steamID);
}

commands["!cubind"] = function(message, channelName) {
    var channelID = getChannelID(channelName);
    bind.unbindChannel(channelID);
}

commands["!subind"] = function(message, steamName) {
    var steamID = getSteamID(steamName);
    bind.unbindSteam(steamID);
}


commands["!sname"] = function(message, id) {
    message.reply(getSteamName(id));
}

commands["!sid"] = function(message, name) {
    message.reply(getSteamID(name));
}

commands["!cid"] = function(message, name) {
    message.reply(getChannelID(name));
}

commands["!cname"] = function(message, id) {
    message.reply(getChannelName(id));
}

commands["!friends"] = function(message, search) {
    var friends = [];

    if (search) search = search.toLowerCase();

    for (id in steamBot.users) {
        var name = steamBot.users[id].player_name;

        var friendBind = getChannelName(bind.getBindSteam(id));
        if (friendBind) name = name + " -> " + friendBind;
        if (steamBot.steamID.getSteamID64() === id) name += " -> bot";

        if (!search || name.toLowerCase().includes(search) || (friendBind && friendBind.toLowerCase().includes(search))) {
            friends.push(name);
        }
    }

    message.reply("\n" + friends.join("\n"));
}

    commands["!binds"] = function(message, search) {
        var binds = bind.getBinds();
        var nameBinds = "\n"
        if (search) search = search.toLowerCase();

        for (channelID in binds) {
            var steamID = binds[channelID];

            var channelName = getChannelName(channelID);
            var steamName = getSteamName(steamID);

            if (!search || channelName.toLowerCase().includes(search) || steamName.toLowerCase().includes(search)) {
                nameBinds = nameBinds + channelName + " -> " + steamName + "\n";
            }
        }

        message.reply(nameBinds);

    }

    commands["!idbinds"] = function(message) {
        var binds = bind.getBinds();
        var nameBinds = "\n"
        for (channelID in binds) {
            var steamID = binds[channelID];

            nameBinds = nameBinds + channelID + " -> " + steamID + "\n";
        }

        message.reply(nameBinds);

    }


commands["!boop"] = function(message) {
    message.reply("blep");
}

commands["!channelname"] = commands["!cname"];
commands["!channelid"] = commands["!cid"];
commands["!steamname"] = commands["!sname"];
commands["!steamid"] = commands["!sid"];




//discord events
discordBot.on('ready', () => {
    console.log('Logged into Discord as ' + discordBot.user.username);
});

discordBot.on('message', message => {
    if (message.channel.name === "bot") {
        callCommand(message);
    }

    if (message.author.id !== discordBot.user.id) {
        var channelID = message.channel.id;
        var steamID = bind.getBindChannel(channelID);

        if (steamID) {
            if (message.content) {
                steamBot.chatMessage(steamID, message.content);
            }

            message.attachments.forEach( attachment => {
                steamBot.chatMessage(steamID, attachment.url);
            });
        }
    }


});

//steam events
steamBot.on('loggedOn', function(details) {
    steamBot.setPersona(SteamUser.EPersonaState.Online);

    setTimeout(function() {
       console.log("Logged into Steam as " + steamBot.accountInfo.name);
    }, 1000);

    //for (k in steamBot.myFriends) console.log(k);
});

steamBot.on('error', function(e) {
	// Some error occurred during logon
	console.log(e);
});

steamBot.on('accountInfo', function(name, country, authedMachines, flags, facebookID, facebookName) {
	var accountInfo = {
        "name":name,
        "country":country,
        "authedMachines":authedMachines,
        "flags":flags,
        "facebookID":facebookID,
        "facebookName":facebookName,
    };

    steamBot.accountInfo = accountInfo;
});

steamBot.on('user', function(sid, user) {

});

steamBot.on('friendMessage', function(senderID, message) {
	console.log(senderID, message);
    var steamID = senderID.getSteamID64()
    var channelID = bind.getBindSteam(steamID);

    if (channelID) {
        discordBot.channels.get(channelID).send(message);
    } else {
        var server = discordBot.guilds.array()[0];
        var username = getSteamName(steamID);

        server.createChannel(utils.stripUnicode(username), "text").then(channel => {
            bind.bind(channel.id, steamID);
            channel.send(message);
        });
    }
});

//dry run or start the bots
if (process.argv[2] === "dry") {
	discordBot.destroy();
    steamBot.logOff();
	steamBot.disconnect();

    process.exit();
} else {
    steamBot.logOn(config.steamConfig);
    discordBot.login(config.discordToken);
}
