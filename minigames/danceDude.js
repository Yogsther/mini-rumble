var danceDude = {
  varName: "danceDude",
  displayName: "Dance Dude",
  timed: false, 
  /* Weather or not the mini-game is timebased or not. If this is false, the timer will be disabled. */
  introText: "Dance!", 
  /* This is the text that will displayed during the game intro, this should be a short explaination of what the objective in the mini-game is.*/
    sounds: ["muh.ogg"],
  textures: ["dance_arrow_left.png", "dance_arrow_up.png", "dance_arrow_down.png", "dance_arrow_right.png", "dance_incoming_left.png", "dance_incoming_up.png", "dance_incoming_down.png", "dance_incoming_right.png", "dance_bg.png"], 
  /* If your mini-game contains textures, enter them in here. default path is /textures. */
    
  init: function(dif){
      this.startTime = Date.now();
      this.incomingSpeed = (1) * (dif + 2);
      
      // Decides the starting position of the incoming arrows
      this.incomingLeftPos = {
          x: 20,
          y: Math.floor((Math.random() * 96) + 32) * 10
                                };
      this.incomingUpPos = {
          x: 120,
          y: Math.floor((Math.random() * 96) + 32) * 10
                                };
      this.incomingDownPos = {
          x: 220,
          y: Math.floor((Math.random() * 96) + 32) * 10
                                };
      this.incomingRightPos = {
          x: 320,
          y: Math.floor((Math.random() * 96) + 32) * 10
                                };
      
      this.hitPos = Math.floor((Math.random() * 64) + 32) * 10;
      
      // Hit Status
      this.hitLeft = false;
      this.hitUp = false;
      this.hitDown = false;
      this.hitRight = false;
      
      this.arrowsHit = 0;
      this.hitGoal = (4) + (dif * 2);
      this.danceStart = true;
      this.sprites = importSpriteSheet("danceDude_bg/danceDude_bg_XXXXX.png",60);
      this.progress = 0;

    /* This function runs when the mini-game starts, variables that needs to be reset should be initiatied here. Difficulty is the increasing difficulty (starts at 0). The difficulty variable should be used to set the difficulty of the mini-game*/
      
},
  paint: function(){
    /* Render function, is called every frame.*/
        // Draw background
      
      
      
      this.progress++;
      ctx.drawImage(this.sprites[this.progress%this.sprites.length], 0, 0);
 
      // Draw "slot arrows"
      ctx.drawImage(t("dance_arrow_left"), 0, 10)
      ctx.drawImage(t("dance_arrow_up"), 0, 10)
      ctx.drawImage(t("dance_arrow_down"), 0, 10)
      ctx.drawImage(t("dance_arrow_right"), 0, 10)
      
      // Draw incoming arrows
      ctx.drawImage(t("dance_incoming_left"), this.incomingLeftPos.x, this.incomingLeftPos.y)
      ctx.drawImage(t("dance_incoming_up"), this.incomingUpPos.x, this.incomingUpPos.y)
      ctx.drawImage(t("dance_incoming_down"), this.incomingDownPos.x, this.incomingDownPos.y)
      ctx.drawImage(t("dance_incoming_right"), this.incomingRightPos.x, this.incomingRightPos.y)
  },
  loop: function(){
    /* Loop function, called every frame before paint() */
      // Ends in a fail on missing one arrow
      if (this.incomingLeftPos.y < -10) failed();
      if (this.incomingUpPos.y < -10) failed();
      if (this.incomingDownPos.y < -10) failed();
      if (this.incomingRightPos.y < -10) failed();
      
      if (this.danceStart == true) {
          this.incomingLeftPos.y -= this.incomingSpeed;
          this.incomingUpPos.y -= this.incomingSpeed;
          this.incomingDownPos.y -= this.incomingSpeed;
          this.incomingRightPos.y -= this.incomingSpeed;
      }
      
  },
  logic: function(key){
    /* Logic is called on a keypress, you can use this for key initiated actions. */

    if ((key.is(keys.left)) & (this.incomingLeftPos.y < 60) & (this.incomingLeftPos.y > 0)) { 
        console.log(this.incomingLeftPos.y);
        this.incomingLeftPos.y += this.hitPos;
        this.hitLeft = true;
        console.log(this.hitLeft);
    }
      
    if ((key.is(keys.up)) & (this.incomingUpPos.y < 60) & (this.incomingLeftPos.y > 0)) { 
        console.log(this.incomingUpPos.y);
        this.incomingUpPos.y += this.hitPos;
        this.hitUp = true;
        console.log(this.hitUp);
    }
      
    if ((key.is(keys.down)) & (this.incomingDownPos.y < 60) & (this.incomingLeftPos.y > 0)) { 
        console.log(this.incomingDownPos.y);
        this.incomingDownPos.y += this.hitPos;
        this.hitDown = true;
        console.log(this.hitDown);
    }
      
    if ((key.is(keys.right)) & (this.incomingRightPos.y < 60) & (this.incomingLeftPos.y > 0)) { 
        console.log(this.incomingRightPos.y);
        this.incomingRightPos.y += this.hitPos;
        this.hitRight = true;
        console.log(this.hitRight);   
    }
      /*
      if ((this.hitLeft == true) & (this.hitUp == true) & (this.hitDown == true) & (this.hitRight == true)) {
          this.hitLeft = false;
          cleared();
        */
      if (this.hitLeft == true) {
          this.arrowsHit = this.arrowsHit + 1;
          playSound("muh.ogg");
          this.hitLeft = false;
      }
      if (this.hitUp == true) {
          this.arrowsHit = this.arrowsHit + 1;
          playSound("muh.ogg");
          this.hitUp = false;
      }
      if (this.hitDown == true) {
          this.arrowsHit = this.arrowsHit + 1;
          playSound("muh.ogg");
          this.hitDown = false;
      }
      if (this.hitRight == true) {
          this.arrowsHit = this.arrowsHit + 1;
          playSound("muh.ogg");
          this.hitRight = false;
      }
      
      if ((this.arrowsHit > this.hitGoal) & (this.danceStart == true)) {
          cleared();
          this.danceStart = false;
      }
      }
  }
