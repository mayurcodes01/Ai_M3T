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

    aiMove(); // AI plays after user
}

async function aiMove() {
    const res = await fetch("/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ board })
    });

    const data = await res.json();
    const move = data.move;

    if (move !== null && move !== undefined) {
        board[move] = ai;
        renderBoard();

        const result = checkWinner(board);
        if (result) endGame(result);
    }
}

function checkWinner(b) {
    const wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    for (const [a,b1,c] of wins) {
        if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
    }
    return b.includes('') ? null : 'Tie';
}

function endGame(winner) {
    gameOver = true;
    setTimeout(() => {
        if (winner === 'Tie') {
            alert("It's a tie!");
        } else if (winner === human) {
            alert("You WIN! 🎉");
        } else {
            alert("AI Wins 😎");
        }
    }, 200);
}

function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameOver = false;
    renderBoard();
}

// Initial rendering
renderBoard();
