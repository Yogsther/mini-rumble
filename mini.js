/**
 * Mini game collection for Mini-Rumble
 */


var typeMaster = {
    varName: "typeMaster",
    displayName: "Type Master",
    timed: true,
    timedWin: false, 
    textures: ["pixel_pointer.png"],
    introText: "Type!",
    init: function(dif){
        var words = ["Mario Time", "Apple", "Carrot", "Weird", "Accommodate", "Handkercheif", "Indict", "Cemetery", "Conscience", "Rhythm", "Playwright", "Embarrass", "Millennium", "Pharaoh", "Liaison", "Convalesce", "Supersede", "Ecstasy", "Caribbean", "Harass", "Maintenance", "Pronunciation", "Artic", "Occurred", "Recommend"]
        this.word = words[Math.floor(Math.random()*words.length)];
        this.progress = 0;
        this.sinProgression = 0;
        this.colors = [255, 66, 66];
        this.cleared = false;
        this.failed = false;
        this.fallingProgress = 0;
        this.xPos = 0
        this.jumpProgress = 0;
        this.firstRun = true;
    },
    paint: function(){

        var pointerScale = .5;

        fill("#111");
        var fontSize = 350 / this.word.length;
        ctx.font = fontSize + "px mario-maker";
        ctx.fillStyle = "white";
        ctx.textAlign = "left";


        var text = {
            x: (25) + canvas.width / 2, 
            y: canvas.height / 2,
            spacing: fontSize
        }

        
        if(this.failed){
            this.fallingProgress += 20;
        }

        for(let i = 0; i < this.word.length; i++){
            if(i < this.progress){
                ctx.fillStyle = "#ffdc73";
            } else if(i == this.progress) {
                ctx.fillStyle = "white";
            } else {
                ctx.fillStyle = "grey";
            }
            if(this.cleared){
                this.jumpProgress+=.035;
                ctx.fillStyle = "rgb(" + this.colors[0] + "," + this.colors[1] + "," + this.colors[2] + ")";
                this.colors = fadeColor(this.colors[0], this.colors[1], this.colors[2])
            }
            if(i == this.progress){
                var desiredPosition = 10+ text.x + (i * text.spacing) - (text.spacing * (this.word.length / 2)) - ((t("pixel_pointer").width/2) * pointerScale);
                if(this.xPos < desiredPosition) this.xPos+=10;

                if(this.firstRun){
                    this.xPos = desiredPosition;
                    this.firstRun = false;
                }

                this.sinProgression+=.5;
                yExtra = Math.sin(this.sinProgression);
                // Draw pointer
                ctx.drawImage(t("pixel_pointer"), this.xPos, text.y + (yExtra * 2), t("pixel_pointer").width * pointerScale, t("pixel_pointer").height * pointerScale)
            }

            var extraY = 0;
            if(this.fallingProgress - (i * 30) >= i){
                extraY = this.fallingProgress - (i * 10);
            }

            var jump = 0;
            if(this.cleared && i == Math.round(this.jumpProgress) % this.word.length) jump = -10;
            ctx.fillText(this.word[i], text.x + (i * text.spacing) - (text.spacing * (this.word.length / 2)), text.y + jump + extraY);

        }

        
    },
    logic: function(key){
        if(key.char.toLowerCase() == "shift") return;
        //console.log(key.char.toLowerCase(), this.word[this.progress].toLowerCase() , key.char.toLowerCase() == this.word[this.progress].toLowerCase());
        if(key.char.toLowerCase() == this.word[this.progress].toLowerCase()){
            this.progress++;
            if(this.progress >= this.word.length && !this.cleared){
                this.cleared = true;
                cleared(900);
            }
        } else {
            failed(900);
            this.failed = true;
        }
    },
    loop: function(){

    }

}

