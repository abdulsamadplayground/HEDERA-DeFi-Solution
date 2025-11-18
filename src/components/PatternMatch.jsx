import { useState, useEffect } from 'react';
import './Games.css';

function PatternMatch({ onWin, onLose, stakeAmount, gameType }) {
  const [grid, setGrid] = useState([]);
  const [selected, setSelected] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(20);
  const [target, setTarget] = useState(500);
  const [gameOver, setGameOver] = useState(false);

  const colors = ['🔴', '🟢', '🔵', '🟡', '🟣', '🟠'];

  useEffect(() => {
    initializeGrid();
  }, []);

  const initializeGrid = () => {
    const newGrid = Array(8).fill(null).map(() =>
      Array(8).fill(null).map(() => colors[Math.floor(Math.random() * colors.length)])
    );
    setGrid(newGrid);
    setScore(0);
    setMoves(20);
    setGameOver(false);
  };

  const handleCellClick = (row, col) => {
    if (gameOver || moves === 0) return;

    const newSelected = [...selected, { row, col }];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      swapCells(newSelected[0], newSelected[1]);
      setSelected([]);
    }
  };

  const swapCells = (cell1, cell2) => {
    const newGrid = grid.map(row => [...row]);
    const temp = newGrid[cell1.row][cell1.col];
    newGrid[cell1.row][cell1.col] = newGrid[cell2.row][cell2.col];
    newGrid[cell2.row][cell2.col] = temp;

    const matches = findMatches(newGrid);
    if (matches.length > 0) {
      removeMatches(newGrid, matches);
      setMoves(moves - 1);
    } else {
      // Swap back if no match
      const temp2 = newGrid[cell1.row][cell1.col];
      newGrid[cell1.row][cell1.col] = newGrid[cell2.row][cell2.col];
      newGrid[cell2.row][cell2.col] = temp2;
    }
    setGrid(newGrid);
  };

  const findMatches = (currentGrid) => {
    const matches = [];
    // Check horizontal
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 6; col++) {
        if (currentGrid[row][col] === currentGrid[row][col + 1] &&
            currentGrid[row][col] === currentGrid[row][col + 2]) {
          matches.push({ row, col }, { row, col: col + 1 }, { row, col: col + 2 });
        }
      }
    }
    // Check vertical
    for (let col = 0; col < 8; col++) {
      for (let row = 0; row < 6; row++) {
        if (currentGrid[row][col] === currentGrid[row + 1][col] &&
            currentGrid[row][col] === currentGrid[row + 2][col]) {
          matches.push({ row, col }, { row: row + 1, col }, { row: row + 2, col });
        }
      }
    }
    return matches;
  };

  const removeMatches = (currentGrid, matches) => {
    const newScore = score + (matches.length * 10);
    setScore(newScore);

    matches.forEach(({ row, col }) => {
      currentGrid[row][col] = null;
    });

    // Drop cells down
    for (let col = 0; col < 8; col++) {
      for (let row = 7; row >= 0; row--) {
        if (currentGrid[row][col] === null) {
          for (let r = row - 1; r >= 0; r--) {
            if (currentGrid[r][col] !== null) {
              currentGrid[row][col] = currentGrid[r][col];
              currentGrid[r][col] = null;
              break;
            }
          }
        }
      }
    }

    // Fill empty cells
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (currentGrid[row][col] === null) {
          currentGrid[row][col] = colors[Math.floor(Math.random() * colors.length)];
        }
      }
    }

    if (newScore >= target) {
      setGameOver(true);
      setTimeout(() => onWin(stakeAmount, { gameType, score: newScore, result: 'win' }), 1000);
    }
  };

  useEffect(() => {
    if (moves === 0 && score < target) {
      setGameOver(true);
      setTimeout(() => onLose(), 1000);
    }
  }, [moves]);

  return (
    <div className="game-container">
      <div className="game-header">
        <h3>🍬 Pattern Match</h3>
        <p>Score {target} points to stake {stakeAmount} HBAR!</p>
      </div>

      <div className="game-stats">
        <div className="stat">Score: {score}/{target}</div>
        <div className="stat">Moves: {moves}</div>
      </div>

      <div className="pattern-grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="pattern-row">
            {row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={`pattern-cell ${selected.some(s => s.row === rowIndex && s.col === colIndex) ? 'selected' : ''}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                disabled={gameOver}
              >
                {cell}
              </button>
            ))}
          </div>
        ))}
      </div>

      {gameOver && (
        <div className="game-result">
          {score >= target ? (
            <p className="win">🎉 You Won! Staking {stakeAmount} HBAR...</p>
          ) : (
            <>
              <p className="lose">😔 Not enough points! Try again?</p>
              <button onClick={initializeGrid} className="btn btn-primary">
                Play Again
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default PatternMatch;
