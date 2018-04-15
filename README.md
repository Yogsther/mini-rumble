# Mini Rumble (Alpha v.0.0.3)

Try it out in your browser:

 [mini.livfor.it]([http://mini.livfor.it)

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

- [ ] Add more minigames (2/10)

- [ ] Controller Support

- [ ] Package Electron app

- [ ] Publish documentation and API 

- [ ] Online leaderboards

- [ ] Multiplayer play

#### Documentation:

Mini games are located in the mini.js file. Each mini-game is store in it's own variable.

The structure is as followes.

```javascript
var nameOfMinigame = {
  timed: true, 
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

##### Good things to know:

If the mini-game is timed, the user will have 5 seconds to complete the objective, otherwise the game will be failed.

Once the objective is completed, cleared() should be called to proceed, or if failed: use failed(); 

```javascript
cleared(); // Successful completion of the mini-game, queueing next game.
failed(); // Failed outcome from mini-game, i.e Game Over.
```



##### Built in functions and Data types:

**Key:** This variable is recived in the logic function. 

- key.is(Array) if the key is any of the keyCodes in th array.

- key.code; returns the 

Examples:

```javascript
/* Recived key-input is of type keys.action. */
key.is(keys.action);
/* Get keyCode for input-key */
key.code == 82;
```

**t(name)**
 - Returns texture from name. Alternative from using textures["name"];

**importTexture(texturePath)**
 - Imports texture from path, default path: textures/.
 ```javascript

 /**
  * Example:
  * If the path to the texture is: textures/rabbitGame/rabbit_open.png
  * Then the expected texturePath should be: rabbitGame/rabbit_open.png
  * The name of the texture would be "rabbit_open", and it would be stored in the textures variable.
  * Retrive it with t("name") or textures["name"]
  */

  importTexture("rabbitGame/rabbit_open.png"); // Import texture
  var img = t("rabbit_open"); // Get texture

 ```

 **importSpriteSheet(path, amount)**
 - Import multible textures in series. Designed for After Effects PNG sequence exports.
 ```javascript
  /**
   *  Example: Import 20 images from textures/overlay/overlay_00.png => textures/overlay/overlay_19.png
   *  use importSpriteSheet("textures/overlay/overlay_XX.png", 20);
   *  captial X in the path will be replaced with the number, XX => 00 -> 01... 50
   *                                                         XXX => 000 -> 001... 050
   *  importSpriteSheet will return all the textures in one array aswell, so it's usefull to keep them.
   */

  var sprites = importSpriteSheet("textures/overlay/overlay_XX.png", 20); // Imports textures, stores them in textures arr and return them. 
  
  // In a loop, we could cycle these sprites to animate something in the game.
  ctx.drawImage(sprites[progress], 0, 0);

 ```
**keyDown(keyCode)**
 - Check if key is down, usefull for when controller a character. Checking for keys should be done in the loop function.
 ```javascript 
 /**
  * Example:  
  * Check if key is down, can be a keyCode or an Array of keyCodes.
  */

  if(keyDown(23) && keyDown(keys.action)){
    /* Do something */
  }
```


**keys**
 - This object contains the keys for action and back, you can use this variable to check for these keys.
```javascript
  /* Example 1: In the logic function on a keypress you can check if that key is of type action or back. */
  logic: function(key){
    if(key.is(keys.action)) // Do Something
  }
  /* Example 2: To check if a key is down, in the loop function */
  loop: function(){
    if(keyDown(keys.action)) // Do something
  }

```

**cleared()**
 - If the objective of the mini-game was cleared, call this function to queue the next mini-game.

**failed()**
 - If the objective was failed, use this function to cause a Game Over.

