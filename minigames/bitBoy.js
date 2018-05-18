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
	introSprites: importSpriteSheet("bitBoy/bitboy_ts_intro/bitboy_ts_introXXXXX.png", 90),
	loopSprites: importSpriteSheet("bitBoy/bitboy_ts_loop/bitboy_ts_loopXXXXX.png", 60),
	sounds: [

	],
	init: function (difficulty) {

		/* Startup + Title screen + Level start sequences*/
		//Describes which screen is currently active
		this.scene = 0;
		//the games boot-up sequence (fading from black to the title screen)
		this.gameTurnOn = 0;
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

	paint: function () {

		fill("#111");
		//plays the intro sequence
		if (this.scene == 0) {
			draw(this.introSprites[this.tsProgress % this.introSprites.length], 0, 0);
			this.tsProgress += 1;
			//ensures that the transition from intro to loop is smooth
			if (this.tsProgress == 90) {
				this.tsProgress = 120;
			}
			//Loops the title screen animation if the intro has played
			if (this.tsProgress >= 90) {
				draw(this.loopSprites[this.tsProgress % this.loopSprites.length], 0, 0);
			}
		}

		//Shows the "level start screen" and checks if the player has lost a life or not
		if (this.scene == 1) {

			if (this.livesLeft == 1) {
				draw("bitboy_levelstart_1_life", 0, -10);
			}

			if (this.livesLeft == 0) {
				draw("bitboy_levelstart_0_life", 0, -10);
			}

			this.levelStartTime++;
			//decides how long to show the level start screen before the game begins
			if (this.levelStartTime == 60) {
				this.scene = 2;
				this.levelStartTime = 0;
			}
		}

		if (this.scene == 2) {
			draw("bitboy_bg", 0, 0);
			draw("bitboy_player", this.playerPos.x, this.playerPos.y);
			draw("bitboy_box", this.boxPos.x - this.scrollAmount, this.boxPos.y);
		}

		//draws the "console" that bitBoy is being played on, this should always be on top of everything else
		draw("bitboy_overlay", 0, 0);

	},

	loop: function () {
		//scrolls the screen right/left
		this.scrollAmount += this.scrollAcceleration;

		if ((this.scene == 2) && (keyDown(keys.right))) {
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

		if ((this.scene == 2) && (keyDown(keys.left))) {
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

	logic: function (key) {
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