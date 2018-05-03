# Mini Rumble  (Beta v.0.5.2)

 Try it out in your browser:
 [mini.livfor.it](http://mini.livfor.it)
 
 Documentation & API: 
 [mini.livfor.it/docs](http://mini.livfor.it/docs)

##### What is it?

Mini Rumble is a mini-game collection with a varity of games. The Engine is dynamic and makes it easy to add new games. Making your own mini-game for Mini Rumble is easy with the rich documentation and easy-to-use API (Coming soon).

Currently the game is avalible to play online, but will later also be avalible as a desctop application. Using the desctop application will increase performance and allow for quicker 

##### Controlls:
- Move and Navigate: Arrow keys
- Select: X
- Back: Z

##### Todo:

- [x] Mini-game API
- [x] Basic engine working
- [x] Finnish Options menu
- [x] Finalize game engine for v.0.1 (Beta)
- [x] Mobile Support
- [x] Publish documentation and API 
- [ ] 10 minigames (6/10)
- [ ] Controller Support
- [ ] Package Electron app
- [ ] 1.0 Build
- [ ] Begin full patch-notes documentation
- [ ] Online leaderboards
- [ ] Multiplayer play

#### Documentation:

Check out the full documentation here: [mini.livfor.it/docs](http://mini.livfor.it/docs)

Mini games are located in the minigames folder. Each mini-game is stored in it's own variable, in it's own file.
The structure is as followes.

```javascript
var nameOfMinigame = {
  varName: "nameOfMinigame", /* The exact name of the variable. */
  displayName: "Test mini-game", /* The display name of the mini-game; Shown in the menu when togglening mini-games. */
  timed: true, /* If the mini-game should have a 5-second time restriction. */
  timedWin: false, /* Weather or not the mini-game should be won when the time runs out. */
  /* Weather or not the mini-game is timebased or not. If this is false, the timer will be disabled. */
  introText: "Something!", 
  /* This is the text that will displayed during the game intro, this should be a short explaination of what the objective in the mini-game is.*/
  textures: ["filename.png"], 
  /* If your mini-game contains textures, enter them in here. default path is /textures. */
  init: function(difficulty){
    this.example = "example"; // This is how you would initiate a variable.

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
```
