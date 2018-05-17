var mines = {
  varName: "mines",
  displayName: "Mines",
  timed: false,
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
  init: function(difficulty){
    
  },
  paint: function(){
    draw("mines_bg", 0, 0);
  },
  loop: function(){

  },
  logic: function(key){

  }
}

miniGames.push(mines);