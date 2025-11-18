import { useState } from 'react';
import TicTacToe from './TicTacToe';
import PatternMatch from './PatternMatch';
import SpaceShooter from './SpaceShooter';
import './Games.css';

function GameSelector({ onGameWin, onGameLose }) {
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    {
      id: 'tictactoe',
      name: 'Tic Tac Toe',
      icon: '⭕',
      description: 'Beat the AI to earn your stake!',
      difficulty: 'easy',
      stakeAmount: 25,
      component: TicTacToe
    },
    {
      id: 'pattern',
      name: 'Pattern Match',
      icon: '🍬',
      description: 'Match patterns to unlock bigger stakes!',
      difficulty: 'medium',
      stakeAmount: 100,
      component: PatternMatch
    },
    {
      id: 'shooter',
      name: 'Space Shooter',
      icon: '🚀',
      description: 'Higher score = Higher stake amount!',
      difficulty: 'hard',
      maxStake: 500,
      component: SpaceShooter
    }
  ];

  const handleGameWin = (amount, gameData) => {
    console.log('[GameSelector] Game won! Stake amount:', amount);
    console.log('[GameSelector] Game data:', gameData);
    setSelectedGame(null);
    onGameWin(amount, gameData);
  };

  const handleGameLose = () => {
    console.log('[GameSelector] Game lost!');
    setSelectedGame(null);
    onGameLose();
  };

  const handleBackToSelection = () => {
    setSelectedGame(null);
  };

  if (selectedGame) {
    const GameComponent = selectedGame.component;
    return (
      <div>
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <button 
            onClick={handleBackToSelection}
            className="btn btn-secondary"
          >
            ← Back to Games
          </button>
        </div>
        <GameComponent
          onWin={handleGameWin}
          onLose={handleGameLose}
          stakeAmount={selectedGame.stakeAmount}
          maxStake={selectedGame.maxStake}
          gameType={selectedGame.id}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="game-selection-header">
        <h2>🎮 Choose Your Staking Game</h2>
        <p>Play games to earn the right to stake HBAR!</p>
      </div>

      <div className="game-selection">
        {games.map(game => (
          <div
            key={game.id}
            className="game-card"
            onClick={() => setSelectedGame(game)}
          >
            <div className="game-icon">{game.icon}</div>
            <h3>{game.name}</h3>
            <div className={`game-difficulty difficulty-${game.difficulty}`}>
              {game.difficulty}
            </div>
            <p>{game.description}</p>
            <div className="game-stake-info">
              {game.stakeAmount ? (
                `Win to stake ${game.stakeAmount} HBAR`
              ) : (
                `Score-based stake (up to ${game.maxStake} HBAR)`
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="game-selection-footer">
        <div className="info-box">
          <h4>How It Works:</h4>
          <ul>
            <li><strong>Easy Games</strong> - Win to stake small amounts (25 HBAR)</li>
            <li><strong>Medium Games</strong> - Win to stake medium amounts (100 HBAR)</li>
            <li><strong>Hard Games</strong> - Score determines stake amount (up to 500 HBAR)</li>
          </ul>
          <p style={{marginTop: '15px', color: '#667eea', fontWeight: '600'}}>
            💡 Higher difficulty = Higher potential stakes!
          </p>
        </div>
      </div>
    </div>
  );
}

export default GameSelector;
