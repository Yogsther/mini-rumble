/* Connect */
var socket = io.connect("localhost:9898");
var games = new Array();
var game = new Object();

socket.on("connect", () => { isOnline = true });
socket.on("disconnect", () => { isOnline = false });

function requestCreateLobby(){
    socket.emit("createLobby", {
        username: "Test user"
    })
}

function joinLobby(id){
    socket.emit("join", {id: games[id].id, username: "Test user"})
}

function browse(){
    socket.emit("browse");
}

socket.on("list", list => {
    games = list;
})

socket.on("joined", recivedGame => {
    game = recivedGame;
    onlineRender.scene = 2;
})

function disconnect(){
    socket.emit("leave");
}