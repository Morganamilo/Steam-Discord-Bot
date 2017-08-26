exports.tokenize = function(str) {
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

exports.begins = function(str, begin) {
    return str.substr(0, begin.length) === begin;
}

exports.keyOf = function(obj, value) {
    for (key in obj) {
        if (obj[key] === value) {
            return key;
        }
    }
}

exports.stripUnicode = function(str1){
    str1 = str1.replace(/[^\x00-\x7F]/g, "_");
    return str1;
}
