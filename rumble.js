/**
 * Mini-Rumble Game Engine, core
 */

/* Debug options */
var instaStart = false; // !! BROKEN, DONT USE - TODO: FIX /* Insert gamemode variable here to instastart. Devmode needs to be enables aswell! */
var initialDifficulty = 0; /* This needs to be 0 whenever a commit is made! */
/* These are already enabled if Dev-mode is enabled! */
var disableGameOver = false;
var logCoordinates = false;


/* Engine variables */
const canvas = c = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

/* All overlay textures, can be multible sprites to form a spritesheet. */

var loadingScreenDotJump = 0;
var loadingMessages = [
    "Get ready!",
    "Collecting your data",
    "Working hard",
    "Hardly working",
    "Sorting things out",
    "Downloading information",
    "Adding RNG",
    "Fixsung typos",
    "Buffing the buttons",
    "Cooking spaghetti",
    "Building bootlegs"
]
var currentLoadPackageMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
renderLoadingScreen();


var warningSigns = new Array();

var globalOptions = {
    hardcoreMode: false,
    displayFPS: false,
    devTools: false,
    disableSound: false,
    disableMusic: false,
    limitFPS: false
}

var miniGames = new Array();
var activeMinigames = miniGames.slice();

var backgroundSound = undefined;
var playingMenuMusic = false;

var soundEffects = [
    "rumble/sfx/yoshi-mount.mp3",
    "rumble/sfx/faster.mp3",
    "rumble/sfx/menu-click.mp3",
    "rumble/sfx/hurt.mp3"
];
var mainMenuMusic = [
    "rumble/ts_music/SmoothMoves.mp3",
    "rumble/ts_music/Ware.mp3"
];
var titleSounds = [
    "rumble/bg_music/yoshi-island.mp3",
    "rumble/bg_music/WaluigiPinball.mp3",
    "rumble/bg_music/ComeOn.mp3",
    "rumble/bg_music/KingDedede.mp3",
    "rumble/bg_music/DiggaLeg.mp3"
];


function loadSettings() {
    expandOptions();
    var settings = localStorage.getItem("globalOptions");
    if (settings === undefined) return;
    globalOptions = Object.assign(globalOptions, JSON.parse(settings));
    loadWarnings();
}

function expandOptions() {
    for (let i = 0; i < miniGames.length; i++) {
        eval("globalOptions." + miniGames[i].varName + " = false");
        optionsRender.options.push({
            text: "Disable " + miniGames[i].displayName,
            source: miniGames[i].varName
        });
    }
}

function loadWarnings() {
    warningSigns = [{
        title: "Note!",
        description: "Online features in progress"
    }];
    if (globalOptions.devTools) warningSigns.push({
        title: "Leaderboards disabled!",
        description: "Dev-mode is enabled!"
    });
    var gamemodesDisabled = 0;
    for (let i = 0; i < miniGames.length; i++) {
        if (eval("globalOptions." + miniGames[i].varName)) gamemodesDisabled++;
    }
    var msg = " gamemodes are disabled."
    if (gamemodesDisabled < 2) msg = " gamemode is disabled."
    if (gamemodesDisabled > 0) warningSigns.push({
        title: "Leaderboards disabled!",
        description: gamemodesDisabled + msg
    });
}

function saveSettings() {
    loadWarnings();
    var settings = JSON.stringify(globalOptions);
    localStorage.setItem("globalOptions", settings);
}

var inGame = false;
var selectedScene = 0;
var miniGame = undefined;
var showingOpeningAnimation = false;
var score = 0;
var openingAnimationDuration = 15;
var gameLength = 5; // Seconds
var timer = 0;


/* All texture name to be imported during the importTextures process. */
var textureNames = ["rumble/mini_logo.png", "rumble/rumble_logo.png", "rumble/table.png", "gameicons/typeMaster_icon.png"]
var textures = new Object();
var sounds = new Object();

var keys = {
    action: [88, 32, 13],
    back: [90, 8, 27],
    up: [38, 87],
    down: [40, 83],
    left: [37, 65],
    right: [39, 68]
}

var ready = false;

var onlineRender = {
    animationProgress: 0,
    buttons: ["Join", "Leave"],
    buttonZoom: [0, 0],
    selectedButton: 0,
    paint: function () {
        fill("#111");
        
        dots = canvas.width;
        speed = .1;
        spacing = .005;
        scale = 10;

        ctx.fillStyle = "#304560";
        ctx.fillRect(0, 0, canvas.width, 100);

        this.animationProgress += speed;
        for (let i = 0; i < dots; i++) {
            ctx.fillStyle = "#5678a5";
            var y = (Math.sin(this.animationProgress + (spacing * i)) * scale) + 60;
            ctx.fillRect((canvas.width / dots) * i, y, (canvas.width / dots), 110 - y);
        }

        // Online text
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        ctx.font = "50px mario-maker";
        ctx.fillText("Online!", 50, 70)


        /* Buttons */

        for (let i = 0; i < this.buttons.length; i++) {
            var zoom = 0;
            var zoomSpeed = 3
            if (this.selectedButton % this.buttons.length == i) {
                if (this.buttonZoom[i] < 10) this.buttonZoom[i] += zoomSpeed;
            } else {
                if (this.buttonZoom[i] > 0) this.buttonZoom[i] -= zoomSpeed;
            }
            zoom = this.buttonZoom[i]
            ctx.fillStyle = "#7092d1";
            ctx.fillRect(25 - zoom, 140 + (i * (100 + 20)) - zoom, 200 + zoom * 2, 100 + zoom * 2);
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.font = 30 + (zoom * 2) + "px mario-maker";
            ctx.fillText(this.buttons[i], 25 + (200 / 2) - (zoom / 2) + 5, 140 + (i * (100 + 20)) - zoom)

        }


    },
    logic(key) {
        if (key.is(keys.down)) this.selectedButton++;
        if (key.is(keys.up)) {
            this.selectedButton--;
            if (this.selectedButton < 0) this.selectedButton += this.buttons.length;
        }
        if (key.is(keys.back)) selectedScene = 0;
    }
}


