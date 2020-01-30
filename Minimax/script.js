let gameBoard = (function () {
    const board = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    const renderBoard = function () {
        for (let i = 0; i < board.length; i++) {
            let gridCell = document.querySelector(`[data-position="${i}"]`);
            if (board[i] === "X" || board[i] === "O") {
                gridCell.textContent = board[i];
            }
            else {
                gridCell.textContent = "";
            }
        }
    }
    const resetBoard = function () {
        for (let i = 0; i < 9; i++) {
            board[i] = i;
        }
        renderBoard();
        gameStatus.cellsFilled = 0;
    }
    return { board, renderBoard, resetBoard };
})();

const Player = function (name, symbol) {
    return { name, symbol };
}

let gameStatus = {
    playerturn: "player1",
    p1Score: 0,
    tieScore: 0,
    p2Score: 0,
    cellsFilled: 0,
    ai: false,
}

function resetScores() {
    gameStatus.p1Score = 0;
    gameStatus.p2Score = 0;
    gameStatus.tieScore = 0;
}

function renderPage(type) {
    const home = document.querySelector(".home-container");
    const game = document.querySelector(".game-container");
    const resultsContainer = document.querySelector(".results-container");
    const results = document.querySelector(".results-banner");
    const scores = document.querySelector(".scores");
    let gridCells = document.querySelectorAll(".grid-cell");

    if (type === "game") {
        gridCells.forEach(cell => {
            cell.addEventListener("click", placeMove);
        });
        home.style.display = "none";
        game.style.display = "flex";
        gameBoard.resetBoard();
        renderNames();
        renderScores();
        gameStatus.playerturn = "player1";
        renderTurn();
        scores.style.display = "flex";
        resultsContainer.style.display = "none";
        results.textContent = "";
    }
    else {
        home.style.display = "block";
        game.style.display = "none";
        resetScores();
    }
}

function renderNames() {
    const { player1, player2 } = getPlayers();
    const player1Name = document.querySelector(".player-name");
    const player2Name = document.querySelector(".player2-name");
    player1Name.textContent = player1.name;
    player2Name.textContent = player2.name;
}

function renderScores() {
    const player1Score = document.querySelector(".player-score");
    const tieScore = document.querySelector(".tie-score");
    const player2Score = document.querySelector(".player2-score");
    player1Score.textContent = gameStatus.p1Score;
    tieScore.textContent = gameStatus.tieScore;
    player2Score.textContent = gameStatus.p2Score;
}

let activateButton = function () {
    let p1 = document.querySelector(".one-player");
    let p2 = document.querySelector(".two-player");
    let player2Input = document.querySelector(".player-2-input");

    // If p1 is already active, switch to p2
    if (p1.classList.contains("active")) {
        p1.classList.remove("active");
        p2.classList.add("active");
        player2Input.classList.remove("inactive");
    }
    else {
        p2.classList.remove("active");
        p1.classList.add("active");
        player2Input.classList.add("inactive");
    }
};

const getPlayers = function () {
    let p1Name = document.querySelector("input[name=p1]").value || "Player1";
    let player1 = Player(p1Name, "X");

    let player2;
    if (playerVsAi()) {
        gameStatus.ai = true;
        player2 = Player("AI", "O");
    }
    else {
        gameStatus.ai = false;
        let p2Name = document.querySelector("input[name=p2]").value || "Player2";
        player2 = Player(p2Name, "O");
    }
    return { player1, player2 };
}

function playerVsAi() {
    const onePlayerBtn = document.querySelector(".one-player");
    return (onePlayerBtn.classList.contains("active")) ? true : false;
}

const renderTurn = function () {
    let player1 = document.querySelector(".player-container");
    let player2 = document.querySelector(".player2-container");
    if (gameStatus.playerturn === "player1") {
        player2.classList.remove("turn");
        player1.classList.add("turn");
    }
    else {
        player1.classList.remove("turn");
        player2.classList.add("turn");
    }
}

const { board } = gameBoard;
const winCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

function checkWinner(array, symbol) {
    let winner = null;
    const { player1, player2 } = getPlayers();
    winCombos.forEach(function (subArr) {
        let counter = 0;
        subArr.forEach(function (index) {
            if (board[index] === symbol) {
                counter++;
                if (counter == 3) {
                    winner = gameStatus.playerturn;
                    (winner === "player1") ? (renderWin(player1.name), gameStatus.p1Score++) : (renderWin(player2.name), gameStatus.p2Score++);
                }
            }
        });
    });
    if (gameStatus.cellsFilled === 9 && winner === null) {
        renderDraw();
    }
}


