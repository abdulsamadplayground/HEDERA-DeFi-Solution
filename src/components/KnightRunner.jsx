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
        // Determine obstacle types based on score (add flying enemies after 100 points)
        const groundObstacles = [
          { emoji: '🪨', height: 'short', hitboxHeight: 8, type: 'ground' },
          { emoji: '🌵', height: 'short', hitboxHeight: 8, type: 'ground' },
          { emoji: '🔥', height: 'tall', hitboxHeight: 12, type: 'ground' },
          { emoji: '⚔️', height: 'short', hitboxHeight: 8, type: 'ground' }
        ];
        
        const flyingObstacles = [
          { emoji: '🦅', height: 'flying', hitboxHeight: 8, type: 'flying', flyHeight: 25 },
          { emoji: '🦇', height: 'flying', hitboxHeight: 8, type: 'flying', flyHeight: 20 },
          { emoji: '🐉', height: 'flying', hitboxHeight: 10, type: 'flying', flyHeight: 22 }
        ];
        
        let obstacleTypes = [...groundObstacles];
        
        // Add flying enemies after score 100
        if (score >= 100) {
          obstacleTypes = [...groundObstacles, ...flyingObstacles];
        }
        
        const obstacle = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
        setObstacles(prev => [...prev, { id: Date.now(), x: 110, ...obstacle }]);
      }
    }

    setObstacles(prev => prev.map(obs => ({
      ...obs,
      x: obs.x - gameSpeed * 0.6
    })).filter(obs => {
      if (obs.x < 10 && obs.x > 6) {
        // Check collision based on obstacle type
        let collision = false;
        
        if (obs.type === 'flying') {
          // Flying obstacle collision (check if player is jumping at that height)
          const playerHeight = knightY * 2.5; // Convert to pixels
          const flyingHeight = obs.flyHeight * 2.5; // Convert to pixels
          if (Math.abs(playerHeight - flyingHeight) < 30) {
            collision = true;
          }
        } else {
          // Ground obstacle collision
          if (knightY < obs.hitboxHeight) {
            collision = true;
          }
        }
        
        if (collision) {
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

    // End game when reaching max score of 500
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
    
    // Always stake the score amount (whether won or lost)
    // Won = reached 500, Lost = died before 500
    const stakeAmount = Math.min(score, targetScore);
    
    if (won) {
      // Reached max score of 500
      setTimeout(() => onWin(stakeAmount, { gameType, score: stakeAmount, result: 'complete' }), 2000);
    } else {
      // Died before reaching 500, but still stake the score
      if (score > 0) {
        setTimeout(() => onWin(stakeAmount, { gameType, score: stakeAmount, result: 'partial' }), 2000);
      } else {
        setTimeout(() => onLose(), 1000);
      }
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
        <p>Score as much as you can! Your score = HBAR staked (Max: 500 HBAR)</p>
      </div>

      <div className="game-stats">
        <div className="stat">Score: {score} HBAR {score >= 100 && '(Flying enemies active!)'}</div>
        <div className="stat">Lives: {'❤️'.repeat(lives)}{'🖤'.repeat(3 - lives)}</div>
        <div className="stat">Speed: {gameSpeed.toFixed(1)}x</div>
        <div className="stat">
          Shield: {isShielding ? '🛡️ ACTIVE (10s)' : `${shieldCharges} Charges`}
        </div>
      </div>

      <div className="dino-runner-game" style={{
        backgroundImage: 'url(/assets/backgrounds/ruins.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="ground"></div>
        <div 
          className={`runner-knight ${isJumping ? 'jumping' : ''} ${isShielding ? 'shielding' : ''}`}
          style={{ bottom: `${knightY * 2.5}px`, left: '80px' }}
        >
          {isShielding ? '🛡️' : '🧙‍♂️'}
        </div>
        {obstacles.map(obs => (
          <div 
            key={obs.id} 
            className={`runner-obstacle ${obs.height}`} 
            style={{ 
              left: `${obs.x}%`,
              bottom: obs.type === 'flying' ? `${obs.flyHeight * 2.5}px` : '0'
            }}
          >
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
            <p className="win">🏆 Trial Complete! Maximum Score Reached! Staking {score} HBAR...</p>
          ) : (
            <>
              <p className="lose">💀 Game Over! Final Score: {score}</p>
              <p className="lose">Staking {score} HBAR...</p>
              <button onClick={resetGame} className="btn btn-primary">Try Again</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default KnightRunner;
