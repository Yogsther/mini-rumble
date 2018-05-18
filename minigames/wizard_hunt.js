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
      "wizard_hunt/wall.png",
      "wizard_hunt/wizard.png",
      "wizard_hunt/light.png"
    ],
    walls: [{x: 250, y: 250}, {x: 50, y: 50}],
    init: function(difficulty){
      this.player = {
        x: 0,
        y: 0,
        speed: 5
      }
      this.camera = {
        x: this.player.x + c.width/2,
        y: this.player.y + c.height/2
      }

      this.lantern = {
        x: 100,
        y: 100
      }
    },
    paint: function(){
      

        /* Draw player */
        fill("#111");

        for(let i = 0; i < this.walls.length; i++){
          draw("wall", this.walls[i].x - this.camera.x + c.width/2, this.walls[i].y - this.camera.y + c.height/2)
        }
        
        draw("wizard", this.player.x - this.camera.x + c.width/2, this.player.y - this.camera.y + c.height/2);

        drawC("light", 391 , 320, .2);

        if(true){
          draw("lantern", this.player.x - this.camera.x + c.width/2, this.player.y - this.camera.y + c.height/2);
        }
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, c.width, 320 - t("lantern").height*1.2);
        ctx.fillRect(0, 0, 391 - t("lantern").width * 1.2, c.height);
        
    },
    loop: function(){
      if(keyDown(keys.right)) this.player.x+=this.player.speed;
      if(keyDown(keys.left)) this.player.x-=this.player.speed;
      if(keyDown(keys.up)) this.player.y-=this.player.speed;
      if(keyDown(keys.down)) this.player.y+=this.player.speed;

      for(let i = 0; i < this.walls.length; i++){
        /* Define objects to check collisions for */
        var player = {x: this.player.x, y: this.player.y, texture: "wizard"};
        var wall = {x: this.walls[i].x, y: this.walls[i].y, texture: "wall"}
        /* Check collision for the objects */
        var col = checkCollision(player, wall);
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
          player.x = this.player.x;
          player.y = this.player.y;
          col = checkCollision(player, wall);

          breakStop++; /* Count up break prevention, if this loop runs more than 500 times, it's probably stuck on a bug. */
        }
      }

      /* Update camera */
      this.camera = {
        x: this.player.x,
        y: this.player.y
      }
      

    },
    logic: function(key){
      
    }
  }

  miniGames.push(wizard_hunt);
