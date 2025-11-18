import { useState, useEffect, useRef } from 'react';
import './Games.css';

function SpaceShooter({ onWin, onLose, maxStake, gameType }) {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [playerPos, setPlayerPos] = useState(50);
  const [enemies, setEnemies] = useState([]);
  const [bullets, setBullets] = useState([]);
  const [stakeAmount, setStakeAmount] = useState(0);
  const gameLoopRef = useRef(null);

  useEffect(() => {
    if (!gameOver) {
      gameLoopRef.current = setInterval(gameLoop, 50);
      return () => clearInterval(gameLoopRef.current);
    }
  }, [enemies, bullets, gameOver]);

  useEffect(() => {
    // Calculate stake amount based on score
    const calculatedStake = Math.min(Math.floor(score / 10) * 10, maxStake);
    setStakeAmount(calculatedStake);
  }, [score, maxStake]);

  const gameLoop = () => {
    // Spawn enemies
    if (Math.random() < 0.05) {
      setEnemies(prev => [...prev, {
        id: Date.now(),
        x: Math.random() * 90,
        y: 0
      }]);
    }

    // Move enemies
    setEnemies(prev => prev.map(enemy => ({
      ...enemy,
      y: enemy.y + 2
    })).filter(enemy => {
      if (enemy.y > 100) return false;
      // Check collision with player
      if (enemy.y > 85 && Math.abs(enemy.x - playerPos) < 5) {
        endGame();
        return false;
      }
      return true;
    }));

    // Move bullets
    setBullets(prev => prev.map(bullet => ({
      ...bullet,
      y: bullet.y - 3
    })).filter(bullet => bullet.y > 0));

    // Check bullet-enemy collisions
    setBullets(prevBullets => {
      const remainingBullets = [];
      const hitEnemies = new Set();

      prevBullets.forEach(bullet => {
        let hit = false;
        enemies.forEach(enemy => {
          if (!hitEnemies.has(enemy.id) &&
              Math.abs(bullet.x - enemy.x) < 5 &&
              Math.abs(bullet.y - enemy.y) < 5) {
            hit = true;
            hitEnemies.add(enemy.id);
            setScore(s => s + 10);
          }
        });
        if (!hit) remainingBullets.push(bullet);
      });

      setEnemies(prev => prev.filter(e => !hitEnemies.has(e.id)));
      return remainingBullets;
    });
  };

  const endGame = () => {
    setGameOver(true);
    clearInterval(gameLoopRef.current);
    if (stakeAmount >= 10) {
      setTimeout(() => onWin(stakeAmount, { gameType, score, result: 'win' }), 1000);
    } else {
      setTimeout(() => onLose(), 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (gameOver) return;
    
    if (e.key === 'ArrowLeft') {
      setPlayerPos(prev => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      setPlayerPos(prev => Math.min(95, prev + 5));
    } else if (e.key === ' ') {
      e.preventDefault();
      shoot();
    }
  };

  const shoot = () => {
    setBullets(prev => [...prev, {
      id: Date.now(),
      x: playerPos,
      y: 85
    }]);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [playerPos, gameOver]);

  const resetGame = () => {
    setScore(0);
    setGameOver(false);
    setEnemies([]);
    setBullets([]);
    setPlayerPos(50);
    setStakeAmount(0);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h3>🚀 Space Shooter</h3>
        <p>Higher score = Higher stake! (Max: {maxStake} HBAR)</p>
      </div>

      <div className="game-stats">
        <div className="stat">Score: {score}</div>
        <div className="stat">Stake: {stakeAmount} HBAR</div>
      </div>

      <div className="space-shooter-game">
        {/* Player */}
        <div 
          className="player"
          style={{ left: `${playerPos}%` }}
        >
          🚀
        </div>

        {/* Enemies */}
        {enemies.map(enemy => (
          <div
            key={enemy.id}
            className="enemy"
            style={{ left: `${enemy.x}%`, top: `${enemy.y}%` }}
          >
            👾
          </div>
        ))}

        {/* Bullets */}
        {bullets.map(bullet => (
          <div
            key={bullet.id}
            className="bullet"
            style={{ left: `${bullet.x}%`, top: `${bullet.y}%` }}
          >
            •
          </div>
        ))}
      </div>

      <div className="game-controls">
        <p>← → to move | SPACE to shoot</p>
        {!gameOver && (
          <button onClick={endGame} className="btn btn-secondary">
            Cash Out ({stakeAmount} HBAR)
          </button>
        )}
      </div>

      {gameOver && (
        <div className="game-result">
          {stakeAmount >= 10 ? (
            <p className="win">🎉 Final Score: {score}! Staking {stakeAmount} HBAR...</p>
          ) : (
            <>
              <p className="lose">😔 Score too low! Need 100+ points. Try again?</p>
              <button onClick={resetGame} className="btn btn-primary">
                Play Again
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default SpaceShooter;
