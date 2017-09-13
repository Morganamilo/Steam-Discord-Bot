
let help = {};

help.help =
    "Help and usage for all commands. Do `!help <command>` for more detail about a specific command.\n" +
    "    `help`    Shows this help message\n" +
    "    `bind`    Binds a Discord channel to a Steam user\n" +
    "    `autobind` Automaticly bind Steam friends\n" +
    "    `autorename`    Automaticly renames channels to match their bind\n" +
    "    `ubind`    Unbinds a chennel useing the channel or username\n"+
    "    `mkchannel`    Creates a Discord channel\n" +
    "    `rmchannel`    Deletes channel, unbinds it if bound\n" +
    "    `sid`    Gets the ID of the server\n" +
    "    `fid`    Gets the Steam ID associated with a Steam name\n" +
    "    `cid`     Gets the channel ID associated with a channel name\n" +
    "    `friends`    Lists all Steam friends and their binds\n" +
    "    `idfriends`    Lists all Steam friends and their binds as IDs\n" +
    "    `channels`    Lists all chanels and their binds\n" +
    "    `idchannels`    Lists all channels and their binds as IDs\n" +
    "    `binds`    Lists all binds\n" +
    "    `idbinds`    Lists all binds as IDs\n" +
    "    `vbinds`    List all binds verbosely\n" +
    "    `fixbinds` Fixes broken binds\n" +
    "    `unbindall`    Unbinds all channels\n" +
    "    `sort`    Sorts binded channels alphabetically\n"
;

help.bind =
    "Binds a Discord channel to a Steam user. If the channel does not already exist it will be created automaticly. If no channel name is specified it will be automaticly generated from the Steam name.\n" +
    "Usage:\n" +
    "    `!bind <channel name> <Steam name>`\n" +
    "    `!bind <Steam name>`\n"
;

help.autobind =
    "Automaticly binds Steam friends to existing unbound channels that match the Steam name. It will convert the Steam name to a channel name first so that \"Foo Bar\" will match \"foo_bar\"\n" +
    "Usage:\n" +
    "    `!autobind`\n"
;

//
help.autorename =
    "Automaticly renames channel to match the Steam name of the user they are bound to. Optionaly a search string can be included to rename matching channels.\n" +
    "Usage:\n" +
    "    `!autorename\n"
    "    `!autorename <channel name>...\n" +
    "    `!autorename <channel id>...\n"
;


help.ubind =
    "Unbinds a channel. This does not delete the channel.\n" +
    "Usage:\n" +
    "    `!ubind <channel name>...`\n" +
    "    `!ubind <Steam name>...`\n" +
    "    `!ubind <channel id>...`\n" +
    "    `!ubind <Steam name>...`\n"
;

help.mkchannel =
    "Creates a Discord channel in the server the command was sent from.\n" +
    "Usage:\n" +
    "    `!mkchannel` <channel name>...`\n" +
    "    `!mkchannel` <Steam name>...`\n" +
    "    `!mkchannel` <channel id>...`\n" +
    "    `!mkchannel` <Steam name>...`\n"
;

 help.rmchannel =
    "deletes a Discord channel in the server the command was sent from. If the channel is bound it will be unbound before deletion.\n" +
    "Usage:\n" +
    "    `!rmchannel <channel name>...`\n" +
    "    `!rmchannel <channel id>...`\n"
;

help.sid =
    "Gets the name and id of the server that the command was sent from.\n" +
    "Usage:\n" +
    "    `!sid`\n"
;

help.fid =
    "Shows Steam friends and their IDs. Optionaly a search string can be used to only show matching results.\n" +
    "Usage:\n" +
    "    `!fid`" +
    "    `!fid` <channel name>...`\n" +
    "    `!fid` <Steam name>...`\n" +
    "    `!fid` <channel id>...`\n" +
    "    `!fid` <Steam id>...`\n"
;

