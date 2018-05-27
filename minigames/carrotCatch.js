
var carrotCatch = {
    varName: "carrotCatch",
    displayName: "Carrot Catch",
    icon: "gameicons/carrotCatch_icon.png",
    timed: false,
    textures: [
        "carrot_catch/carrot.png", 
        "carrot_catch/rabbit_closed.png", 
        "carrot_catch/rabbit_open.png", 
        "carrot_catch/sunny_grass.png"
    ],
    introText: "Catch!",
    init: function (dif) {
        this.dif = dif;
        this.startTime = Date.now();
        this.carrotSpeed = (10) * ((dif + 2) * .5);
        this.carrotPosition = {
            x: 677,
            y: 205
        };
        this.rabbitScale = .7;
        this.carrotScale = .3;
        this.carrotCatchSuccess = undefined;
        this.carrotStopped = false;
        this.rabbitTexture = "rabbit_open"
        this.carrotTime = Math.floor(Math.random() * 2000) + 900; // Can be between 900 -> 2900 ms
    },
    paint: function () {
        // Fill background
        //ctx.fillStyle = "yellow";
        //ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(t("sunny_grass"), 0, 0)
        // Draw rabbit
        ctx.drawImage(t(this.rabbitTexture), 62, 134, t(this.rabbitTexture).width * this.rabbitScale, t(this.rabbitTexture).height * this.rabbitScale)
        // Draw carrot
        ctx.drawImage(t("carrot"), this.carrotPosition.x, this.carrotPosition.y, t("carrot").width * this.carrotScale, t("carrot").height * this.carrotScale)
        if (this.carrotCatchSuccess) {
            // Draw rabbit
            ctx.drawImage(t(this.rabbitTexture), 62, 134, t(this.rabbitTexture).width * this.rabbitScale, t(this.rabbitTexture).height * this.rabbitScale)
        }
    },
    loop: function () {
        if (this.carrotPosition.x < -150) failed();
        if (Date.now() - this.startTime > this.carrotTime && !this.carrotStopped) this.carrotPosition.x -= this.carrotSpeed;
    },
    logic: function (key) {
        if ((key.is(keys.action) || key.is(keys.back)) && this.carrotStopped == false) {
            this.carrotStopped = true;
            disableInputs = true;
            this.rabbitTexture = "rabbit_closed"
            if (this.carrotPosition.x > 90 && this.carrotPosition.x < 232) {
                playSound("nom_0")
                this.carrotCatchSuccess = true;
            } else {
                this.carrotCatchSuccess = false;
            }
            setTimeout(() => {
                disableInputs = false;
                if (this.carrotCatchSuccess == true) {
                    if (this.dif >= 8) {
                        achieve();
                    }
                    cleared();
                } else {
                    failed();
                }
            }, 700);
        }
    }

}

miniGames.push(carrotCatch);