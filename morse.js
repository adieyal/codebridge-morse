var morse_lookup = {
    a : "sl", b : "lsss", c : "lsls", d : "lss",
    e : "s", f : "ssls", g : "lls", h : "ssss",
    i : "ss", j : "slll", k : "lsl", l : "slss",
    m : "ll", n : "ls", o : "lll", p : "slls",
    q : "llsl", r : "sls", s : "sss", t : "l",
    u : "ssl", v : "sssl", w : "sll", x : "lssl",
    y : "lsll", z : "llss",
    1 : "sllll", 2: "sslll", 3: "sssll", 4: "ssssl",
    5 : "sssss", 6: "lssss", 7: "llsss", 8: "lllss",
    9:  "lllls", 0: "lllll",
    " ": "space"
}
var morse = {
    text_to_morse : function(text) {
        text = text.toLowerCase();
        var code = []
        for (idx in text) {
            var letter = text[idx]
            if (morse_lookup[letter]) {
                code.push(morse_lookup[letter])
            }
        }
        return code
    }
}

function MorseNode(ac, rate) {
    // ac is an audio context.
    this._oscillator = ac.createOscillator();
    this._gain = ac.createGain();
    this._oscillator.connect(this._gain);
    this._gain.connect(ac.destination);

    this._gain.gain.value = 0;
    this._oscillator.frequency.value = 750;


    if(rate == undefined)
        rate = 20;
    this._dot = 1.2 / rate; // formula from Wikipedia.
    this._oscillator.start(0);

}

MorseNode.prototype.MORSE = {
    "A": ".-",
    "B": "-...",
    "C": "-.-.",
    "D": "-..",
    "E": ".",
    "F": "..-.",
    "G": "--.",
    "H": "....",
    "I": "..",
    "J": ".---",
    "K": "-.-",
    "L": ".-..",
    "M": "--",
    "N": "-.",
    "O": "---",
    "P": ".--.",
    "Q": "--.-",
    "R": ".-.",
    "S": "...",
    "T": "-",
    "U": "..-",
    "W": ".--",
    "X": "-..-",
    "Y": "-.--",
    "Z": "--..",

    "1": ".----",
    "2": "..---",
    "3": "...--",
    "4": "....-",
    "5": ".....",
    "6": "-....",
    "7": "--...",
    "8": "---..",
    "9": "----.",
    "0": "-----"
};

MorseNode.prototype.playChar = function(t, c) {
    for(var i = 0; i < c.length; i++) {
        switch(c[i]) {
        case '.':
            this._gain.gain.setValueAtTime(1.0, t);
            t += this._dot;
            this._gain.gain.setValueAtTime(0.0, t);
            break;
        case '-':
            this._gain.gain.setValueAtTime(1.0, t);
            t += 3 * this._dot;
            this._gain.gain.setValueAtTime(0.0, t);
            break;
        }
        t += this._dot;
    }
    return t;
}

MorseNode.prototype.playString = function(t, w) {
    var w = w.toUpperCase();
    for(var i = 0; i < w.length; i++) {
        if(w[i] == ' ') {
            t += 3 * this._dot; // 3 dots from before, three here, and
                                // 1 from the ending letter before.
        }
        else if(this.MORSE[w[i]] != undefined) {
            t = this.playChar(t, this.MORSE[w[i]]);
            t += 2 * this._dot;
        }
    }
    return t;
}
