module.exports = function(bot) {
    let help = {};  

    help.help = 
        "Help and usage for all commands. Do `!help <command>` for more detail about a specific command.\n" +
		"    `help`    Shows this help message\n" +
        "    `bind`    Binds a discord channel to a steam user\n" +
        "    `cubind`    Unbinds a channel using the channel name\n" +
        "    `subind`    Unbinds a channel using the steam username\n" +
		"    `mkchannel`    Creates a discord channel\n" +
		"    `rmchannel`    Deletes channel, unbinds it if bound\n" +
		"    `sname`    Gets the steam name associated with a steam ID\n" +
		"    `sid`    Gets the steam ID associated with a steam name\n" +
		"    `cname`     Gets the channel name associated with a channel ID\n" +
		"    `cid`     Gets the channel ID associated with a channel name\n" +
		"    `friends`    Lists all steam friends and their binds\n" +
		"    `channels`    Lists all chanels and their binds\n" +
		"    `idchannels`    Lists all channels and their binds as IDs\n" +
		"    `binds`    Lists all binds\n" +
        "    `vbids`    List all binds verbosely"
		"    `idbinds`    Lists all binds as IDs\n" +
		"    `unbindall`    Unbinds all channels\n" +
        "    `sort`    Sorts binded channels alphabetically\n"
	;
    
    help.bind =
        "Binds a discord channel to a steam user. If the channel does not already exist it will be created automaticly. If no channel name is specified it will be automaticly generated from the steam name.\n" +
        "Usage:\n" +
        "    `!bind <channel name> <steam name>`\n" +
        "    `!bind <steam name>`\n"
    ;
    
    
    help.cubind =
        "Unbinds a channel using the channel name, it does not delete the channel.\n" +
        "Usage:\n" +
        "    `!cubind <channel name>`\n"
    ;
    
    help.subind =
        "Unbinds a channel using the steam username, it does not delete the channel.\n" +
        "Usage:\n" +
        "    `!subind <steam name>`\n"
    ;
    
    help.mkchannel =
        "Creates a discord channel in the server the command originated from\n" +
        "Usage:\n" +
        "    `!mkchannel <channel name>`\n"
    ;
    
     help.rmchannel =
        "deletes a discord channel in the server the command originated from. If the channel is bound it will be unbound before deletion\n" +
        "Usage:\n" +
        "    `!rmchannel <channel name>`\n"
    ;
    
     help.sname =
        "Gets the steam name associated with a steam ID\n" +
        "Usage:\n" +
        "    `!sname <steam ID>`\n"
    ;
    
    help.sid =
        "Gets the steam ID associated with a steam name\n" +
        "Usage:\n" +
        "    `!sid <steam name>`\n"
    ;
    
    help.cname =
        "Gets the channel name associated with a channel ID. Will only search for channels belonging to the server the command originated from\n" +
        "Usage:\n" +
        "    `!cname <channel ID>`\n"
    ;
    
    help.cid =
        "Gets the channel ID associated with a channel name. Will only search for channels belonging to the server the command originated from\n" +
        "Usage:\n" +
        "    `!cid <channel name>`\n"
    ;
    
    help.friends =
        "Lists all steam friends, if bound also lists the channel they are bound to. Optionaly a seach term can be used where the list will only contain entries where the steam name or channel name contains the search term.\n" +
        "Usage:\n" +
        "    `!friends`\n" +
        "    `!friends <search>`\n"
    ;
    
    help.channels =
        "Lists all channels belonging to the server the message originated from, if bound also list the steam user it is bound to. Optionaly a seach term can be used where the list will only contain entries where the steam name or channel name contains the search term.\n" +
        "Usage:\n" +
        "    `!channels`\n" +
        "    `!channels <search>`\n"
    ;
    
    help.idchannels =
        "Lists all channels IDs belonging to the server the message originated from, if bound also list the steam user IDs it is bound to. Optionaly a seach term can be used where the list will only contain entries where the steam ID or channel ID contains the search term.\n" +
        "Usage:\n" +
        "    `!idchannels`\n" +
        "    `!idchannels <search>`\n"
    ;
    
    help.binds = 
        "Lists all binds, showing the channel name and steam name. Optionaly a seach term can be used where the list will only contain entries where the steam name or channel name contains the search term.\n" +
        "Usage:\n" +
        "    `!binds`\n" +
        "    `!binds <search>`\n"
    ;
    
    help.vbinds =
        "List All binds or a specific bind very verbosely. Includes all data it can find on a binds and points out errors.\n" +
        "Usage:\n" +
        "    `!vbinds`\n" +
        "    `!binds cid <channel ID>`\n" +
        "    `!binds cname <channel name>`\n" +
        "    `!binds sid <steam name>`\n" +
        "    `!binds sname <steam name>`\n" 
    ;
    
    help.idbinds = 
        "Lists all binds in ID form, showing the channel ID and steam ID. Optionaly a seach term can be used where the list will only contain entries where the steam ID or channel ID contains the search term.\n" +
        "Usage:\n" +
        "    `!idbinds`\n" +
        "    `!idbinds <search>`\n"
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
    
    bot.help = help;
}