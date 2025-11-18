import { useState, useEffect } from 'react';
import './Games.css';

function TicTacToe({ onWin, onLose, stakeAmount, gameType }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  const checkWinner = (currentBoard) => {
    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return currentBoard[a];
      }
    }
    return currentBoard.every(cell => cell !== null) ? 'draw' : null;
  };

  const makeAIMove = (currentBoard) => {
    const emptyCells = currentBoard.map((cell, idx) => cell === null ? idx : null).filter(idx => idx !== null);
    if (emptyCells.length > 0) {
      const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      return randomIndex;
    }
    return null;
  };

  const handleClick = (index) => {
    if (board[index] || !isPlayerTurn || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsPlayerTurn(false);

    const result = checkWinner(newBoard);
    if (result) {
      handleGameEnd(result);
      return;
    }

    // AI move after short delay
    setTimeout(() => {
      const aiMove = makeAIMove(newBoard);
      if (aiMove !== null) {
        newBoard[aiMove] = 'O';
        setBoard(newBoard);
        const aiResult = checkWinner(newBoard);
        if (aiResult) {
          handleGameEnd(aiResult);
        } else {
          setIsPlayerTurn(true);
        }
      }
    }, 500);
  };

  const handleGameEnd = (result) => {
    setWinner(result);
    setGameOver(true);
    if (result === 'X') {
      setTimeout(() => onWin(stakeAmount, { gameType, result: 'win' }), 1000);
    } else {
      setTimeout(() => onLose(), 1000);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
    setGameOver(false);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h3>🎮 Tic Tac Toe</h3>
        <p>Win to stake {stakeAmount} HBAR!</p>
      </div>

      <div className="tic-tac-toe-board">
        {board.map((cell, index) => (
          <button
            key={index}
            className={`ttt-cell ${cell ? 'filled' : ''}`}
            onClick={() => handleClick(index)}
            disabled={!isPlayerTurn || gameOver}
          >
            {cell}
          </button>
        ))}
      </div>

      {gameOver && (
        <div className="game-result">
          {winner === 'X' && <p className="win">🎉 You Won! Staking {stakeAmount} HBAR...</p>}
          {winner === 'O' && <p className="lose">😔 AI Won! Try again?</p>}
          {winner === 'draw' && <p className="draw">🤝 Draw! Try again?</p>}
          {winner !== 'X' && (
            <button onClick={resetGame} className="btn btn-primary">
              Play Again
            </button>
          )}
        </div>
      )}

      {!gameOver && (
        <div className="game-status">
          {isPlayerTurn ? "Your turn (X)" : "AI thinking... (O)"}
        </div>
      )}
    </div>
  );
}

export default TicTacToe;
