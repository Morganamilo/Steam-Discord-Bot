# Steam-Discord-Bot
A proxy for linking the Steam chat to Discord's chat.

Links a steam user to a discord channel. Allowing you to talk so people on Steam, using Discord, without them ever noticing.

Based on:
* [Discord.js](https://discord.js.org/)
* [Node-Steam-User](https://github.com/DoctorMcKay/node-steam-user)

## TODO
* A proper Readme
* Auto make channel on !bind
* Reciving a message from a user with no bind should create a bind automaticly

  * If i recive a message from Foo and Foo has no bind, something equivalent to `!bind Foo Foo` should be called
  * In the rare case the channel already exits name the channel Foo (2)
* !unbind should delete the channel
* Show when someone is typing
  
  * Show when someone starts typing a message in steam
  * (Maybe) Show when you are typing, i like my privacy
* Handle errors and disconnects
  
  * Losing connection to Steam/Discord/internet is totally untested
* Impove the output of commands, make them more clear to the user
  
  * Many comamnds dont give any output when called, the bot should respond based on the result of the command
  * Calling a command incorrectly should cause the bot to respond stating the error
* Support calling !commands from within a not bot channel
  
  * For example: Calling `!delete testing` from the bot channel could also be done by calling `!delete` from within the testing channel  