/**
 * Menu renders,
 * Simular structure to minigames but a little diffrent.
 */

var menuRender = /* Main Menu render and Logic (index: 0) */ {
    spriteIndex: 0,
    pinIndex: 0,
    lastUpdate: Date.now(),
    buttonColors: [
        [209, 66, 66],
        [209, 83, 66],
        [209, 104, 66]
    ],
    buttonTitles: [
        "Play",
        "Online",
        "Options"
    ],
    selectedButton: 0,
    progress: 0,
    buttonPositions: {
        x: -50,
        y: 220
    },
    buttonScale: .8,
    buttonExtension: [0, 0, 0],
    buttonSpacing: 80,
    paint: function () {
        ctx.textAlign = "left"
        /* Draw background */
        fill("#000000")
        this.spriteIndex++;
        // Draw logo
        drawC("rumble_logo", c.width/2, 140  + (Math.sin(this.spriteIndex*.08)*8), .8);
        drawC("mini_logo", c.width/2, 50 + (Math.sin((this.spriteIndex+10)*.08)*5), .8);

        /* Draw buttons */
        for (let i = 0; i < 3; i++) {
            var tilt = 50;
            var tiltSpeed = 10;
            if (this.selectedButton % this.buttonColors.length == i && this.buttonExtension[i] < tilt) this.buttonExtension[i] += tiltSpeed;
            if (this.selectedButton % this.buttonColors.length != i && this.buttonExtension[i] > 0) this.buttonExtension[i] -= tiltSpeed;
            tilt = this.buttonExtension[i];
            /* Draw button shadow */
            // Draw black background for darkness instead of transparency 
            ctx.fillStyle = "black";
            ctx.fillRect(this.buttonPositions.x + tilt - 50, this.buttonPositions.y + (i * this.buttonSpacing) + 10, 450 * this.buttonScale + 20, 80 * this.buttonScale);
            if (this.selectedButton % this.buttonColors.length == i) {
                ctx.fillStyle = "#800020"
                //ctx.fillStyle = "rgba(" + this.buttonColors[i][0] + ", " + this.buttonColors[i][1] + ", " + this.buttonColors[i][2] + ",0.5)";
            } else {
                ctx.fillStyle = "#400020"
                //ctx.fillStyle = "rgba(" + this.buttonColors[i][0] + ", " + this.buttonColors[i][1] + ", " + this.buttonColors[i][2] + ",0.3)";
            }
            ctx.fillRect(this.buttonPositions.x + tilt - 50, this.buttonPositions.y + (i * this.buttonSpacing) + 10, 450 * this.buttonScale + 20, 80 * this.buttonScale);

            /* Draw button */
            if (this.selectedButton % this.buttonColors.length == i) {
                ctx.fillStyle = "#c00020"
                //ctx.fillStyle = "rgb(" + this.buttonColors[i][0] + ", " + this.buttonColors[i][1] + ", " + this.buttonColors[i][2] + ")";
            } else {
                ctx.fillStyle = "#800020"
                //ctx.fillStyle = "rgba(17, 17, 17, 1)";
            }
            ctx.fillRect(this.buttonPositions.x + tilt - 50, this.buttonPositions.y + (i * this.buttonSpacing), 450 * this.buttonScale + 20, 80 * this.buttonScale);

            /* Draw button-text */
            /* ctx.font = 55 * this.buttonScale + "px mario-kart";
            ctx.textAlign = "left";
            ctx.fillStyle = "white"; */
            var globalOffset = -30 * this.buttonScale; 


            this.progress+=0.05;
            if(this.selectedButton % this.buttonColors.length == i) type(this.buttonTitles[i], tilt + this.buttonPositions.x + (40 * this.buttonScale) - globalOffset + 80 * this.buttonScale - 20, (this.buttonPositions.y - 10) + (i * this.buttonSpacing) + 15, 4, this.progress % 10);
                else type(this.buttonTitles[i], tilt + this.buttonPositions.x + (40 * this.buttonScale) - globalOffset + 80 * this.buttonScale - 20, (this.buttonPositions.y - 10) + (i * this.buttonSpacing) + 15, 4);
            
            /* for (let j = 0; j < text.length; j++) {
                if (this.progress == j && i == this.selectedButton % this.buttonTitles.length) jump = 10;
                type(text[j], tilt + this.buttonPositions.x + (j * 40 * this.buttonScale) - globalOffset + 80 * this.buttonScale, (this.buttonPositions.y - 10) + (i * this.buttonSpacing) - jump + 53);
                if (text[j] == "I") globalOffset += 12;
            } */


            /* ctx.fillStyle = "#111";
            ctx.font = "20px mario-maker",
            ctx.textAlign = "right";
            ctx.fillText("Z: Back X: Select", 630, 470);
            ctx.fillStyle = "rgba(0,0,0,0.3)";
            ctx.textAlign = "left";
            ctx.fillText(version, 15, 30); */
            type("Z: Back X: Select", 510, 460, 1)
            type(version, 10, 10, 1);

            // Draw board
            this.pinIndex+=.09;
            draw("table", 340, 220, 1.06)
            for(let i = 0; i < 12; i++){
                let x = i % 4;
                let y = (i - x) / 4;
                jump = 0;
                if(Math.round(this.pinIndex) % 20 == i) jump = -3;
                drawC("typeMaster_icon", 397 + x * 60, jump + 275 + y * 60, 2)
            }

            /* Warning signs */

            /* for (let i = 0; i < warningSigns.length; i++) {
                
                height = 60;
                width = 230;
                x = 390;
                y = 383 - (i * (height + 10));

                ctx.fillStyle = "rgba(0,0,0,.6)"
                ctx.fillRect(x, y, width, height);
                ctx.fillStyle = "red";
                ctx.textAlign = "left";
                ctx.font = "15px mario-maker"
                ctx.fillText(warningSigns[i].title, x + 10, y + 25)
                ctx.fillStyle = "white";
                ctx.font = "14px mario-maker"
                ctx.fillText(warningSigns[i].description, x + 10, y + 45)
            } */
        }
    },
    logic: function (key) {
        var playEffect = false;

        if (key.is(keys.down)) {
            this.selectedButton++;
            playEffect = true;
        }
        if (key.is(keys.up)) {
            playEffect = true;
            this.selectedButton--;
            if (this.selectedButton < 0) this.selectedButton = this.buttonColors.length - 1;
        }
        if (key.is(keys.action)) {
            playEffect = true;
            if (this.selectedButton % this.buttonColors.length == 0) startGame(); /* Play button */
            if (this.selectedButton % this.buttonColors.length == 1) selectedScene = 2 /* Play button */
            if (this.selectedButton % this.buttonColors.length == 2) {
                selectedScene = 1; /* Display options */
                optionsRender.selectedOption = 0;
            }

        }

        if (playEffect) playSound("menu-click", 1);
    }
}

