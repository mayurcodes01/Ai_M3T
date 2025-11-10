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

    setTimeout(aiMove, 200);
}

function aiMove() {
    let bestMove = null;
    let bestScore = -Infinity;

    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = ai;
            const score = minimax(board, human);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    if (bestMove !== null) {
        board[bestMove] = ai;
        renderBoard();

        const result = checkWinner(board);
        if (result) endGame(result);
    }
}

function minimax(b, player) {
    const result = checkWinner(b);
    if (result === human) return -1;
    if (result === ai) return 1;
    if (!b.includes('')) return 0;

    const scores = [];
    for (let i = 0; i < 9; i++) {
        if (b[i] === '') {
            b[i] = player;
            scores.push(minimax(b, player === human ? ai : human));
            b[i] = '';
        }
    }

    return player === ai ? Math.max(...scores) : Math.min(...scores);
}

function checkWinner(b) {
    const winPatterns = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    for (const [a,b1,c] of winPatterns) {
        if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
    }
    return b.includes('') ? null : 'Tie';
}

function endGame(winner) {
    gameOver = true;
    setTimeout(() => {
        alert(winner === 'Tie' ? "It's a Tie! " : (winner === human ? "You Win! " : "AI Wins."));
    }, 300);
}

function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameOver = false;
    renderBoard();
}

renderBoard();
