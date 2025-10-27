
var playerRed = "R";
var playerYellow = "Y";
var currentPlayer = playerRed;

var gameOver = false;
var board;
var aiPlayer = playerYellow; 
var humanPlayer = playerRed; 


var rows = 6;
var columns = 7;

window.onload = function(){
    setGame();
    document.getElementById("restartBtn").onclick = restartGame;
}

function setGame(){
    board = [];
    currColumns = [5,5,5,5,5,5,5];

    for(let r = 0; r < rows; r++){
        let row = [];
        for(let c = 0; c < columns; c++){
            //JS
            row.push(' ');

            // HTML
            // <div id="0-0" class="tile"></div>
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.addEventListener("click", setPiece);
            document.getElementById("board").append(tile);
        }
        board.push(row);
    }
}

function setPiece(){
    if(gameOver || currentPlayer === aiPlayer){
        return; // Block clicks during AI turn
    }
    let coords = this.id.split("-"); //"0-0" -> ["0", "0"]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    r = currColumns[c];
    if(r < 0){
        return;
    }

    makeMove(r, c, currentPlayer);
}

function makeMove(r, c, player) {
    board[r][c] = player;
    let tile = document.getElementById(r.toString() + "-" + c.toString());
    if (player == playerRed){
        tile.classList.add("red-piece");
        currentPlayer = playerYellow;
    }
    else{
        tile.classList.add("yellow-piece");
        currentPlayer = playerRed;
    }

    currColumns[c] -= 1; //updating the row height for the column

    checkWinner();
    
    // Trigger AI move after human move
    if (!gameOver && currentPlayer === aiPlayer) {
        setTimeout(aiMove, 600); // Delay for visual effect
    }
}

function aiMove() {
    if (gameOver) return;
    
    let bestCol = getBestMove();
    let r = currColumns[bestCol];
    
    if (r >= 0) {
        makeMove(r, bestCol, aiPlayer);
    }
}

function getBestMove() {
    // Minimax with alpha-beta pruning (depth 4 for good balance)
    let bestScore = -Infinity;
    let bestCol = 3; // Default to center
    
    for (let c = 0; c < columns; c++) {
        if (currColumns[c] >= 0) {
            // Try move
            let r = currColumns[c];
            board[r][c] = aiPlayer;
            currColumns[c]--;
            
            let score = minimax(0, 4, -Infinity, Infinity, false);
            
            // Undo move
            board[r][c] = ' ';
            currColumns[c]++;
            
            if (score > bestScore) {
                bestScore = score;
                bestCol = c;
            }
        }
    }
    
    return bestCol;
}

function minimax(depth, maxDepth, alpha, beta, isMaximizing) {
    let winner = checkWinnerForMinimax();
    
    if (winner === aiPlayer) return 10000 - depth;
    if (winner === humanPlayer) return -10000 + depth;
    if (isBoardFull() || depth === maxDepth) return evaluateBoard();
    
    if (isMaximizing) {
        let maxScore = -Infinity;
        for (let c = 0; c < columns; c++) {
            if (currColumns[c] >= 0) {
                let r = currColumns[c];
                board[r][c] = aiPlayer;
                currColumns[c]--;
                
                let score = minimax(depth + 1, maxDepth, alpha, beta, false);
                
                board[r][c] = ' ';
                currColumns[c]++;
                
                maxScore = Math.max(maxScore, score);
                alpha = Math.max(alpha, score);
                if (beta <= alpha) break;
            }
        }
        return maxScore;
    } else {
        let minScore = Infinity;
        for (let c = 0; c < columns; c++) {
            if (currColumns[c] >= 0) {
                let r = currColumns[c];
                board[r][c] = humanPlayer;
                currColumns[c]--;
                
                let score = minimax(depth + 1, maxDepth, alpha, beta, true);
                
                board[r][c] = ' ';
                currColumns[c]++;
                
                minScore = Math.min(minScore, score);
                beta = Math.min(beta, score);
                if (beta <= alpha) break;
            }
        }
        return minScore;
    }
}

function evaluateBoard() {
    let score = 0;
    
    // Center column preference
    for (let r = 0; r < rows; r++) {
        if (board[r][3] === aiPlayer) score += 3;
        if (board[r][3] === humanPlayer) score -= 3;
    }
    
    // Evaluate all possible windows of 4
    score += evaluateWindows(aiPlayer) - evaluateWindows(humanPlayer);
    
    return score;
}

function evaluateWindows(player) {
    let score = 0;
    
    // Horizontal
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            score += scoreWindow([board[r][c], board[r][c+1], board[r][c+2], board[r][c+3]], player);
        }
    }
    
    // Vertical
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 3; r++) {
            score += scoreWindow([board[r][c], board[r+1][c], board[r+2][c], board[r+3][c]], player);
        }
    }
    
    // Diagonal (/)
    for (let r = 3; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            score += scoreWindow([board[r][c], board[r-1][c+1], board[r-2][c+2], board[r-3][c+3]], player);
        }
    }
    // Diagonal (\)
    for (let r = 0; r < rows - 3; r++) {
        for (let c = 0; c < columns - 3; c++) {
            score += scoreWindow([board[r][c], board[r+1][c+1], board[r+2][c+2], board[r+3][c+3]], player);
        }
    }
    
    return score;
}

