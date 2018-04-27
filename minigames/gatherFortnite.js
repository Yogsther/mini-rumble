var gatherFortnite = {
    varName: "gatherFortnite",
    displayName: "Wood Gather",
    timed: true,
    textures: ["gather/tricerathot.png", "gather/wood.png", "gather/gather_bg.png", "gather/thot_big.png"],
    introText: "Gather!",
    init: function (dif) {
        /* Run on initiation */
        this.dif = dif;
        this.amountOfMaterials = (dif + 2) * 2;
        this.materials = new Array();
        this.player = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            direction: 0,
            superDirection: 0,
            sprite: t("tricerathot"),
            scale: .4
        }
        this.cleared = false;
        
        this.woodScale = .4;
        this.padding = 50;
        this.populateMaterials();
        this.drawScene = 0;
        this.finalScene = {
            opacity: 1,
            x: 255,
            y: 10,
            timer: 0
        }
        
    },
    populateMaterials: function(){
        for(let i = 0; i < this.amountOfMaterials; i++){
            var x = Math.floor(Math.random() * (canvas.width - (this.padding*2))) + this.padding;
                y = Math.floor(Math.random() * (canvas.height - (this.padding*2))) + this.padding;
            this.materials[i] = {x: x, y: y, collected: false};
            console.log(x, y);
        }
    },
    paint: function () {
        if(this.drawScene == 0){

            ctx.fillStyle = "#111";
            ctx.fillRect(0, 0, canvas.width, canvas.height); // Clear
    
            // Draw materials
            this.materials.forEach(material => {
                if(!material.collected){
                ctx.drawImage(t("wood"), material.x, material.y, t("wood").width * this.woodScale, t("wood").height * this.woodScale);
            }
            })
    
            // Draw player
            var playerDrawPoint = this.getDrawPoint(this.player.x, this.player.y, this.player.sprite);
    
    
            ctx.save();
            ctx.translate(playerDrawPoint.x, playerDrawPoint.y);
            var desiredDirection = (90 * this.player.direction);
            for(let i = 0; i < 6; i++){
                var distance = (desiredDirection - (this.player.superDirection % 360))
                if(distance < -180) distance = 360 + distance;
                if(distance > 180) distance = distance - 360;
                if(distance < 180 && distance > 0) this.player.superDirection++;
                if(distance < 0 && distance > -180) this.player.superDirection--;
    
                if(Math.abs(distance) == 180) this.player.superDirection++; // Correct if user is stuck at 180 turn    
            }
    
            ctx.rotate(this.player.superDirection * Math.PI / 180);
            ctx.translate(-this.player.x, -this.player.y);
            ctx.drawImage(this.player.sprite, playerDrawPoint.x, playerDrawPoint.y, this.player.sprite.width * this.player.scale, this.player.sprite.height * this.player.scale);
            ctx.restore();
        } else if(this.drawScene = 1){
            // Draw finish scene
            if(this.finalScene.timer > 25){
                this.finalScene.timer = 0;
                if(this.finalScene.y > 0) this.finalScene.y = -10;
                    else this.finalScene.y = 10;
            }
            this.finalScene.timer++;
            this.finalScene.opacity -= .005;
            this.finalScene.x -= 1;
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            var bgScale = .6;
            ctx.globalAlpha = this.finalScene.opacity;
            ctx.drawImage(t("gather_bg"), 0, 0, t("gather_bg").width*bgScale, t("gather_bg").height*bgScale);
            ctx.globalAlpha = 1;
            var triceraScale = .4;
            ctx.drawImage(t("thot_big"), this.finalScene.x, 50 + this.finalScene.y, t("thot_big").width*triceraScale, t("thot_big").height*triceraScale);

        }


    },
    getCenter: function(sprite, x, y){
        let superX = x + (sprite.width / 2);
        let superY = y + (sprite.height / 2);
        return {x: superX, y: superY};
    },
    loop: function () {

        // Wood collection detection
        var notCollected = 0;
        this.materials.forEach(material => {
            
            if(!material.collected){
            notCollected++;
            var superMaterial = this.getCenter(t("wood"), material.x, material.y);
            var superPlayer = this.getCenter(this.player.sprite, this.player.x, this.player.y);
            var distance = {
                x: ((superMaterial.x ) - (superPlayer.x * (this.player.scale*2))),
                y: ((superMaterial.y) - (superPlayer.y * (this.player.scale * 2)))
            }

            var totalDistance = Math.sqrt(Math.pow(distance.x, 2) + Math.pow(distance.y, 2));
    
            var woodSpeed  = 10;
            if(totalDistance < 100){
                // x
                if(distance.x > 0) material.x-=woodSpeed;
                if(distance.x < 0) material.x+=woodSpeed;
                // y
                if(distance.y > 0) material.y-=woodSpeed;
                if(distance.y < 0) material.y+=woodSpeed;
                if(totalDistance < 30){
                    material.collected = true;
                }
            }
        }

        });

        if(notCollected == 0 && !this.cleared){
            this.drawScene = 1;
            this.cleared = true;
            cleared(1000);
            
        }
        
        var speed = 3 * (1+this.dif);
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