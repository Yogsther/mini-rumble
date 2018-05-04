const lib = [{
        title: "Welcome!",
        description: "Welcome to the Mini-Rumble Docs. You can search for functions, variables and data-types here or read up on how the engine works!\nHave fun!\n\n\nStarter guide: " + "Mini games are located in the minigames folder. Each mini-game is stored in it's own variable, in it's own file.\n\nThe structure is as followes.\n\n\n" + "```javascript\nvar nameOfMinigame = {\n  varName: \"nameOfMinigame\", /* The exact name of the variable. */\n  displayName: \"Test mini-game\", /* The display name of the mini-game; Shown in the menu when togglening mini-games. */\n  timed: true, /* If the mini-game should have a 5-second time restriction. */\n  timedWin: false, /* Weather or not the mini-game should be won when the time runs out. */\n  /* Weather or not the mini-game is timebased or not. If this is false, the timer will be disabled. */\n  introText: \"Something!\", \n  /* This is the text that will displayed during the game intro, this should be a short explaination of what the objective in the mini-game is.*/\n  textures: [\"filename.png\"], \n  /* If your mini-game contains textures, enter them in here. default path is /textures. */\n  init: function(difficulty){\n    this.example = \"example\"; // This is how you would initiate a variable.\n\n    /* This function runs when the mini-game starts, variables that needs to be reset should be initiatied here. Difficulty is the increasing difficulty (starts at 0). The difficulty variable should be used to set the difficulty of the mini-game*/\n},\n  paint: function(){\n    /* Render function, is called every frame.*/\n  },\n  loop: function(){\n    /* Loop function, called every frame before paint() */\n  },\n  logic: function(key){\n    /* Logic is called on a keypress, you can use this for key initiated actions. */\n  }\n}\n```",
        type: "text",
        pinned: true
    }, {
        title: "Understand the docs",
        type: "text",
        description: "Use the search box to search all functions, game configs and data types. \n\nEvery item has a category:\n - function: Any function either stand-alone or a mini-game standard function.\n - data type: A new data type with special properties.\n - text: A text with information, like this one.\n - game config: A variable that should be set in the mini-game structure.\n - global variable: Global variables that you don't have to use but could come in handy if you would like to do something more advanvced.",
        pinned: true
    }, {
        title: "draw(Image sprite, int x, int y, double scale)",
        description: "Draw an image on the canvas. Scale does not have to be provided. This will also make it show up in the debug overlay (feature coming soon).```javascript//Example\ndraw(t(\"rabbit\"), 250, 100, .5)```",
        type: "function"
    }, {
        title: "introText",
        description: "introText determines what text should be displayed at the start of your mini-game. This should be a short description in as few words as possible informing the player what the mini-game's objective is. ```javascript//Example\nvar myMiniGame = {\n    introText: \"Gather!\"\n}\n```",
        type: "game config"
    }, {
        title: "Key",
        description: "This variable is recived in the logic function.\n```javascriptkey.is(keyArray) /* Boolean, if the key is of that type. */\nkey.char /* Key char example: 'B'*/\nkey.code /* Key code example: 23*/\n\n/* Examples */\nif(key.is(keys.action)){\n    // Is is either X, Enter or Space\n}\n```",
        type: "data type",
    }, {
        title: "timed",
        description: "Weather or not the mini-game is bound to a timer or not. If this is disabled the game won't automatically fail once time runs out.",
        type: "game config"
    }, {
        title: "timedWin",
        description: "Weather or not the mini-game should be failed once the 5 seconds timer runs out.",
        type: "game config"
    }, {
        title: "requiresKeyboard",
        description: "If the mini-game requires a full keyboard to be played. This is primarly for mobile users and will enable the on-screen keyboard for them.",
        type: "game config"
    },
    {
        title: "textures",
        description: "Array of what textures needs to be imported for your mini-game. Defaulted directory is /textures.\n```javascript\n/* Example of texture located in /textures/example/bunny.png */\ntextures: [\"example/bunny.png\"],\n\n/* To retrive the texture, use t(textureName) or use textures[\"textureName\"] */\ndraw(t(bunny), 0, 0);",
        type: "game config"
    },
    {
        title: "displayName",
        description: "The title that will be shown in the options menu, ect.",
        type: "game config"
    },
    {
        title: "varName",
        description: "Important config part that has to be the same as the variable name.\n\n```javascript\n/* Example */\nvar bunnyGame = {\n    varName: \"bunnyGame\",\n    ...\n}\n```",
        type: "game config"
    },
    {
        title: "t(String name)",
        description: "Returns and image from that name.\nRemember, the image name is only the name of the file excluding the extention!\n\n```javascript/* Example \n * A file imported from textures/bunny/bunnyHop.png\n * will be imported as followes:\n */\n\n importTexture(\"bunny/bunnyHop.png\");\n\n /* And the texture should be retrived like this: */\n var texture = t(\"bunnyHop\");```",
        type: "function"
    },
    {
        title: "init(int dificulty)",
        description: "The init function runs once when the mini-game is started. Here you should setup some variables that needs to be reset for each new game (Don't import textures here!). The difficulty variable starts at 0 and increases with 1 every 3 clears. So your mini-game should be tailored to that value.\n\n```javascript\n/* Example */\n\nvar bunnyMinigame = {\n   init: function(dif){\n       this.speed = (dif + 1) * 2;\n       this.player = new Object();\n       ...\n   },\n   ...\n} ",
        type: "function"
    },
    {
        title: "logic(Key key)",
        description: "Logic is called on every keypress.\nThis is usefull for time-perfect presses, not for movement or aiming.\n\nSee more about the Key object in the docs:\nkey.is(), key.char, key.code\n\n\n```javascript /* Example */\nvar bunnyGame = {\n   logic: function(key){\n       if(key.is(keys.action)) player.x++;\n   },\n   ...\n}\n```",
        type: "function"
    }, {
        title: "paint()",
        description: "Paint is called each frame, right after loop().\nUse this method to paint your scene using the ctx and the draw() function.\n\n```javascript /* Example */\n\nvar bunnyGame = {\n    paint: function(){\n        draw(t(\"bunny\"), 20, 50);\n    },\n    ...\n}\n```",
        type: "function"
    },
    {
        title: "onMobile",
        description: "If the user is on a mobile device.",
        type: "global variable"
    },
    {
        title: "importTexture(String texturePath)",
        description: "Import a texture image, PNG or JPG. More formats should work too. However, gifs do not work - If you want an animated sprite you have to use importSpriteSheet and animate the cycle yourself.\nDeafult directory is /textures/\n\n````javascript\n/* Example: Import an and draw it.\n * Org directory for image: /textures/bunny/bunnyRed.png\n */\n\n importTexture(\"bunny/bunnyRed.png\"); // Import\n draw(t(\"bunnyRed\"), 50, 50); // Draw\n \n\n",
        type: "function"
    },
    {
        title: "importSpriteSheet(String path, int amount)",
        description: "Import a bigger amount of images. Designed for after effects PNG sequence exports.\nSupports any format that starts at 0. If the starting image looks like image_0000.png, then\nyou should enter image_XXXX.png. Make sure the amount is right too!\n\n```javascript\n/*  If the path is: \"textures/overlay/overlay_00.png => overlay_19.png\"\n    Then expected input path is: \"overlay/overlay_XX.png\", amount: 20\n*/\n\n var sprites = importSpriteSheet(\"overlay/overlay_XX.png\", 20); // Import and store a copy of the images in the sprite variable. All sprites are also stored in the textures array.\n draw(sprites[0], 50, 50); // Draw the first sprite in the sheet.\n\n```",
        type: "function"
    },
    {
        title: "keyDown(int keyCode)",
        description: "Return boolean if the key is down.\nThis is usefull when making movement controlls for a character. You can check if a key is down in the loop function and ajust your varaibles accordingly.\nThis also works great for mobile players.\n\n```javascript /* Example */\nif(keyDown(23)) player.x++;\n```",
        type: "function"
    },
    {
        title: "importSound(String path)",
        description: "Import a sound file. Default directory is /sounds/\nUse playSound() to play the sound.\nIf you want to change pitch or anything advanced, use s(name) to get direct access to the variable.",
        type: "function"
    },
    {
        title: "checkCollision(Image sprite, int x, int y, double scale, Image sprite2, int x2, int y2, double scale2)",
        description: "Check a collision between two objects. Provide the sprite, x and y coordinates and the scale for both objects. If they don't scale, put null or 1.\n\n```javascript\n\nvar obj1 = {x: 20, y: 20, sprite: t(\"guy\")};\nvar obj2 = {x: 10, y: 20, sprite: t(\"guy\")};\n\nvar colliding = checkCollision(obj1.sprite, obj1.x, obj1.y, null, obj2.sprite , obj2.x, obj2.y, null);\n\nif(colliding) // Do something\n\n```",
        type: "function"
    },
    {
        title: "cleared(int ms)",
        description: "Call cleared mini-game. This should be done when the object is completed and the mini-game is not timedWin based. If a number is entered the mini-game will wait that many milliseconds until it triggeres the cleared screen. Player input will be disabled during this time and losing because of the time running out has been disaled. This can allow you to have a win animation lasting over the usual time limit.",
        type: "function"
    },
    {
        title: "failed(int ms)",
        description: "Call failed mini-game. This should be done if the mini-game objective has been failed. Does not have to be called manually if the game is time-based. If a number is entered, the fail trigger wont happend until that much time (in milliseconds) has passed. This can allow you to have a game over screen, after the player has failed.",
        type: "function"
    },
    {
        title: "playSound(String name)",
        description: "Play a previously imported sound.\n\n```javascript /* Example */\nplaySound(\"nom_0\"); // Plays audio!\n```\n",
        type: "function"
    },
    {title: "fill(String color)", description: "Fill the entire screen with one solid color. Can be hex, rgb or rgba.", type: "function"},
    {title: "textures", description: "This is the array that stores all imported textures for the mini-game. ", type: "global variable"},
    {title: "Updating version", description: "Updating the version of Mini-rumble is super easy, hotfixes are updated automatically with every new commit. \nTo edit the minor or major you have to provide the full version in the beginning of your commit.\n<br><br>\nExample: To update from 0.6.2 => 0.7.0, the commit message should equal: \"v.0.7 {message}\" (without the quotes or brackets)", type: "text", pinned: true},


]

