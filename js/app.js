//This JavaScript function always returns a random number
//between min (included) and max (excluded)
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

//Play background sound
sounds[0].loop = true;
sounds[0].play();

//Specifies lives left before game over
var lives = 3;
document.getElementById("lives").innerHTML = lives;

//Reset function for lives
var reset = function() {
    lives = lives - 1;
    var lifeSpanElement = document.getElementById("lives");
    lifeSpanElement.innerHTML = lives;
    if (lives === 0) {
        $("#gameOverModal").modal('show');
        sounds[0].pause();
        sounds[3].play();
        $(".restart").click(function() {
            window.location.reload(true);
        });
    }
};

//Initial Score
var score = 0;

//Incrase score function
var updScore = function() {
    score = score + 100;
    document.getElementById("score").innerHTML = score;
    if (score === 1000) {
        $("#wonModal").modal('show');
        sounds[0].pause();
        sounds[4].play();
        clearTimeout(timer);
        $(".restart").click(function() {
            window.location.reload(true);
        });
    }
};

//Function that end the game after 35 seconds (timeout)
var timeOut = function() {
    $("#gameOverModal").modal('show');
    sounds[0].pause();
    sounds[3].play();
    $(".restart").click(function() {
        window.location.reload(true);
    });
};

//End the game if you did not get 1000 points in 35 seconds
var timer = window.setTimeout("timeOut()", 35000);

// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // Setting the Enemy initial location
    this.x = x;
    this.y = y;

    //Setting enemy speed
    this.speed = speed;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug-'+getRndInteger(1, 6)+'.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    // Updates the Enemy location
    this.x = this.x + (this.speed * dt);

    //If the Enemy reaches the end of canvas
    if (this.x > 505) {
        this.x = -100;
    }

    // Check for collision between player and enemies and handle it
    if ((this.x) <= (player.x + 65) && (this.x + 70) >= (player.x) && 
        (this.y) <= (player.y + 35) && (this.y + 35) >= (player.y)) {
        sounds[1].play();
        player.x = 200;
        player.y = 400;

        // toggle background after collision between player and enemies
        document.querySelector('body').style.backgroundColor = '#772020';
        setTimeout(function () {
            document.querySelector('body').style.backgroundColor = '#f1e8e8';
        }, 300);

        //Update lives
        reset();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

// Player class
var Player = function(x, y) {
    // Setting the player initial location
    this.x = x;
    this.y = y;

    // The image/sprite for our player, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-boy.png';
};

// Update method
Player.prototype.update = function() {
    // The player cannot move off screen, So
    // I will set x and y axises boundaries
    // x axis
    if (this.x < 0) {
        this.x = 0;
    }
    else if (this.x > 400) {
        this.x = 400;
    }

    // y axis
    else if (this.y > 400) {
        this.y = 400;
    }
    else if (this.y < 0) {
        sounds[2].play();
        this.x = 200;
        this.y = 400;

        // Increase score since the player reaches the water
        updScore();
    }

};

// render method
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];

// Position "y" where the enemies will are created
var enemyPositionY = [65, 145, 225];

// Place the player object in a variable called player
var player = new Player(200, 400);

// Create Enemy variable
var enemy;

//Creating several new Enemies objects and placing them in an array called allEnemies
enemyPositionY.forEach(function(posY) {
    enemy = new Enemy(Math.floor(Math.random() * 30), posY, 50 + Math.floor(Math.random() * 350));
    allEnemies.push(enemy);
});

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

//handleInput method
// switch statement takes the key event listener and change the values x or y accordingly
Player.prototype.handleInput = function(key) {
    switch (key) {

        case 'up':
        this.y -= 90;
        break;

        case 'down':
        this.y += 90;
        break;

        case 'left':
        this.x -= 100;
        break;

        case 'right':
        this.x += 100;
        break;

        default:
        break;
    }
};

//Timer to notify the player before the game ending
function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
};

window.onload = function () {
    var fiveMinutes = 60 * 0.58,
        display = document.querySelector('#time');
    startTimer(fiveMinutes, display);
};