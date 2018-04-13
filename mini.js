/**
 * Mini game collection for Mini-Rumble
 */


 var mash = {
     textures: ["sandwich_front.png", "sandwich_center.png", "sandwich_back.png", "etika_closed.png", "etika_open.png", "x_down.png", "x_up.png", "z_down.png", "z_up.png"],
     introText: "Eat!", /* Intro text is the text displayed before the mini-game, should contain a short instruction for the minigame. */
     init: function(dif){
        /* Run on initiation */
        this.dif = dif;
        this.sandwichLength = (dif*3) + 3;
        this.sandwich = ["sandwich_front", "sandwich_back"];
        for(let i = 0; i < this.sandwichLength; i++){
            this.sandwich.splice(1, 0, "sandwich_center");
        }
        this.nextKey = undefined;
        this.openKey = undefined;
        this.etika = {
            texture: textures["etika_open"],
            x: 10,
            y: 5,
            scale: 0.9
        }
     },
     paint: function(){
        /* Paint method, runs every frame. */
        ctx.fillStyle = "#a3a1a1";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        var buttonPositions = {x: 330, y: 10, scale: 0.7};
        var x = "up";
        var z = "up";
        

        if(this.nextKey == "x") z = "down";
        if(this.nextKey == "z") x = "down";

        ctx.drawImage(textures["z_"+z], buttonPositions.x, buttonPositions.y, textures["z_"+z].width * buttonPositions.scale, textures["z_"+z].height * buttonPositions.scale);
        ctx.drawImage(textures["x_"+x], buttonPositions.x + 150, buttonPositions.y, textures["x_"+x].width * buttonPositions.scale, textures["x_"+x].height * buttonPositions.scale);
      
        
        var sandwichStartPos = {x: 180, y: 238};
        var scale = 0.40;
        for(let i = 0; i < this.sandwich.length; i++){
            var texture = textures[this.sandwich[i]]; 
            ctx.drawImage(texture, sandwichStartPos.x + ((texture.width * scale) * i), sandwichStartPos.y, texture.width * scale, texture.height * scale)
        }
        
        ctx.drawImage(this.etika.texture, this.etika.x, this.etika.y, this.etika.texture.width * this.etika.scale, this.etika.texture.height * this.etika.scale);

     },
     loop: function(){
        if(this.sandwich.length < 1){
            // Sandwich is empty!
            cleared();
        }

        /* Logic loop, runs every frame. */
        /* Use primarly keyDown(keyArr with keycodes) to test for keys, and use the variable keys.action or keys.back (They contain array with the keycodes.)*/
     },
     /* Move variables */
     logic: function(key){

        
        if((keys.action.indexOf(key) != -1 && this.nextKey == "x") || this.nextKey == undefined){
            // Action, aka X key
            if(this.openKey == undefined) this.openKey = "z"
            this.nextKey = "z";

            if(this.openKey == "x"){
                // Open mouth
                this.etika.texture = textures["etika_open"]
            } else {
                // Open mouth
                this.etika.texture = textures["etika_closed"]
                this.sandwich.splice(0, 1); // Chew
            }
            
        } 
        if((keys.back.indexOf(key) != -1 && this.nextKey == "z") || this.nextKey == undefined){
            // Back, aka Z key
            if(this.openKey == undefined) this.openKey = "x"
            this.nextKey = "x";
            
            if(this.openKey == "z"){
                // Close mouth
                this.etika.texture = textures["etika_closed"]
                this.sandwich.splice(0, 1); // Chew
            } else {
                // Open mouth
                this.etika.texture = textures["etika_open"]
            }
        }
     }
 }

 
 var miniGames = [mash]