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

    init: function(difficulty){
     
    },
    paint: function(){
        /* Draw player */
        draw("wizard");
    },
    loop: function(){

    },
    logic: function(key){

    }
  }

  miniGames.push(wizard_hunt);
