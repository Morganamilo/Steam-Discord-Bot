# Steam-Discord-Bot
A bot for linking Steam's chat to Discord's chat.

Allows you to talk with friends on steam from the discord client.

## Installation

Clone this repository:

    $ git clone https://github.com/Morganamilo/Steam-Discord-Bot.git
    $ cd Steam-Discord-Bot
    
Install npm modules:

    $ npm install discord.js
    $ npm install steam-user
    
Edit the config file:

     $ cp config.json.template config.json
     $ vim config.json
     
Start the bot:

    $ node main.js

## Usage

Create a server and add your Discord bot to it. It is intended that only you and your Discord bot are added to the server as anyone in the server will be able to send and receive messages as if they were you.

Commands can be sent to the bot in the bot channel. The default name for this channel is `bot` but this can be changed in the config file.

Type `!help` to get a list of commands.

Communication between you and a Steam friend is done using binds. A bind is simply a link between a channel ID and a Steam ID. When you bind a channel to a user they become linked, any messages sent in the channel will be forwarded to the Steam user and any message sent by the steam user will be forwarded to the channel.

Note `channel name` can always be substituted with `channel ID` and `Steam name` can always be substituted with `Steam ID`

To create a bind simply do `!bind <Steam name>`. If you wish to specify the channel name do `!bind <channel name> <Steam name>`. Otherwise the channel name will be the same as the steam name.

This creates a bind between the steam user and a channel. If the channel does not exist it will be created automatically.

Another way to create a bind is to create a channel with the same name as your steam friend and do `!autobind`. It will detect channels with a matching name and bind them together.

If you receive a message on Steam from a user that has no bind, a bind will automatically be created equivalent to calling `!bind <Steam name>`.

Binds are automatically deleted when you delete a channel or are no longer friends with someone on Steam.

To delete a bind manually do `!ubind <channel name>` or `!ubind <Steam name>`. If you also wish to delete the channel you can do `!rmchannel <channel name>` instead.

Sometimes a bind may become broken. This can be caused by deleting a channel or removing a Steam friend while the bot is not running.

To simply delete all the broken binds do `!fixbinds`. To delete just one do `!ubind <channel name>` or `!ubind <Steam name>`. Alternatively re-friending that user will also fix the bind.

## Config

All settings are stored in config.json.

### discordToken

The token for your Discord bot.

### botChannel

Sets the name of the channel that the bot will listen to commands on.

Defaults to `bot`.

### receiveTyping

Controls whether or not friends typing on Steam will trigger typing in their Discord channel.

Defaults to `true`.

### sendTyping

Controls whether or not typing on Discord will show your friends that you are typing.

Defaults to `true`.

### logging

Controls whether or not the bot will print out information to the console.

Defaults to `true`.

### steamLogon

The logon settings passed to the Steam bot.

see https://github.com/DoctorMcKay/node-steam-user#logondetails

### steamConfig

The config settings passed to the Steam bot.

see https://github.com/DoctorMcKay/node-steam-user#options-
