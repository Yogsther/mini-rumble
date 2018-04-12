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


/* All texture name to be imported during the importTextures process. */
var textureNames = ["neon_bg.jpg"]
var textures = new Object();

var keys = {
    action: [88, 32, 13],
    back: [90, 8, 27],
    up: [38],
    down: [40],
    left: [37],
    right: [39]
}



var menuRender =  /* Main Menu render and Logic (index: 0) */ {
    lastUpdate: Date.now(),
    buttonColors: [[255,0,0],[200,55,0],[150,105,0]],
    buttonTitles: ["Play", "Options", "Exit"],
    selectedButton: 0,
    progress: 0,
    buttonPositions: {x: -60, y: 150},
    buttonSpacing: 100,
    paint: function(){
        /* Fade colors for buttons */
        for(let j = 0; j < 5; j++){
            for(let i = 0; i < this.buttonColors.length; i++){
                this.buttonColors[i] = fadeColor(this.buttonColors[i][0], this.buttonColors[i][1], this.buttonColors[i][2]);
            }
        }

        /* Draw background */
        ctx.drawImage(textures["neon_bg"], 0, 0)
        ctx.fillStyle = "rgba(17, 17, 17,0.8)";
        ctx.fillRect(0,0,canvas.width, canvas.height);

        /* Draw buttons */
        for(let i = 0; i < 3; i++){
            var tilt = 0;
            if(this.selectedButton % this.buttonColors.length == i) tilt = 50;
            /* Draw button shadow */
            // Draw black background for darkness instead of transparency 
            ctx.fillStyle = "black";
            ctx.fillRect(this.buttonPositions.x+tilt-50, this.buttonPositions.y+(i*this.buttonSpacing)+10, 450, 80);
            if(this.selectedButton == i){
                ctx.fillStyle = "rgba(" + this.buttonColors[i][0] + ", " + this.buttonColors[i][1] + ", " + this.buttonColors[i][2] + ",0.5)";
            } else {
                ctx.fillStyle = "rgba(" + this.buttonColors[i][0] + ", " + this.buttonColors[i][1] + ", " + this.buttonColors[i][2] + ",0.3)";
            }
            ctx.fillRect(this.buttonPositions.x+tilt-50, this.buttonPositions.y+(i*this.buttonSpacing)+10, 450, 80);
            
            /* Draw button */
            if(this.selectedButton % this.buttonColors.length == i){
                ctx.fillStyle = "rgb(" + this.buttonColors[i][0] + ", " + this.buttonColors[i][1] + ", " + this.buttonColors[i][2] + ")";
            } else {
                ctx.fillStyle = "rgba(17, 17, 17, 1)";
            }
            ctx.fillRect(this.buttonPositions.x+tilt, this.buttonPositions.y+(i*this.buttonSpacing), 400, 80);
            
            /* Draw button-text */
            ctx.font="55px mario-kart";
            ctx.fillStyle = "white";
            var globalOffset = 0;
            
            var text = this.buttonTitles[i].toUpperCase();
            for(let j = 0; j < text.length; j++){
                var jump = 0;
                if(this.progress == j && i == this.selectedButton % this.buttonTitles.length) jump = 10; 
                ctx.fillText(text[j], tilt+this.buttonPositions.x+(j*40)-globalOffset+80, this.buttonPositions.y+(i*this.buttonSpacing)-jump+53);
                if(text[j] == "I") globalOffset += 12;
            }

            var hopSpeed = 50; // ms
            var maxHopLength = this.buttonTitles[this.selectedButton % this.buttonTitles.length].length + 10; // chars
            if(Date.now() - this.lastUpdate > hopSpeed){
                this.progress+=1;
                this.lastUpdate = Date.now();
                if(this.progress > maxHopLength) this.progress = 0;
            }
            
        }
    }, 
    logic: function(key) {
        if(key == 40) this.selectedButton++;
        if(key == 38){
            this.selectedButton--;
            if(this.selectedButton < 0) this.selectedButton = this.buttonColors.length-1;
        }
        if(keys.action.indexOf(key) != -1){
            if(this.selectedButton == 0) startGame(); /* Play button */
        }
    }
}

var renders = [menuRender];

window.onload = ()=>{
    importTextures();
    render();
}


function t(name){
    return textures[name];
}

function fadeColor(r,g,b){
    if(r > 0 && b == 0){
        r--;
        g++;
      }
      if(g > 0 && r == 0){
        g--;
        b++;
      }
      if(b > 0 && g == 0){
        r++;
        b--;
      }
      return [r,g,b];
      //return "rgb("+r+","+g+","+b+")";
}



function importTextures() {
    /* Import all textures */
    textureNames.forEach(texture => {
        var textureName = texture.substr(0, texture.indexOf("."));
        textures[textureName] = new Image();
        textures[textureName].src = "textures/" + texture;
    })
}

var keysDown = new Array();
function keyDown(keys){
    if(!isNaN(keys)) keys = [keys];
    for(let i = 0; i < keysDown.length; i++){
        if(keys.indexOf(keysDown[i]) != -1) return true;
    }
    return false;
}

function startGame(){
    score = 0;
    miniGame = miniGames[0];
    inGame = true;
    showingOpeningAnimation = true;    
    drawOpening();
    miniGame.init(1);
}



document.addEventListener("keydown", e => {
    if(!inGame) renders[selectedScene].logic(e.keyCode);
    if(!keyDown(e.keyCode)){
        keysDown.push(e.keyCode);
    }

});

document.addEventListener("keyup", e => {
    while(keyDown(e.keyCode)){
        for(let i = 0; i < keysDown.length; i++){
            if(keysDown[i] == e.keyCode) keysDown.splice(i, 1);
        }
    }
})

function drawOpening(){
    showingOpeningAnimation = true;
    window.openingProgress = 0;
    window.lastOpeningDate = Date.now(); // Throttle
}

function render() {
    if (!inGame) {
        renders[selectedScene].paint(); // Paint menu
    }
    if(inGame && !showingOpeningAnimation){
        miniGames[miniGame].loop()
        miniGames[miniGame].paint()
    }
    if(showingOpeningAnimation){
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        var maxSize = 70;
        var size = openingProgress * 10;
        if(size > maxSize) size = maxSize;
        ctx.font = size + "px mario-kart" 
        var text = miniGame.introText
        ctx.fillText(text.substr(0, openingProgress), (canvas.width/2), canvas.height/2)
        if(Date.now() - lastOpeningDate > 50){
            openingProgress++;
            lastOpeningDate = Date.now();
        }
        
    }
    requestAnimationFrame(render);
}

