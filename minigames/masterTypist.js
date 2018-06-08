var typeMaster = {
    varName: "typeMaster",
    displayName: "Type Master",
    icon: "gameicons/typeMaster_icon.png",
    timed: true,
    themeColor: "#f21e61",
    timedWin: false,
    textures: [
        "type_master/pixel_pointer.png"
    ],
    sounds: [
        "type_master/key_0.mp3",
        "type_master/key_2.mp3",
        "type_master/key_3.mp3"
    ],
    requiresKeyboard: true,
    introText: "Type!",
    init: function (dif) {
        this.dif = dif;

        this.library = new Object();
        this.library.noun = ["horse", "car", "phone", "house", "mouse", "computer", "mouse", "animal", "apple"];
        this.library.conjunctionPast = ["just", "recently", "is"]
        this.library.conjunction = ["is"]
        this.library.conjunctionPlural = ["are"]
        this.library.adjective = ["nice", "cool", "real", "big", "tiny", "round", "black", "white", "red", "scary", "fun", "awesome", "american", "loving", "accidental", "avrage", "attractive"];
        this.library.verbPast = ["running", "driving", "playing", "shooting", "riding", "crying", "dying", "simming", "jumping", "finding", "calling", "killing", "riding"];
        this.library.verb = ["drove", "played", "shot", "rode", "cried", "died", "swim", "found", "called", "killed", "rode"];

        //this.library.determiner = ["the", "a", "this", "every", "many"]
        this.library.determiner = ["a"]
        this.library.determinerPlural = ["those", "these", "all"]


        this.words = [
            "Wahoo",
            "Ohyeah",
            "QWERTY",
            "Random",
            "Wow",
            "Very",
            "Nice",
            "Meme",
            "Review",
            "Me",
            "too",
            "thanks",
            "haha",
            "yes", "Dab",
            "Somebody",
            "Once",
            "Told",
            "Me",
            "The",
            "World",
            "Is",
            "Gonna",
            "Roll",
            "Me",
            "I",
            "Aint",
            "The",
            "Sharpest",
            "Tool",
            "In",
            "The",
            "Shed",
            "She",
            "Was",
            "Looking",
            "Kind",
            "Of",
            "Dumb",
            "With",
            "Her",
            "Finger",
            "And",
            "Her",
            "Thumb",
            "In",
            "The",
            "Shape",
            "Of",
            "An",
            "L",
            "On",
            "Her",
            "Forehead",
            "Well",
            "The",
            "Years",
            "Start",
            "Coming",
            "And",
            "They",
            "Dont",
            "Stop",
            "Coming",
            "Fed",
            "To",
            "The",
            "Rules",
            "And",
            "I",
            "Hit",
            "The",
            "Ground",
            "Running",
            "Didnt",
            "Make",
            "Sense",
            "Not",
            "To",
            "Live",
            "For",
            "Fun",
            "Your",
            "Brain",
            "Gets",
            "Smart",
            "But",
            "Your",
            "Head",
            "Gets",
            "Dumb",
            "So",
            "Much",
            "To",
            "Do",
            "So",
            "Much",
            "To",
            "See",
            "So",
            "Much",
            "Wrong",
            "With",
            "Taking",
            "The",
            "Backstreets",
            "You",
            "Never",
            "Know",
            "If",
            "You",
            "Dont",
            "Go",
            "You",
            "Never",
            "Shine",
            "If",
            "You",
            "Dont",
            "Glow",
            "Hey",
            "Now",
            "You",
            "Are",
            "An",
            "All",
            "Star",
            "Do",
            "You",
            "Have",
            "The",
            "Bird",
            "Gas",
            "Gas",
            "Gas",
            "Im",
            "Gonna",
            "Step",
            "On",
            "The",
            "Gas",
            "Tonight",
            "And",
            "Be",
            "Your",
            "Hero",
            "Oof",
            "My",
            "Body",
            "Is",
            "Ready",
            "But",
            "Can",
            "You",
            "Do",
            "This",
            "OwO",
            "Whats",
            "This"
        ]
        this.nextWord = undefined;
        this.wordsToType = (dif + 1);
        this.completedWords = 0;
        this.wordStart = Math.floor(Math.random() * this.words.length);


        this.word = this.words[this.wordStart];

        this.progress = 0;
        this.sinProgression = 0;
        this.colors = [255, 66, 66];
        this.cleared = false;
        this.failed = false;
        this.fallingProgress = 0;
        this.xPos = 0
        this.jumpProgress = 0;
        this.firstRun = true;
    },
    newWord: function () {
        /* Every noun needs a determiner and an adjective before it! */
        order = ["determiner", "adjective", "noun", "conjunction", "verb", "determiner", "adjective", "noun", "determiner", "adjective", "noun", "determiner", "adjective", "noun", "conjunction", "verb", "determiner", "adjective", "noun", "determiner", "adjective", "noun"]
        vowels = ["a", "e", "i", "o", "u"];

        var plural = false;

        if (Math.random() > .5) this.past = true;
        else this.past = false;

        /* Define next word */
        if (order[this.completedWords % order.length] == "determiner") {
            if (Math.random() > .5) plural = true; // 50/50 its plural for maximum variation
            this.nextWord = this.library[order[this.completedWords + 2 % order.length]][Math.floor(Math.random() * this.library[order[this.completedWords + 2 % order.length]].length)];
            this.nextAdjective = this.library.adjective[Math.floor(Math.random() * this.library.adjective.length)];
            if (plural) this.nextWord = this.nextWord + "s";

            if (plural) this.word = this.library.determinerPlural[Math.floor(Math.random() * this.library.determinerPlural.length)];
            else this.word = this.library.determiner[Math.floor(Math.random() * this.library.determiner.length)];

            if (vowels.indexOf(this.nextAdjective[0].toLowerCase()) != -1 && this.word == "a") this.word = "an";
        } else if (order[this.completedWords % order.length] == "noun") {
            this.word = this.nextWord;
        } else if (order[this.completedWords % order.length] == "conjunction") {
            
            if (Math.random() > .5) this.past = true;
            else this.past = false;

            if (!this.past) this.word = this.library.conjunctionPast[Math.floor(Math.random() * this.library.conjunctionPast.length)]
            else this.word = this.library.conjunction[Math.floor(Math.random() * this.library.conjunction.length)]
           
        } else if (order[this.completedWords % order.length] == "verb") {
            if (this.past) this.word = this.library.verbPast[Math.floor(Math.random() * this.library.verbPast.length)]
            else this.word = this.library.verb[Math.floor(Math.random() * this.library.verb.length)]

        } else if (order[this.completedWords % order.length] == "adjective") {
            this.word = this.nextAdjective;
        } else {
            this.word = this.library[order[this.completedWords % order.length]][Math.floor(Math.random() * this.library[order[this.completedWords % order.length]].length)];
        }


    },
    paint: function () {

        var pointerScale = .5;

        fill("#111");


        if (!this.failed && !this.cleared) {
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.font = "20px mario-maker";
            //ctx.fillText((this.completedWords + 1) + "/" + this.wordsToType, canvas.width / 2, 100);
            type((this.completedWords + 1) + "/" + this.wordsToType, canvas.width / 2, 100, 3, undefined, undefined, "center");
        }

        var fontSize = 350 / this.word.length;
        ctx.font = fontSize + "px mario-maker";
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        var text = {
            x: (25) + canvas.width / 2,
            y: canvas.height / 2,
            spacing: fontSize
        }


        if (this.failed) {
            this.fallingProgress += 20;
        }

        for (let i = 0; i < this.word.length; i++) {
            if (i < this.progress) {
                ctx.fillStyle = "#ffdc73";
            } else if (i == this.progress) {
                ctx.fillStyle = "white";
            } else {
                ctx.fillStyle = "grey";
            }
            if (this.cleared) {
                this.jumpProgress += .035;
                ctx.fillStyle = "rgb(" + this.colors[0] + "," + this.colors[1] + "," + this.colors[2] + ")";
                this.colors = fadeColor(this.colors[0], this.colors[1], this.colors[2])
            }
            if (i == this.progress) {
                var desiredPosition = 10 + text.x + (i * text.spacing) - (text.spacing * (this.word.length / 2)) - ((t("pixel_pointer").width / 2) * pointerScale);
                if (this.xPos < desiredPosition) this.xPos += 20;

                if (this.firstRun) {
                    this.xPos = desiredPosition;
                    this.firstRun = false;
                }

                this.sinProgression += .5;
                yExtra = Math.sin(this.sinProgression);
                // Draw pointer
                ctx.drawImage(t("pixel_pointer"), this.xPos, text.y + (yExtra * 2), t("pixel_pointer").width * pointerScale, t("pixel_pointer").height * pointerScale)
            }

            var extraY = 0;
            if (this.fallingProgress - (i * 30) >= i) {
                extraY = this.fallingProgress - (i * 10);
            }

            var jump = 0;
            if (this.cleared && i == Math.round(this.jumpProgress) % this.word.length) jump = -10;
            ctx.fillText(this.word[i], text.x + (i * text.spacing) - (text.spacing * (this.word.length / 2)), text.y + jump + extraY);
            //type(this.word[i], text.x + (i * text.spacing) - (text.spacing * (this.word.length / 2)), text.y + jump + extraY - 100, fontSize/20, undefined, undefined, "left");

        }


    },
    logic: function (key) {
        if (key.char.toLowerCase() == "shift") return;
        if (key.char.toLowerCase() == this.word[this.progress].toLowerCase()) {
            this.progress++;
            playSound(this.sounds[Math.floor(Math.random() * this.sounds.length)]);
            if (this.progress >= this.word.length && !this.cleared) {
                this.completedWords++;
                if (this.wordsToType == this.completedWords) {
                    this.cleared = true;
                    if (this.dif >= 6) {
                        achieve();
                    }
                    cleared(900);
                } else {
                    this.wordStart++;
                    //his.newWord();

                    this.word = this.words[this.wordStart % this.words.length];
                    
                    this.progress = 0;
                    this.sinProgression = 0;
                    this.colors = [255, 66, 66];
                    this.xPos = 0
                    //this.firstRun = true;
                }

            }
        } else {
            failed(900);
            this.failed = true;
        }
    },
    loop: function () {

    }

}

miniGames.push(typeMaster);