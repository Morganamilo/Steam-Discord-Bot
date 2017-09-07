module.exports = function(bot) {
    let help = {};
    
    help["help"] = "`Shows this help message`";
    help["bind"] = "`!bind <channel name> <steam name>\n" +
        "!bind <steam name>`";
    
    bot.help = help;
}