var gatherFortnite = {
    varName: "gatherFortnite",
    displayName: "Wood Gather",
    timed: true,
    textures: ["gather/tricerathot.png", "gather/wood.png"],
    introText: "Gather!",
    init: function (dif) {
        /* Run on initiation */
        this.dif = dif;
        this.materials = new Array();
        this.player = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            direction: 0,
            superDirection: 0,
            sprite: t("tricerathot"),
            scale: .4
        }
        

    },
    paint: function () {
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Clear

        // Draw player

        var playerDrawPoint = this.getDrawPoint(this.player.x, this.player.y, this.player.sprite);


        ctx.save();
        ctx.translate(playerDrawPoint.x, playerDrawPoint.y);
        var desiredDirection = (90 * this.player.direction);
        for(let i = 0; i < 6; i++){
            var distance = (desiredDirection - (this.player.superDirection % 360))
            console.log(distance);
            var changedDir = false;
            if(distance < 180 && distance > 0){
                this.player.superDirection++;
                changedDir = true;
            }
            if(distance < 0 && distance > -180){
                changedDir = true;
                this.player.superDirection--;
            } 

            if(!changedDir && this.player.superDirection != desiredDirection)this.player.superDirection++;    
            
            //if(desiredDirection < Math.round(this.player.superDirection) % 360) 
            //if(desiredDirection > Math.round(this.player.superDirection) % 360) this.player.superDirection++; 
        }

        ctx.rotate(this.player.superDirection * Math.PI / 180);
        ctx.translate(-this.player.x, -this.player.y);
        ctx.drawImage(this.player.sprite, playerDrawPoint.x, playerDrawPoint.y, this.player.sprite.width * this.player.scale, this.player.sprite.height * this.player.scale);
        ctx.restore();


    },
    loop: function () {
        var speed = 3;
        if (keyDown(keys.left)) {
            this.player.x -= speed;
            this.player.direction = 3;
        }
        if (keyDown(keys.right)) {
            this.player.x += speed;
            this.player.direction = 1;
        }
        if (keyDown(keys.up)) {
            this.player.y -= speed;
            this.player.direction = 0;
        }
        if (keyDown(keys.down)) {
            this.player.y += speed;
            this.player.direction = 2;
        }
    },
    /* Move variables */
    logic: function (key) {
        // Not used.
    },
    getDrawPoint: function (x, y, sprite) {
        return {
            x: x - ((sprite.width * this.player.scale) / 2),
            y: y - ((sprite.height * this.player.scale) / 2)
        };
    }
}