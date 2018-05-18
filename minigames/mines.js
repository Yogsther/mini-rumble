var mines = {
  varName: "mines",
  displayName: "Mines",
  timed: false,
  wip: true,
  timedWin: false,
  introText: "Sweep!", 
  textures: [
    "mines/mines_bg.png",
    "mines/mines_mine.png",
    "mines/mines_1.png",
    "mines/mines_2.png",
    "mines/mines_3.png",
    "mines/mines_4.png",
    "mines/mines_5.png",
    "mines/mines_6.png",
    "mines/mines_7.png",
    "mines/mines_8.png",
    "mines/mines_panel.png",
    "mines/mines_flag.png",
    "mines/mines_selector.png"
  ],
  sounds: [

  ],
  init: function(difficulty) {
    
    this.panel = t("mines_panel");

    this.selectorPos = {
      x: 290,
      y: 150
    }
    this.selectedSpace = 23;
  },
  paint: function(){
    draw("mines_bg", 0, 0);
    draw("mines_selector", this.selectorPos.x, this.selectorPos.y);
  },
  loop: function() {

  },
  logic: function(key) {
    if (key.is(keys.right)) {
      if (this.selectorPos.x < 570) {
        this.selectorPos.x += 70;
        this.selectedSpace += 1;
      } else {
        this.selectorPos.x = 10;
        this.selectedSpace -= 8;
      }
    }
    if (key.is(keys.left)) {
      if (this.selectorPos.x > 10) {
        this.selectorPos.x -= 70;
        this.selectedSpace -= 1;
      } else {
        this.selectorPos.x = 570;
        this.selectedSpace += 8;
      }
    }
    if (key.is(keys.down)) {
      if (this.selectorPos.y < 290) {
        this.selectorPos.y += 70;
        this.selectedSpace += 9;
      } else {
        this.selectorPos.y = 10;
        this.selectedSpace -= 36;
      }
    }
    if (key.is(keys.up)) {
      if (this.selectorPos.y > 10) {
        this.selectorPos.y -= 70;
        this.selectedSpace -= 9;
      } else {
        this.selectorPos.y = 290;
        this.selectedSpace += 36;
      }
    }
  }
}

miniGames.push(mines);