help.cid =
    "Shows Discord channels and their IDs. Optionaly a search string can be used to only show matching results\n" +
    "Usage:\n" +
     "Usage:\n" +
    "    `!cid`" +
    "    `!cid` <channel name>...`\n" +
    "    `!cid` <Steam name>...`\n" +
    "    `!cid` <channel id>...`\n" +
    "    `!cid` <Steam id>...`\n"
;

help.friends =
    "Lists all Steam friends, if bound also lists the channel they are bound to. Optionaly a seach string can be used to only show matching results.\n" +
    "Usage:\n" +
    "    `!friends`" +
    "    `!friends` <channel name>...`\n" +
    "    `!friends` <Steam name>...`\n" +
    "    `!friends` <channel id>...`\n" +
    "    `!friends` <Steam id>...`\n"
;

help.idfriends =
     "Lists all Steam friends as IDs, if bound also lists the channel they are bound to an ID. Optionaly a seach string can be used to only show matching results.\n" +
    "Usage:\n" +
    "    `!idfriends`" +
    "    `!idfriends` <channel name>...`\n" +
    "    `!idfriends` <Steam name>...`\n" +
    "    `!idfriends` <channel id>...`\n" +
    "    `!idfriends` <Steam id>...`\n"
;

help.channels =
    "Lists all Discord channels, if bound also lists the Steam user they are bound to. Optionaly a seach string can be used to only show matching results.\n" +
    "Usage:\n" +
    "    `!channels`" +
    "    `!channels` <channel name>...`\n" +
    "    `!channels` <Steam name>...`\n" +
    "    `!channels` <channel id>...`\n" +
    "    `!channels` <Steam id>...`\n"
;

help.idchannels =
   "Lists all Discord channels as IDs, if bound also lists the Steam user they are bound to as an ID. Optionaly a seach string can be used to only show matching results.\n" +
    "Usage:\n" +
    "    `!idchannels`" +
    "    `!idchannels` <channel name>...`\n" +
    "    `!idchannels` <Steam name>...`\n" +
    "    `!idchannels` <channel id>...`\n" +
    "    `!idchannels` <Steam id>...`\n"
;

help.binds = 
    "Lists all binds. Optionaly a seach string can be used to only show matching results.\n" +
    "Usage:\n" +
    "    `!binds`" +
    "    `!binds` <channel name>...`\n" +
    "    `!binds` <Steam name>...`\n" +
    "    `!binds` <channel id>...`\n" +
    "    `!binds` <Steam id>...`\n"
;

help.idbinds = 
    "Lists all binds as IDs. Optionaly a seach string can be used to only show matching results.\n" +
    "Usage:\n" +
    "    `!idbinds`" +
    "    `!idbinds` <channel name>...`\n" +
    "    `!idbinds` <Steam name>...`\n" +
    "    `!idbinds` <channel id>...`\n" +
    "    `!idbinds` <Steam id>...`\n"
;

help.vbinds =
    "List All binds. Includes all data it can find on a binds and points out errors. Optionaly a seach string can be used to only show matching results.\n" +
    "Usage:\n" +
    "    `!vbinds`" +
    "    `!vbinds` <channel name>...`\n" +
    "    `!vbinds` <Steam name>...`\n" +
    "    `!vbinds` <channel id>...`\n" +
    "    `!vbinds` <Steam id>...`\n"
;

help.fixbinds =
    "Fixes all broken binds. Any bind with an ID that can't be resloved to either a Discord channel or Steam user is deleted\n" +
    "Usage:\n" +
    "    `!fixvbinds`\n"
;

help.unbindall = 
    "Unbinds all channels. This does not delete the channels.\n" +
    "Usage:\n" +
    "    `!unbindall`\n"
;

help.sort = 
    "Sorts binded channels alphabetically. Unbinded channels should be left at the top with binded channels underneath.\n" +
    "Usage:\n" +
    "    `!sort`\n"
;

module.exports = help;