var optionsRender = {
    buttonZoom: 10,
    buttonStyles: {
        height: 60,
        width: 400
    },
    buttonPositions: {
        x: 0,
        y: 100
    },
    scrollPosition: 0,
    buttonSpacing: 20,
    selectedOption: 0,
    startPoint: 0,
    options: [{
        text: "Enable hardcore mode",
        source: "hardcoreMode"
    }, {
        text: "Display FPS",
        source: "displayFPS"
    }, {
        text: "Enable Dev-tools",
        source: "devTools"
    }, {
        text: "Disable sound",
        source: "disableSound"
    }, {
        text: "Disable music",
        source: "disableMusic"
    }, {
        text: "Lock to 60 FPS",
        source: "limitFPS"
    }],
    spriteIndex: 0,
    paint: function () {

        /* Draw background */
        fill("#4286f4");
        this.spriteIndex++;

        ctx.fillStyle = "rgba(0,0,0,0.75)";
        var width = canvas.width - (canvas.width / 4)
        var height = canvas.height - (canvas.height / 8);
        ctx.fillRect((canvas.width - width) / 2, (canvas.height - height) / 2, width, height);

        while (this.selectedOption % this.options.length > this.startPoint + 3) this.startPoint++;
        while (this.selectedOption % this.options.length < this.startPoint) this.startPoint--;

        for (let i = this.startPoint; i < this.startPoint + 4; i++) {
            var button = {
                x: this.buttonPositions.x = (canvas.width / 2) - (this.buttonStyles.width / 2),
                y: this.buttonPositions.y + ((i - this.startPoint) * (this.buttonSpacing + this.buttonStyles.height)),
                width: this.buttonStyles.width,
                height: this.buttonStyles.height,
                color: "#111"
            }

            var text = {
                display: this.options[i].text,
                state: this.options[i].source,
                x: button.x + 30,
                y: button.y + 18,
                scale: 1,
                otherScale: 1
            }
            
            if (this.selectedOption % this.options.length == i) {
                // Selected button
                /*
                button.x -= this.buttonZoom;
                button.y -= this.buttonZoom;
                button.width += this.buttonZoom * 2;
                button.height += this.buttonZoom * 2;
                */
                button.color = "#353535"
                // Text
                /*
                text.scale = 1.15;
                text.x -= 20;
                text.y -= 20;
                text.otherScale = 1.1;
                */
            }

            ctx.fillStyle = button.color;
            ctx.fillRect(button.x, button.y, button.width, button.height);
            ctx.fillStyle = "white";
            ctx.font = (20 * text.scale) + "px mario-maker";
            ctx.textAlign = "left";
            type(text.display + ":", text.x, text.y);
            // Status
            var statusText = {
                text: "OFF",
                color: "#912f2f"
            };
            if (eval("globalOptions." + this.options[i].source)) statusText = {
                text: "ON",
                color: "#2f9146"
            };
            ctx.textAlign = "right";
            ctx.fillStyle = statusText.color;
            type(statusText.text, text.x + 300 * (text.otherScale), text.y)

        }
        type("Z: Back X: Select", 510, 460, 1);
    },
    logic: function (key) {
        var playEffect = false;

        if (key.is(keys.down)) {
            this.selectedOption++;
            playEffect = true;
        }
        if (key.is(keys.up)) {
            this.selectedOption--;
            playEffect = true;
            if (this.selectedOption < 0) this.selectedOption = this.options.length - 1;
        }
        if (key.is(keys.action)) {
            // Toggle option
            playEffect = true;
            eval("globalOptions." + this.options[this.selectedOption % this.options.length].source + "= !globalOptions." + this.options[this.selectedOption % this.options.length].source);
            saveSettings();
        }
        if (key.is(keys.back)) {
            // Go back to manu
            playEffect = true;
            selectedScene = 0;
        }

        if (playEffect) playSound("menu-click", 1);
    }
}




window.onload = () => {
    ready = false;
    checkForMobileUser()
    loadSettings();
    getAmountOfCommits();
    loadFinalStuff();
    loadLast();
}

