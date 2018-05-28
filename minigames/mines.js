var mines = {
	varName: "mines",
	displayName: "Mines",
	timed: false,
	wip: true,
	timedWin: false,
	introText: "Sweep!",
	textures: [
		"mines/mines_bg.png",
		"mines/mines_mine.png",
		"mines/mines_1.png",
		"mines/mines_2.png",
		"mines/mines_3.png",
		"mines/mines_4.png",
		"mines/mines_5.png",
		"mines/mines_6.png",
		"mines/mines_7.png",
		"mines/mines_8.png",
		"mines/mines_panel.png",
		"mines/mines_flag.png",
		"mines/mines_selector.png"
	],
	sounds: [

	],
	init: function (difficulty) {

		//selector draw position
		this.selectorPos = {
			x: 290,
			y: 150
		}
		this.matrixPos = {
			x: (this.selectorPos.x - 10) / 70,
			y: (this.selectorPos.y - 10) / 70
		}
		//current selector space id
		this.selectedSpace = 23;
		this.createMatrix = function (width, height) {
			let matrix = [];
			while (height > 0) {
				matrix.push(new Array(width).fill(0));
				height--;
			}
			return matrix;
		}
		this.stageWidth = 9;
		this.stageHeight = 5;
		this.scale = 70;
		this.stage = this.createMatrix(this.stageWidth, this.stageHeight);
		this.setup = function () {
			console.log("setup started")
			for (let y = 0; y < this.stage.length; y++) {
				for (let x = 0; x < this.stage[y].length; x++) {
					if (Math.random() < 0.2) {
						this.stage[y][x] = {
							revealed: false,
							mine: true,
							flagged: false,
							number: -1
						};
					} else {
						this.stage[y][x] = {
							revealed: false,
							mine: false,
							flagged: false,
							number: -1
						};
					}
					for (let i = -1; i < 2; i++) {
						for (let j = -1; j < 2; j++) {
							this.stage[this.matrixPos.y + i][this.matrixPos.x + j].mine = false;
						}
					}
				}
			}
			for (let y = 0; y < this.stage.length; y++) {
				for (let x = 0; x < this.stage[y].length; x++) {
					if (!this.stage[y][x].mine) {
						let number = 0;
						for (let i = -1; i < 2; i++) {
							for (let j = -1; j < 2; j++) {
								try {
									if (this.stage[y + i][x + j].mine) {
										number++;
									}
								} catch {
	
								}
							}
						}
						this.stage[y][x].number = number;
					}
				}
			}
			console.table(this.stage);
		}
		this.reveal = function (x, y) {
			let cell = this.stage[y][x];
			cell.revealed = true;
			if (cell.number === 0) {
				for (let i = -1; i < 2; i++) {
					for (let j = -1; j < 2; j++) {
						try {
							if (!this.stage[y + i][x + j].revealed) {
								this.reveal(x + j, y + i);
							}
						} catch {

						}
					}
				}
			}
			if (this.stage[y][x].mine) {
				console.log("game over");
			}
		}
	},
	paint: function () {
		fill("#111");

		//draw background
		draw("mines_bg", 0, 0);

		//draw mines and numbers
		for (let i = 0; i < this.stage.length; i++) {
			for (let j = 0; j < this.stage[i].length; j++) {
				if (this.stage[i][j].mine) {
					draw("mines_mine", 10 + (j * 70), 10 + (i * 70));
				} else {
					let number = 0;
					for (let ii = -1; ii < 2; ii++) {
						for (let jj = -1; jj < 2; jj++) {
							try {
								if (this.stage[i + ii][j + jj].mine) {
									number++;
								}
							} catch {

							}
						}
					}
					this.stage[i][j].number = number;
					if (number > 0) {
						draw("mines_" + number, 10 + (j * 70), 10 + (i * 70));
					}
				}
			}
		}

		//draw panels
		for (let i = 0; i < this.stage.length; i++) {
			for (let j = 0; j < this.stage[i].length; j++) {
				if (!this.stage[i][j].revealed) {
					draw("mines_panel", 10 + (j * 70), 10 + (i * 70));
				}
			}
		}

		//draw flags
		for (let i = 0; i < this.stage.length; i++) {
			for (let j = 0; j < this.stage[i].length; j++) {
				if (this.stage[i][j].flagged) {
					draw("mines_flag", 10 + (j * 70), 10 + (i * 70));
				}
			}
		}

		//draw selector
		draw("mines_selector", this.selectorPos.x, this.selectorPos.y);
	},
	loop: function () {

	},
	logic: function (key) {
		this.matrixPos.x = (this.selectorPos.x - 10) / 70;
		this.matrixPos.y = (this.selectorPos.y - 10) / 70;
		if (key.is(keys.right)) {
			if (this.selectorPos.x < 570) {
				this.selectorPos.x += 70;
				this.selectedSpace += 1;
			} else {
				this.selectorPos.x = 10;
				this.selectedSpace -= 8;
			}
		}
		if (key.is(keys.left)) {
			if (this.selectorPos.x > 10) {
				this.selectorPos.x -= 70;
				this.selectedSpace -= 1;
			} else {
				this.selectorPos.x = 570;
				this.selectedSpace += 8;
			}
		}
		if (key.is(keys.down)) {
			if (this.selectorPos.y < 290) {
				this.selectorPos.y += 70;
				this.selectedSpace += 9;
			} else {
				this.selectorPos.y = 10;
				this.selectedSpace -= 36;
			}
		}
		if (key.is(keys.up)) {
			if (this.selectorPos.y > 10) {
				this.selectorPos.y -= 70;
				this.selectedSpace -= 9;
			} else {
				this.selectorPos.y = 290;
				this.selectedSpace += 36;
			}
		}
		if (key.is(keys.action)) {
			if (this.stage[0][0] === 0) {
				this.setup();
			}
			if (!this.stage[this.matrixPos.y][this.matrixPos.x].flagged) {
				this.reveal(this.matrixPos.x, this.matrixPos.y);
			}
		}
		if (key.is(keys.back) && !this.stage[this.matrixPos.y][this.matrixPos.x].revealed) {
			this.stage[this.matrixPos.y][this.matrixPos.x].flagged = !this.stage[this.matrixPos.y][this.matrixPos.x].flagged;
		}
	}
}

miniGames.push(mines);