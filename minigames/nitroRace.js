var nitroRace = {
	varName: "nitroRace",
	displayName: "Nitro Race",
	icon: "",
	themeColor: "#4286f4",
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
			y: (canvas.height / 2) + 80,
			scale: 4,
			distance: 0, //player distance from start
			dir: 0, //player direction
			vel: 0, //player velocity
			acc: 0.05, //player acceleration
			deacc: 0.1, //player deacceleration
			hp: 100 //player hitpoints
		}
		this.walls = new Array();
		this.wall = {
			x: (Math.random() * 192) + 120,
			y: -1000,
			texture: "nitro_wall",
			amount: 10 + (dif * 2)
		}
		for (let i = 0; i < this.wall.amount; i++) {
			var y = -1000 * i;
		}
		this.goal = {
			y: -50000,
			distance: -50000 - (dif * 10000)
		}
	},
	paint: function () {
		fill("#111");

		//Draw road
		draw("nitro_road", 0, (this.player.distance % 480) - 480, 4);

		//Draw Finish line
		draw("nitro_finishline", 120, this.goal.y, 4);

		draw("nitro_wall", this.wall.x, this.wall.y + this.player.distance, 4);

		//Draw player
		drawC("nitro_playerShadow", this.player.x, this.player.y + 15, 4, this.player.dir);
		drawC("nitro_player", this.player.x, this.player.y, this.player.scale, this.player.dir);
		
		
		/*Draw Hud*/
		ctx.fillStyle = "#111";
		ctx.fillRect(0, 390, 170, 90);
		//Draw speedometer
		type(Math.floor(this.player.vel * 10) + " km/h", 10, 408, 2);
		//Draw HP
		type("HP", 10, 444, 2);
		ctx.fillStyle = "#80ff80";
		ctx.fillRect(50, 452, this.player.hp, 10);
		
	},
	loop: function () {
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