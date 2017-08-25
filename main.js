const Discord = require('discord.js');
const discordBot = new Discord.Client();

//const ChatBot = require("steam-chat-bot").ChatBot;
var SteamUser = require('steam-user');


const config = require("./config");
const utils = require("./utils");
const bind = require("./bind.js");


//init steam bot
var steamBot = new SteamUser()
var commands = {};

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

function callCommand(message) {
    var tokens = utils.tokenize(message.content);
    var command = tokens[0];
    var commandFunc = commands[command];

    tokens[0] = message;

    if (commandFunc) {
        commandFunc.apply(this, tokens);
    }
}


commands["!bind"] = function(message, channelName, steamName) {
    var channelID = getChannelID(channelName);
    var steamID = getSteamID(steamName);

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

commands["!unbindchanne"] = function(message) {
    bind.unbindChannel(channelID);
}

commands["!test"] = function(message) {

}

commands["!boop"] = function(message) {
    message.reply("blep");
}

commands["!name"] = function(message, id) {
    message.reply(getSteamName(id));
}

commands["!id"] = function(message, name) {
    message.reply(getSteamID(name));
}

commands["!cid"] = function(message, name) {
    message.reply(getChannelID(name));
}



//discord stuff
discordBot.on('ready', () => {
    console.log('Discord bot is ready');
});

discordBot.on('message', message => {
    if (message.channel.name === "bot") {
        callCommand(message);
    }

    if (message.author.id !== discordBot.user.id) {
        var channelID = message.channel.id;
        var steamID = bind.getBindChannel(channelID);

        if (steamID) {
            steamBot.chatMessage(steamID, message.content);
        }
    }


});

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

    var channelID = bind.getBindSteam(senderID.getSteamID64());

    if (channelID) {
        discordBot.channels.get(channelID).send(message);
    }
});

//dry run or start the bots
if (process.argv[2] === "dry") {
	discordBot.destroy();
    steamBot.logOff();
	steamBot.disconnect();

    process.exit();
} else {
        steamBot.logOn(config.steamOptions);

		discordBot.login(config.discordToken);
}

