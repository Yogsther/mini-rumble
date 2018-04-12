/**
 * Mini game collection for Mini-Rumble
 */


 var mash = {
     introText: "Mash!", /* Intro text is the text displayed before the mini-game, should contain a short instruction for the minigame. */
     init: function(dif){
        /* Run on initiation */
        this.dif = dif;
     },
     paint: function(){
        /* Paint method, runs every frame. */
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
     },
     loop: function(){
        /* Logic loop, runs every frame. */
        /* Use primarly keyDown(keyCode) to test for keys, and use the variable keys.action or keys.back (They contain array with the keycodes.)*/
     },
     /* Move variables */
     dif: 0 /* Difficulty variable, sets on init. This variable should determen the difficulty of your mini-game */
 }

 
 var miniGames = [mash]