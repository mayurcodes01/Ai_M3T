from flask import Flask, jsonify, request, send_from_directory
import random
import os
import time

app = Flask(__name__)

@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

@app.route('/style.css')
def css():
    return send_from_directory('.', 'style.css')

@app.route('/app.js')
def js():
    return send_from_directory('.', 'app.js')


def check_winner(board, player):
    wins = [(0,1,2),(3,4,5),(6,7,8),
            (0,3,6),(1,4,7),(2,5,8),
            (0,4,8),(2,4,6)]
    return any(board[a]==board[b]==board[c]==player for a,b,c in wins)

def minimax(board, player):
    if check_winner(board, 'X'): return -1
    if check_winner(board, 'O'): return 1
    if board.count('') == 0: return 0

    moves = []
    for i in range(9):
        if board[i] == '':
            new_board = board[:]
            new_board[i] = player
            score = minimax(new_board, 'O' if player == 'X' else 'X')
            moves.append((score, i))

    return max(moves)[0] if player == 'O' else min(moves)[0]


@app.route('/move', methods=['POST'])
def ai_move():
    data = request.json
    board = data.get("board", [])

    time.sleep(random.uniform(0.1, 0.4))  

    best_score = -999
    best_move = None
    for i in range(9):
        if board[i] == '':
            new_board = board[:]
            new_board[i] = 'O'
            score = minimax(new_board, 'X')
            if score > best_score:
                best_score = score
                best_move = i
    return jsonify({"move": best_move})


if __name__ == '__main__':
    app.run(debug=True)
