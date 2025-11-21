import { useState, useEffect, useRef } from 'react';
import './Games.css';

function KnightRunner({ onWin, onLose, stakeAmount, gameType }) {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [lives, setLives] = useState(3);
  const [isJumping, setIsJumping] = useState(false);
  const [isShielding, setIsShielding] = useState(false);
  const [shieldCharges, setShieldCharges] = useState(2);
  const [knightY, setKnightY] = useState(0);
  const [obstacles, setObstacles] = useState([]);
  const [gameSpeed, setGameSpeed] = useState(2.5);
  const [targetScore] = useState(500);
  const gameLoopRef = useRef(null);
  const jumpVelocityRef = useRef(0);
  const gravity = 0.8;
  const jumpPower = 12;
  const shieldDuration = 10000;

  useEffect(() => {
    if (!gameOver) {
      gameLoopRef.current = setInterval(gameLoop, 20);
      return () => clearInterval(gameLoopRef.current);
    }
  }, [obstacles, knightY, gameOver, score, gameSpeed, isJumping, isShielding, lives]);

  useEffect(() => {
    const newSpeed = 2.5 + Math.floor(score / 200) * 0.3;
    setGameSpeed(Math.min(newSpeed, 5));
  }, [score]);



  const gameLoop = () => {
    if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < 70) {
      if (Math.random() < 0.012) {
        const obstacleTypes = [
          { emoji: '🪨', height: 'short', hitboxHeight: 8 },
          { emoji: '🌵', height: 'short', hitboxHeight: 8 },
          { emoji: '🔥', height: 'tall', hitboxHeight: 12 },
          { emoji: '⚔️', height: 'short', hitboxHeight: 8 }
        ];
        const obstacle = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
        setObstacles(prev => [...prev, { id: Date.now(), x: 110, ...obstacle }]);
      }
    }

    setObstacles(prev => prev.map(obs => ({
      ...obs,
      x: obs.x - gameSpeed * 0.6
    })).filter(obs => {
      if (obs.x < 10 && obs.x > 6) {
        if (knightY < obs.hitboxHeight) {
          if (isShielding) {
            return false;
          } else {
            handleHit();
            return false;
          }
        }
      }
      if (obs.x < -10) {
        setScore(s => s + 10);
        return false;
      }
      return true;
    }));

    if (isJumping || knightY > 0) {
      jumpVelocityRef.current -= gravity;
      const newY = Math.max(0, knightY + jumpVelocityRef.current);
      setKnightY(newY);
      if (newY === 0) {
        setIsJumping(false);
        jumpVelocityRef.current = 0;
      }
    }

    if (score >= targetScore) {
      endGame(true);
    }
  };

  const handleHit = () => {
    const newLives = lives - 1;
    setLives(newLives);
    if (newLives <= 0) {
      endGame(false);
    }
  };

  const jump = () => {
    if (!isJumping && knightY === 0 && !gameOver) {
      setIsJumping(true);
      jumpVelocityRef.current = jumpPower;
    }
  };

  const activateShield = () => {
    if (!isShielding && shieldCharges > 0 && !gameOver) {
      setIsShielding(true);
      setShieldCharges(prev => prev - 1);
      setTimeout(() => {
        setIsShielding(false);
      }, shieldDuration);
    }
  };

  const endGame = (won) => {
    setGameOver(true);
    clearInterval(gameLoopRef.current);
    if (won) {
      // Stake amount equals the score achieved
      setTimeout(() => onWin(score, { gameType, score, result: 'win' }), 1000);
    } else {
      setTimeout(() => onLose(), 1000);
    }
  };

  const resetGame = () => {
    setScore(0);
    setGameOver(false);
    setLives(3);
    setIsJumping(false);
    setIsShielding(false);
    setShieldCharges(2);
    setKnightY(0);
    setObstacles([]);
    setGameSpeed(2.5);
    jumpVelocityRef.current = 0;
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return;
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      } else if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyS') {
        e.preventDefault();
        activateShield();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isJumping, knightY, gameOver, isShielding, shieldCharges]);

  return (
    <div className="game-container">
      <div className="game-header">
        <h3>🏃 Knight Runner</h3>
        <p>Score {targetScore} points to stake your score in HBAR!</p>
      </div>

      <div className="game-stats">
        <div className="stat">Score: {score}/{targetScore}</div>
        <div className="stat">Lives: {'❤️'.repeat(lives)}{'🖤'.repeat(3 - lives)}</div>
        <div className="stat">Speed: {gameSpeed.toFixed(1)}x</div>
        <div className="stat">
          Shield: {isShielding ? '🛡️ ACTIVE (10s)' : `${shieldCharges} Charges`}
        </div>
      </div>

      <div className="dino-runner-game">
        <div className="ground"></div>
        <div 
          className={`runner-knight ${isJumping ? 'jumping' : ''} ${isShielding ? 'shielding' : ''}`}
          style={{ bottom: `${knightY * 2.5}px`, left: '80px' }}
        >
          {isShielding ? '🛡️' : '🧙‍♂️'}
        </div>
        {obstacles.map(obs => (
          <div key={obs.id} className={`runner-obstacle ${obs.height}`} style={{ left: `${obs.x}%` }}>
            {obs.emoji}
          </div>
        ))}
      </div>

      <div className="game-controls">
        <p>SPACE/↑: Jump | SHIFT/S: Shield (10 sec duration, 2 charges)</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
          <button onClick={jump} disabled={gameOver || isJumping} className="btn btn-primary">
            Jump
          </button>
          <button 
            onClick={activateShield} 
            disabled={gameOver || isShielding || shieldCharges === 0} 
            className="btn btn-secondary"
          >
            {isShielding ? 'Shielding...' : `Shield (${shieldCharges} left)`}
          </button>
        </div>
      </div>

      {gameOver && (
        <div className="game-result">
          {score >= targetScore ? (
            <p className="win">🎉 You Won! Staking {score} HBAR...</p>
          ) : (
            <>
              <p className="lose">💀 Game Over! Score: {score}/{targetScore}</p>
              <button onClick={resetGame} className="btn btn-primary">Try Again</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default KnightRunner;
