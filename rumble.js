/**
 * Mini-Rumble Game Engine, core
 */

/* Engine variables */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var inGame = false;
var selectedScene = 0;
var miniGame = 0;
var showingOpeningAnimation = false;
var score = 0;
var openingAnimationDuration = 15;
var gameLength = 5; // Seconds
var timer = 0;


/* All texture name to be imported during the importTextures process. */
var textureNames = ["neon_bg.jpg", "stopwatch.png"]
var textures = new Object();

var keys = {
    action: [88, 32, 13],
    back: [90, 8, 27],
    up: [38],
    down: [40],
    left: [37],
    right: [39]
}


var menuRender = /* Main Menu render and Logic (index: 0) */ {
    lastUpdate: Date.now(),
    buttonColors: [
        [255, 0, 0],
        [200, 55, 0],
        [150, 105, 0]
    ],
    buttonTitles: ["Play", "Options", "Exit"],
    selectedButton: 0,
    progress: 0,
    buttonPositions: {
        x: -50,
        y: 150
    },
    buttonSpacing: 100,
    paint: function () {
        ctx.textAlign = "left"
        /* Fade colors for buttons */
        for (let j = 0; j < 5; j++) {
            for (let i = 0; i < this.buttonColors.length; i++) {
                this.buttonColors[i] = fadeColor(this.buttonColors[i][0], this.buttonColors[i][1], this.buttonColors[i][2]);
            }
        }

        /* Draw background */
        ctx.drawImage(textures["neon_bg"], 0, 0)
        ctx.fillStyle = "rgba(17, 17, 17,0.8)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        /* Draw buttons */
        for (let i = 0; i < 3; i++) {
            var tilt = 0;
            if (this.selectedButton % this.buttonColors.length == i) tilt = 50;
            /* Draw button shadow */
            // Draw black background for darkness instead of transparency 
            ctx.fillStyle = "black";
            ctx.fillRect(this.buttonPositions.x + tilt - 50, this.buttonPositions.y + (i * this.buttonSpacing) + 10, 450, 80);
            if (this.selectedButton == i) {
                ctx.fillStyle = "rgba(" + this.buttonColors[i][0] + ", " + this.buttonColors[i][1] + ", " + this.buttonColors[i][2] + ",0.5)";
            } else {
                ctx.fillStyle = "rgba(" + this.buttonColors[i][0] + ", " + this.buttonColors[i][1] + ", " + this.buttonColors[i][2] + ",0.3)";
            }
            ctx.fillRect(this.buttonPositions.x + tilt - 50, this.buttonPositions.y + (i * this.buttonSpacing) + 10, 450, 80);

            /* Draw button */
            if (this.selectedButton % this.buttonColors.length == i) {
                ctx.fillStyle = "rgb(" + this.buttonColors[i][0] + ", " + this.buttonColors[i][1] + ", " + this.buttonColors[i][2] + ")";
            } else {
                ctx.fillStyle = "rgba(17, 17, 17, 1)";
            }
            ctx.fillRect(this.buttonPositions.x + tilt, this.buttonPositions.y + (i * this.buttonSpacing), 400, 80);

            /* Draw button-text */
            ctx.font = "55px mario-kart";
            ctx.fillStyle = "white";
            var globalOffset = -30;

            var text = this.buttonTitles[i].toUpperCase();
            for (let j = 0; j < text.length; j++) {
                var jump = 0;
                if (this.progress == j && i == this.selectedButton % this.buttonTitles.length) jump = 10;
                ctx.fillText(text[j], tilt + this.buttonPositions.x + (j * 40) - globalOffset + 80, this.buttonPositions.y + (i * this.buttonSpacing) - jump + 53);
                if (text[j] == "I") globalOffset += 12;
            }

            var hopSpeed = 50; // ms
            var maxHopLength = this.buttonTitles[this.selectedButton % this.buttonTitles.length].length + 10; // chars
            if (Date.now() - this.lastUpdate > hopSpeed) {
                this.progress += 1;
                this.lastUpdate = Date.now();
                if (this.progress > maxHopLength) this.progress = 0;
            }

        }
    },
    logic: function (key) {
        if (key.code == 40) this.selectedButton++;
        if (key.code == 38) {
            this.selectedButton--;
            if (this.selectedButton < 0) this.selectedButton = this.buttonColors.length - 1;
        }
        if (key.is(keys.action)) {
            if (this.selectedButton % this.buttonColors.length == 0) startGame(); /* Play button */
        }
    }
}

var renders = [menuRender];

window.onload = () => {
    importTextures();
    readyOverlay();
    render();
}

var overlaySprites = new Array();
function readyOverlay() {
    for (let i = 0; i < 20; i++) {
        var number = i.toString();
        if (number.length < 2) number = "0" + number;
        overlaySprites.push("overlay_" + number);
        importTexture("overlay/overlay_" + number + ".png");
    }
}


function t(name) {
    return textures[name];
}

function fadeColor(r, g, b) {
    if (r > 0 && b == 0) {
        r--;
        g++;
    }
    if (g > 0 && r == 0) {
        g--;
        b++;
    }
    if (b > 0 && g == 0) {
        r++;
        b--;
    }
    return [r, g, b];
}

