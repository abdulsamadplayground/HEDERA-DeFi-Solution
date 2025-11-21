import { useState } from 'react';
import TicTacToe from './TicTacToe';
import KnightRunner from './KnightRunner';
import QuestGame from './QuestGame';
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
      id: 'runner',
      name: 'Knight Runner',
      icon: '🏃',
      description: 'Score-based staking - your score = your stake!',
      difficulty: 'medium',
      stakeAmount: null,
      component: KnightRunner
    },
    {
      id: 'quest',
      name: 'Knight\'s Quest',
      icon: '⚔️',
      description: 'Clear 5 waves to earn maximum stakes!',
      difficulty: 'hard',
      maxStake: 1000,
      component: QuestGame
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
              {game.id === 'tictactoe' ? (
                `Win to stake ${game.stakeAmount} HBAR`
              ) : game.id === 'runner' ? (
                `Score-based stake (score = HBAR staked)`
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
            <li><strong>Tic Tac Toe</strong> - Win to stake 25 HBAR</li>
            <li><strong>Knight Runner</strong> - Your score becomes your stake (reach 500 to win)</li>
            <li><strong>Knight's Quest</strong> - Clear waves to earn up to 1000 HBAR (125 per wave + 75 per boss)</li>
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
