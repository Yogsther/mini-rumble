
var hoverDodge = {
    varName: "hoverDodge",
    displayName: "Hover Dodge",
    icon: "gameicons/hoverDodge_icon.png",
    timed: true,
    timedWin: true,
    textures: [
        "hover_dodge/hover_board.png", 
        "hover_dodge/warning.png"
    ],
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
        var amountOfPolls = 20 * (dif+1);
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
            if(this.playerJumpProgress > 5.9 || (this.playerY > this.groundLevel + (this.playerTexture.height * this.playerScale))){
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

miniGames.push(hoverDodge);