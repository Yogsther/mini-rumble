var nitroRace = {
	varName: "nitroRace",
	displayName: "Nitro Race",
	icon: "gameicons/wip_icon.png",
	timed: false,
	introText: "Race!",
	textures: [
		"nitroRace/nitro_player.png",
		"nitroRace/nitro_playerShadow.png",
		"nitroRace/nitro_road.png",
		"nitroRace/nitro_wall.png",
		"nitroRace/nitro_finishline.png"
	],
	sprites: [

	],
	sounds: [

	],
	wip: true,

	init: function (dif) {
		this.dif = dif;
		this.player = {
			x: canvas.width / 2,
			y: canvas.height / 2,
			//player distance from start
			distance: 0,
			scale: 4,
			//player direction
			dir: 0,
			//player velocity
			vel: 0,
			//player acceleration/deacceleration
			acc: 0.05,
			deacc: 0.1
		}
		this.wall = {
			x: 120,
			y: -1000
		}
		this.goal = {
			y: -50000,
			distance: -50000 - (dif * 10000)
		}
	},
	paint: function () {
		fill("#087c2d");

		//Draw road
		draw("nitro_road", 0, (this.player.distance % 480) - 480, 4);

		//Draw Finish line
		draw("nitro_finishline", 120, this.goal.y, 4);

		draw("nitro_wall", this.wall.x, this.wall.y + this.player.distance, 4);

		//Draw player
		drawC("nitro_playerShadow", this.player.x, this.player.y + 15, 4, this.player.dir);
		drawC("nitro_player", this.player.x, this.player.y, this.player.scale, this.player.dir);
		
		

		//Draw speedometer
		type(Math.floor(this.player.vel * 10) + " km/h", 50, 400, 2);
	},
	loop: function () {
		console.log(this.player.vel);
		this.player.distance += this.player.vel;
		this.player.x += this.player.dir * 0.25;
		this.goal.y = this.goal.distance + this.player.distance;
		
		if (!((this.player.x > 120) && (this.player.x < canvas.width - 120))) {
			this.player.vel -= 0.1;
		}
		//Key up (accelerate)
		if ((keyDown(keys.up)) && (this.player.vel <= 50)) {
			this.player.vel += this.player.acc;
		} else if (this.player.vel > 0) {
			this.player.vel -= this.player.deacc;
		}

		//prevents the player from having a negative velocity
		if (this.player.vel <= 0) {
			this.player.vel = 0;
		}

		//Key left (go left)
		if ((keyDown(keys.left)) && (this.player.dir >= -48) && (this.player.x >= 50)) {
			this.player.dir -= 6;
		}

		//Key right (go right)
		if ((keyDown(keys.right)) && (this.player.dir <= 48) && (this.player.x <= canvas.width - 50)) {
			this.player.dir += 6;
		}

		//Sets the player direction back to 0
		if (this.player.dir < 0) {
			this.player.dir += 3;
		}
		if (this.player.dir > 0) {
			this.player.dir -= 3;
		}
		
		if (this.goal.y >= 500) {
			cleared();
		}
	},
	logic: function (key) {

	}
}

miniGames.push(nitroRace);