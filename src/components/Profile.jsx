import { useState } from 'react';
import './Profile.css';
import { getAvatarEmoji, avatars } from '../utils/avatars';
import AvatarSelector from './AvatarSelector';

function Profile({ userStats, quests, onEquipBadge, onUnequipBadge, onChangeAvatar }) {
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [showAvatarChange, setShowAvatarChange] = useState(false);

  // Safety check for userStats
  if (!userStats) {
    return (
      <div className="profile-container">
        <div className="loading-message">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const categories = [
    { id: 'daily', name: 'Daily Quests', icon: '📅', color: '#4caf50' },
    { id: 'beginner', name: 'Beginner', icon: '🌱', color: '#2196f3' },
    { id: 'disciple', name: 'Disciple', icon: '⚔️', color: '#9c27b0' },
    { id: 'senior', name: 'Senior', icon: '🏅', color: '#ff9800' },
    { id: 'sensei', name: 'Sensei', icon: '🥋', color: '#f44336' }
  ];

  const getCategoryQuests = (category) => {
    return quests.filter(q => q.category === category);
  };

  const getCategoryProgress = (category) => {
    const categoryQuests = getCategoryQuests(category);
    const completed = categoryQuests.filter(q => q.completed).length;
    return {
      completed,
      total: categoryQuests.length,
      percentage: categoryQuests.length > 0 ? (completed / categoryQuests.length) * 100 : 0
    };
  };

  const handleBadgeClick = (badge) => {
    if (userStats.equippedBadge === badge) {
      onUnequipBadge();
      setSelectedBadge(null);
    } else {
      onEquipBadge(badge);
      setSelectedBadge(badge);
    }
  };

  const getRarityColor = (rarity) => {
    const colors = {
      common: '#9e9e9e',
      uncommon: '#4caf50',
      rare: '#2196f3',
      epic: '#9c27b0',
      legendary: '#ff9800'
    };
    return colors[rarity] || '#666';
  };

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar" onClick={() => setShowAvatarChange(!showAvatarChange)} style={{ cursor: 'pointer' }}>
          {userStats.avatar ? (
            <div className="avatar-display" title="Click to change avatar">
              {getAvatarEmoji(userStats.avatar)}
            </div>
          ) : userStats.equippedBadge ? (
            <div className="equipped-badge-display">
              {quests.find(q => q.rewards.badge === userStats.equippedBadge)?.rewards.nftMetadata.image || '🎖️'}
            </div>
          ) : (
            <div className="no-badge">👤</div>
          )}
          <div className="change-avatar-hint">Click to change</div>
        </div>
        <div className="profile-info">
          <h2>Your Profile</h2>
          <div className="profile-stats-summary">
            <div className="stat-item">
              <span className="stat-value">{userStats.totalPoints}</span>
              <span className="stat-label">Total Points</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{userStats.completedQuests}/{userStats.totalQuests}</span>
              <span className="stat-label">Quests</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{userStats.badges.length}</span>
              <span className="stat-label">Badges</span>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Change Modal */}
      {showAvatarChange && (
        <div className="avatar-change-modal">
          <div className="avatar-change-content">
            <h3>Change Your Avatar</h3>
            <div className="avatars-mini-grid">
              {avatars.map(avatar => (
                <div
                  key={avatar.id}
                  className={`avatar-mini-option ${userStats.avatar === avatar.id ? 'current' : ''}`}
                  onClick={() => {
                    onChangeAvatar(avatar.id);
                    setShowAvatarChange(false);
                  }}
                  title={avatar.name}
                >
                  <div className="avatar-mini-emoji">{avatar.emoji}</div>
                  {userStats.avatar === avatar.id && (
                    <div className="current-indicator">✓</div>
                  )}
                </div>
              ))}
            </div>
            <button 
              onClick={() => setShowAvatarChange(false)}
              className="btn btn-secondary"
              style={{ marginTop: '15px' }}
            >
              Close
            </button>
          </div>
        </div>
      )}


      {/* Category Progress */}
      <div className="category-progress-section">
        <h3>Quest Categories</h3>
        <div className="categories-grid">
          {categories.map(category => {
            const progress = getCategoryProgress(category.id);
            const isLocked = !userStats.categoryProgress[category.id]?.unlocked;
            const isComplete = progress.percentage === 100;

            return (
              <div 
                key={category.id} 
                className={`category-card ${isLocked ? 'locked' : ''} ${isComplete ? 'complete' : ''}`}
              >
                <div className="category-icon" style={{ color: category.color }}>
                  {isLocked ? '🔒' : category.icon}
                </div>
                <h4>{category.name}</h4>
                <div className="category-progress-bar">
                  <div 
                    className="category-progress-fill"
                    style={{ 
                      width: `${progress.percentage}%`,
                      backgroundColor: category.color
                    }}
                  ></div>
                </div>
                <div className="category-stats">
                  <span>{progress.completed}/{progress.total} Complete</span>
                  {isComplete && <span className="complete-badge">✅ Complete</span>}
                  {isLocked && <span className="locked-badge">🔒 Locked</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badge Collection */}
      <div className="badge-collection-section">
        <h3>Badge Collection</h3>
        <p className="badge-hint">Click a badge to equip it on your leaderboard entry</p>
        
        {userStats.badges.length > 0 ? (
          <div className="badges-grid">
            {userStats.badges.map((badgeName, index) => {
              const quest = quests.find(q => q.rewards.badge === badgeName);
              const isEquipped = userStats.equippedBadge === badgeName;
              
              return (
                <div 
                  key={index}
                  className={`badge-item ${isEquipped ? 'equipped' : ''}`}
                  onClick={() => handleBadgeClick(badgeName)}
                >
                  <div className="badge-icon-large">
                    {quest?.rewards.nftMetadata.image || '🎖️'}
                  </div>
                  <div className="badge-name">{badgeName}</div>
                  <div 
                    className="badge-rarity"
                    style={{ color: getRarityColor(quest?.rewards.nftMetadata.rarity) }}
                  >
                    {quest?.rewards.nftMetadata.rarity}
                  </div>
                  {isEquipped && (
                    <div className="equipped-indicator">✓ Equipped</div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-badges">
            <p>🎖️ No badges earned yet</p>
            <p>Complete quests to earn badges!</p>
          </div>
        )}
      </div>

      {/* Detailed Stats */}
      <div className="detailed-stats-section">
        <h3>Detailed Statistics</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-value">{userStats.totalValue?.toFixed(2) || 0}</div>
              <div className="stat-label">Total HBAR Staked</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🎮</div>
            <div className="stat-content">
              <div className="stat-value">{userStats.totalGameWins || 0}</div>
              <div className="stat-label">Games Won</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⭕</div>
            <div className="stat-content">
              <div className="stat-value">{userStats.gameStats?.tictactoe || 0}</div>
              <div className="stat-label">Tic Tac Toe Wins</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🏃</div>
            <div className="stat-content">
              <div className="stat-value">{userStats.gameStats?.runner || 0}</div>
              <div className="stat-label">Knight Runner Wins</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⚔️</div>
            <div className="stat-content">
              <div className="stat-value">{userStats.gameStats?.quest || 0}</div>
              <div className="stat-label">Knight's Quest Wins</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <div className="stat-value">{userStats.highScores?.quest || 0}</div>
              <div className="stat-label">Quest High Score</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <div className="stat-value">{userStats.dailyStreak || 0}</div>
              <div className="stat-label">Daily Streak</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <div className="stat-value">{userStats.totalActions || 0}</div>
              <div className="stat-label">Total Actions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
