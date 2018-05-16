var wizard_hunt = {
    varName: "wizard_hunt", /* The exact name of the variable. */
    displayName: "Orb hunt", /* The display name of the mini-game; Shown in the menu when togglening mini-games. */
    timed: true, /* If the mini-game should have a 5-second time restriction. */
    timedWin: false, /* Weather or not the mini-game should be won when the time runs out. */
    introText: "Find the orb!", 
    /* This is the text that will displayed during the game intro, this should be a short explaination of what the objective in the mini-game is.*/
    textures: [
      "wizard_hunt/lantern.png",
      "wizard_hunt/wall.png",
      "wizard_hunt/wizard.png"
    ],
    walls: [{x: 250, y: 250}, {x: 50, y: 50}],
    init: function(difficulty){
      this.player = {
        x: 100,
        y: 100,
        speed: 5
      }
    },
    paint: function(){
        /* Draw player */
        fill("#111");

        for(let i = 0; i < this.walls.length; i++){
          draw("wall", this.walls[i].x, this.walls[i].y)
        }
        
        draw("wizard", this.player.x, this.player.y);

        // TODO MOVE TO LOGIC
        for(let i = 0; i < this.walls.length; i++){
          var player = {x: this.player.x, y: this.player.y, texture: "wizard"};
          var wall = {x: this.walls[i].x, y: this.walls[i].y, texture: "wall"}
          var col = checkCollision(player, wall);
          //console.log(col);
        }

    },
    loop: function(){
      if(keyDown(keys.right)) this.player.x+=this.player.speed;
      if(keyDown(keys.left)) this.player.x-=this.player.speed;
      if(keyDown(keys.up)) this.player.y-=this.player.speed;
      if(keyDown(keys.down)) this.player.y+=this.player.speed;

      

    },
    logic: function(key){
      
    }
  }

  miniGames.push(wizard_hunt);
