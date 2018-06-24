var bitBoy = {
	varName: "bitBoy",
	displayName: "Bit Boy",
	themeColor: "#fff",
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
	wip: true,
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

		this.player = {
			x: 200,
			y: 200
		};
		//height of where a jump was started
		this.playerJumpSpeed = 0;
		this.playerFallSpeed = 0;

		//game objects
		this.walls = [{x: 360, y: 200, width: 60, height: 60}, {x: 0, y: 0, width: 20, height: 480}],

		this.scrollAcceleration = 0;
		this.scrollAmount = 0;
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
			draw("bitboy_player", this.player.x, this.player.y);
			//draw("bitboy_box", this.walls.x, this.walls.y);
			ctx.fillStyle = "#fff";
			ctx.fillRect(this.walls[i].x, this.walls[i].y, this.walls[i].width, this.walls[i].height);
		}

		//draws the "console" that bitBoy is being played on, this should always be on top of everything else
		draw("bitboy_overlay", 0, 0);

	},

	loop: function () {
		//scrolls the screen right/left
		if (this.scene == 2) {
			if (keyDown(keys.right)) {
			}
		}
	},

	logic: function (key) {
		//"press x to start"
		if ((this.scene == 0) && (this.tsProgress >= 90) && (key.is(keys.action))) {
			this.scene = 1;
		}
	}
}

miniGames.push(bitBoy);