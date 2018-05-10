var missiles = {
  varName: "missiles",
  displayName: "Missiles",
  timed: true,
  timedWin: true,
  textures: [],
  introText: "Avoid!",
  init: function (dif) {
    this.playerSpeed = 0.5;
    this.maxPlayerSpeed = 10;
    this.gravitySpeed = 2;
    this.maxGravity = 20;
    this.groundLevel = 375;
    this.player = {
      x: (canvas.width / 2) - (100 /* player.width*/ / 2),
      y: 300,
      velocityX: 0,
      velocityY: 0,
      height: 20,
      width: 20,
      grounded: false
    }
    this.friction = 1.05
    this.Missile = function (x, y) {
      this.x = x;
      this.y = y;
      this.velocityX = 0;
      this.maxSpeed = 10;
      this.explosionSize = 180;
      this.width = 40;
      this.height = 20;
      this.direction;
      this.fuse = Date.now() + Math.floor(Math.random() * 100);
      this.running = false;
      this.exploded = false;
      if (this.x <= 0) {
        this.direction = 1;
      } else {
        this.direction = -1;
      }
      this.run = function () {
        if (this.running && !this.exploded) {
          if (Math.abs(this.velocityX) < this.maxSpeed) {
            this.velocityX += this.direction * 0.2;
          }
          this.x += this.velocityX;
          if (this.direction === 1) {
            if (this.x > canvas.width - this.width) {
             window.explosions.push(new window.Explosion(this.x, this.y, this.explosionSize));
              this.exploded = true;
            }
          } else {
            if (this.x < 0) {
              window.explosions.push(new window.Explosion(this.x, this.y, this.explosionSize));
              this.exploded = true;
            }
          }
        } else {
          if (Math.random() < 0.01) {
            this.running = true;
          }
        }
      }
    }
    this.missiles = [];
    this.lastUpdate = Date.now();
    this.missileFreq = 800 - dif * 80;

    window.Explosion = function(x, y, size) {
      this.x = x;
      this.y = y;
      this.progress = 0;
      this.active = true;
      this.size = size;
    }
    window.explosions = [];
    
  },
  paint: function () {
    fill("#111");
    ctx.fillStyle = "white";
    ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
    ctx.fillStyle = "gray";
    ctx.fillRect(0, this.groundLevel, canvas.width, canvas.height - this.groundLevel);
    ctx.fillStyle = "red"
    for (let i = 0; i < this.missiles.length; i++) {
      ctx.fillRect(this.missiles[i].x, this.missiles[i].y, this.missiles[i].width, this.missiles[i].height);
    }
    for (let i = 0; i < explosions.length; i++) {
      ctx.fillStyle = "rgba(255, 255, 255, " + (1 - explosions[i].progress / explosions[i].size) + ")";
      ctx.fillRect(explosions[i].x - explosions[i].progress / 2, explosions[i].y - explosions[i].progress / 2, explosions[i].progress, explosions[i].progress);
      explosions[i].progress += 2;
      if (explosions[i].progress >= explosions[i].size) {
        explosions[i].active = false;
        explosions[i].progress = 0;
        explosions.splice(i, 1);
      }
    }
  },
  loop: function () {
    /* check if player is touching ground */
    this.player.grounded = (this.player.y + this.player.height === this.groundLevel);
    /* increase friction if player is touching ground */
    if (this.player.grounded) {
      this.friction = 1.4;
    } else {
      this.friction = 1.05;
    }
    /* keys */
    /* left */
    if (keyDown(keys.left) && Math.abs(this.player.velocityX) < this.maxPlayerSpeed) {
      this.player.velocityX -= this.playerSpeed;
    }
    /* right */
    if (keyDown(keys.right) && Math.abs(this.player.velocityX) < this.maxPlayerSpeed) {
      this.player.velocityX += this.playerSpeed;
    }
    /* jump */
    if ((keyDown(keys.up) || keyDown(keys.action)) && this.player.grounded) {
      this.player.velocityY = -15;
    } else if ((keyDown(keys.up) || keyDown(keys.action)) && this.player.velocityY < 0) {
      this.player.velocityY -= 1.3;
    }
    /* gravity */
    if (this.player.velocityY < this.maxGravity && !this.player.grounded) {
      this.player.velocityY += this.gravitySpeed;
    }
    /* friction */
    if (!keyDown(keys.right) && this.player.velocityX > 0) {
      this.player.velocityX /= this.friction;
    }
    if (!keyDown(keys.left) && this.player.velocityX < 0) {
      this.player.velocityX /= this.friction;
    }
    /* update player position */
    this.player.x += this.player.velocityX;
    this.player.y += this.player.velocityY;

    /* collisions */
    if (this.player.x < 0) {
      this.player.velocityX = 0;
      this.player.x = 0;
    }
    if (this.player.x + this.player.width > canvas.width) {
      this.player.velocityX = 0;
      this.player.x = canvas.width - this.player.width;
    }
    if (this.player.y < 0) {
      this.player.velocityY = 0;
      this.player.y = 0;
    }
    if (this.player.y + this.player.height > this.groundLevel) {
      this.player.velocityY = 0;
      this.player.y = this.groundLevel - this.player.height;
    }
    for (let i = 0; i < this.missiles.length; i++) {
      if (this.player.x + this.player.width > this.missiles[i].x && this.player.x < this.missiles[i].x + this.missiles[i].width && this.player.y + this.player.height > this.missiles[i].y && this.player.y < this.missiles[i].y + this.missiles[i].height && this.missiles[i].running) {
        explosions.push(new Explosion(this.missiles[i].x, this.missiles[i].y, this.missiles[i].explosionSize));
        this.missiles.splice(i, 1);
        failed();
      }
    }

    if (Date.now() - this.missileFreq > this.lastUpdate) {
      this.lastUpdate = Date.now();
      let x;
      if (Math.random() > 0.5) {
        x = -40; 
      } else {
        x = canvas.width;
      }
      this.missiles.push(new this.Missile(x, (this.groundLevel - 200) + ((1 - Math.pow(Math.random(), 2)) * 180)));
    }
    for (let i = 0; i < this.missiles.length; i++) {
      this.missiles[i].run();
      if (this.missiles[i].exploded) {
        this.missiles.splice(i, 1);
      }
    }
  },
  logic: function (key) {

  }
}