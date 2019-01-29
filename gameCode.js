
var stage = document.getElementById("stage");
var score = document.getElementById("score");

var controlPanel = document.getElementById("controlPanel");
var width = 50, height = 30, cellSize, playerSpeed, playerIsDead = false;
//colors
var boardColor, snakeColor, foodColor, deathColor;
var colorThemeIndex = document.getElementById("colorTheme").value;
var blocksPerFood = 1;
var gameSpeed = 100;
var food = {
    x: -1,
    y: -1
};
var snake = {
    position: {
        x: 1,
        y: 1
    },
    direction: 0,
    body: []
};


window.addEventListener("keydown", keydownHandler, false);

window.addEventListener("resize", function(event) {
    maximizeBoardSize();
    drawBoard();
    renderBoard();
});
document.getElementById("restartButton").addEventListener("click", restartGame);
changeThemeColor();
maximizeBoardSize();
drawBoard();
placeFood();
timer();






function keydownHandler(){
    switch(event.keyCode){
        case 37:
            if(!(snake.direction == "right")){
                snake.direction = "left";
            }
            break;
        case 38:
            if(!(snake.direction == "down")){
                snake.direction = "up";
            }
            break;
        case 39:
            if(!(snake.direction == "left")){
                snake.direction = "right";
            }
            break;
        case 40:
            if(!(snake.direction == "up")){
                snake.direction = "down";
            }
            break;
            //R for Restart
        case 82:
            restartGame();
            break;
            
        case 32: //space
            if(playerIsDead){
                restartGame();
            }
    }
}

function restartGame(){
    playerIsDead = false;
    snake = {
        position: {
            x: 1,
            y: 1
        },
        direction: 0,
        body: []
    };
    
    timer();
    updateGameVars();
    food.x = false; food.y = false;
    placeFood();
    changeThemeColor();
}
function updateGameVars(){
    blocksPerFood = document.getElementById("blocksPerFoodInput").value;
    gameSpeed = document.getElementById("gameSpeedInput").value;
    timer();
}
function timer(){
    
    clearInterval(playerSpeed);
    playerSpeed = setInterval(updateGame, gameSpeed);
}

function updateGame(){

    score.innerHTML = "Length: " + (snake.body.length + 1);
    if(snake.body.length > 0){
        snake.body.splice(0, 0, [snake.position.x, snake.position.y]);
        snake.body.pop();
    }
    
    //check for food collision
    if(snake.position.x == food.x && snake.position.y == food.y){
        
        var newBodyBlock = [food.x, food.y];
        food.x = false; food.y = false;
        //snake.body.splice(0,0, newBodyBlock);
        for(var i = 0; i < blocksPerFood; i++){
            snake.body.push(newBodyBlock);
        }
        placeFood();
    }
    //Movement
    if(snake.direction == "left"){
        snake.position.x--;
        
    }
    else if(snake.direction == "right"){
        snake.position.x++;
        
    }
    else if(snake.direction == "up"){
        snake.position.y--;
    }
    else if(snake.direction == "down"){
        snake.position.y++;
    }
    
    
    
    
    
    //Death
    
    if((snake.body.length-1) >= (width*height)){
        endGame("win");
    }
    else if((snake.position.x < 0)|| (snake.position.y < 0) || (snake.position.x > width-1) || (snake.position.y > height-1)){
        endGame("death");
        document.getElementById("tile-" + snake.body[0][1] + "-" + snake.body[0][0]).style.backgroundColor = deathColor;
    }
    else{
        for(var i = 0; i < snake.body.length; i++){
            if(snake.position.x == snake.body[i][0] && snake.position.y == snake.body[i][1]){
                endGame("death");
                document.getElementById("tile-" + snake.position.y + "-" + snake.position.x).style.backgroundColor = deathColor;
                break;
            }
        }
        
    }
    if(!playerIsDead){
        renderBoard();
    }
}




function renderBoard(){
    for(var row = 0; row < height; row++){
        for(var col = 0; col < width; col++){
            var thisDiv = document.getElementById("tile-" + row + "-" + col);
            thisDiv.style.backgroundColor = boardColor;
        

        }
    }
    document.getElementById("tile-" + food.y + "-" + food.x).style.backgroundColor = foodColor;
    document.getElementById("tile-" + snake.position.y + "-" + snake.position.x).style.backgroundColor = snakeColor;
    for(var i = 0; i < snake.body.length; i++){
        var x = snake.body[i][0];
        var y = snake.body[i][1];
        var body = document.getElementById("tile-" + y + "-" + x);
        
        body.style.backgroundColor = snakeColor;
    }
}



function placeFood(){
    
    var rnd1 = Math.floor(Math.random() * width);
    var rnd2 = Math.floor(Math.random() * height);
    
    if(snake.position.x == rnd1 && snake.position.y == rnd2){
        placeFood();
    }
    for(var i = 0; i < snake.body.length; i++){
        if (snake.body[i][0] == rnd1 && snake.body[i][1] == rnd2){
            placeFood();
            break;
        }
    }
   
    food.y = rnd2;
    food.x = rnd1;
}


function changeThemeColor(){
    
    colorThemeIndex = document.getElementById("colorTheme").value;
    var body = document.getElementById("body");

    switch(colorThemeIndex){
        case '0':
            
            boardColor = "#212121";
            snakeColor = "limegreen";
            foodColor = "red";
            deathColor = "orange";
            body.style.backgroundColor = '#ffe093';
        
        break;
        case '1':
            
            boardColor = "#212121";
            snakeColor = "#b266ff";
            foodColor = "#77ffb6";
            deathColor = "#c2ff77";
            body.style.backgroundColor = '#7fb0ff';
        
        break;
        case '2':
            boardColor = "#212121";
            snakeColor = "#fccd5f";
            foodColor = "#b75ffc";
            deathColor = "#e52727";
            body.style.backgroundColor = "#c8ffaf";
        
        break;
    }
}

function maximizeBoardSize(){
    var tHeight = Math.floor((window.innerHeight)/height);
    var tWidth = Math.floor((window.innerWidth)/width);
    if(tHeight > tWidth){
        cellSize = tWidth - 5;
    }
    else{
        cellSize = tHeight - 5;
    }
    controlPanel.style.height = ((window.innerHeight)-(cellSize*height))  + "px";

}

function drawBoard(){
    //Clear all previous children of 'stage' div (when resizing)
    while (stage.firstChild) {
        stage.removeChild(stage.firstChild);
    }
    
    stage.style.position = "relative";
    stage.style.width = width * cellSize + "px";    
    stage.style.height = height * cellSize + "px";
    
    for(var row = 0; row < height; row++){
        for(var col = 0; col < width; col++){
            var newDiv = document.createElement("div");
            newDiv.setAttribute("id", "tile-" + row + "-" + col);
            newDiv.style.position = "absolute";
            newDiv.style.left = cellSize * col + "px";
            newDiv.style.top = cellSize * row + "px";
            newDiv.style.width = cellSize + "px";
            newDiv.style.height = cellSize + "px";
            newDiv.style.border = "1px solid" + boardColor;
            newDiv.data = "board";
            document.getElementById("stage").appendChild(newDiv);
            
        }
    }
    console.log(`${cellSize} cellSize`);
    stage.style.border =  cellSize + " solid black";
}

function endGame(state){
    console.log(state);
    playerIsDead = true;
    clearInterval(playerSpeed);
    
}