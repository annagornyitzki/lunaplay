var board;
var playerO = "O";
var playerX = "X";
var currentPlayer = playerX;
var gameOver = false;

window.onload = function() {
    setGame();
    document.getElementById("restartBtn").onclick = restartGame;
}

function restartGame() {
    document.getElementById("board").innerHTML = "";
    gameOver = false;
    currentPlayer = playerX;
    setGame();
}

function setGame() {
    board = [
        [' ', ' ', ' '],
        [' ', ' ', ' '],
        [' ', ' ', ' ']
    ];

    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            // <div id="0-0"></div>
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            if(r === 0 || r === 1) {
                tile.classList.add("horizontal-line");
            }
            if(c === 0 || c === 1) {
                tile.classList.add("vertical-line");
            }
            tile.addEventListener("click", setTile);
            document.getElementById("board").append(tile);
        }
    }
}

function setTile(){
    if (gameOver || currentPlayer !== playerX) {
        return;
    }

    let coords = this.id.split("-"); //""1-1 -> ["1","1"]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    if (board[r][c] != ' ') {
        return;
    }

    board[r][c] = currentPlayer;
    this.innerText = currentPlayer;

    checkWinner();

    if (!gameOver) {
        currentPlayer = playerO;
        setTimeout(aiMove, 400); // AI moves after a short delay
    }

}

function aiMove() {
    if (gameOver) return;
    // Find all empty cells
    let empty = [];
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            if (board[r][c] === ' ') empty.push([r, c]);
        }
    }
    if (empty.length === 0) return;

    // Pick a random empty cell
    let [r, c] = empty[Math.floor(Math.random() * empty.length)];
    board[r][c] = playerO;
    document.getElementById(r + "-" + c).innerText = playerO;

    checkWinner();

    if (!gameOver) currentPlayer = playerX;
}

checkWinner = function() {
    //horizontally
    for(let r = 0; r < 3; r++) {
        if(board[r][0] == board[r][1] && board[r][1] == board[r][2] && board[r][0] != ' ') {
            for (let i = 0; i < 3; i++){
                let tile = document.getElementById(r.toString() + "-" + i.toString());
                tile.classList.add("winner");
            }
            gameOver = true;
            wipeBoard();
            return;
        }
    }
    //vertically
    for(let c = 0; c < 3; c++) {
        if(board[0][c] == board[1][c] && board[1][c] == board[2][c] && board[0][c] != ' ') {
            for (let i = 0; i < 3; i++){
                let tile = document.getElementById(i.toString() + "-" + c.toString());
                tile.classList.add("winner");
            }
            gameOver = true;
            wipeBoard();
            return;
        }
    }
    //diagonally
    if(board[0][0] == board[1][1] && board[1][1] == board[2][2] && board[0][0] != ' ') {
        for (let i = 0; i < 3; i++){
            let tile = document.getElementById(i.toString() + "-" + i.toString());
            tile.classList.add("winner");
        }
        gameOver = true;
        wipeBoard();
        return;
    }
    //anti-diagonally
    if(board[0][2] == board[1][1] && board[1][1] == board[2][0] && board[0][2] != ' ') {
        for (let i = 0; i < 3; i++){
            let tile = document.getElementById(i.toString() + "-" + (2 - i).toString());
            tile.classList.add("winner");
        }
        gameOver = true;
        wipeBoard();
        return;
    }
    //tie
    let tie = true;
    for (let r = 0; r < 3; r++)
        for (let c = 0; c < 3; c++)
            if (board[r][c] === ' ') tie = false;
    if (tie){
        gameOver = true;
        wipeBoard();
    }
}

function wipeBoard() {
    setTimeout(() => {
        document.getElementById("board").innerHTML = "";
        gameOver = false;
        currentPlayer = playerX;
        setGame();
    }, 800);
}