lib.sort(compare);



function compare(a, b) {
    if (a.type < b.type)
        return -1;
    if (a.type > b.type)
        return 1;
    return 0;
}

function matching(doc) {
    var search = document.getElementById("search-box").value.toLowerCase().split(" ");
    var totalMatch = true;
    for(let i = 0; i < search.length; i++){
        var match = false;
        if (search[i] == false) match = true;
        if (doc.title.toLowerCase().indexOf(search[i]) != -1) match = true;
        if (doc.description.toLowerCase().indexOf(search[i]) != -1) match = true;
        if (doc.type.toLowerCase().indexOf(search[i]) != -1) match = true;
        if(!match){
            totalMatch = false;
            return totalMatch;
        }
    }
    
    return totalMatch;
}

function displayLinks() {
    var i = 0;
    var first = null;
    document.getElementById('list').innerHTML = '';
    lib.forEach(doc => {
        if (matching(doc)) {
            if (first == null) first = i;
            var title = doc.title;
            if (doc.type == "function") title = titleShort(doc.title)
            if (title.length > 50) {
                title = title.substr(0, 50) + "...";
            }
            var category = doc.type.split(" ");
            var categoryString = "";
            category.forEach(cat => {
                categoryString += cat[0];
            })
            if (doc.pinned) {
                first = i;
                document.getElementById('list').innerHTML = '<span class="link" onclick="displayPage(lib[' + i + '])">' + title + ' <span class="cat">' + categoryString + '</span></span>' + document.getElementById('list').innerHTML;
            } else {
                document.getElementById('list').innerHTML += '<span class="link" onclick="displayPage(lib[' + i + '])">' + title + ' <span class="cat">' + categoryString + '</span></span>';
            }
        }
        i++;
    })

    displayPage(lib[first]);
}

