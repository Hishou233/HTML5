const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const BLOCK_SIZE = 20;  //放大畫素，20點為一格
const MAP_SIZE = canvas.width/BLOCK_SIZE ; // (寬400 / 格20) = 20格子(列)
let score = 0;
const GameStart = document.getElementById("buttonStart");
function initgame(){
    score = 0; //let是宣告，如果這裡再寫一遍會等於宣告了一個區域變數score，和外部的廣域變數score不同
snake = {
    //身體位置    
    body: [ { x: MAP_SIZE / 2, y: MAP_SIZE / 2 } ],  
    //身體長度    
    size: 5, 
    //行進方向 
    direction: { x: 0, y: -1 }, 
    //畫蛇
    drawSnake: function () {
        this.moveSnake();
        ctx.fillStyle='lime';
        for (let i=0; i<this.body.length; i++){      
            ctx.fillRect(
            this.body[i].x * BLOCK_SIZE,
            this.body[i].y * BLOCK_SIZE,
            BLOCK_SIZE,
            BLOCK_SIZE
            );
        }
    },
    //移動蛇
    moveSnake: function () {
        newBlock = {
        x: this.body[0].x + this.direction.x,
        y: this.body[0].y + this.direction.y
    }
    this.body.unshift(newBlock);
    while (this.body.length > this.size) {
        this.body.pop();
    }
    },
}
apple = {
    //蘋果位置
    x: 5,
    y: 5,
    //畫蘋果
    drawApple: function () {
        ctx.fillStyle = 'red';
        ctx.fillRect(
        this.x * BLOCK_SIZE ,
        this.y * BLOCK_SIZE ,
        BLOCK_SIZE ,
        BLOCK_SIZE
);
    },
    //放蘋果
    putApple: function () {
        this.x = Math.floor(Math.random() * MAP_SIZE);
        this.y = Math.floor(Math.random() * MAP_SIZE);
    },
}
}

//控制蛇
function keyDown(event) {
    //up
    if (event.keyCode == 38 || event.keyCode == 87){
        if (snake.direction.y == 1) return;
            snake.direction.y = -1;
            snake.direction.x = 0;
    }
    //down
    else if (event.keyCode == 40 || event.keyCode == 83) {
        if (snake.direction.y == -1) return;
            snake.direction.y = 1;
            snake.direction.x = 0;
    }
    //left
    else if (event.keyCode == 37 || event.keyCode == 65) {
        if (snake.direction.x == 1) return;
            snake.direction.y = 0;
            snake.direction.x = -1;
    }
    //right
    else if (event.keyCode == 39 || event.keyCode == 68) {
        if (snake.direction.x == -1) return;
            snake.direction.y = 0;
            snake.direction.x = 1;
    }
}

//開始遊戲
function gameStart() {
    gameInterval = setInterval(drawGame, 100); //100毫秒
//吃蘋果
function eatApple() {
    if (snake.body[0].x === apple.x && snake.body[0].y === apple.y) {
        snake.size += 1;
        score++;
        apple.putApple();
    }
}
//繪製地圖
function drawMap() {
    ctx.fillStyle = 'black' ;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
//繪製分數
function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "10px Verdana";
    ctx.fillText("Score " + score, canvas.width - 50, 10);    
}
//判定結束
function checkDeath() {
    // hit walls
    if( (snake.body[0].x < 0) ||
        (snake.body[0].x >= MAP_SIZE)||
        (snake.body[0].y < 0) ||
        (snake.body[0].y >= MAP_SIZE)
    ){
        clearInterval(gameInterval);
    }
    // hit body
    for (var i=1; i<snake.body.length; i++) {
        if (snake.body[0].x === snake.body[i].x &&
            snake.body[0].y === snake.body[i].y) {
                clearInterval(gameInterval);
            }  
    }
}
//繪製遊戲
function drawGame() {
    drawMap();
    apple.drawApple();
    snake.drawSnake();
    eatApple(); 
    drawScore();
    checkDeath();    
}
}
/////
document.addEventListener("keydown", keyDown);
GameStart.addEventListener("click",  function(){
initgame(); //初始化
gameStart(); //執行開始遊戲
})