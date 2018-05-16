

var mash = {
    varName: "mash",
    displayName: "Eat the Sandwich",
    timed: true,
    textures: [
        "mash/sandwich_front.png", 
        "mash/sandwich_center.png", 
        "mash/sandwich_back.png", 
        "mash/etika_closed.png", 
        "mash/etika_open.png", 
        "mash/x_down.png", 
        "mash/x_up.png", 
        "mash/z_down.png", 
        "mash/z_up.png"
    ],
    sounds: [
        "mash/nom_0.mp3",
        "mash/nom_1.mp3", 
        "mash/nom_2.mp3", 
        "mash/nom_3.mp3", 
        "mash/nom_4.mp3"
    ],
    introText: "Eat!",
    /* Intro text is the text displayed before the mini-game, should contain a short instruction for the minigame. */
    init: function (dif) {
        /* Run on initiation */
        this.dif = dif;
        this.sandwichLength = (dif * 3) + 3;
        this.sandwich = ["sandwich_front", "sandwich_back"];
        for (let i = 0; i < this.sandwichLength; i++) {
            this.sandwich.splice(1, 0, "sandwich_center");
        }
        this.nextKey = undefined;
        this.openKey = undefined;
        this.previousKey = undefined;
        this.mouthOpen = true;
        this.particles = new Array();
        this.particlesToSpawn = 0;
        this.lastSpawn = Date.now();
        this.currentX = 180;
        this.etika = {
            texture: textures["etika_open"],
            x: 10,
            y: 5,
            scale: 0.9
        }
    },
    paint: function () {
        /* Paint method, runs every frame. */
        ctx.fillStyle = "#a3a1a1";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        var buttonPositions = {
            x: 330,
            y: 10,
            scale: 0.7
        };
        var x = "up";
        var z = "up";

        if (this.nextKey == "x") z = "down";
        if (this.nextKey == "z") x = "down";

        ctx.drawImage(textures["z_" + z], buttonPositions.x, buttonPositions.y, textures["z_" + z].width * buttonPositions.scale, textures["z_" + z].height * buttonPositions.scale);
        ctx.drawImage(textures["x_" + x], buttonPositions.x + 150, buttonPositions.y, textures["x_" + x].width * buttonPositions.scale, textures["x_" + x].height * buttonPositions.scale);


        var sandwichStartPos = {
            x: 180,
            y: 238
        };
        var scale = 0.40;
        if (this.currentX > sandwichStartPos.x) this.currentX -= 30;

        for (let i = 0; i < this.sandwich.length; i++) {
            var texture = textures[this.sandwich[i]];
            ctx.drawImage(texture, this.currentX + ((texture.width * scale) * i), sandwichStartPos.y, texture.width * scale, texture.height * scale)
        }

        ctx.drawImage(this.etika.texture, this.etika.x, this.etika.y, this.etika.texture.width * this.etika.scale, this.etika.texture.height * this.etika.scale);

        /*x: 216, y: 282 */

        var yStart = 312;
        for (let i = 0; i < this.particles.length; i++) {
            var particle = this.particles[i];

            var y = ((-(Math.pow(particle.progress, 3)) / 100) * -1) + yStart;
            var x = particle.progress + 216 + particle.punch;
            if (particle.goLeft) x = (x * -1) + 432;

            particle.progress += 2;
            if (particle.y > canvas.height) this.particles.splice(i, 1);
            ctx.fillStyle = particle.color;
            ctx.fillRect(x, y, 15, 15);
        }

    },
    loop: function () {
        if (this.sandwich.length < 1) {
            // Sandwich is empty!
            cleared();
        }

        if (this.particlesToSpawn > 0 && Date.now() - this.lastSpawn > 20) {
            this.spawnParticle();
            this.lastSpawn = Date.now();
            this.particlesToSpawn--;
        }

        /* Logic loop, runs every frame. */
        /* Use primarly keyDown(keyArr with keycodes) to test for keys, and use the variable keys.action or keys.back (They contain array with the keycodes.)*/
    },
    /* Move variables */
    logic: function (key) {

        if (key.is(keys.action) || key.is(keys.back)) {

            if (key.is(this.previousKey)) return;
            this.previousKey = key.code;

            if (key.is(keys.action)) {
                this.nextKey = "z"
            } else {
                this.nextKey = "x";
            }

            if (this.mouthOpen) {
                this.etika.texture = textures["etika_closed"]
                this.sandwich.splice(0, 1); // Chew
                this.mouthOpen = false;
                this.chew();
            } else {
                this.etika.texture = textures["etika_open"]
                this.mouthOpen = true;
            }
        }
    },
    chew: function () {
        this.particlesToSpawn += 5;
        this.currentX += t(this.sandwich[0]).width * .4;
        playSound(this.sounds[Math.floor(Math.random() * this.sounds.length)]);
    },
    spawnParticle: function () {
        var particleColors = ["#db2b2b", "#2ece29", "#af2b8c", "#f9ab36", "#cc861e"];
        var goLeft = false;
        if (Math.random() > .5) goLeft = true;
        this.particles.push({
            progress: 0,
            color: particleColors[Math.floor(Math.random() * particleColors.length)],
            goLeft: goLeft,
            punch: Math.floor(Math.random() * 50)
        });
    }
}

miniGames.push(mash);