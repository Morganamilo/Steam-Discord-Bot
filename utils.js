module.exports.tokenize = function(str) {
    var inQuotes = false;
    var letters = str.split("");
    var words = [];
    var wordcount = 0;

    for (var n = 0; n < letters.length; n++) {
        var letter = letters[n];

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

module.exports.begins = function(str, begin) {
    return str.substr(0, begin.length) === begin;
}

module.exports.keyOf = function(obj, value) {
    for (key in obj) {
        if (obj[key] === value) {
            return key;
        }
    }
}

module.exports.toChannelName = function(str){
    str = str.replace(/[^0-9a-z_\-]/gi, "_").toLowerCase();
    return str;
}

module.exports.discordEscape = function(str) {
    let controls = "\\*_`~";
    
    for (key in controls) {
        let control = controls[key];
        
        str = str.replace(control, "\\" + control)
    }
    
    return str
}

module.exports.discordCode = function(str) {
    str = str.replace("`", "'")
    str = "`" + str + "`";
    return str;
}

module.exports.discordUnderline = function(str) {
    str = str.replace("_", "\\_")
    str = "__" + str + "__";
    return str;
}

module.exports.discordBold = function(str) {
    str = str.replace("**", "\\**")
    str = "**" + str + "**";
    return str;
}
