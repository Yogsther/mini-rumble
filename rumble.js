/**
 * Mini-Rumble Game Engine, core
 */

/* Debug options */
var instaStart = false; /* Insert gamemode variable here to instastart. Devmode needs to be enables aswell! */
var initialDificulty = 0 /* This needs to be 0 whenever a commit is made! */
/* These are already enabled if Dev-mode is enabled! */
var disableGameOver = false;
var logCoordinates = false;



/* Engine variables */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const c = canvas;

var loadingScreenDotJump = 0;
var loadingMessages = ["Get ready!", "Collecting your data", "Working hard", "Hardly working", "Sorting things out", "Downloading information"]
var currentLoadPackageMessage = loadingMessages[Math.floor(Math.random()*loadingMessages.length)];
renderLoadingScreen();


/* TODO: Warninnggggg */
var warningSigns = new Array();

var globalOptions = {
    displayFPS: false,
    devTools: false,
    disableSound: false,
    disableMusic: false,
    limitFPS: false
}


var miniGames = [mash, carrotCatch, hoverDodge, typeMaster, danceDude, gatherFortnite, cock_n_shoot, bounce, missiles];
var activeMinigames = miniGames.slice(); 

var backgroundSound = undefined;

var soundEffects = ["yoshi-mount.mp3", "faster.mp3", "menu-click.mp3"];
var titleSounds = ["mario-bonus-level.mp3", "yoshi-island.mp3", "WaluigiPinball.mp3", "ComeOn.mp3", "KingDedede.mp3", "DiggaLeg.mp3"];


function loadSettings() {
    expandOptions();
    var settings = localStorage.getItem("globalOptions");
    if (settings == undefined) return;
    globalOptions = Object.assign(globalOptions, JSON.parse(settings));
    loadWarnings();
}

function expandOptions(){
    for(let i = 0; i < miniGames.length; i++){
        eval("globalOptions." + miniGames[i].varName + " = false");
        optionsRender.options.push({text: "Disable " + miniGames[i].displayName, source: miniGames[i].varName});
    }
}

function loadWarnings(){
    warningSigns = [{title: "Note!", description: "Online features in progress"}];
    if(globalOptions.devTools) warningSigns.push({title: "Leaderboards disabled!", description: "Dev-mode is enabled!"});
    var gamemodesDisabled = 0;
    for(let i = 0; i < miniGames.length; i++){
        if(eval("globalOptions." + miniGames[i].varName)) gamemodesDisabled++;
    }
    var msg = " gamemodes are disabled."
    if(gamemodesDisabled < 2) msg = " gamemode is disabled."
    if(gamemodesDisabled > 0) warningSigns.push({title: "Leaderboards disabled!", description: gamemodesDisabled + msg});
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
var textureNames = ["neon_bg.jpg", "stopwatch.png"]
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
        text: "Limit FPS (60)",
        source: "limitFPS"
    }],
    spriteIndex: 0,
    backgroundSprites: importSpriteSheet("minirumble_titlescreen/minirumble_titlescreen_XXXXX.png", 60),
    paint: function () {

        /* Draw background */
        ctx.drawImage(this.backgroundSprites[this.spriteIndex % this.backgroundSprites.length], 0, 0);
        this.spriteIndex++;

        ctx.fillStyle = "rgba(0,0,0,0.75)";
        var width = canvas.width - (canvas.width / 4)
        var height = canvas.height - (canvas.height / 8);
        ctx.fillRect((canvas.width - width) / 2, (canvas.height - height) / 2, width, height);

        while(this.selectedOption % this.options.length > this.startPoint+3) this.startPoint++;
        while(this.selectedOption % this.options.length < this.startPoint) this.startPoint--;

        for (let i = this.startPoint; i < this.startPoint+4; i++) {
            var button = {
                x: this.buttonPositions.x = (canvas.width / 2) - (this.buttonStyles.width / 2),
                y: this.buttonPositions.y + ((i-this.startPoint) * (this.buttonSpacing + this.buttonStyles.height)),
                width: this.buttonStyles.width,
                height: this.buttonStyles.height,
                color: "#111"
            }

            var text = {
                display: this.options[i].text,
                state: this.options[i].source,
                x: button.x + 30,
                y: button.y + 36,
                scale: 1,
                otherScale: 1
            }

            if (this.selectedOption % this.options.length == i) {
                // Selected button
                button.x -= this.buttonZoom;
                button.y -= this.buttonZoom;
                button.width += this.buttonZoom * 2;
                button.height += this.buttonZoom * 2;
                button.color = "#353535"
                // Text
                text.scale = 1.15;
                text.x -= 10;
                text.y -= -1;
                text.otherScale = 1.1;
            }

            ctx.fillStyle = button.color;
            ctx.fillRect(button.x, button.y, button.width, button.height);
            ctx.fillStyle = "white";
            ctx.font = (20 * text.scale) + "px mario-maker";
            ctx.textAlign = "left";
            ctx.fillText(text.display + ":", text.x, text.y);
            // Status
            var statusText = {
                text: "No",
                color: "#912f2f"
            };
            if (eval("globalOptions." + this.options[i].source)) statusText = {
                text: "Yes",
                color: "#2f9146"
            };
            ctx.textAlign = "right";
            ctx.fillStyle = statusText.color;
            ctx.fillText(statusText.text, text.x + 340 * (text.otherScale), text.y)

        }
        ctx.fillStyle = "#111";
        ctx.font = "20px mario-maker",
        ctx.textAlign = "right";
        ctx.fillText("Z: Back X: Select", 630, 470);
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

        if (playEffect) playSound("menu-click");
    }
}