var hoverDodge = {
    varName: "hoverDodge",
    displayName: "Hover Dodge",
    timed: true,
    timedWin: true,
    textures: ["hover_board.png", "warning.png"],
    introText: "Dodge!",
    init: function (dif) {
        this.flex = 60; // Flex margin for collision
        this.speed = (dif + 1) * 1.5;
        this.groundLevel = 296;
        this.playerY = this.groundLevel;
        this.playerScale = .5;
        this.playerX = 140;
        this.playerJumpProgress = false;
        this.playerTexture = t("hover_board"); 
        this.worldX = 0;
        this.pollScale = .4;
        this.warningTexture = t("warning");
        this.polls = new Array();
        var amountOfPolls = 20;
        var lastPollPosition = 200;
        var minimSpace = 400;
        var maximumSpace = 800;
        for(let i = 0; i < amountOfPolls; i++){
            var position = Math.floor(Math.random() * (maximumSpace - minimSpace) + minimSpace) + lastPollPosition;
            this.polls.push(position);
            lastPollPosition = position;
        }
    },
    paint: function () {
        /* Background */
        ctx.fillStyle = "#8e4141";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        /* Draw ground */
        ctx.fillStyle = "grey";
        ctx.fillRect(0, this.groundLevel, canvas.width, canvas.height - this.groundLevel);

        /* Draw player */
        ctx.drawImage(this.playerTexture, this.playerX, this.playerY - (this.playerTexture.height * this.playerScale), this.playerScale * this.playerTexture.width, this.playerScale * this.playerTexture.height)

        var flex = this.flex; 
        /* Draw warning stops */
        for(let i = 0; i < this.polls.length; i++){
            var poll = this.polls[i];

            if(poll + this.worldX > (-1) * this.warningTexture.width){
    
                var collisionScore = 0;
                if(poll + this.worldX - flex > this.playerX){
                    collisionScore++;
                }
                if(poll + this.worldX + flex < this.playerX + this.playerTexture.width * this.playerScale ){
                    collisionScore++;
                }
                if(this.playerY + (this.playerTexture.height * this.playerScale) + flex > this.groundLevel - (this.warningTexture.height*this.pollScale)){
                    collisionScore++;
                }
                if(collisionScore == 3) failed();
                // Render it, since it's infront.
                ctx.drawImage(this.warningTexture, poll + this.worldX, this.groundLevel - (this.warningTexture.height * this.pollScale), this.warningTexture.width * this.pollScale, this.warningTexture.height * this.pollScale);
            }
        }

    },
    logic: function (key) {
        if(this.playerJumpProgress === false){
            this.playerJumpProgress = -6;
        }
    },
    loop: function () {
        if(this.playerJumpProgress !== false){
            if(this.playerJumpProgress > 6 || (this.playerY > this.groundLevel + (this.playerTexture.height * this.playerScale))){
                this.playerJumpProgress = false;
                this.playerY = this.groundLevel;
            } else {
                this.playerJumpProgress+=.3;
                this.playerY = (this.groundLevel + (Math.pow(this.playerJumpProgress, 2) - 36) * 8);
            }
        }
        this.worldX -= 7 + (this.speed / 2);
    }
}

var carrotCatch = {
    varName: "carrotCatch",
    displayName: "Carrot Catch",
    timed: false,
    textures: ["carrot.png", "rabbit_closed.png", "rabbit_open.png", "sunny_grass.png"],
    introText: "Catch!",
    init: function (dif) {
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
                    cleared();
                } else {
                    failed();
                }
            }, 700);
        }
    }

}

var mash = {
    varName: "mash",
    displayName: "Eat the Sandwich",
    timed: true,
    sounds: ["nom_0.mp3", "nom_1.mp3", "nom_2.mp3", "nom_3.mp3", "nom_4.mp3"],
    textures: ["sandwich_front.png", "sandwich_center.png", "sandwich_back.png", "etika_closed.png", "etika_open.png", "x_down.png", "x_up.png", "z_down.png", "z_up.png"],
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


var miniGames = [mash, carrotCatch, hoverDodge, typeMaster];
var activeMinigames = miniGames.slice(); 