function getAmountOfCommits() {
    /**
     * Use github's API to see the last 30 commits and messages.
     * Parse and read them to see the latest update message: A commit 
     * message containing "v.x.x" in the start. This will determine the version
     * number. More about the version number: http://mini.livfor.it/docs
     */
    var client = new XMLHttpRequest();
    client.open('GET', 'https://api.github.com/repos/yogsther/mini-rumble/commits');
    client.onreadystatechange = function () {
        var commits = client.responseText;
        try {
            commits = JSON.parse(commits);
        } catch (e) {}

        var i = 0;
        window.finalVersion = false;
        try {
            commits.forEach(commit => {
                if (finalVersion === false) {
                    var message = commit.commit.message;

                    if (message.indexOf("v.") != -1) {
                        version = message.substr(message.indexOf("v."), message.indexOf(" ")) + "." + i;
                        console.log('%c'+ "Mini-Rumble " + version + " 👌", 'color: #f4425c; font-size:15px;font-family:Ubuntu;');
                        finalVersion = true;
                    }
                    i++;
                }
            })
        } catch (e) {}
    }
    client.send();
}

var version = "Beta";

var startedLoading = false;

function loadFinalStuff() {
    startedLoading = true;
    importTextures();
    importSounds();
    ready = true;
    instaLoad();
}

function instaLoad() {
    if (instaStart !== false && globalOptions.devTools) {
        miniGames = [instaStart]
        startGame();
    }
}



function renderLoadingScreen() {

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    ctx.fillStyle = "white";
    ctx.font = "50px mario-maker";
    ctx.textAlign = "center";
    loadingScreenDotJump += .05;
    var loadingString = "Loading";
    for (let i = 0; i < (loadingScreenDotJump % 4 - 1); i++) loadingString += ".";
    ctx.fillText(loadingString, canvas.width / 2, canvas.height / 2);
    ctx.font = "20px mario-maker";
    ctx.fillText(currentLoadPackageMessage, canvas.width / 2, 291)

    if (!ready) {
        requestAnimationFrame(renderLoadingScreen);
    } else {
        render();
    }
}

var onMobile = false;

function checkForMobileUser() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        document.getElementById("buttons").innerHTML = '<div id="dpad"> ' +
            '<button class="dpad" id="up" onclick="buttonClick(this.id)">▲</button>' +
            '<button class="dpad" id="left" onclick="buttonClick(this.id)">◀</button> ' +
            '<button class="dpad" id="right" onclick="buttonClick(this.id)">▶</button> ' +
            '<button class="dpad" id="down" onclick="buttonClick(this.id)">▼</button> ' +
            '</div><div id="zyButtons"><button id="z" onclick="buttonClick(this.id)">Z</button> <button id="x" onclick="buttonClick(this.id)">X</button></div>';
        document.body.style.background = "black";
        canvas.style.top = "0px";
        onMobile = true;
    }
}



function t(name) {
    return textures[name];
}

function fadeColor(r, g, b) {
    if (r > 66 && b == 66) {
        r--;
        g++;
    }
    if (g > 66 && r == 66) {
        g--;
        b++;
    }
    if (b > 66 && g == 66) {
        r++;
        b--;
    }
    return [r, g, b];
}

function importSpriteSheet(path, amount) {

    /*  If the path is: "textures/overlay/overlay_00.png => overlay_19.png"
        Then expected input path is: "overlay/overlay_XX.png", amount: 20
    */
    var count = 0;
    var totalSprites = new Array();
    path.split("").forEach(l => {
        if (l == "X") count++;
    })
    for (let i = 0; i < amount; i++) {
        var number = i.toString();
        while (number.length < count) number = "0" + number;
        var importPath = path.substr(0, path.indexOf("X")) + number + path.substr(path.lastIndexOf("X") + 1, path.length)
        var texture = importTexture(importPath);
        totalSprites.push(texture);
    }
    return totalSprites;
}


function importTextures() {
    /* Import all textures */
    currentLoadPackageMessage = "Importing textures...";
    miniGames.forEach(minigame => {
        if (minigame.textures != undefined) {
            minigame.textures.forEach(texture => {
                textureNames.push(texture);
            })
        }
    });
    textureNames.forEach(texture => {
        importTexture(texture);
    });

    window.overlaySprites = [importSpriteSheet("rumble/overlay/overlay_XX.png", 20), importTexture("rumble/overlay_mystery.png"), importTexture("rumble/overlay_turbo.png")];

}

function importTexture(texture) {
    var textureName = texture.substr(texture.lastIndexOf("/") + 1);
    textureName = textureName.substr(0, textureName.indexOf("."));

    textures[textureName] = new Image();
    textures[textureName].src = "textures/" + texture;
    return textures[textureName];
}

function importSounds() {
    /* Bulk import engine sounds, this runs when the engine starts. */
    currentLoadPackageMessage = "Importing sounds";
    titleSounds.forEach(sound => {
        importSound(sound);
    })
    mainMenuMusic.forEach(sound => {
        importSound(sound);
    });
    soundEffects.forEach(sound => {
        importSound(sound);
    })
    miniGames.forEach(minigame => {
        if (minigame.sounds != undefined) {
            minigame.sounds.forEach(sound => {
                importSound(sound);
            })
        }
    });
}