var onlineRender = {
    animationProgress: 0,
    buttons: ["Join", "Leave"],
    buttonZoom: [0, 0],
    selectedButton: 0,
    paint: function() {
        fill("#111");
        
        dots = canvas.width;
        speed = .1;
        spacing = .005;
        scale = 10;

        ctx.fillStyle = "#304560";
        ctx.fillRect(0, 0, canvas.width, 100);
        
        this.animationProgress+=speed;
        for(let i = 0; i < dots; i++){
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
        
        for(let i = 0; i < this.buttons.length; i++){
            var zoom = 0;
            var zoomSpeed = 3
            if(this.selectedButton % this.buttons.length == i){
                if(this.buttonZoom[i] < 10) this.buttonZoom[i] += zoomSpeed;
            } else {
                if(this.buttonZoom[i] > 0) this.buttonZoom[i] -= zoomSpeed;
            }
            zoom = this.buttonZoom[i]
            ctx.fillStyle = "#7092d1";
            ctx.fillRect(25 - zoom, 140 + (i * (100 + 20)) - zoom, 200 + zoom * 2, 100 + zoom * 2);
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.font =  30 + (zoom * 2) + "px mario-maker";
            ctx.fillText(this.buttons[i], 25 + (200 / 2) - (zoom/2) + 5, 140 + (i * (100 + 20)) - zoom)

        }


    }, 
    logic(key){
        if(key.is(keys.down)) this.selectedButton++;
        if(key.is(keys.up)){
            this.selectedButton--;
            if(this.selectedButton < 0) this.selectedButton+=this.buttons.length;
        }
        if(key.is(keys.back)) selectedScene = 0;
    }
}

var menuRender = /* Main Menu render and Logic (index: 0) */ {
    backgroundSprites: importSpriteSheet("minirumble_titlescreen/minirumble_titlescreen_XXXXX.png", 60),
    spriteIndex: 0,
    lastUpdate: Date.now(),
    buttonColors: [
        [209, 66, 66],
        [209, 83, 66],
        [209, 104, 66]
    ],
    buttonTitles: ["Play", "Online", "Options"],
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
        /* Fade colors for buttons */
        for (let j = 0; j < 5; j++) {
            for (let i = 0; i < this.buttonColors.length; i++) {
                this.buttonColors[i] = fadeColor(this.buttonColors[i][0], this.buttonColors[i][1], this.buttonColors[i][2]);
            }
        }

        /* Draw background */
        ctx.drawImage(this.backgroundSprites[this.spriteIndex % this.backgroundSprites.length], 0, 0);
        this.spriteIndex++;

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
            if (this.selectedButton == i) {
                ctx.fillStyle = "#9e1f1f"
                //ctx.fillStyle = "rgba(" + this.buttonColors[i][0] + ", " + this.buttonColors[i][1] + ", " + this.buttonColors[i][2] + ",0.5)";
            } else {
                ctx.fillStyle = "#2d0a0a"
                //ctx.fillStyle = "rgba(" + this.buttonColors[i][0] + ", " + this.buttonColors[i][1] + ", " + this.buttonColors[i][2] + ",0.3)";
            }
            ctx.fillRect(this.buttonPositions.x + tilt - 50, this.buttonPositions.y + (i * this.buttonSpacing) + 10, 450 * this.buttonScale + 20, 80 * this.buttonScale);

            /* Draw button */
            if (this.selectedButton % this.buttonColors.length == i) {
                ctx.fillStyle = "#e83333"
                //ctx.fillStyle = "rgb(" + this.buttonColors[i][0] + ", " + this.buttonColors[i][1] + ", " + this.buttonColors[i][2] + ")";
            } else {
                ctx.fillStyle = "#9b2323"
                //ctx.fillStyle = "rgba(17, 17, 17, 1)";
            }
            ctx.fillRect(this.buttonPositions.x + tilt - 50, this.buttonPositions.y + (i * this.buttonSpacing), 450 * this.buttonScale + 20, 80 * this.buttonScale);

            /* Draw button-text */
            ctx.font = 55 * this.buttonScale + "px mario-kart";
            ctx.textAlign = "left";
            ctx.fillStyle = "white";
            var globalOffset = -30 * this.buttonScale;

            var text = this.buttonTitles[i].toUpperCase();
            for (let j = 0; j < text.length; j++) {
                var jump = 0;
                if (this.progress == j && i == this.selectedButton % this.buttonTitles.length) jump = 10;
                ctx.fillText(text[j], tilt + this.buttonPositions.x + (j * 40 * this.buttonScale) - globalOffset + 80 * this.buttonScale, (this.buttonPositions.y - 10) + (i * this.buttonSpacing) - jump + 53);
                if (text[j] == "I") globalOffset += 12;
            }

            var hopSpeed = 50; // ms
            var maxHopLength = this.buttonTitles[this.selectedButton % this.buttonTitles.length].length + 10; // chars
            if (Date.now() - this.lastUpdate > hopSpeed) {
                this.progress += 1;
                this.lastUpdate = Date.now();
                if (this.progress > maxHopLength) this.progress = 0;
            }

            ctx.fillStyle = "#111";
            ctx.font = "20px mario-maker",
            ctx.textAlign = "right";
            ctx.fillText("Z: Back X: Select", 630, 470);
            ctx.fillStyle = "rgba(0,0,0,0.3)";
            ctx.textAlign = "left";
            ctx.fillText(version, 15, 30);

            /* Warning signs */
            
            for(let i = 0; i < warningSigns.length; i++){
                /* Black box */
                height = 60; 
                width = 230; 
                x = 390; 
                y = 383 - (i * (height+10));

                ctx.fillStyle = "rgba(0,0,0,.6)"
                ctx.fillRect(x, y, width, height);
                ctx.fillStyle = "red";
                ctx.textAlign = "left";
                ctx.font = "15px mario-maker"
                ctx.fillText(warningSigns[i].title, x+10, y+25)
                ctx.fillStyle = "white";
                ctx.font = "14px mario-maker"
                ctx.fillText(warningSigns[i].description, x+10, y+45)
            }
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

        if (playEffect) playSound("menu-click");
    }
}



