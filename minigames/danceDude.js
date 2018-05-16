var danceDude = {
  varName: "danceDude",
  displayName: "Dance Dude",
  timed: false,
  introText: "Dance!",
  textures: [
    "dance/dance_arrow_left.png",
    "dance/dance_arrow_up.png",
    "dance/dance_arrow_down.png",
    "dance/dance_arrow_right.png",
    "dance/dance_incoming_left.png",
    "dance/dance_incoming_up.png",
    "dance/dance_incoming_down.png",
    "dance/dance_incoming_right.png",
    "dance/dance_arrow_up_hit.png",
    "dance/dance_arrow_down_hit.png",
    "dance/dance_arrow_left_hit.png",
    "dance/dance_arrow_right_hit.png"
  ],
  sounds: [
    "dance/dance_hit_1.mp3",
    "dance/dance_hit_2.mp3",
    "dance/dance_hit_3.mp3",
    "dance/dance_hit_4.mp3"
  ],
  /* If your mini-game contains textures, enter them in here. default path is /textures. */

  init: function (dif) {
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
    this.sprites = importSpriteSheet("dance/danceDude_bg/danceDude_bg_XXXXX.png", 60);
    this.progress = 0;

    /* This function runs when the mini-game starts, variables that needs to be reset should be initiatied here. Difficulty is the increasing difficulty (starts at 0). The difficulty variable should be used to set the difficulty of the mini-game*/

  },
  paint: function () {
    /* Render function, is called every frame.*/
    fill("#111");
    // Draw background
    this.progress++;
    ctx.drawImage(this.sprites[this.progress % this.sprites.length], 0, 0);

    // Draw "slot arrows"
    ctx.drawImage(t("dance_arrow_left"), 0, 10);
    ctx.drawImage(t("dance_arrow_up"), 0, 10);
    ctx.drawImage(t("dance_arrow_down"), 0, 10);
    ctx.drawImage(t("dance_arrow_right"), 0, 10);

    // Draw incoming arrows
    ctx.drawImage(t("dance_incoming_left"), this.incomingLeftPos.x, this.incomingLeftPos.y);
    ctx.drawImage(t("dance_incoming_up"), this.incomingUpPos.x, this.incomingUpPos.y);
    ctx.drawImage(t("dance_incoming_down"), this.incomingDownPos.x, this.incomingDownPos.y);
    ctx.drawImage(t("dance_incoming_right"), this.incomingRightPos.x, this.incomingRightPos.y);
    if (this.hitUp) {
      ctx.drawImage(t("dance_arrow_up_hit"), 0, 10);
    }
    if (this.hitDown) {
      ctx.drawImage(t("dance_arrow_down_hit"), 0, 10);
    }
    if (this.hitLeft) {
      ctx.drawImage(t("dance_arrow_left_hit"), 0, 10);
    }
    if (this.hitRight) {
      ctx.drawImage(t("dance_arrow_right_hit"), 0, 10);
    }
  },
  loop: function () {
    /* Loop function, called every frame before paint() */
    this.hitPos = Math.floor((Math.random() * 64) + 32) * 10;

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
  logic: function (key) {
    /* Logic is called on a keypress, you can use this for key initiated actions. */
    // Ends game with a fail on pressing a key too early
    if ((key.is(keys.left)) && (this.incomingLeftPos.y > 70) && (this.danceStart)) failed();
    if ((key.is(keys.up)) && (this.incomingUpPos.y > 70) && (this.danceStart)) failed();
    if ((key.is(keys.down)) && (this.incomingDownPos.y > 70) && (this.danceStart)) failed();
    if ((key.is(keys.right)) && (this.incomingRightPos.y > 70) && (this.danceStart)) failed();

    if ((key.is(keys.left)) & (this.incomingLeftPos.y < 70) & (this.incomingLeftPos.y > -10)) {
      this.incomingLeftPos.y += this.hitPos;
      this.hitLeft = true;
    }

    if ((key.is(keys.up)) & (this.incomingUpPos.y < 70) & (this.incomingLeftPos.y > -10)) {
      this.incomingUpPos.y += this.hitPos;
      this.hitUp = true;
    }

    if ((key.is(keys.down)) & (this.incomingDownPos.y < 70) & (this.incomingLeftPos.y > -10)) {
      this.incomingDownPos.y += this.hitPos;
      this.hitDown = true;
    }

    if ((key.is(keys.right)) & (this.incomingRightPos.y < 70) & (this.incomingLeftPos.y > -10)) {
      this.incomingRightPos.y += this.hitPos;
      this.hitRight = true;
    }

    if (this.hitLeft == true) {
      this.arrowsHit = this.arrowsHit + 1;
      playSound("dance_hit_1");
      setTimeout(()=>{this.hitLeft = false;},70);
    }
    if (this.hitUp == true) {
      this.arrowsHit = this.arrowsHit + 1;
      playSound("dance_hit_3");
      setTimeout(()=>{this.hitUp = false;},70);
    }
    if (this.hitDown == true) {
      this.arrowsHit = this.arrowsHit + 1;
      playSound("dance_hit_4");
      setTimeout(()=>{this.hitDown = false;},70);
    }
    if (this.hitRight == true) {
      this.arrowsHit = this.arrowsHit + 1;
      playSound("dance_hit_2");
      setTimeout(()=>{this.hitRight = false;},70);
    }

    if ((this.arrowsHit > this.hitGoal) & (this.danceStart == true)) {
      cleared();
      this.danceStart = false;
    }
  }
}


miniGames.push(danceDude);