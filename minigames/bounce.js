
var bounce = {
    varName: "bounce",
    displayName: "Bounce",
    timed: true,
    timedWin: true,
    textures: [],
    introText: "Bounce!",
    init: function (dif) {
        this.bounces = 0;
        this.playerSpeed = (((dif + 1) * 2) + 6);
        this.pastPositions = new Array();
        this.dot = {
            x: canvas.width /2,
            y: 25,
            dir: Math.floor(Math.random()*110)+200,
            vel: (((dif + 1) * 2) + 6),
            width: 20,
            length: 20,
            color: [255, 66, 66]
        }
        this.player = {
            x: (canvas.width / 2) - (100 /* player.width*/ /2),
            y: 355,
            height: 20,
            width: 100
        }
    },
    paint: function () {
        fill("#111");
        /* Paint the dot */
        ctx.fillStyle = "rgba(" + this.dot.color[0] + ", " + this.dot.color[1] + ", " + this.dot.color[2] +  ")";
        var i = 0;
        this.pastPositions.forEach(dot => {
            ctx.fillStyle = "rgba(" + dot.color[0] + ", " + dot.color[1] + ", " + dot.color[2] +  ", " + (i / this.pastPositions.length) + ")";
            ctx.fillRect(dot.x, dot.y, this.dot.width, this.dot.width);
            i++;
        })
        this.dot.color = fadeColor(this.dot.color[0], this.dot.color[1], this.dot.color[2])
        ctx.fillRect(this.dot.x, this.dot.y, this.dot.width, this.dot.width);

        /* Draw player */
        ctx.fillStyle = "white";
        ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
    },
    checkBounds: function(){
        colliding = false;
        if(this.bounces < 1){
        if(this.dot.x > canvas.width - this.dot.width) colliding = "x"; 
        if(this.dot.x < 0) colliding = "x";
        if(this.dot.y + this.dot.width > canvas.height) failed();
        if(this.dot.y + this.dot.width > this.player.y && this.dot.y < this.player.y + this.player.height){
            if(this.dot.x + this.dot.width > this.player.x && this.dot.x < this.player.x + this.player.width){
                colliding = "y";
            }
        }

        
        if(this.dot.y < 0) colliding = "y";
        if(colliding === "x"){
            this.dot.dir = 180 - this.dot.dir; 
        } else if(colliding === "y") {
            this.dot.dir = 360 - this.dot.dir;
        }
        if(colliding !== false){
            //this.dot.vel += 5;
            this.bounces = 3;
            //if(this.dot.vel > 8) this.dot.vel = 8;
        }
    }   
    
        this.pastPositions.push({x: this.dot.x, y: this.dot.y, color: this.dot.color});
        while(this.pastPositions.length > this.dot.length) this.pastPositions.splice(0, 1);
    },
    loop: function (){
        if(this.bounces > 0) this.bounces--;
        playerSpeed = this.playerSpeed;
        if(keyDown(keys.left)) this.player.x-=playerSpeed;
        if(keyDown(keys.right)) this.player.x+=playerSpeed;

        this.checkBounds();
        direction = this.dot.dir / (180/Math.PI)
        this.dot.x += Math.cos(direction) * this.dot.vel;
        this.dot.y += Math.sin(direction) * this.dot.vel;
        /* Gravity */
        //if(this.dot.vel > 0) this.dot.vel-=.02;
        //if(this.dot.vel < 0) this.dot.vel = 0;
        //this.dot.y+=2;
    },
    logic: function (key) {
       
    }

}

miniGames.push(bounce);