function checkCollision(obj1, obj2) {
    /**
     * Check 2D collision between two object.
     * Returns false for no collision. 
     * Returns an object on collision: {fromLeft: bool, fromRight: bool, fromTop: bool, fromBottom: bool}
     * Usage: if(checkCollision(obj1, obj2).fromLeft) // Do something
     */

    if (obj1.texture === undefined) obj1.texture = obj1.sprite;
    if (obj2.texture === undefined) obj2.texture = obj2.sprite;
    if(obj1.texture.constructor == String) obj1.texture = t(obj1.texture)
    if(obj2.texture.constructor == String) obj2.texture = t(obj2.texture)

    if (obj1.x < obj2.x + obj2.texture.width &&
        obj1.x + obj1.texture.width > obj2.x &&
        obj1.y < obj2.y + obj2.texture.height &&
        obj1.texture.height + obj1.y > obj2.y) {
        
        /* Collision has happened, calculate further */

        info = {
            fromLeft: false,
            fromRight: false,
            fromTop: false,
            fromBottom: false
        }

        values = new Array();

        /* From left value */
        values[0] = ((obj1.x + obj1.texture.width - obj2.x)) /* * obj1.texture.width; / Possible addition */
        /* From right value */
        values[1] = (obj2.x+obj2.texture.width - obj1.x);
        /* From top values */
        values[2] = (obj1.y + obj1.texture.height - obj2.y);
        /* From bottom value */        
        values[3] =  obj2.texture.height + obj2.y - obj1.y;

        /**
         * Get the shortest distance from values, the shortest one will be the direction of overlap.
         */
        short = 0;
        for(let i = 0; i < values.length; i++){
            if(values[i] < values[short]) short = i;
        }

        return {
            fromLeft: short == 0,
            fromRight: short == 1,
            fromTop: short == 2,
            fromBottom: short == 3
        }

    }

    return false;
}


function importSound(sound) {
    /* Import a sound, default directory: /sounds/ */
    var soundName = sound.substr(sound.lastIndexOf("/") + 1);
    soundName = soundName.substr(0, soundName.indexOf("."));
    sounds[soundName] = new Audio();
    sounds[soundName].src = "sounds/" + sound;
    return sounds[soundName];
}

function s(name) {
    /* Return a sound file from name */
    if (name.indexOf(".") != -1) {
        var sound = name;
        var soundName = sound.substr(sound.lastIndexOf("/") + 1);
        soundName = soundName.substr(0, soundName.indexOf("."));
        name = soundName;
    }
    return sounds[name];
}

function playSound(name, volume) {

    if (globalOptions.disableSound) return;
    if (name.indexOf(".") != -1) {
        var sound = name;
        var soundName = sound.substr(sound.lastIndexOf("/") + 1);
        soundName = soundName.substr(0, soundName.indexOf("."));
        name = soundName;
    }
    if (volume == undefined) volume = .4;
    sounds[name].volume = volume;
    sounds[name].play();
}


var keysDown = new Array();

function keyDown(keys) {
    if (!isNaN(keys)) keys = [keys];
    for (let i = 0; i < keysDown.length; i++) {
        if (keys.indexOf(keysDown[i]) != -1) return true;
    }
    return false;
}


function startGame() {
    /* First start of the game, total reset. */
    window.difficulty = initialDifficulty;
    window.overlaySprite = overlaySprites[Math.floor(Math.random()*overlaySprites.length)];
    inGame = true;
    if (!globalOptions.hardcoreMode) {
        window.lives = 3;
    } else {
        window.lives = 1;
        //difficulty = 3;
    }
    playingMenuMusic = false;
    if (!globalOptions.disableSound && !globalOptions.disableMusic) {
        backgroundSound.pause();
        backgroundSound = s(titleSounds[Math.floor(Math.random() * titleSounds.length)]);
        backgroundSound.volume = .2;
        backgroundSound.loop = true;
        backgroundSound.playbackRate = 1;
        backgroundSound.play();
    }

    showClearedScreen("Ready? Go!", "#66a0ff");
    window.startTimout = setTimeout(() => {
        score = 0;
        newGame();
    }, 1000)
}

function newGame() {
    /* For each start of a new mini-game. */
    var miniGamesArray = miniGames.concat(); // Copy array

    for (let i = 0; i < miniGamesArray.length; i++) {
        if (eval("globalOptions." + miniGamesArray[i].varName) || (miniGamesArray[i].wip && !globalOptions.devTools)) {
            miniGamesArray.splice(i, 1);
            i--;
        }
    }

    if (miniGame !== undefined && miniGamesArray.length > 1) {
        for (let i = 0; i < miniGamesArray.length; i++) {
            if (miniGamesArray[i] === miniGame) {
                miniGamesArray.splice(i, 1);
            }
        }
    }

    if (miniGamesArray.length < 1) {
        failed();
        return;
    }
    drawOpening();
    miniGame = miniGamesArray[Math.floor(Math.random() * miniGamesArray.length)];
    inGame = true;
}



canvas.addEventListener("click", e => {
    var rect = canvas.getBoundingClientRect();
    var x = Math.round(e.clientX - rect.left);
    var y = Math.round(e.clientY - rect.top);

    if (logCoordinates) log("X: " + x + " Y: " + y);
})


function buttonClick(id) {
    var keys = [38, 40, 37, 39, 88, 90];
    var translate = ["up", "down", "left", "right", "x", "z"];
    for (let i = 0; i < translate.length; i++) {
        if (id == translate[i]) {
            click(keys[i]);
            break;
        }
    }
}

function loadLast() {
    /**
     * Load mobile controlls and attach event listeners (Only if onMobile!)
     */
    if (!onMobile) return;
    var keys = [38, 40, 37, 39, 88, 90];
    var translate = ["up", "down", "left", "right", "x", "z"];
    var elements = new Array();

    /* Add event listeners to all mobile buttons */
    translate.forEach(e => elements.push(document.getElementById(e)));

    for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener("touchstart", e => {
            var index = translate.indexOf(elements[i].id);
            var key = keys[index];
            if (!keyDown(key)) keysDown.push(key);
        });

        elements[i].addEventListener("touchend", e => {
            var index = translate.indexOf(elements[i].id);
            var key = keys[index];
            buttonClick(translate[index]);
            while (keyDown(key)) {
                for (let i = 0; i < keysDown.length; i++) {
                    if (keysDown[i] == key) {
                        keysDown.splice(i, 1);
                    }
                }
            }
        });
    }
}

