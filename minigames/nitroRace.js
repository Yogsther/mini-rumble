var nitroRace = {
	varName: "nitroRace",
	displayName: "Nitro Race",
	icon: "gameicons/wip_icon.png",
	timed: false,
	introText: "Race!",
	textures: [
		"nitroRace/nitro_player.png",
		"nitroRace/nitro_playerShadow.png",
		"nitroRace/nitro_road.png"
	],
	sprites: [

	],
	sounds: [

	],

	init: function (dif) {
		this.dif = dif;
		this.player = {
			x: canvas.width / 2,
			y: canvas.height / 2,
			distance: 0,
			scale: 4,
			dir: 0,
			vel: 0,
			acc: 0.05,
			deacc: 0.1
		}
		this.goal = {
			y: -50000 - (dif * 10000),
			distance: -10000
		}
	},
	paint: function () {
		fill("#087c2d");

		//Draw road
		draw("nitro_road", 0, (this.player.distance % 480) - 480, 4);
		draw("nitro_road", 0, (this.player.distance % 480), 4);

		//Draw Finish line
		ctx.fillRect((canvas.width / 2) - 250, this.goal.y + this.player.distance, 500, 50)
		//Draw player
		draw("nitro_playerShadow", this.player.x, this.player.y + 20, 4, this.player.dir);
		draw("nitro_player", this.player.x, this.player.y, this.player.scale, this.player.dir);

		//Draw speedometer
		type(Math.floor(this.player.vel * 10) + " km/h", 50, 400, 2);
	},
	loop: function () {
		this.player.distance += this.player.vel;
		this.goal.distance = this.goal.y + this.player.distance;
		this.player.x += this.player.dir * 0.25;
		
		//Key up (accelerate)
		if ((keyDown(keys.up)) && (this.player.vel <= 50)) {
			this.player.vel += this.player.acc;
		} else if (this.player.vel > 0) {
			this.player.vel -= this.player.deacc;
		} 

		//prevents the player from gaining a negative velocity
		if (this.player.vel <= 0) {
			this.player.vel = 0;
		}

		//Key left (go left)
		if ((keyDown(keys.left)) && (this.player.dir >= -48) && (80 <= this.player.x)) {
			this.player.dir -= 6;
		}

		//Key right (go right)
		if ((keyDown(keys.right)) && (this.player.dir <= 48) && (this.player.x <= canvas.width - 140)) {
			this.player.dir += 6;
		}

		//Sets the player direction back to 0 when no key is pressed
		if (this.player.dir < 0) {
			this.player.dir += 3;
		}
		if (this.player.dir > 0) {
			this.player.dir -= 3;
		}

		if (this.goal.distance >= 500) {
			cleared();
		}
	},
	logic: function (key) {

	}
}

miniGames.push(nitroRace);