window.onload = () => {
    ready = false;
    //renderLoadingScreen(); // TODO: Not working for some reason..
    checkForMobileUser()
    loadSettings();
    getAmountOfCommits();
    loadFinalStuff();
    loadLast();
}

function getAmountOfCommits(){
    
    var client = new XMLHttpRequest();
    client.open('GET', 'https://api.github.com/repos/yogsther/mini-rumble/commits');
    client.onreadystatechange = function() {
        var commits = client.responseText;
        commits = JSON.parse(commits);
        var i = 0;
        window.finalVersion = false;
        commits.forEach(commit => {
            if(finalVersion === false){
            var message = commit.commit.message;
            if(message.indexOf("v.") != -1){
                version = message.substr(message.indexOf("v."), message.indexOf(" ")) + "." + i;    
            }
            i++;
            }
        })
    }
    client.send();
}

var version = "Beta";

/* 
    Old way of getting the current version via the README
    function getVersion(){
    var client = new XMLHttpRequest();
    client.open('GET', '/README.md');
    client.onreadystatechange = function() {
        var s = JSON.stringify(client.responseText)
        version = s.substr(s.indexOf("(") + 1, s.indexOf(")") -17);
    }
    client.send();
} */

var startedLoading = false;
function loadFinalStuff(){
    startedLoading = true;
    importTextures();
    importSounds();
    //loadControlpanel();
    readyOverlay();
    ready = true;
    instaLoad();
}

