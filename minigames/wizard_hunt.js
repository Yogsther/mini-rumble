var wizard_hunt = {
    varName: "wizard_hunt", /* The exact name of the variable. */
    displayName: "Orb hunt", /* The display name of the mini-game; Shown in the menu when togglening mini-games. */
    timed: true, /* If the mini-game should have a 5-second time restriction. */
    timedWin: false, /* Weather or not the mini-game should be won when the time runs out. */
    introText: "Find the orb!", 
    /* This is the text that will displayed during the game intro, this should be a short explaination of what the objective in the mini-game is.*/
    wip: true,
    textures: [
      "wizard_hunt/lantern.png",
      "wizard_hunt/ground.png",
      "wizard_hunt/wizard.png",
      "wizard_hunt/wizard_flipped.png",
      "wizard_hunt/wizard_walk_0.png",
      "wizard_hunt/wizard_walk_1.png",
      "wizard_hunt/wizard_walk_0_flipped.png",
      "wizard_hunt/wizard_walk_1_flipped.png",
      "wizard_hunt/light.png",
      "wizard_hunt/compass.png",
      "wizard_hunt/pointer.png",
      "wizard_hunt/orb_01.png"
    ],
    objects: [],
    init: function(difficulty){
      this.player = {
        x: 0,
        y: 0,
        speed: 5,
        flip: false
      }
      this.camera = {
        x: this.player.x + c.width/2,
        y: this.player.y + c.height/2
      }

      this.lantern = {
        x: 0,
        y: -100,
        picked: false,
        texture: t("lantern")
      }

      this.editMode = false;

      this.pastLocations = [];
      this.walkCycle = 0;

      this.map = new Array();
      for(let i = 0; i < 200; i++){
        this.map[i] = Math.floor(Math.random() * 4); 
      }
      
      this.pointerRotation = 0;
      this.removeTimer = 0;
      this.orb = {
        x: 300,
        y: 300,
        texture: t("orb_01")
      }
    },
    paint: function(){

        this.walkCycle+=.1;

        /* Dash animation */
        if(this.removeTimer > 0) this.removeTimer--;
        if(this.removeTimer == 0 && this.pastLocations.length > 0){
          this.pastLocations.splice(0, 1);
          this.removeTimer+=2;
        }
        
      
        fill("#111")
        // Draw ground
        // Tile width = 150px
        for(let i = 0; i < 200; i++){
          let x = i % 20;
          let y = (i - x) / 20;
          draw("ground", x*150 - this.camera.x + c.width/2, y * 150 - this.camera.y + c.height/2, 1, this.map[i]*90)
        }

        for(let i = 0; i < this.objects.length; i++){
          draw("object", this.objects[i].x - this.camera.x + c.width/2, this.objects[i].y - this.camera.y + c.height/2)
        }
    
        // Draw orb
        draw(this.orb.texture, this.orb.x - this.camera.x + c.width/2, this.orb.y - this.camera.y + c.height/2);
        for(let i = 0; i < this.pastLocations.length; i++){
          opcaity = i / this.pastLocations.length
          draw(this.pastLocations[i].sprite, this.pastLocations[i].x - this.camera.x + c.width/2, this.pastLocations[i].y - this.camera.y + c.height/2, 1, 0, opcaity);
        }
        /* Draw player */
        sprite = "wizard";
        if(keyDown(keys.up) || keyDown(keys.down) || keyDown(keys.left) ||keyDown(keys.right)){
          sprite+="_walk_" + Math.floor(this.walkCycle%2);
        }
        if(this.player.flip) sprite+="_flipped";

        if(this.player.speed > 5){
          this.pastLocations.push({x: this.player.x, y: this.player.y, sprite: sprite});
        }
        if(this.editMode){
          // Draw object instead reee
        } else {
          draw(sprite, this.player.x - this.camera.x + c.width/2, this.player.y - this.camera.y + c.height/2);
        }
        
        /* Draw light pattern */
        drawC("light", 67 + this.lantern.x - this.camera.x + c.width/2, 84 + this.lantern.y - this.camera.y + c.height/2, 2);
        /* Draw lantern sprite */
        lanternFlip = 60;
        lanternOffsetY = 0;
        if(this.lantern.picked) lanternOffsetY = 78;
        if(!this.lantern.picked) lanternFlip = 0;
        if(this.player.flip && this.lantern.picked) lanternFlip = -6; // Correct lantern position if flipped
        draw("lantern", lanternFlip + this.lantern.x - this.camera.x + c.width/2, lanternOffsetY + this.lantern.y - this.camera.y + c.height/2);
        
        /* Draw compass */
        draw("compass", 20, (c.height - t("compass").height) - 20);
        draw("pointer", 20, (c.height - t("compass").height) - 20, 1, this.pointerRotation - 90);
        

        if(globalOptions.devTools){

          type("- Map editor -", 400, 10, 1.5, 0, 0, "left");
          type("K - Place object", 400, 30, 1.5, 0, 0, "left");
          type("<J L> - Change object", 400, 50, 1.5, 0, 0, "left");
          type("T - Toggle editor", 400, 70, 1.5, 0, 0, "left");
          
        }
        
    },
    loop: function(){
      if(keyDown(keys.right)){
        this.player.x+=this.player.speed;
        this.player.flip = false;
      }
      if(keyDown(keys.left)){
        this.player.x-=this.player.speed;
        this.player.flip = true;
      }

      if(keyDown(keys.up)) this.player.y-=this.player.speed;
      if(keyDown(keys.down)) this.player.y+=this.player.speed;

      /* Calculate angle for compass */
      distanceX = this.orb.x - this.player.x;
      distanceY = this.orb.y - this.player.y;
      this.pointerRotation = Math.atan(distanceY / distanceX) * (180 / Math.PI);
      if(distanceX >= 0) this.pointerRotation += 180;

      for(let i = 0; i < this.objects.length; i++){
        /* Define objects to check collisions for */
        var player = {x: this.player.x, y: this.player.y, texture: "wizard"};
        var object = {x: this.objects[i].x, y: this.objects[i].y, texture: "object"}
        /* Check collision for the objects */
        var col = checkCollision(player, object);
        var breakStop = 0; // To prevent freeze
        while(col){
          if(breakStop > 500) break; /* Prevent freeze */
          /**
           * Check collisions for each direction, and prevent
           * by moving the player in the opposite direction!
           */
          if(col.fromTop) this.player.y--;
          if(col.fromBottom) this.player.y++;
          if(col.fromLeft) this.player.x--;
          if(col.fromRight) this.player.x++; 

          /* Update collisison data */
          player.x = this.player.x 
          player.y = this.player.y;
          col = checkCollision(player, object);

          breakStop++; /* Count up break prevention, if this loop runs more than 500 times, it's probably stuck on a bug. */
        }
      }

      /* Update camera */
      this.camera = {
        x: this.player.x + t("wizard").width/2,
        y: this.player.y + t("wizard").height/2
      }
      if(this.lantern.picked){
        this.lantern.x = this.player.x;
        this.lantern.y = this.player.y;
      } else {
        var player = {x: this.player.x, y: this.player.y, texture: "wizard"};
        var col = checkCollision(player, this.lantern);
        if(col){
          if(!this.lantern.picked) changeThemeColor("#ffbd00");
          this.lantern.picked = true;
          this.lantern.x = this.player.x;
          this.lantern.y = this.player.y;
        }
      }
    },
    logic: function(key){
      //log(key.code);
      if(key.code == 67) log("Player pos: " + this.player.x + " : " + this.player.y)
      if(key.is(keys.action)){
        this.player.speed = 15;
        setTimeout(() => {this.player.speed = 5}, 200);
      }
      if(key.code == 84) this.editMode = !this.editMode;
      if(key.code == 75){
        // Place object
      }
      if(key.code == 76){
        // Switch forward
      }
      if(key.code == 74){
        // Switch backward
      }
    }
  }

  miniGames.push(wizard_hunt);
