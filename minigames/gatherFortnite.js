var gatherFortnite = {
    varName: "gatherFortnite",
    displayName: "Wood Gather",
    timed: true,
    textures: [
        "gather/tricerathot.png", 
        "gather/wood.png", 
        "gather/gather_bg.png", 
        "gather/thot_big.png", 
        "gather/gather_grass.png"
    ],
    introText: "Gather!",
    init: function (dif) {
        /* Run on initiation */
        this.dif = dif;
        this.amountOfMaterials = (dif + 2) * 2;
        this.turningSpeed = (dif +1) * 1.2;
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
            timer: 0,
            bgX: -20
        }
    },
    populateMaterials: function(){
        for(let i = 0; i < this.amountOfMaterials; i++){
            var x = Math.floor(Math.random() * (canvas.width - (this.padding*2))) + this.padding;
                y = Math.floor(Math.random() * (353  - (this.padding*2))) + this.padding;
            this.materials[i] = {x: x, y: y, collected: false};
            console.log(x, y);
        }
    },
    paint: function () {
        if(this.drawScene == 0){
            ctx.fillStyle = "#111";
            ctx.fillRect(0, 0, canvas.width, canvas.height); // Clear
            ctx.drawImage(t("gather_grass"), 0, 0);
    
            // Draw materials
            this.materials.forEach(material => {
                if(!material.collected){
                draw(t("wood"), material.x, material.y, this.woodScale);
            }
            })

            var desiredDirection = (90 * this.player.direction);
            for(let i = 0; i < 6; i++){
                var distance = (desiredDirection - (this.player.superDirection % 360))
                if(distance < -180) distance = 360 + distance;
                if(distance > 180) distance = distance - 360;
                if(distance < 180 && distance > 0) this.player.superDirection+=this.turningSpeed;
                if(distance < 0 && distance > -180) this.player.superDirection-=this.turningSpeed;
    
                if(Math.abs(distance) == 180) this.player.superDirection++; // Correct if user is stuck at 180 turn    
            }

            draw(this.player.sprite, this.player.x, this.player.y, this.player.scale, this.player.superDirection)
        } else if(this.drawScene == 1){
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
            this.finalScene.bgX+=.2;
            ctx.drawImage(t("gather_bg"), this.finalScene.bgX, 0, t("gather_bg").width*bgScale, t("gather_bg").height*bgScale);
            ctx.globalAlpha = 1;
            var triceraScale = .4;
           
            ctx.drawImage(t("thot_big"), this.finalScene.x, 50 + this.finalScene.y, t("thot_big").width*triceraScale, t("thot_big").height*triceraScale);

        }
        


    },
    getCenter: function(sprite, x, y, scale){
        let superX = x + ((sprite.width * scale) / 2);
        let superY = y + ((sprite.height * scale) / 2);
        return {x: superX, y: superY};
    },
    loop: function () {

        // Wood collection detection
        var notCollected = 0;
        this.materials.forEach(material => {
            
            if(!material.collected){
            notCollected++;
            var superMaterial = this.getCenter(t("wood"), material.x, material.y, this.woodScale);
            var superPlayer = this.getCenter(this.player.sprite, this.player.x, this.player.y, this.player.scale);
            var distance = {
                x: ((superMaterial.x ) - (superPlayer.x)),
                y: ((superMaterial.y) - (superPlayer.y))
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
        if ((keyDown(keys.left)) && (keyDown(keys.up))) {
            this.player.direction = 3.5;
        }
        if ((keyDown(keys.right)) && (keyDown(keys.up))) {
            this.player.direction = 0.5;
        }
        if ((keyDown(keys.left)) && (keyDown(keys.down))) {
            this.player.direction = 2.5;
        }
        if ((keyDown(keys.right)) && (keyDown(keys.down))) {
            this.player.direction = 1.5;
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

miniGames.push(gatherFortnite);