function importSpriteSheet(path, amount){

}

function importTextures() {
    /* Import all textures */
    miniGames.forEach(minigame => {
        if (minigame.textures != false) {
            minigame.textures.forEach(texture => {
                textureNames.push(texture);
            })
        }
    });
    textureNames.forEach(texture => {
        importTexture(texture);
    })
}

function importTexture(texture) {
    var textureName = texture.substr(texture.lastIndexOf("/") + 1);
        textureName = textureName.substr(0, textureName.indexOf("."));
    
    textures[textureName] = new Image();
    textures[textureName].src = "textures/" + texture;
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
    inGame = false;
    showClearedScreen("Ready? Go!", "#66a0ff");
    setTimeout(() => {
        score = 0;
        window.difficulty = 0;
        newGame();
    }, 1000)

}

function newGame() {
    /* For each start of a new mini-game. */
    drawOpening();
    miniGame = miniGames[Math.floor(Math.random() * miniGames.length)];
    inGame = true;
}

document.addEventListener("keydown", e => {
    var key = {
        code: e.keyCode,
        is: function (type) {
            if (type == undefined) return false;
            if (type.constructor != Array) return this.code == type;
            return type.indexOf(this.code) != -1;
        }
    };

    if (!inGame) renders[selectedScene].logic(key);

    if (inGame && !showingOpeningAnimation) miniGame.logic(key);

    if (!keyDown(e.keyCode)) {
        keysDown.push(e.keyCode);
    }
});

function cleared() {
    score++;
    var display = {
        text: "Cleared!",
        color: "#38ed4a"
    }
    if (score % 3 == 0) {
        difficulty++;
        display = {
            text: "Faster!",
            color: "#ffe226"
        }
    }
    showClearedScreen(display.text, display.color);
    setTimeout(() => {
        newGame();
    }, 1000);
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

var overlayProgress = 0;

function drawOverlay() {

    var timePassed = (Date.now() - timer) / 1000;
    var timeLeft = Math.ceil(gameLength - timePassed);
    if (timeLeft < 0) {
        showClearedScreen("Game Over!", "#8c2424");
        inGame = false;
    }
    overlayProgress+=0.4; // Speed
    ctx.drawImage(textures[overlaySprites[Math.round(overlayProgress) % overlaySprites.length]], 0, 0);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "30px mario-maker"
    ctx.fillText(timeLeft.toString(), 591, 440)

    ctx.fillStyle = "#f4d942",
    ctx.textAlign = "left";
    ctx.fillText(score.toString(), 418, 440)



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

var fps = 0;
var frames = 0;
var lastCountedFPS = Date.now();
var frameScoreCached = new Array();

function render() {

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
        ctx.fillText(text.substr(0, openingProgress), (canvas.width / 2), canvas.height / 2)
        if (Date.now() - lastOpeningDate > 50) {
            openingProgress++;
            lastOpeningDate = Date.now();
        }
        if (openingProgress > openingAnimationDuration) {
            /* Close opening animation */
            showingOpeningAnimation = false;
            timer = Date.now();
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
        var duration = 1000 // ms
        var curtainSpeed = 30;
        var textDisplayTimeout = 1.5;


        clearedProgress += speed;
        ctx.fillStyle = "#111";
        if (x < 0 || x == undefined) {
            var x = (canvas.width * -1) + (clearedProgress * curtainSpeed)
            if (x > 0) x = 0;
        }
        ctx.fillRect(x, 0, canvas.width, canvas.height);

        ctx.fillStyle = clearedColor;
        for (let i = 0; i < pins; i++) {
            var pinWidth = canvas.width / pins;
            var localProgress = clearedProgress - (i * pinOffset)
            var height = localProgress * 10;
            if (localProgress > maxHeight) {
                height = maxHeight * 10;
                height += (dampedSin((localProgress - maxHeight) / bounceSpeed) * bounceScale)
            }
            //if()
            ctx.fillRect(i * (pinWidth), 0, pinWidth + 1, height);
            ctx.fillRect(i * (pinWidth), canvas.height, pinWidth + 1, height * -1);
        }
        var text = clearedText;
        var textOffset = 10;
        var textSpacing = 50;
        ctx.font = "50px mario-maker"
        for (let i = 0; i < (clearedProgress / textDisplayTimeout) - text.length; i++) {
            if (i < text.length) {
                var localProgress = clearedProgress - (i * textOffset)
                ctx.fillStyle = "white";
                ctx.fillText(text[i], canvas.width / 2 + (i * textSpacing) - (text.length * textSpacing / 2) + 25, 10 + canvas.height / 2 + (dampedSin((localProgress - (i + 100)) * 0.02)));
            }
        }
        if (Date.now() - clearedStartTime >= duration) showingClearedScreen = false;
    }

    // Render FPS
    ctx.font = "20px mario-maker";
    ctx.fillStyle = "white";
    ctx.textAlign = "right";
    ctx.fillText("fps: " + Math.round(fps), 630, 20);
    requestAnimationFrame(render);
}

function dampedSin(t) {
    return Math.pow(Math.E, t * (-1)) * Math.cos(2 * Math.PI * t);
}

//showClearedScreen();/* 
/* setInterval(()=> {
    showClearedScreen();
}, 1000000) */