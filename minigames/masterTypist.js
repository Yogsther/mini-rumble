var typeMaster = {
    varName: "typeMaster",
    displayName: "Type Master",
    timed: true,
    timedWin: false, 
    textures: ["pixel_pointer.png"],
    requiresKeyboard: true,
    introText: "Type!",
    init: function(dif){
        var words = ["Wahoo", "Ohyeah", "Mario Time", "Lets a go", "Here I go", "Mama Mia", "QWERTY", "Random", "Wow"]
        this.word = words[Math.floor(Math.random()*words.length)];
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
            if(this.progress >= this.word.length && !this.cleared){
                this.cleared = true;
                cleared(900);
            }
        } else {
            failed(900);
            this.failed = true;
        }
    },
    loop: function(){

    }

}
