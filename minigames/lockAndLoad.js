var lockAndLoad = {
    varName: "lockAndLoad",
    displayName: "Lock n Load",
    introText: "Lock n Load!",
    icon: "gameicons/lockAndLoad_icon.png",
    timed: true,
    textures: [
        "cock_n_shoot/cock_arm.png",
        "cock_n_shoot/cock_barrel.png",
        "cock_n_shoot/cock_bg.png",
        "cock_n_shoot/cock_hatch.png",
        "cock_n_shoot/shoot_bg.png",
        "cock_n_shoot/shoot_enemy.png",
        "cock_n_shoot/shoot_player.png",
        "cock_n_shoot/shoot_bullet.png",
        "cock_n_shoot/shoot_flash.png"
    ],
    sounds: [
        "cock_n_shoot/cock_lock.ogg",
        "cock_n_shoot/cock_load.ogg",
        "cock_n_shoot/shoot_bang.ogg"
    ],
    init: function (dif) {

        /* init - Pump Scene */
        this.gameprogress = 0
        this.armPos = {
            x: 0,
            y: 170
        }
        this.armSpeed = 5 * ((dif) + 3)

        /* init - Shoot Scene */
        this.shootActive = false
        this.shootBgPos = {
            x: 0,
            y: 0
        }
        this.shootPlayerPos = {
            x: 40,
            y: 370
        }
        this.shootBulletPos = {
            x: 80,
            y: 390
        }
        this.shootFlashPos = {
            x: 650,
            y: 0
        }
        this.shootBulletSpeed = 20
        this.gunFired = false
        this.enemyPos = {
            x: 150,
            y: 420
        }
        this.enemyDirection = 0
        this.enemySpeed = 2 * ((dif) + 1)
        this.enemyShot = false

    },
    paint: function () {

        /* paint - Pump Scene */
        if (this.shootActive == false) {
            ctx.drawImage(t("cock_bg"), 0, 0)
            ctx.drawImage(t("cock_hatch"), 0, 170)
            ctx.drawImage(t("cock_barrel"), 0, 160)
            ctx.drawImage(t("cock_arm"), this.armPos.x, this.armPos.y)
        }

        /* paint - Shoot Scene */
        if (this.shootActive) {
            ctx.drawImage(t("shoot_bg"), this.shootBgPos.x, this.shootBgPos.y)
            ctx.drawImage(t("shoot_bullet"), this.shootBulletPos.x, this.shootBulletPos.y)
            ctx.drawImage(t("shoot_player"), this.shootPlayerPos.x, this.shootPlayerPos.y)
            ctx.drawImage(t("shoot_enemy"), this.enemyPos.x, this.enemyPos.y)
            ctx.drawImage(t("shoot_flash"), this.shootFlashPos.x, this.shootFlashPos.y)
        }
    },
    loop: function () {

        /* loop - Pump Scene */
        if ((this.gameprogress == 1) && (this.armPos.x > -120)) {
            this.armPos.x -= 10;
        }
        if ((this.gameprogress == 2) && (this.armPos.x < 0)) {
            this.armPos.x += 10;
        }
        if ((this.gameprogress == 2) && (this.armPos.x == 0)) {
            this.shootActive = true;
        }

        /* loop - Shoot Scene */
        if (this.enemyPos.y < 300) {
            this.enemyDirection = 1;
        }
        if (this.enemyPos.y > 420) {
            this.enemyDirection = 0;
        }
        if ((this.shootActive) && (this.enemyShot == false) && (this.enemyDirection == 0)) {
            this.enemyPos.y -= this.enemySpeed;
        }
        if ((this.shootActive) && (this.enemyShot == false) && (this.enemyDirection == 1)) {
            this.enemyPos.y += this.enemySpeed;
        }
        if (this.gunFired) {
            this.shootBulletPos.x += this.shootBulletSpeed;
        }
        if (this.shootBulletPos.x > 120) {
            this.shootFlashPos.x = 650;
        }
        if ((this.shootBulletPos.x > 160) && (this.shootBulletPos.x < 200) && (this.enemyPos.y > 340) && (this.enemyPos.y < 400)) {
            this.enemyShot = true;
        }
        if ((this.enemyShot == false) && (this.shootBulletPos.x > 630)) {
            failed();
        }
        if (this.enemyShot) {
            this.shootBulletPos.y = 500;
            badgeGet("lockAndLoad_icon");
            cleared();
        }
    },
    logic: function (key) {

        /* logic - Pump Scene */
        if ((key.is(keys.left)) && (this.gameprogress == 0)) {
            playSound("cock_lock", 0.1);
            this.gameprogress = 1;
        }
        if ((key.is(keys.right)) && (this.gameprogress == 1) && (this.armPos.x == -120)) {
            playSound("cock_load", 0.1);
            this.gameprogress = 2;
        }

        /* logic - Shoot Scene */
        if ((key.is(keys.action)) && (this.shootActive) && (this.gunFired == false)) {
            this.shootFlashPos.x = 0;
            playSound("shoot_bang", 0.1);
            this.gunFired = true;
        }
    }

}

miniGames.push(lockAndLoad);