function renderWin(name) {
    const resultsContainer = document.querySelector(".results-container");
    const results = document.querySelector(".results-banner");
    const scores = document.querySelector(".scores");
    scores.style.display = "none";
    resultsContainer.style.display = "flex";
    results.textContent = `${name} wins!`;
    endGame();
}

function renderDraw() {
    const resultsContainer = document.querySelector(".results-container");
    const results = document.querySelector(".results-banner");
    const scores = document.querySelector(".scores");
    scores.style.display = "none";
    resultsContainer.style.display = "flex";
    results.textContent = `It's a draw!`;
    gameStatus.tieScore++;
    endGame();
}

const mainGame = (function () {
    activateButton();
    renderTurn();
    let onePlayerBtn = document.querySelector(".one-player");
    onePlayerBtn.addEventListener("click", activateButton);

    let twoPlayerBtn = document.querySelector(".two-player");
    twoPlayerBtn.addEventListener("click", activateButton);

    let playBtn = document.querySelector(".play");
    playBtn.addEventListener("click", function () {
        getPlayers();
        renderPage("game");
    });

    let homeBtn = document.querySelector(".home-button");
    homeBtn.addEventListener("click", function () {
        renderPage("home");
    });

    let newGameBtn = document.querySelector(".newgame-button");
    newGameBtn.addEventListener("click", function () {
        renderPage("game");
    });

    let gridCells = document.querySelectorAll(".grid-cell");
    gridCells.forEach(cell => {
        cell.addEventListener("click", placeMove);
    })
})();

function placeMove(e) {
    const { board } = gameBoard;
    const { player1, player2 } = getPlayers();
    if (board[e.target.getAttribute("data-position")] !== "X" && board[e.target.getAttribute("data-position")] !== "O") {
        if (gameStatus.playerturn === "player1") {
            board[e.target.getAttribute("data-position")] = player1.symbol;
            gameStatus.cellsFilled++;
            checkWinner(winCombos, player1.symbol);
            gameStatus.playerturn = "player2";
        }
        else if (gameStatus.playerturn === "player2" && !gameStatus.ai) {
            board[e.target.getAttribute("data-position")] = player2.symbol;
            gameStatus.cellsFilled++;
            checkWinner(winCombos, player2.symbol);
            gameStatus.playerturn = "player1";
        }
        if (gameStatus.playerturn === "player2" && gameStatus.ai) {
            gameStatus.cellsFilled++;
            let aiIndex = aiPlay();
            board[aiIndex] = player2.symbol;
            checkWinner(winCombos, player2.symbol);
            gameStatus.playerturn = "player1";
        }
    }
    gameBoard.renderBoard();
    renderTurn();
};

function endGame() {
    gameStatus.cellsFilled = 0;
    let gridCells = document.querySelectorAll(".grid-cell");
    gridCells.forEach(cell => {
        cell.removeEventListener("click", placeMove);
    });

}
function aiPlay() {
    const { player2 } = getPlayers();

    function winning(board, player) {
        if (
            (board[0] == player && board[1] == player && board[2] == player) ||
            (board[3] == player && board[4] == player && board[5] == player) ||
            (board[6] == player && board[7] == player && board[8] == player) ||
            (board[0] == player && board[3] == player && board[6] == player) ||
            (board[1] == player && board[4] == player && board[7] == player) ||
            (board[2] == player && board[5] == player && board[8] == player) ||
            (board[0] == player && board[4] == player && board[8] == player) ||
            (board[2] == player && board[4] == player && board[6] == player)
        ) {
            return true;
        } else {
            return false;
        }
    }

    function emptyCells(board) {
        return board.filter(cell => cell !== "O" && cell !== "X");
    }

    let bestPlay = minimax(gameBoard.board, player2.symbol).index;

    function minimax(newBoard, player) {
        let human = "X";
        let ai = "O";

        let availableSpots = emptyCells(newBoard);

        if (winning(newBoard, human)) {
            return { score: -10 };
        }
        else if (winning(newBoard, ai)) {
            return { score: 10 }
        }
        else if (availableSpots.length === 0) {
            return { score: 0 };
        }
        let moves = [];
        for (let i = 0; i < availableSpots.length; i++) {
            let move = {};
            move.index = newBoard[availableSpots[i]];
            newBoard[availableSpots[i]] = player;

            if (player === ai) {
                let result = minimax(newBoard, human);
                move.score = result.score;
            }
            else {
                let result = minimax(newBoard, ai);
                move.score = result.score;
            }
            newBoard[availableSpots[i]] = move.index;
            moves.push(move);
        }

        let bestMove;
        if (player === ai) {
            let bestScore = -10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        else {
            let bestScore = 10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        return moves[bestMove];
    }
    return bestPlay;
}