function instaLoad(){
    if(instaStart !== false && globalOptions.devTools){
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
    loadingScreenDotJump+=.05;
    var loadingString = "Loading";
    for(let i = 0; i < (loadingScreenDotJump % 4-1); i++) loadingString+=".";
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
        onMobile = true;
    }
}

var overlaySprites = new Array();

function readyOverlay() {
    overlaySprites = importSpriteSheet("overlay/overlay_XX.png", 20);
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
    console.log(currentLoadPackageMessage);
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

}

function importTexture(texture) {
    var textureName = texture.substr(texture.lastIndexOf("/") + 1);
    textureName = textureName.substr(0, textureName.indexOf("."));

    textures[textureName] = new Image();
    textures[textureName].src = "textures/" + texture;
    return textures[textureName];
}

function importSounds() {
    currentLoadPackageMessage = "Importing sounds";
    titleSounds.forEach(sound => {
        importSound(sound);
    })

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

function playSound(name) {
    if (globalOptions.disableSound) return;
    if (name.indexOf(".") != -1) {
        var sound = name;
        var soundName = sound.substr(sound.lastIndexOf("/") + 1);
        soundName = soundName.substr(0, soundName.indexOf("."));
        name = soundName;
    }
    sounds[name].volume = .4;
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

    inGame = true;
    if (!globalOptions.disableSound && !globalOptions.disableMusic) {
        backgroundSound = s(titleSounds[Math.floor(Math.random() * titleSounds.length)]);
        backgroundSound.volume = .2;
        backgroundSound.loop = true;
        backgroundSound.play();
    }

    showClearedScreen("Ready? Go!", "#66a0ff");
    setTimeout(() => {
        score = 0;
        window.difficulty = initialDificulty;
        newGame();
    }, 1000)
}

function newGame() {
    /* For each start of a new mini-game. */
    var miniGamesArray = miniGames.concat(); // Copy array

    for(let i = 0; i < miniGamesArray.length; i++){
        if(eval("globalOptions." + miniGamesArray[i].varName)){
            miniGamesArray.splice(i , 1);
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

    if(miniGamesArray.length < 1){
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

    if (logCoordinates) console.log("X: ", x, "Y: ", y);
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

function loadLast(){
    var keys = [38, 40, 37, 39, 88, 90];
    var translate = ["up", "down", "left", "right", "x", "z"];

    var elements = document.getElementsByClassName("dpad");
    for(let i = 0; i < elements.length; i++){
        elements[i].addEventListener("touchstart", e => {
            var index = translate.indexOf(elements[i].id);
            var key = keys[index];

            if(!keyDown(key)) keysDown.push(key);
        });

        elements[i].addEventListener("touchend", e => {
            var index = translate.indexOf(elements[i].id);
            var key = keys[index];
            
            while (keyDown(key)) {
                for (let i = 0; i < keysDown.length; i++) {
                    if (keysDown[i] == key){
                        keysDown.splice(i, 1);
                    }
                }
            }
        });
    }
}

function displayMobileKeyboard(){
    disableKeyboard = true;
    document.getElementById("keyboard-input").innerHTML = ' <input type="text" id="keyboard-controlls" oninput="detectMobileInput(this.value)">';
    document.getElementById("keyboard-controlls").focus();
    return;
}

function hideMobileKeyboard(){
    disableKeyboard = false;
    document.getElementById("keyboard-input").innerHTML = '';
    document.getElementById("canvas").focus();
}


var disableKeyboard = false;

function detectMobileInput(value){
    var charCode = value.toLowerCase().charCodeAt(0);
    click(charCode, value);
    document.getElementById("keyboard-controlls").value = "";
}


function click(code, char) {
    if(!ready) return;
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
    if(disableKeyboard) return;
    click(e.keyCode, e.key)
});

function cleared(ms){
    
    if (ms == undefined) ms = 0;
    globalOptions.disableGameOver = true;
    
    setTimeout(() => {
        disableKeyboard = false;
        score++;
        var sound = "yoshi-mount";
        var display = {
            text: "Cleared!",
            color: "#38ed4a"
        }
        if (score % 3 == 0) {
            sound = "faster";
            difficulty++;
            if (!globalOptions.disableSound && !globalOptions.disableMusic) backgroundSound.playbackRate += .05;

            display = {
                text: "Faster!",
                color: "#ffe226"
            }
        }
        playSound(sound);
        showClearedScreen(display.text, display.color);
        setTimeout(() => {
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
    ctx.drawImage(overlaySprites[Math.round(overlayProgress) % overlaySprites.length], 0, 0);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "30px mario-maker"
    var timePrint = timeLeft.toString();
    if (timeLeft < 0) timePrint = "0";
    if (!timed) timePrint = "?";
    ctx.fillText(timePrint, 591, 440)

    ctx.fillStyle = "#f4d942",
        ctx.textAlign = "left";
    ctx.fillText(score.toString(), 418, 440)
}

var failedCalled = false;
function failed(ms) {
    if(globalOptions.devTools) return;
    if(failedCalled) return;
    failedCalled = true;
    if (ms == undefined) ms = 0;
    disableInputs = true;
    setTimeout(() => {
        disableKeyboard = false;
        miniGame = undefined;
        showClearedScreen("Game Over!", "#8c2424");
        inGame = false;
        setTimeout(() => {
            try {
                backgroundSound.pause();
                backgroundSound.playbackRate = 1;
                backgroundSound.currentTime = 0;
                //setTimeout(()=> {clearInterval(slowDown);}, 250);
            } catch (e) {}
            failedCalled = false;
            disableInputs = false
        }, 400);
    }, ms)
}

function draw(sprite, x, y, scale){
    if(scale == false) scale = 1;
    ctx.drawImage(sprite, x, y, sprite.width * scale, sprite.height * scale);
}

function checkCollision(sprite1, x1, y1, scale1, sprite2, x2, y2, scale2){
    if(scale1 == false) scale1 = 1;
    if(scale2 == false) scale2 = 1;

    // TODO

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
    if(Date.now() - lastRender < 16 && globalOptions.limitFPS){
        requestAnimationFrame(render);
        return;
    }

    lastRender = Date.now();

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
        ctx.fillText(text.substr(0, openingProgress), (canvas.width / 2), canvas.height / 2)
        if (Date.now() - lastOpeningDate > 50) {
            openingProgress++;
            lastOpeningDate = Date.now();
        }
        if (openingProgress > openingAnimationDuration) {
            /* Close opening animation */
            showingOpeningAnimation = false;
            timer = Date.now();
            window.timed = miniGame.timed;
            if(miniGame.requiresKeyboard && onMobile){
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
        if((timePassed - 900) > 0){
            opacity = Math.round((((timePassed - 1000)) / 200) * 100) / 100;
        }

        clearedProgress += speed;
        ctx.fillStyle = "#111";
        if (x < 0 || x == undefined) {
            var x = (canvas.width * -1) + (clearedProgress * curtainSpeed)
            if (x > 0) x = 0;
        }
        ctx.fillRect(0, x, canvas.width, canvas.height);
        ctx.fillRect(0, x*-1, canvas.width, canvas.height);

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
        var textSpacing = 50;
        ctx.font = "50px mario-maker"
        for (let i = 0; i < (clearedProgress / textDisplayTimeout) - text.length; i++) {
            if (i < text.length) {
                var localProgress = clearedProgress - (i * textOffset)
                ctx.fillStyle = "rgba(255,255,255, 1)";
                ctx.fillText(text[i], canvas.width / 2 + (i * textSpacing) - (text.length * textSpacing / 2) + 25, 10 + canvas.height / 2 + (dampedSin((localProgress - (i + 100)) * 0.02)));
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
