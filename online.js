/* Connect */
var socket = io.connect("213.66.254.63:5223");
var games = new Array();
var game = new Object();

socket.on("connect", () => { isOnline = true });
socket.on("disconnect", () => { isOnline = false });


socket.on("list", list => {
    games = list;
})

socket.on("gameUpdate", recivedGame => {
    game = recivedGame;
})

socket.on("scoreboard", info => {
    window.scoreboard = info.scoreboard;
    onlineRender.scene = 3;
})

socket.on("joined", recivedGame => {
    game = recivedGame;
    onlineRender.scene = 2;
})

socket.on("startGame", gameData => {
    seed = gameData.seed;
    startOnlineGame(gameData);
})

function requestCreateLobby(){
    socket.emit("createLobby", {
        username: globalOptions.username,
        settings: globalOptions,
        lobbyName: globalOptions.lobbyName,
        password: globalOptions.password
    })
}

function joinLobby(id){
    socket.emit("join", {id: games[id].id, username: globalOptions.username, password: lobbyPassword})
}

function browse(){
    socket.emit("browse");
}


function disconnect(){
    socket.emit("leave");
    inOnlineGame = false;
}

function onlineInitGame(){
    // Initiate the game (only for game leader)
    socket.emit("startGame")
}

function startOnlineGame(gameData) {
    /* First start of the game, total reset. */
    window.difficulty = 0;
    window.overlaySprite = overlaySprites[Math.floor(random() * overlaySprites.length)];
    inGame = true;
    inOnlineGame = true;
    window.lives = gameData.lives;
    
    if (!globalOptions.disableSound && !globalOptions.disableMusic && playingMenuMusic) {
        backgroundSound.pause();
        backgroundSound = s(titleSounds[Math.floor(random() * titleSounds.length)]);
        backgroundSound.volume = .2;
        backgroundSound.loop = true;
        backgroundSound.playbackRate = 1;
        backgroundSound.play();
    }
    playingMenuMusic = false;

    if(gameData.score == 0){
        showClearedScreen("Online? Go!", "#ffbc00");
        window.startTimout = setTimeout(() => {
            score = 0;
            newOnlineGame(gameData);
            globalOptions.disableGameOver = false;
        }, 1000)
    } else {
        showingClearedScreen = false;
        score = 0;
        newOnlineGame(gameData);
        globalOptions.disableGameOver = false;
    }
    
}

function newOnlineGame(minigameInput) {

    miniGames.forEach(mini => {
        if(mini.varName == minigameInput.miniGame) miniGame = mini;
    })
    drawOpening();
    
    score = minigameInput.score;
    lives = minigameInput.lives;
    difficulty = minigameInput.difficulty;
    if(minigameInput.faster) showFasterAnimation = true;
        else showFasterAnimation = false;
    
    if (miniGame.themeColor !== undefined) changeThemeColor(miniGame.themeColor);
    else changeThemeColor("#000000");
    inGame = true;
    inOnlineGame = true;
    setTimeout(() => { showingClearedScreen = false }, 200);
}