function titleShort(title) {

    var name = title.substr(0, title.indexOf("("));
    var vars = new Array();
    title = title.split(" ");
    title.splice(0, 1);
    while (title.length > 0) {
        vars.push(title[0].substr(0, title[0].length - 1))
        title.splice(0, 1);
    }

    var string = "";
    for (let i = 0; i < vars.length; i++) {
        if (i % 2 == 0) {
            string += vars[i]
            if (i != vars.length - 1) string += ", "
        }
    }
    return name + "(" + string + ")";
}

function displayPage(doc) {
    document.getElementById("content").innerHTML = '<div id="page"></div>';
    document.getElementById("page").innerHTML = '<span id="title"></span><span id="type"></span> <span id="description"></span>';

    var description = "<code class='lang-markup'>" + markdownToHTML(doc.description) + "</code>"; //markdownToHTML(doc.description);
    document.getElementById("title").innerHTML = doc.title;
    document.getElementById("type").innerHTML = doc.type;
    document.getElementById("description").innerHTML = description;
    Prism.highlightAll();
}


var replaceKeys = [{
    f: "```javascript",
    r: "</code><pre><code class='lang-javascript'>"
}, {
    f: "```",
    r: "</code></pre><code class='lang-markup'>"
}];

function markdownToHTML(markdown) {
    replaceKeys.forEach(replace => {
        while (markdown.indexOf(replace.f) != -1) {
            markdown = markdown.substr(0, markdown.indexOf(replace.f)) + replace.r + markdown.substr(markdown.indexOf(replace.f) + replace.f.length, markdown.length);
        }
    })
    return markdown;
}



displayLinks();
document.getElementById("search-box").focus();