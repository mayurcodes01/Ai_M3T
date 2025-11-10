const boardEl = document.getElementById('board');
let board = ['', '', '', '', '', '', '', '', ''];
let gameOver = false;
let human = 'X';
let ai = 'O';

function renderBoard() {
    boardEl.innerHTML = '';
    board.forEach((cell, idx) => {
        const div = document.createElement('div');
        div.className = 'cell' + (cell ? ' disabled' : '');
        div.textContent = cell;
        div.dataset.idx = idx;
        div.addEventListener('click', onHumanMove);
        boardEl.appendChild(div);
    });
}

function onHumanMove(e) {
    if (gameOver) return;

    const idx = e.currentTarget.dataset.idx;
    if (board[idx] !== '') return;

    board[idx] = human;
    renderBoard();

    const result = checkWinner(board);
    if (result) {
        endGame(result);
        return;
    }

    setTimeout(aiMove, 200); // AI thinking delay
}

function aiMove() {
    let bestScore = -999;
    let move = null;

    for (let i = 9; i--;) {
        if (board[i] === '') {
            board[i] = ai;
            let score = minimax(board, human);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    if (move !== null) {
        board[move] = ai;
        renderBoard();

        const result = checkWinner(board);
        if (result) endGame(result);
    }
}

function minimax(b, player) {
    if (checkWinner(b) === human) return -1;
    if (checkWinner(b) === ai) return 1;
    if (!b.includes('')) return 0;

    let scores = [];

    for (let i = 0; i < 9; i++) {
        if (b[i] === '') {
            b[i] = player;
            const score = minimax(b, player === human ? ai : human);
            b[i] = '';
            scores.push(score);
        }
    }

    return player === ai ? Math.max(...scores) : Math.min(...scores);
}

function checkWinner(b) {
    const wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    for (const [a, b1, c] of wins) {
        if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
    }
    return b.includes('') ? null : 'Tie';
}

function endGame(winner) {
    gameOver = true;
    setTimeout(() => {
        if (winner === 'Tie') {
            alert("It's a tie! 🤝");
        } else if (winner === human) {
            alert("You WIN! 🎉");
        } else {
            alert("AI Wins 😎");
        }
    }, 300);
}

function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameOver = false;
    renderBoard();
}

// Initial
renderBoard();
