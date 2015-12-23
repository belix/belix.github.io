// Define size of the blocks where player can move at
var canvasWidth = 505;
var canvasHeight = 606;
var numRows = 6;
var numCols = 5;
var blockWidth = canvasWidth/numCols;
var blockHeight = 90;
var entityHeight = 70;
var entityWidth = 70;

var gameStates = {
    CHAR_SELECTION_STARTED: 0,
    PLAYING: 1,
    GAME_OVER: 2
};
gameState = gameStates.CHAR_SELECTION;



var SelectionMenu = function(){
    this.characters = ['images/char-boy.png', 'images/char-cat-girl.png', 'images/char-horn-girl.png',
        'images/char-pink-girl.png', 'images/char-princess-girl.png'];
    this.charSelector = 'images/Selector.png';
    this.charSelectionIndex = 2;
}

SelectionMenu.prototype.render = function(){

    if (gameState === gameStates.CHAR_SELECTION){
        ctx.font="40px Verdana";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("Choose your character!",ctx.canvas.width / 2, 110);

        //render selector sprite
        ctx.drawImage(Resources.get(this.charSelector), blockWidth * this.charSelectionIndex, 125);
        //render all chars for char selection
        for (character in this.characters) {
            ctx.drawImage(Resources.get(this.characters[character]),blockWidth * character, 130);
        }
    }
    else if (gameState === gameStates.PLAYING){

    }
    else if (gameState === gameStates.GAME_OVER){

    }
}

SelectionMenu.prototype.handleInput = function(pressedKey){
    console.log("schlund");
    switch(pressedKey) {
        case 'left':
        console.log(this.charSelectionIndex);
            this.charSelectionIndex--;
            this.charSelectionIndex = Math.max(this.charSelectionIndex,0);
            break;
        case 'right':
            this.charSelectionIndex++;
            this.charSelectionIndex = Math.min(this.charSelectionIndex,4);
            break;
        case 'space':
            initGame();
            gameState = gameStates.PLAYING;
            break;
        default:
            break;
    }
}

// Enemies our player must avoid
var Enemy = function(locX, locY) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = locX * blockWidth;
    this.y = locY * blockHeight;
    this.speed = getRandomArbitrary(0.5,1.0);

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += blockWidth*dt*this.speed;
    if (this.x > canvasWidth){
        this.x = -50;
    }

    //update edges of enemy
    this.left = this.x;
    this.top = this.y;
    this.right = this.x + entityWidth;
    this.bottom = this.y + entityHeight;

    //check for collisions
    this.checkCollision(this, player);
};

Enemy.prototype.isIntersecting = function(enemy, player) {
        return !(enemy.top > player.bottom
               || enemy.left > player.right
               || enemy.right < player.left
               || enemy.bottom < player.top);
}

Enemy.prototype.checkCollision = function(enemy, player) {
    if(this.isIntersecting(enemy, player)) {
        // If there is collision between the player and any of the enemies,
        // reduce the player's life by 1
        player.lives -= 1;
        console.log("lives:");
        console.log(player.lives);
        player.x = 202;
        player.y = 390;
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    console.log(selectionMenu.charSelectionIndex);
    this.sprite = selectionMenu.characters[selectionMenu.charSelectionIndex];
    this.x = 202;
    this.y = 390;
    this.lives = 10;
    this.score = 0;
}

Player.prototype.handleInput = function(pressedKey){
    switch(pressedKey) {
        case 'left':
            this.x -= blockWidth;
            break;
        case 'right':
            this.x += blockWidth;
            break;
        case 'up':
            this.y -=blockHeight;
            break;
        case 'down':
            this.y += blockHeight;
            break;
        default:
            break;
    }
};

Player.prototype.update = function(dt) {

    //update edges of player
    this.left = this.x;
    this.top = this.y;
    this.right = this.x + entityWidth;
    this.bottom = this.y + entityHeight;
};

// Draw the enemy on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var selectionMenu = new SelectionMenu();
var player;
var allEnemies;
function initGame(){
    player = new Player();
    allEnemies = [new Enemy(2,2.4),new Enemy(0,1.4),new Enemy(1,0.4)];
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    if(gameState === gameStates.PLAYING){
        player.handleInput(allowedKeys[e.keyCode]);
    }
    else{
        selectionMenu.handleInput(allowedKeys[e.keyCode]);
    }
});