let board;
let boardWidth = 460;
let boardHeight = 590;
let context;

let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
};

let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;
let highScore = 0;

let gameStarted = false;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    birdImg = new Image();
    birdImg.src = "flappybird.png";

    topPipeImg = new Image();
    topPipeImg.src = "toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "bottompipe.png";

    document.addEventListener("keydown", handleKeyPress);

    // Retrieve high score from local storage
    highScore = localStorage.getItem("flappyBirdHighScore") || 0;
}

function handleKeyPress(event) {
    if (event.code === "Space" && !gameStarted) {
        startGame();
    } else if (event.code === "Space" && !gameOver) {
        jump();
    } else if (event.code === "Space" && gameOver) {
        resetGame();
    }
}

function startGame() {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("board").style.display = "block";
    gameStarted = true;
    setInterval(placePipes, 1500);
    requestAnimationFrame(update);
}

function jump() {
    velocityY = -6;

    if (gameOver) {
        resetGame();
    }
}

function resetGame() {
    bird.y = birdY;
    pipeArray = [];
    gameOver = false;
    velocityY = 0;

    // Update high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("flappyBirdHighScore", highScore);
    }

    // Reset the score to 0
    score = 0;

    // Display restart screen
    context.fillStyle = "rgba(0, 0, 0, 0.5)";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle = "white";
    context.font = "30px sans-serif";
    context.fillText("Press Space to Restart", board.width / 2 - 150, board.height / 2 - 15);
    context.fillText("High Score: " + highScore, board.width / 2 - 70, board.height / 2 + 30);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }

    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    context.fillStyle = "white";
    context.font = "25px sans-serif";

    // Display Score
    context.fillText("Score: " + score, 5, 30);

    // Display High Score
    context.fillText("High Score: " + highScore, 150, 30);

    if (gameOver) {
        context.fillText("GAME OVER", 5, 90);
        context.fillText("Press Space to Restart", 5, 140);
    }
}

function placePipes() {
    if (gameOver || !gameStarted) {
        return;
    }

    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 4;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(bottomPipe);
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}
