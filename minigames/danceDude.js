var danceDude = {
	varName: "danceDude",
	displayName: "Dance Dude",
	icon: "gameicons/danceDude_icon.png",
	timed: false,
	introText: "Dance!",
	textures: [
		"dance/dance_arrow_left.png",
		"dance/dance_arrow_up.png",
		"dance/dance_arrow_down.png",
		"dance/dance_arrow_right.png",
		"dance/dance_incoming_left.png",
		"dance/dance_incoming_up.png",
		"dance/dance_incoming_down.png",
		"dance/dance_incoming_right.png",
		"dance/dance_arrow_up_hit.png",
		"dance/dance_arrow_down_hit.png",
		"dance/dance_arrow_left_hit.png",
		"dance/dance_arrow_right_hit.png"
	],
	sprites: importSpriteSheet("dance/danceDude_bg/danceDude_bg_XXXXX.png", 60),
	sounds: [
		"dance/dance_hit_1.mp3",
		"dance/dance_hit_2.mp3",
		"dance/dance_hit_3.mp3",
		"dance/dance_hit_4.mp3"
	],

	init: function (dif) {
		this.dif = dif;
		this.startTime = Date.now();
		this.incomingSpeed = (1) * (dif + 2);

		// Decides the starting position of the incoming arrows
		this.incomingLeftPos = {
			x: 55,
			y: (Math.floor(Math.random() * 7) * 70) + 480
		};
		this.incomingUpPos = {
			x: 155,
			y: (Math.floor(Math.random() * 7) * 70) + 480
		};
		this.incomingDownPos = {
			x: 255,
			y: (Math.floor(Math.random() * 7) * 70) + 480
		};
		this.incomingRightPos = {
			x: 355,
			y: (Math.floor(Math.random() * 7) * 70) + 480
		};

		this.arrowScaleL = 1;
		this.arrowScaleU = 1;
		this.arrowScaleD = 1;
		this.arrowScaleR = 1;

		this.hitPos = (Math.floor(Math.random() * 7) * 70) + 480;

		// Hit Status
		this.hitLeft = false;
		this.hitUp = false;
		this.hitDown = false;
		this.hitRight = false;

		this.arrowsHit = 0;
		this.hitGoal = (4) + (dif * 2);
		this.danceStart = true;
		this.progress = 0;

	},
	paint: function () {

		fill("#111");
		// Draw background
		this.progress++;
		draw(this.sprites[this.progress % this.sprites.length], 0, 0);

		// Draw "slot arrows"
		drawC("dance_arrow_left", 55, 75, this.arrowScaleL);
		drawC("dance_arrow_up", 155, 75, this.arrowScaleU);
		drawC("dance_arrow_down", 255, 75, this.arrowScaleD);
		drawC("dance_arrow_right", 355, 75, this.arrowScaleR);

		// Draw incoming arrows
		drawC("dance_incoming_left", this.incomingLeftPos.x, this.incomingLeftPos.y, this.arrowScaleL);
		drawC("dance_incoming_up", this.incomingUpPos.x, this.incomingUpPos.y, this.arrowScaleU);
		drawC("dance_incoming_down", this.incomingDownPos.x, this.incomingDownPos.y, this.arrowScaleD);
		drawC("dance_incoming_right", this.incomingRightPos.x, this.incomingRightPos.y, this.arrowScaleR);

		// Draw hit animations
		if (this.hitUp) {
			draw("dance_arrow_up_hit", 0, 10);
		}
		if (this.hitDown) {
			draw("dance_arrow_down_hit", 0, 10);
		}
		if (this.hitLeft) {
			draw("dance_arrow_left_hit", 0, 10);
		}
		if (this.hitRight) {
			draw("dance_arrow_right_hit", 0, 10);
		}

		// Draw progress counter
		this.arrowsLeft = this.hitGoal - this.arrowsHit;
		type(this.arrowsHit + "/" + this.hitGoal, 400, 100);
	},
	loop: function () {
		this.hitPos = (Math.floor(Math.random() * 7) * 70) + 480;

		// Ends in a fail on missing one arrow
		if (this.incomingLeftPos.y < 20) failed();
		if (this.incomingUpPos.y < 20) failed();
		if (this.incomingDownPos.y < 20) failed();
		if (this.incomingRightPos.y < 20) failed();

		if (this.danceStart == true) {
			this.incomingLeftPos.y -= this.incomingSpeed;
			this.incomingUpPos.y -= this.incomingSpeed;
			this.incomingDownPos.y -= this.incomingSpeed;
			this.incomingRightPos.y -= this.incomingSpeed;
		}
		if (this.incomingLeftPos.y < 95) {
			if (this.arrowScaleL <= 1.03) {
				this.arrowScaleL += 0.03;
			}
		} else {
			if (this.arrowScaleL >= 1.05) {
				this.arrowScaleL -= 0.05;
			}
		}
		if (this.incomingUpPos.y < 95) {
			if (this.arrowScaleU <= 1.05) {
				this.arrowScaleU += 0.05;
			}
		} else {
			if (this.arrowScaleU >= 1.05) {
				this.arrowScaleU -= 0.05;
			}
		}
		if (this.incomingDownPos.y < 95) {
			if (this.arrowScaleD <= 1.05) {
				this.arrowScaleD += 0.05;
			}
		} else {
			if (this.arrowScaleD >= 1.05) {
				this.arrowScaleD -= 0.05;
			}
		}
		if (this.incomingRightPos.y < 95) {
			if (this.arrowScaleR <= 1.05) {
				this.arrowScaleR += 0.05;
			}
		} else {
			if (this.arrowScaleR >= 1.05) {
				this.arrowScaleR -= 0.05;
			}
		}
	},
	logic: function (key) {
		/* Logic is called on a keypress, you can use this for key initiated actions. */
		// Ends game with a fail on pressing a key too early
		if ((key.is(keys.left)) && (this.incomingLeftPos.y > 110) && (this.danceStart)) {
			failed();
		}
		if ((key.is(keys.up)) && (this.incomingUpPos.y > 110) && (this.danceStart)) {
			failed();
		}
		if ((key.is(keys.down)) && (this.incomingDownPos.y > 110) && (this.danceStart)) {
			failed();
		}
		if ((key.is(keys.right)) && (this.incomingRightPos.y > 110) && (this.danceStart)) {
			failed();
		};

		if ((key.is(keys.left)) && (this.incomingLeftPos.y < 110)) {
			this.incomingLeftPos.y = this.hitPos;
			this.hitLeft = true;
		}
		if ((key.is(keys.up)) && (this.incomingUpPos.y < 110)) {
			this.incomingUpPos.y += this.hitPos;
			this.hitUp = true;
		}
		if ((key.is(keys.down)) && (this.incomingDownPos.y < 110)) {
			this.incomingDownPos.y += this.hitPos;
			this.hitDown = true;
		}
		if ((key.is(keys.right)) && (this.incomingRightPos.y < 110)) {
			this.incomingRightPos.y += this.hitPos;
			this.hitRight = true;
		}

		if (this.hitLeft == true) {
			this.arrowsHit += 1;
			playSound("dance_hit_1");
			setTimeout(() => {
				this.hitLeft = false;
			}, 70);
		}
		if (this.hitUp == true) {
			this.arrowsHit += 1;
			playSound("dance_hit_3");
			setTimeout(() => {
				this.hitUp = false;
			}, 70);
		}
		if (this.hitDown == true) {
			this.arrowsHit += 1;
			playSound("dance_hit_4");
			setTimeout(() => {
				this.hitDown = false;
			}, 70);
		}
		if (this.hitRight == true) {
			this.arrowsHit += 1;
			playSound("dance_hit_2");
			setTimeout(() => {
				this.hitRight = false;
			}, 70);
		}

		if ((this.arrowsHit >= this.hitGoal) && (this.danceStart == true)) {
			if (this.dif >= 8) {
				achieve();
			}
			cleared();
			this.danceStart = false;
		}
	}
}

miniGames.push(danceDude);