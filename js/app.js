/* Enemy class */
var Enemy = function() {
    /* Generate a random starting position and speed */
    this.randX();
    this.randY();
    this.randSpeed();

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    /* Enemy's width and height for collision detection */
    this.width = 90;
    this.height = 60;
};


// Update the enemy's position
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    /* If the enemy goes off context, set new position and speed */
    if ( this.x > 505 ) {
        this.x = -101;
        this.randY();
        this.randSpeed();
    }

    /* Move the enemy based on dt and its speed */
    this.x += dt * this.speed;
};

/* Choose a random column and position the Enemy */
Enemy.prototype.randX = function() {
    this.x = 404 - ( 101 * Math.floor(Math.random() * 5) );
};

/* Choose a random row and position the Enemy */
Enemy.prototype.randY = function() {
    this.y = 305 - ( 83 * Math.floor(Math.random() * 3) );
};

/* Choose a random speed and set it on the Enemy */
Enemy.prototype.randSpeed = function() {
    this.speed = 250 - Math.floor( 50 * (Math.random() * 3) );
};

/* Draw the enemy on the screen */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


/* Player Class */
var Player = function() {
    /* Set Starting Position */
    this.reset();

    /* Player sprite */
    this.sprite = 'images/char-boy.png';

    /* Player width and height for collision detection */
    this.width = 60;
    this.height = 75;
};

/* Lives */
Player.prototype.lives = 3;

/* Check for win */
Player.prototype.checkWin = function() {
    /* Win Condition */
    if ( this.y-83 < 126 ) {
        /* Alert */
        swal({
            title: "You Win!",
            imageUrl: "http://vignette2.wikia.nocookie.net/rift/images/7/7f/AWESOME_FACE!!!.png/revision/latest?cb=20110302225528",
            imageSize: "100x100",
            confirmButtonText: "Huzzah!"
        });
        this.reset();
        this.lives = 3;
        return true;
    }
    return false;
};

/* Check if any enemies are colliding with the player */
Player.prototype.checkCollisions = function(enemies) {
    enemies.forEach(function(en) {
        if ( (player.x < en.x+en.width && player.x+player.width > en.x) &&
             (player.y < en.y+en.height && player.y+player.height > en.y)
            ) {
            player.reset();
            player.lives--;
            player.checkAlive();
        }
    });
};

/* Check if the player is still alive */
Player.prototype.checkAlive = function() {

    if (this.lives === 0) {
        swal({
            title: "Game Over!",
            imageUrl: "http://vignette2.wikia.nocookie.net/fantendo/images/b/b2/Sad_Face.png/revision/latest?cb=20131020025647",
            imageSize: "100x100",
            confirmButtonText: "I'll get 'em next time."
        });
        this.lives = 3;
    }
};

/* Update the player's position */
Player.prototype.update = function( x,y ) {
    this.x += x || 0;
    this.y += y || 0;
};

/* Draw the player and lives on to the context */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    /* Render the number of lives */
    ctx.fillStyle = '#FF2400';
    ctx.font = '30px Comic Sans';
    for (var i=0; i<player.lives; i++) {
        ctx.fillText( String.fromCharCode(9829), 10+(25*i), 578);
    }
};

/* Reset the player's position */
Player.prototype.reset = function() {
    this.x = 218;
    this.y = 458;
};

/* Respond to user input */
Player.prototype.handleInput = function(direction) {
    switch (direction) {
        case 'left':
            if (this.x > 45) { this.update( -101,0 ); }
            break;
        case 'up':
            if ( !this.checkWin() ) { this.update( 0,-83 ); }
            break;
        case 'right':
            if (this.x < 404) { this.update( 101,0 ); }
            break;
        case 'down':
            if (this.y < 391) { this.update( 0,83 ); }
            break;
        default:
            break;
    }
};


/* Instantiate the player and enemies array */
var player = new Player();
var allEnemies = [];

/* Generate enemies and store them in allEnemies */
for (var i=0; i<7; i++) {
    allEnemies[i] = new Enemy();
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