/**
 * Mobile keyboard handlers
 */

var disableKeyboard = false;

function displayMobileKeyboard() {
    disableKeyboard = true;
    document.getElementById("keyboard-input").innerHTML = ' <input type="text" id="keyboard-controlls" oninput="detectMobileInput(this.value)">';
    document.getElementById("keyboard-controlls").focus();
    return;
}

function hideMobileKeyboard() {
    disableKeyboard = false;
    document.getElementById("keyboard-input").innerHTML = '';
    document.getElementById("canvas").focus();
}

function detectMobileInput(value) {
    var charCode = value.toLowerCase().charCodeAt(0);
    click(charCode, value);
    document.getElementById("keyboard-controlls").value = "";
}

function endGame(){
    try {
        backgroundSound.pause();
        backgroundSound.playbackRate = 1;
        backgroundSound.currentTime = 0;
        //setTimeout(()=> {clearInterval(slowDown);}, 250);
    } catch (e) {}
   
    showingClearedScreen = false;
    showingOpeningAnimation = false;
    failedCalled = false;
    miniGame = undefined;
    disableInputs = false
    inGame = false;
    playingMenuMusic = false;
    /* End all possible timeouts */
    try{ clearTimeout( newGameTimout); } catch(e) {}
    try{ clearTimeout( setClearedTimeout); } catch(e) {}
    try{ clearTimeout( lifeTimeout); } catch(e) {}
    try{ clearTimeout( updateTimout); } catch(e) {}
    try{ clearTimeout( startTimout); } catch(e) {}
    try{ clearTimeout( finalTimeout); } catch(e) {}
}

function click(code, char) {
    /**
     * Key event emiter.
     * Emits a click event to the current mini-game or scene.
     */
    if(inGame && code == 27) endGame();
    
    if (!ready) return;
    if (disableInputs) return;
    var key = {
        char: char,
        code: code,
        is: function (type) {
            if (type == undefined) return false;
            if (type.constructor != Array) return this.code == type;
            return type.indexOf(this.code) != -1;
        }
    };

    if (!inGame) renders[selectedScene].logic(key);
    try {
        if (inGame && !showingOpeningAnimation) miniGame.logic(key);
    } catch (e) {};
    if (!keyDown(code) && !onMobile) {
        keysDown.push(code);
    }
}

document.addEventListener("keydown", e => {
    if (disableKeyboard) return;
    click(e.keyCode, e.key)
});

function cleared(ms) {

    if (ms == undefined) ms = 0;
    globalOptions.disableGameOver = true;

    window.setClearedTimeout = setTimeout(() => {
        disableKeyboard = false;
        score++;
        var sound = "yoshi-mount";
        var display = {
            text: "Cleared!",
            color: "#38ed4a"
        }
        if ((score % 3 == 0) || (globalOptions.hardcoreMode)) {
            sound = "faster";
            difficulty++;
            if (!globalOptions.disableSound && !globalOptions.disableMusic) backgroundSound.playbackRate = (1 + (difficulty / 20));

            display = {
                text: "Faster!",
                color: "#ffe226"
            }
        }
        playSound(sound);
        showClearedScreen(display.text, display.color);
        window.newGameTimout = setTimeout(() => {
            newGame();
            globalOptions.disableGameOver = false;
        }, 1000);
    }, ms);
}




document.addEventListener("keyup", e => {
    while (keyDown(e.keyCode)) {
        for (let i = 0; i < keysDown.length; i++) {
            if (keysDown[i] == e.keyCode) keysDown.splice(i, 1);
        }
    }
})

function drawOpening() {
    showingOpeningAnimation = true;
    window.openingProgress = 0;
    window.lastOpeningDate = Date.now(); // Throttle
}

function drawGameOver() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

var overlayProgress = 0;

function timePunish(ms) {
    /* Reduce time left with this amount of ms. */
    timer -= ms;
}

