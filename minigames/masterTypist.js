var typeMaster = {
    varName: "typeMaster",
    displayName: "Type Master",
    timed: true,
    timedWin: false, 
    textures: ["pixel_pointer.png"],
    sounds: ["key_0.mp3", "key_1.mp3", "key_2.mp3", "key_3.mp3"],
    requiresKeyboard: true,
    introText: "Type!",
    init: function(dif){
        this.words = ["Wahoo", "Ohyeah", "QWERTY", "Random", "Wow", "Very", "Nice", "Meme", "Review", "Me",  "too", "thanks", "haha" , "yes", "Dab", "Somebody", "Once", "Told", "World", "Roll", "Sharpest", "Tool", "Shed", "Looking", "Kind", "Dumb", "Thumb", "Shape", "Forehead", "Years", "Start", "Rules", "Ground", "Running", "Make", "Sense", "Live", "Fun", "Brain", "Smart", "Head", "Much", "See", "Wrong", "Taking", "Back", "Streets", "Never", "Know", "Shine", "Glow", "Hey", "Now", "All", "Star"]
        this.wordsToType = (dif + 1);
        this.completedWords = 0;
        this.wordStart = Math.floor(Math.random()*this.words.length);
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
    paint: function(){

        var pointerScale = .5;

        fill("#111");
        

        if(!this.failed && !this.cleared){
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.font = "20px mario-maker";
            ctx.fillText((this.completedWords+1) + "/" + this.wordsToType, canvas.width/2, 100);
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

        
        if(this.failed){
            this.fallingProgress += 20;
        }

        for(let i = 0; i < this.word.length; i++){
            if(i < this.progress){
                ctx.fillStyle = "#ffdc73";
            } else if(i == this.progress) {
                ctx.fillStyle = "white";
            } else {
                ctx.fillStyle = "grey";
            }
            if(this.cleared){
                this.jumpProgress+=.035;
                ctx.fillStyle = "rgb(" + this.colors[0] + "," + this.colors[1] + "," + this.colors[2] + ")";
                this.colors = fadeColor(this.colors[0], this.colors[1], this.colors[2])
            }
            if(i == this.progress){
                var desiredPosition = 10+ text.x + (i * text.spacing) - (text.spacing * (this.word.length / 2)) - ((t("pixel_pointer").width/2) * pointerScale);
                if(this.xPos < desiredPosition) this.xPos+=10;

                if(this.firstRun){
                    this.xPos = desiredPosition;
                    this.firstRun = false;
                }

                this.sinProgression+=.5;
                yExtra = Math.sin(this.sinProgression);
                // Draw pointer
                ctx.drawImage(t("pixel_pointer"), this.xPos, text.y + (yExtra * 2), t("pixel_pointer").width * pointerScale, t("pixel_pointer").height * pointerScale)
            }

            var extraY = 0;
            if(this.fallingProgress - (i * 30) >= i){
                extraY = this.fallingProgress - (i * 10);
            }

            var jump = 0;
            if(this.cleared && i == Math.round(this.jumpProgress) % this.word.length) jump = -10;
            ctx.fillText(this.word[i], text.x + (i * text.spacing) - (text.spacing * (this.word.length / 2)), text.y + jump + extraY);

        }

        
    },
    logic: function(key){
        if(key.char.toLowerCase() == "shift") return;
        if(key.char.toLowerCase() == this.word[this.progress].toLowerCase()){
            this.progress++;
            playSound(this.sounds[Math.floor(Math.random()*this.sounds.length)]);
            if(this.progress >= this.word.length && !this.cleared){
                this.completedWords++;
                if(this.wordsToType == this.completedWords){
                    this.cleared = true;
                    cleared(900);
                } else {
                    this.wordStart++;
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
    loop: function(){

    }

}
