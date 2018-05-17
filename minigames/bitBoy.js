
var bitBoy = {
    varName: "bitBoy",
    displayName: "Bit Boy",
    timed: false,
    timedWin: false,
    introText: "It's a me!", 
    textures: [
        "bitBoy/bitboy_bg.png", 
        "bitBoy/bitboy_overlay.png", 
        "bitBoy/bitboy_player.png", 
        "bitBoy/bitboy_levelstart_1_life.png", 
        "bitBoy/bitboy_levelstart_0_life.png", 
        "bitBoy/bitboy_box.png"
    ],

    init: function(difficulty) {

        this.scene = 0;
        this.gameTurnOn = 0;
        
        
        this.introSprites = importSpriteSheet("bitBoy/bitboy_ts_intro/bitboy_ts_introXXXXX.png", 90);
        this.loopSprites = importSpriteSheet("bitBoy/bitboy_ts_loop/bitboy_ts_loopXXXXX.png", 60);
        this.tsProgress = 0;

        this.levelStartTime = 0;
        this.livesLeft = 1;

        this.playerPos = {
            x: 200,
            y: 200
        };
        //height of where a jump was started
        this.playerJumpSpeed = 0;
        this.playerFallSpeed = 0;

        //game objects
        this.boxPos = {
            x: 500,
            y: 230
        };

        this.scrollAcceleration = 0;
        this.scrollAmount = 0;
        this.playerBlockedRight = false;
        this.playerBlockedDown = false;
    },

    paint: function() {

        fill("#111");

        if (this.scene == 0) {
            ctx.drawImage(this.introSprites[this.tsProgress % this.introSprites.length], 0, 0);
            this.tsProgress += 1;

            if (this.tsProgress ==  90) {
                this.tsProgress = 120;
            }

            if (this.tsProgress >= 90) {
                ctx.drawImage(this.loopSprites[this.tsProgress % this.loopSprites.length], 0, 0);
            }
        }

        if (this.scene == 1) {

            if (this.livesLeft == 1) {
                ctx.drawImage(t("bitboy_levelstart_1_life"), 0, -10);
            }

            if (this.livesLeft == 0) {
                ctx.drawImage(t("bitboy_levelstart_0_life"), 0, -10);
            }

            this.levelStartTime++;

            if (this.levelStartTime == 60) {
                this.scene = 2;
                this.levelStartTime = 0;
            }
        }

        if (this.scene == 2) {
            ctx.drawImage(t("bitboy_bg"), 0, 0);
            ctx.drawImage(t("bitboy_player"), this.playerPos.x, this.playerPos.y);
            ctx.drawImage(t("bitboy_box"), this.boxPos.x - this.scrollAmount, this.boxPos.y);
        }

        ctx.drawImage(t("bitboy_overlay"), 0, 0);

    },

    loop: function() {
        //scrolls the screen right/left
        this.scrollAmount += this.scrollAcceleration;

        if  ((this.scene == 2) && (keyDown(keys.right))) {
            if (this.scrollAcceleration < 10) {
                if (this.scrollAcceleration > 0) {
                    this.scrollAcceleration += 0.5;
                } else {
                    this.scrollAcceleration += 2;
                }
            }
        } else {
            if (this.scrollAcceleration > 0) {
                this.scrollAcceleration -= 0.5;
            }
        }
/*
        var player = {
            x: 60,
            y: 90,
            sprite: t("bitboy_player")
        };

        var box = {
            x: 60, 
            y: 60, 
            sprite: t("bitboy_box")
        };

        var colliding = checkCollision(player.sprite, player.x, player.y, box.sprite, box.x, box.y);
        
        if (colliding) {
            if ((this.playerPos + 90) < this.box) {
                this.playerBlockedDown = true;
                this.playerBlockedRight = false;
            } else {
                this.playerBlockedDown = false;
                this.playerBlockedRight = true;
            }
        }
*/

        if  ((this.scene == 2) && (keyDown(keys.left))) {
            if (this.scrollAcceleration > -10) {
                if (this.scrollAcceleration > 0) {
                    this.scrollAcceleration -= 0.5;
                } else {
                    this.scrollAcceleration -= 2;
                }
            }
        } else {
            if (this.scrollAcceleration < 0) {
                this.scrollAcceleration += 1;
            }
        }

        //early collision detection
        if (((this.playerPos.x + 60) >= (this.boxPos.x - this.scrollAmount) && ((this.playerPos.y + 90) > this.boxPos.y))) {
            this.playerBlockedRight = true;
        } else {
            this.playerBlockedRight = false;
        }

        if ((this.playerPos.y + 100) >= (this.boxPos.y) && ((this.playerPos.x + 60) > this.boxPos.x - this.scrollAmount)) {
            this.playerPos.y = 140;
            this.playerBlockedDown = true;
        } else {
            this.playerBlockedDown = false;   
        }

        this.playerPos.y -= this.playerJumpSpeed;

        if (this.playerJumpSpeed > 0) {
            this.playerJumpSpeed -= 0.5;
        }

        this.playerFallSpeed = (16 - this.playerJumpSpeed);
        if (this.playerBlockedDown == false) {
            this.playerPos.y += this.playerFallSpeed;
        }
        if (this.playerPos.y > 200) {
            this.playerPos.y = 200;
        }

    },

    logic: function(key) {
        //"press x to start"
        if ((this.scene == 0) && (this.tsProgress >= 90) && (key.is(keys.action))) {
            this.scene = 1;
        }
        if ((this.playerPos.y == 200) && (key.is(keys.action)) && (this.scene == 2) || (this.playerBlockedDown) && (key.is(keys.action)) && (this.scene == 2)) {
            this.playerJumpSpeed = 16;
        }

    }
}

miniGames.push(bitBoy);