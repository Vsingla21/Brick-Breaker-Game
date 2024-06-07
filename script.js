let interval; // This will be used to store the interval ID for the game loop.
let isPaused = false; // This tracks whether the game is paused.


const canvas = document.getElementById('brickGame');
const ctx = canvas.getContext('2d');

canvas.width = 480;
canvas.height = 320;

let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let bricks = [];

let score = 0;

for(let c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(let r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function collisionDetection() {
    for(let c = 0; c < brickColumnCount; c++) {
        for(let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount * brickColumnCount) {
                        youWin(); // Call the function to display "You Win" message
                    }
                }
            }
        }
    }
}

function youWin() {
    clearInterval(interval); // Stop the game loop
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx.font = "36px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("You Win!", 160, 160); // Display "You Win" message
    // Display final score
    ctx.fillText("Final Score: " + score, 150, 200);
    // Add a "Play Again" button
    ctx.font = "20px Arial";
    ctx.fillText("Play Again", 185, 240);
    canvas.addEventListener("click", restartGame); // Add event listener for clicking the button
}


function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function draw() {
    if (!isPaused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        collisionDetection();
    
        // Ball movement logic and collision with walls
        if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if(y + dy < ballRadius) {
            dy = -dy;
        } else if(y + dy > canvas.height-ballRadius) {
            if(x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            }
            else {
                    gameOver(); 
            }
        }
    
        // Paddle movement logic
        if(rightPressed && paddleX < canvas.width-paddleWidth) {
            paddleX += 7;
        }
        else if(leftPressed && paddleX > 0) {
            paddleX -= 7;
        }
    
        x += dx;
        y += dy;
    }
}

function gameOver() {
    clearInterval(interval); // Stop the game loop
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx.font = "36px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Game Over", 135, 160); // Display a game over message
    // Display final score
    ctx.fillText("Final Score: " + score, 150, 200);
    // Add a "Play Again" button
    ctx.font = "20px Arial";
    ctx.fillText("Play Again", 185, 240);
    canvas.addEventListener("click", restartGame); // Add event listener for clicking the button
}




function restartGame() {
    document.location.reload(); // Simplest way to restart the game
}

function restartGame() {
    document.location.reload(); // Reload the game
    canvas.removeEventListener("click", restartGame); // Remove the event listener
}



function startGame() {
    if (!interval) {
        interval = setInterval(draw, 10); // Adjust the interval rate as needed
    }
    isPaused = false;
}

function togglePause() {
    if (!isPaused) {
        isPaused = true;
    } else if (isPaused) {
        isPaused = false;
        draw(); // Continue drawing when unpaused
    }
}



draw();