function scoreWindow(window, player) {
    let opponent = (player === aiPlayer) ? humanPlayer : aiPlayer;
    let playerCount = window.filter(cell => cell === player).length;
    let emptyCount = window.filter(cell => cell === ' ').length;
    let opponentCount = window.filter(cell => cell === opponent).length;
    
    if (playerCount === 4) return 100;
    if (playerCount === 3 && emptyCount === 1) return 5;
    if (playerCount === 2 && emptyCount === 2) return 2;
    
    if (opponentCount === 3 && emptyCount === 1) return -4; // Block opponent
    
    return 0;
}

function checkWinnerForMinimax() {
    // Horizontal
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns - 3; c++){
            if(board[r][c] != ' '){
                if(board[r][c] == board[r][c+1] && board[r][c+1] == board[r][c+2] && board[r][c+2] == board[r][c+3]){
                    return board[r][c];
                }
            }
        }
    }
    // Vertical
    for(let c = 0; c < columns; c++){
        for(let r = 0; r < rows - 3; r++){
            if(board[r][c] != ' '){
                if(board[r][c] == board[r+1][c] && board[r+1][c] == board[r+2][c] && board[r+2][c] == board[r+3][c]){
                    return board[r][c];
                }
            }
        }
    }
    // Anti-diagonal
    for(let r = 0; r < rows-3; r++){
        for(let c = 0; c < columns - 3; c++){
            if(board[r][c] != ' '){
                if(board[r][c] == board[r+1][c+1] && board[r+1][c+1] == board[r+2][c+2] && board[r+2][c+2] == board[r+3][c+3]){
                    return board[r][c];
                }
            }
        }
    }
    // Diagonal
    for(let r = 3; r < rows; r++){
        for(let c = 0; c < columns - 3; c++){
            if(board[r][c] != ' '){
                if(board[r][c] == board[r-1][c+1] && board[r-1][c+1] == board[r-2][c+2] && board[r-2][c+2] == board[r-3][c+3]){
                    return board[r][c];
                }
            }
        }
    }
    return null;
}


function isBoardFull() {
    for (let c = 0; c < columns; c++) {
        if (currColumns[c] >= 0) return false;
    }
    return true;
}


function checkWinner(){
    //horizontally
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns - 3; c++){
            if(board[r][c] != ' '){
                if(board[r][c] == board[r][c+1] && board[r][c+1] == board[r][c+2] && board[r][c+2] == board[r][c+3]){
                    setWinner(r, c);
                    return;
                }
            }
        }
    }
    //vertically
    for(let c = 0; c < columns; c++){
        for(let r = 0; r < rows - 3; r++){
            if(board[r][c] != ' '){
                if(board[r][c] == board[r+1][c] && board[r+1][c] == board[r+2][c] && board[r+2][c] == board[r+3][c]){
                    setWinner(r, c);
                    return;
                }
            }
        }
    }
    //anti-diagonally
    for(let r = 0; r < rows-3; r++){
        for(let c = 0; c < columns - 3; c++){
            if(board[r][c] != ' '){
                if(board[r][c] == board[r+1][c+1] && board[r+1][c+1] == board[r+2][c+2] && board[r+2][c+2] == board[r+3][c+3]){
                    setWinner(r, c);
                    return;
                }
            }
        }
    }
    //diagonally
    for(let r = 3; r < rows; r++){
        for(let c = 0; c < columns - 3; c++){
            if(board[r][c] != ' '){
                if(board[r][c] == board[r-1][c+1] && board[r-1][c+1] == board[r-2][c+2] && board[r-2][c+2] == board[r-3][c+3]){
                    setWinner(r, c);
                    return;
                }
            }
        }
    }
    //draw detection
    let anyEmpty = false;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === ' ') {
                anyEmpty = true;
                break;
            }
        }
        if (anyEmpty) break;
    }
    if (!anyEmpty) {
        const winner = document.getElementById("winner");
        winner.innerText = "Draw!";
        gameOver = true;
        return;
    }
}

function setWinner(r,c){
    let winner = document.getElementById("winner");
    if(board[r][c] == playerRed){
        winner.innerText = "Red Wins!";
    }
    else{
        winner.innerText = "Yellow Wins!";
    }
    gameOver = true;
}

function restartGame() {
    document.getElementById("board").innerHTML = "";
    gameOver = false;
    currentPlayer = playerRed;
    document.getElementById("winner").innerText = ""; 
    setGame();
}

function wipeBoard(delayMs = 800) {
    setTimeout(() => {
        const boardEl = document.getElementById("board");
        if (boardEl) boardEl.innerHTML = "";

        gameOver = false;
        currentPlayer = playerRed;
        const w = document.getElementById("winner");
        if (w) w.innerText = "";

        setGame();
    }, delayMs);
}
