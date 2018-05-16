var mines = {
    varName: "mines", /* The exact name of the variable. */
    displayName: "Mines", /* The display name of the mini-game; Shown in the menu when togglening mini-games. */
    timed: false, /* If the mini-game should have a 5-second time restriction. */
    timedWin: false, /* Weather or not the mini-game should be won when the time runs out. */
    /* Weather or not the mini-game is timebased or not. If this is false, the timer will be disabled. */
    introText: "Sweep!", 
    /* This is the text that will displayed during the game intro, this should be a short explaination of what the objective in the mini-game is.*/
    textures: [
      "filename.png"
      ],
      /* If your mini-game contains textures, enter them in here. default path is /textures. */
    sounds: [
      "filename.mp3"
    ],
    /* If your mini-game contains sound effects, enter them in here. default path is /sounds. */
    init: function(difficulty){
      this.pos = 1;
  
      /* This function runs when the mini-game starts, variables that needs to be reset should be initiatied here. Difficulty is the increasing difficulty (starts at 0). The difficulty variable should be used to set the difficulty of the mini-game*/
  },
    paint: function(){
      /* Render function, is called every frame.*/
    },
    loop: function(){
      /* Loop function, called every frame before paint() */
    },
    logic: function(key){
      /* Logic is called on a keypress, you can use this for key initiated actions. */
    }
  }