function fill(color) {
    /* Fills the color with  */
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawOverlay() {
    var timePassed = (Date.now() - timer) / 1000;
    var timeLeft = Math.ceil(gameLength - timePassed);
    if (timeLeft < 0 && !globalOptions.disableGameOver && timed) {
        if (miniGame.timedWin) {
            cleared();
        } else {
            failed();
        }

    }
    overlayProgress += 0.3; // Speed
    if(overlaySprite.constructor == Array){
        ctx.drawImage(overlaySprite[Math.round(overlayProgress) % overlaySprite.length], 0, 0);
    } else {
        ctx.drawImage(overlaySprite, 0, 0);
    }
    

    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "30px mario-maker"
    var timePrint = timeLeft.toString();
    if (timeLeft < 0) timePrint = "0";
    if (!timed) timePrint = "?";
    type(timePrint, 580, 417, 2);

    ctx.fillStyle = "#f4d942",
    ctx.textAlign = "left";
    type(score.toString(), 415, 417, 2);
    ctx.fillStyle = "#fb183b",
    type(lives.toString(), 505, 417, 2);
}

var failedCalled = false;

function failed(ms) {
    if (globalOptions.devTools) return;
    if (failedCalled) return;
    failedCalled = true;
    if (ms == undefined) ms = 0;
    disableInputs = true;


    if(lives == 1 /* Boi has no more lives left! */){
        window.lifeTimeout = setTimeout(() => {
            disableKeyboard = false;
            miniGame = undefined;
            showClearedScreen("Game Over!", "#8c2424");
            s("hurt").playbackRate = .2;
            s("hurt").play();
            s("hurt").onended = () => {s("hurt").playbackRate = 1};
            window.finalTimeout = setTimeout(() => {
                try {
                    backgroundSound.pause();
                    backgroundSound.playbackRate = 1;
                    backgroundSound.currentTime = 0;
                    //setTimeout(()=> {clearInterval(slowDown);}, 250);
                } catch (e) {}
                failedCalled = false;
                disableInputs = false
                inGame = false;
                playingMenuMusic = false;
            }, 400);
        }, ms)
    } else {
        lives--;
        window.liveTimout = setTimeout(() => {
            disableKeyboard = false;
            showClearedScreen(lives + " left!", "#e5376b");
            window.updateTimout = setTimeout(() => {
                disableInputs = false
                playSound("hurt");
                globalOptions.disableGameOver = false;
                failedCalled = false;
                cleared(700);
            }, 400);
        }, ms)
    }
    
}

function log(){
    for(let i = 0; i < arguments.length; i++){
        if(globalOptions.devTools){
            string = "";
            if(arguments[i].constructor == String && arguments.length == 1){
                string = arguments[i];
            } else {
                string = JSON.stringify(arguments);
            }
            console.log('%c'+ string, 'background: #111; color: #bada55;');
        }
    }
}

function draw(sprite, x, y, scale, rotation, opacity) {
    /**
     * Draw a texture on screen, provide a scale if you want.
     * You need to provide a scale if you want to change the rotation.
     * You can either submit an Image or a string of the name.
     * Q: How do I flip a sprite? A: Flipping sprites in a canvas is very resource intensive,
     * please instead make a second flipped sprite.
     */

     /* Import texture if a String is provided. */
    if (sprite.constructor == String) sprite = t(sprite);
    if (rotation === undefined) rotation = 0;
    if (scale === undefined) scale = 1;
    if( opacity === undefined) opacity = 1;
    
    width = sprite.width * scale; // Get width of the sprite
    height = sprite.height * scale; // Get height of the sprite
    center = {x: x + width/2, y: y + height/2}

    if (y === undefined) {
        if (x !== undefined) scale = x;
        x = c.width / 2 - width / 2;
        y = c.height / 2 - height / 2;
    }

    ctx.save(); // Save context
    // Rotate and move origin
    ctx.translate(center.x, center.y);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.translate(-center.x, -center.y);
    // Set opacity
    ctx.globalAlpha = opacity;
    // Draw image
    ctx.drawImage(sprite, x, y, width, height);
    
    ctx.restore();
}

function drawC(sprite, x, y, scale, rotation, opacity) {
    /**
     * Draw a centered texture on screen, provide a scale if you want.
     * x and y will be the center location.
     * You can either submit an Image or a string of the name.
     * For more info, see draw() ^^
     */

    if (sprite.constructor == String) sprite = t(sprite);
    if (rotation === undefined) rotation = 0;
    if (scale === undefined) scale = 1;

    width = sprite.width * scale; // Get width of the sprite
    height = sprite.height * scale; // Get height of the sprite
    center = {x: x + width/2, y: y + height/2}
    centerDraw = {x: x - width/2, y: y - height/2}

    if (y === undefined) {
        if (x !== undefined) scale = x;
        x = c.width / 2 - width / 2;
        y = c.height / 2 - height / 2;
    }

    ctx.save(); // Save context
    // Rotate and move origin
    ctx.translate(center.x, center.y);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.translate(-center.x, -center.y);
     // Set opacity
    ctx.globalAlpha = opacity;
    // Draw image
    ctx.drawImage(sprite, centerDraw.x, centerDraw.y, width, height);
    ctx.restore();
}

function type(text, x, y, size, jumpIndex, jumpHeight){
    alpha = "abcdefghijklmnopqrstuvwxyz";
    special = {
        in: [':', '.', '!', '?', ';', ',', "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        translate: ['0_colon', "0_dot", "0_e_mark", "0_q_mark", "0_s_colon", "0_comma", '0_0','0_1','0_2','0_3','0_4','0_5','0_6','0_7','0_8','0_9']
    }
    text = text.toLowerCase().split(""); /* Split text into a char-array */
    position = x; /* Where to write the next letter, increases for each letter a varied amount. */
    letterIndex = 0;
    jump = 0;
    /* Account for unassigned variables */
    if(jumpHeight == undefined) jumpHeight = 15;
    if(size == undefined) size = 2;

    text.forEach(letter => {
        /* Draw out letter by letter */
        /* Special spacing for some characters */
        spacing = 7;
        /* Thinner letters */
        if(['i', '.', '!', ':', ';'].indexOf(letter) != -1) spacing = 3;
        /* Wider letters */
        if(['m', 'w'].indexOf(letter) != -1) spacing = 9;
        if(letter != " "){
            finalLetter = "";
            if(alpha.indexOf(letter) != -1){
                /* Letter is alpha */
                finalLetter = letter;
            } else if (special.in.indexOf(letter) != -1){
                /* Special symbol supported! */
                finalLetter = special.translate[special.in.indexOf(letter)];
            } else {
                console.warn("Symbol not supported! " + letter);
            }
            if(finalLetter !== ""){
                jump = 0;
                if(jumpIndex !== undefined){
                    if(Math.floor(jumpIndex) == letterIndex){
                        jump = Math.floor(jumpIndex) - jumpIndex;
                        jump = jump+1;
                        if(jump > .5) jump = 1-jump;
                        jump = jump*jumpHeight;
                    }
                }
                draw(finalLetter, position, y - jump, size);
            }
        }
        position+=spacing * size;
        letterIndex++;
    })
}


function startOpeningAnimation() {
    showingOpeningAnimation = true;
    openingProgress = 0;
    lastOpeningDate = Date.now();
}


var showingClearedScreen = false;

function showClearedScreen(text, color) {
    window.clearedProgress = 0;
    window.lastClearedProgressIncrease = Date.now();
    window.clearedColor = color;
    window.clearedText = text;
    window.clearedStartTime = Date.now();
    showingClearedScreen = true;
}

var disableInputs = false;
var fps = 0;
var frames = 0;
var lastCountedFPS = Date.now();
var frameScoreCached = new Array();

var renders = [menuRender, optionsRender, onlineRender];
var lastRender = Date.now();

function render() {
    if (Date.now() - lastRender < 16 && globalOptions.limitFPS) {
        requestAnimationFrame(render);
        return;
    }

    lastRender = Date.now();

    if (!inGame) {
        if (!playingMenuMusic && (!globalOptions.disableMusic && !globalOptions.disableSound) && !inGame) {
            /* Play menu music */
            playingMenuMusic = true;
            try {
                backgroundSound.pause();
            } catch (e) {}
            backgroundSound = s(mainMenuMusic[Math.floor(Math.random() * mainMenuMusic.length)]);
            backgroundSound.currentTime = 0;
            backgroundSound.volume = .2;
            backgroundSound.loop = true;
            backgroundSound.playbackRate = 1;
            backgroundSound.play();
        }

        if (((globalOptions.disableSound || globalOptions.disableMusic) && playingMenuMusic) || (inGame && playingMenuMusic)) {
            /* Stop menu music */
            playingMenuMusic = false;
            backgroundSound.pause();
        }
    }

    if (globalOptions.devTools) {
        disableGameOver = true;
        logCoordinates = true;
    } else {
        logCoordinates = false;
        disableGameOver = false;
    }

    if (Date.now() - lastCountedFPS > 50) {
        frameScoreCached.push(frames); // Add new package
        if (frameScoreCached.length > 20) frameScoreCached.splice(0, 1); // Remove first in order
        var totalFrames = 0;
        for (let i = 0; i < frameScoreCached.length; i++) {
            totalFrames += frameScoreCached[i];
        }
        fps = (totalFrames / frameScoreCached.length) * 20
        frames = 0;
        lastCountedFPS = Date.now();
    }
    frames++;

    if (!inGame) {
        renders[selectedScene].paint(); // Paint menu
    }
    if (inGame && !showingOpeningAnimation && !showingClearedScreen) {
        miniGame.loop()
        miniGame.paint()
        drawOverlay(); // Draw overlay last (on top)
    }
    if (showingOpeningAnimation) {
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        var maxSize = 70;
        var size = openingProgress * 10;
        if (size > maxSize) size = maxSize;
        ctx.font = size + "px mario-kart"
        var text = miniGame.introText.toUpperCase();
        ctx.fillText(text.substr(0, openingProgress), (canvas.width / 2), canvas.height / 2);
        if (Date.now() - lastOpeningDate > 50) {
            openingProgress++;
            lastOpeningDate = Date.now();
        }
        if (openingProgress > openingAnimationDuration) {
            /* Close opening animation */
            showingOpeningAnimation = false;
            timer = Date.now();
            window.timed = miniGame.timed;
            if (miniGame.requiresKeyboard && onMobile) {
                displayMobileKeyboard();
            }
            miniGame.init(difficulty);

        }
    }

    if (showingClearedScreen) {
        // Cleared animation
        var pins = 20;
        var pinOffset = 3;
        var speed = 2;
        var maxHeight = 15;
        var bounceScale = 30;
        var bounceSpeed = 50;
        var duration = 1200 // ms
        var curtainSpeed = 20;
        var textDisplayTimeout = 1.5;


        var timePassed = Date.now() - clearedStartTime;
        var opacity = 0;
        if ((timePassed - 900) > 0) {
            opacity = Math.round((((timePassed - 1000)) / 200) * 100) / 100;
        }

        clearedProgress += speed;
        ctx.fillStyle = "#111";
        if (x < 0 || x == undefined) {
            var x = (canvas.width * -1) + (clearedProgress * curtainSpeed)
            if (x > 0) x = 0;
        }
        ctx.fillRect(0, x, canvas.width, canvas.height);
        ctx.fillRect(0, x * -1, canvas.width, canvas.height);

        ctx.fillStyle = clearedColor;
        for (let i = 0; i < pins; i++) {
            var pinWidth = canvas.width / pins;
            var localProgress = clearedProgress - (i * pinOffset);
            var height = localProgress * 10;
            if (localProgress > maxHeight) {
                height = maxHeight * 10;
                height += (dampedSin((localProgress - maxHeight) / bounceSpeed) * bounceScale)
            }
            ctx.fillRect(i * (pinWidth), 0, pinWidth + 1, height);
            ctx.fillRect(i * (pinWidth), canvas.height, pinWidth + 1, height * -1);
        }
        var text = clearedText;
        var textOffset = 10;
        var textSpacing = 45;
        ctx.font = "50px mario-maker"
        for (let i = 0; i < (clearedProgress / textDisplayTimeout) - text.length; i++) {
            if (i < text.length) {
                var localProgress = clearedProgress - (i * textOffset)
                ctx.fillStyle = "rgba(255,255,255, 1)";
                type(text[i], canvas.width / 2 + (i * textSpacing) - (text.length * textSpacing / 2), canvas.height / 2 + (dampedSin((localProgress - (i + 100)) * 0.02)) - 40, 6);
            }
        }

        if (timePassed >= duration) showingClearedScreen = false;
        fill("rgba(17,17,17," + opacity + ")");
    }

    // Render FPS
    if (globalOptions.displayFPS) {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(555, 0, 80, 30);
        ctx.font = "20px mario-maker";
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        ctx.fillText("fps: " + Math.round(fps), 560, 20);
    }


    requestAnimationFrame(render);
}

function dampedSin(t) {
    return Math.pow(Math.E, t * (-1)) * Math.cos(2 * Math.PI * t);
}
