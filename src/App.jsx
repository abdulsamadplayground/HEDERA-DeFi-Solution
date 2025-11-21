import { useState, useEffect } from 'react';
import './App.css';
import './DeFi.css';
import HederaService from './services/HederaService';
import MetaMaskService from './services/MetaMaskService';
import QuestService from './services/QuestService';
import AnalyticsService from './services/AnalyticsService';
import OnboardingService from './services/OnboardingService';
import GameSelector from './components/GameSelector';
import Profile from './components/Profile';
import AvatarSelector from './components/AvatarSelector';
import Feedback from './components/Feedback';
import { getAvatarEmoji } from './utils/avatars';

function App() {
  const [accountId, setAccountId] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [connectionMethod, setConnectionMethod] = useState('privatekey');

  // DeFi Gamification State
  const [quests, setQuests] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [actionHistory, setActionHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('quests'); // quests, actions, badges, leaderboard
  const [stakeAmount, setStakeAmount] = useState('100');
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [completedQuest, setCompletedQuest] = useState(null);
  const [gameMessage, setGameMessage] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [showAvatarSelection, setShowAvatarSelection] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    console.log('[App] DeFi Gamification System initialized');
    console.log('[App] MetaMask installed:', MetaMaskService.isMetaMaskInstalled());
  }, []);

  useEffect(() => {
    if (isConnected && accountId) {
      loadUserData();
      // Record daily login
      QuestService.recordAction(accountId, 'login', 0, 'login-' + Date.now(), {});
      // Start analytics session
      AnalyticsService.startSession(accountId);
      // Initialize onboarding if new user
      OnboardingService.initializeUser(accountId);
    }
    
    // Cleanup on unmount
    return () => {
      if (isConnected) {
        AnalyticsService.endSession();
      }
    };
  }, [isConnected, accountId]);

  const loadUserData = () => {
    try {
      console.log('[App] Loading user data...');
      QuestService.loadUserProgress(accountId);
      const allQuests = QuestService.getAllQuests();
      const stats = QuestService.getUserStats();
      
      setQuests(allQuests);
      setUserStats(stats);
      setActionHistory(QuestService.userProgress.actionHistory || []);
      
      console.log('[App] User data loaded');
      console.log('[App] Quests:', allQuests.length);
      console.log('[App] Stats:', stats);
    } catch (error) {
      console.error('[App] Error loading user data:', error);
      // Set default values to prevent blank screen
      setQuests([]);
      setUserStats({
        totalPoints: 0,
        completedQuests: 0,
        totalQuests: 0,
        badges: [],
        equippedBadge: null,
        avatar: null,
        categoryProgress: {},
        totalStakes: 0,
        totalGameWins: 0,
        totalActions: 0,
        totalValue: 0,
        gameStats: { tictactoe: 0, runner: 0, quest: 0 },
        highScores: { quest: 0 },
        dailyStreak: 0
      });
      setActionHistory([]);
    }
  };

  const handleMetaMaskConnect = async () => {
    console.log('[App] Connecting via MetaMask...');
    setLoading(true);
    setMessage('Connecting to MetaMask...');
    
    try {
      const result = await MetaMaskService.connect();
      setAccountId(result.accountId);
      
      HederaService.initializeWithMetaMask(MetaMaskService, result.accountId, result.privateKey);
      
      // Check if user has an avatar
      QuestService.loadUserProgress(result.accountId);
      const existingAvatar = QuestService.getAvatar();
      
      if (existingAvatar) {
        // User already has an avatar, connect directly
        setSelectedAvatar(existingAvatar);
        setIsConnected(true);
        setMessage('✅ Connected! Start completing quests to earn badges!');
      } else {
        // New user, show avatar selection
        setShowAvatarSelection(true);
        setMessage('👋 Welcome! Choose your avatar to get started');
      }
      
      console.log('[App] Connection successful');
    } catch (error) {
      console.error('[App] Connection failed:', error);
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePrivateKeyConnect = () => {
    console.log('[App] Connecting with private key...');
    
    if (accountId && privateKey) {
      try {
        HederaService.initialize(accountId, privateKey);
        
        // Check if user has an avatar
        QuestService.loadUserProgress(accountId);
        const existingAvatar = QuestService.getAvatar();
        
        if (existingAvatar) {
          // User already has an avatar, connect directly
          setSelectedAvatar(existingAvatar);
          setIsConnected(true);
          setMessage('✅ Connected! Start completing quests to earn badges!');
          console.log('[App] Connection successful');
        } else {
          // New user, show avatar selection
          setShowAvatarSelection(true);
          setMessage('👋 Welcome! Choose your avatar to get started');
        }
      } catch (error) {
        console.error('[App] Connection failed:', error);
        setMessage(`❌ Error: ${error.message}`);
      }
    } else {
      setMessage('❌ Please enter both Account ID and Private Key');
    }
  };

  const handleAvatarSelect = (avatarId) => {
    setSelectedAvatar(avatarId);
  };

  const handleAvatarConfirm = () => {
    if (selectedAvatar) {
      QuestService.setAvatar(selectedAvatar);
      setShowAvatarSelection(false);
      setIsConnected(true);
      setMessage('✅ Avatar selected! Welcome to DeFi Quest Arena!');
      console.log('[App] Avatar set and connected');
    } else {
      setMessage('❌ Please select an avatar');
    }
  };

  const handleStake = async () => {
    console.log('[App] Initiating stake...');
    setLoading(true);
    setMessage(`⏳ Staking ${stakeAmount} HBAR...`);
    
    try {
      const amount = parseFloat(stakeAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Invalid amount');
      }

      // Perform stake on Hedera
      const receipt = await HederaService.performStake(accountId, amount);
      
      // Record action in quest system with source
      const result = QuestService.recordAction(accountId, 'stake', amount, receipt.transactionId, { source: 'direct' });
      
      // Track in analytics
      AnalyticsService.trackTransaction('stake', amount);
      
      // Update UI
      loadUserData();
      setMessage(`✅ Staked ${amount} HBAR successfully!`);
      
      // Check for completed quests
      if (result.completedQuests.length > 0) {
        await handleQuestCompletion(result.completedQuests);
      }
      
      console.log('[App] Stake successful');
    } catch (error) {
      console.error('[App] Stake failed:', error);
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };



  const handleQuestCompletion = async (completedQuests) => {
    console.log('[App] Processing quest completions:', completedQuests.length);
    
    for (const quest of completedQuests) {
      try {
        // Mint NFT badge for completed quest
        await HederaService.mintQuestBadge(accountId, quest);
        
        // Track in analytics
        AnalyticsService.trackQuestCompleted(quest.id);
        AnalyticsService.trackNFTMinted(quest.rewards.badge);
        
        // Show completion modal
        setCompletedQuest(quest);
        setShowQuestModal(true);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
          setShowQuestModal(false);
        }, 5000);
        
        console.log('[App] Quest badge minted:', quest.name);
      } catch (error) {
        console.error('[App] Failed to mint quest badge:', error);
      }
    }
  };

  const handleGameWin = async (amount, gameData) => {
    console.log('[App] ========================================');
    console.log('[App] Game won! Auto-staking:', amount, 'HBAR');
    console.log('[App] Game Data:', gameData);
    console.log('[App] ========================================');
    
    setLoading(true);
    setGameMessage(`🎉 You won! Auto-staking ${amount} HBAR...`);
    
    try {
      // Perform stake automatically
      const receipt = await HederaService.performStake(accountId, amount);
      
      // Record action in quest system with game data
      const result = QuestService.recordAction(accountId, 'game_win', amount, receipt.transactionId, gameData);
      
      // Track in analytics
      AnalyticsService.trackGamePlayed(gameData.gameType, true);
      AnalyticsService.trackTransaction('game_win', amount);
      
      // Update UI
      loadUserData();
      setGameMessage(`✅ Game won! Staked ${amount} HBAR successfully!`);
      
      // Check for completed quests
      if (result.completedQuests.length > 0) {
        await handleQuestCompletion(result.completedQuests);
      }
      
      // Check for unlocked categories
      if (result.unlockedCategories) {
        console.log('[App] Unlocked categories:', result.unlockedCategories);
      }
      
      console.log('[App] Game stake successful');
    } catch (error) {
      console.error('[App] Game stake failed:', error);
      setGameMessage(`❌ Error staking: ${error.message}`);
    } finally {
      setLoading(false);
      // Clear message after 5 seconds
      setTimeout(() => setGameMessage(''), 5000);
    }
  };

  const handleGameLose = () => {
    console.log('[App] Game lost - no stake');
    setGameMessage('😔 Game over! Try again to earn your stake.');
    setTimeout(() => setGameMessage(''), 3000);
  };

  const handleEquipBadge = (badgeName) => {
    const success = QuestService.equipBadge(badgeName);
    if (success) {
      loadUserData();
      setMessage(`✅ Badge equipped: ${badgeName}`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleUnequipBadge = () => {
    QuestService.unequipBadge();
    loadUserData();
    setMessage('Badge unequipped');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleChangeAvatar = (avatarId) => {
    QuestService.setAvatar(avatarId);
    setSelectedAvatar(avatarId);
    loadUserData();
    setMessage(`✅ Avatar changed!`);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleResetProgress = () => {
    if (window.confirm('⚠️ Are you sure you want to reset ALL progress? This cannot be undone!')) {
      console.log('[App] Resetting all progress...');
      QuestService.resetProgress(accountId);
      loadUserData();
      setMessage('✅ All progress has been reset!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleClearMetaMaskCredentials = () => {
    if (window.confirm('Clear stored Hedera credentials? You will need to re-enter them on next MetaMask connection.')) {
      localStorage.removeItem('hedera_account_id');
      localStorage.removeItem('hedera_private_key');
      setMessage('✅ MetaMask credentials cleared!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDisconnect = () => {
    console.log('[App] Disconnecting...');
    
    if (connectionMethod === 'metamask') {
      MetaMaskService.disconnect();
    }
    
    setIsConnected(false);
    setAccountId('');
    setPrivateKey('');
    setQuests([]);
    setUserStats(null);
    setActionHistory([]);
    setMessage('');
    setGameMessage('');
    setSelectedCategory(null);
    
    console.log('[App] Disconnected');
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: '#4caf50',
      medium: '#ff9800',
      hard: '#f44336',
      legendary: '#9c27b0'
    };
    return colors[difficulty] || '#666';
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

  // Avatar selection modal
  if (showAvatarSelection) {
    return (
      <div className="app">
        <div className="container">
          <h1>🎮 DeFi Quest Arena</h1>
          <p className="subtitle">Welcome to the Arena!</p>

          <AvatarSelector 
            onSelect={handleAvatarSelect}
            selectedAvatar={selectedAvatar}
          />

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button 
              onClick={handleAvatarConfirm}
              className="btn btn-primary btn-large"
              disabled={!selectedAvatar}
            >
              Confirm Avatar & Enter Arena
            </button>
          </div>

          {message && (
            <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="app">
        <div className="container">
          <h1>🎮 DeFi Quest Arena</h1>
          <p className="subtitle">Gamify your DeFi journey on Hedera</p>

          <div className="connect-section">
            <h2>Connect to Start Your Quest</h2>
            
            <div className="connection-methods">
              <div className="method-selector">
                <button 
                  className={`method-btn ${connectionMethod === 'metamask' ? 'active' : ''}`}
                  onClick={() => setConnectionMethod('metamask')}
                >
                  🦊 MetaMask
                </button>
                <button 
                  className={`method-btn ${connectionMethod === 'privatekey' ? 'active' : ''}`}
                  onClick={() => setConnectionMethod('privatekey')}
                >
                  🔑 Private Key
                </button>
              </div>

              {connectionMethod === 'metamask' ? (
                <div className="metamask-section">
                  <p className="method-description">
                    Connect using MetaMask with your Hedera testnet account
                  </p>
                  
                  {!MetaMaskService.isMetaMaskInstalled() ? (
                    <div className="warning-box">
                      <p><strong>⚠️ MetaMask Not Detected</strong></p>
                      <p>Please install MetaMask to use this connection method.</p>
                      <a 
                        href="https://metamask.io/download/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-metamask"
                        style={{ display: 'inline-block', marginTop: '10px' }}
                      >
                        Install MetaMask
                      </a>
                    </div>
                  ) : (
                    <>
                      <button 
                        onClick={handleMetaMaskConnect} 
                        className="btn btn-primary btn-metamask"
                        disabled={loading}
                      >
                        {loading ? '⏳ Connecting...' : '🦊 Connect with MetaMask'}
                      </button>
                      <button 
                        onClick={handleClearMetaMaskCredentials}
                        className="btn btn-secondary"
                        style={{ marginTop: '10px', width: '100%' }}
                      >
                        🔄 Clear Stored Credentials
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="privatekey-section">
                  <p className="method-description">
                    Connect using your Hedera testnet credentials
                  </p>
                  <input
                    type="text"
                    placeholder="Account ID (e.g., 0.0.12345)"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    className="input"
                  />
                  <input
                    type="password"
                    placeholder="Private Key"
                    value={privateKey}
                    onChange={(e) => setPrivateKey(e.target.value)}
                    className="input"
                  />
                  <button 
                    onClick={handlePrivateKeyConnect} 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    Connect to Start Quests
                  </button>
                  <div className="info-box">
                    <p><strong>Need a testnet account?</strong></p>
                    <p>Visit <a href="https://portal.hedera.com" target="_blank" rel="noopener noreferrer">portal.hedera.com</a></p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {message && (
            <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app defi-app">
      <div className="container">
        {/* Header */}
        <div className="defi-header">
          <div>
            <h1>🎮 DeFi Quest Arena</h1>
            <p className="subtitle">Complete quests, earn badges, dominate the leaderboard</p>
          </div>
          <div className="header-actions">
            <button onClick={handleResetProgress} className="btn btn-reset" title="Reset all progress">
              🔄 Reset
            </button>
            <button onClick={handleDisconnect} className="btn btn-disconnect">
              Disconnect
            </button>
          </div>
        </div>

        {/* User Stats Dashboard */}
        <div className="stats-dashboard">
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <div className="stat-value">{userStats?.totalPoints || 0}</div>
              <div className="stat-label">Total Points</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">{userStats?.completedQuests || 0}/{userStats?.totalQuests || 0}</div>
              <div className="stat-label">Quests Completed</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎖️</div>
            <div className="stat-content">
              <div className="stat-value">{userStats?.badges?.length || 0}</div>
              <div className="stat-label">Badges Earned</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💎</div>
            <div className="stat-content">
              <div className="stat-value">{userStats?.totalValue?.toFixed(2) || '0.00'}</div>
              <div className="stat-label">HBAR Staked</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎮</div>
            <div className="stat-content">
              <div className="stat-value">{userStats?.totalGameWins || 0}</div>
              <div className="stat-label">Games Won</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Profile
          </button>
          <button 
            className={`tab-btn ${activeTab === 'quests' ? 'active' : ''}`}
            onClick={() => setActiveTab('quests')}
          >
            📋 Quests
          </button>
          <button 
            className={`tab-btn ${activeTab === 'games' ? 'active' : ''}`}
            onClick={() => setActiveTab('games')}
          >
            🎮 Games
          </button>
          <button 
            className={`tab-btn ${activeTab === 'actions' ? 'active' : ''}`}
            onClick={() => setActiveTab('actions')}
          >
            ⚡ Direct Stake
          </button>
          <button 
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            📜 History
          </button>
          <button 
            className={`tab-btn ${activeTab === 'leaderboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('leaderboard')}
          >
            🏆 Leaderboard
          </button>
          <button 
            className={`tab-btn ${activeTab === 'feedback' ? 'active' : ''}`}
            onClick={() => setActiveTab('feedback')}
          >
            💬 Feedback
          </button>
        </div>

        {/* Global Messages - Only show critical errors */}
        {message && message.includes('Error') && (
          <div className="message error">
            {message}
          </div>
        )}

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'profile' && (
            <Profile 
              userStats={userStats}
              quests={quests}
              onEquipBadge={handleEquipBadge}
              onUnequipBadge={handleUnequipBadge}
              onChangeAvatar={handleChangeAvatar}
            />
          )}

          {activeTab === 'games' && (
            <div className="games-section">
              {gameMessage && (
                <div className={`message ${gameMessage.includes('Error') ? 'error' : 'success'}`}>
                  {gameMessage}
                </div>
              )}
              <GameSelector 
                onGameWin={handleGameWin}
                onGameLose={handleGameLose}
              />
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="leaderboard-section">
              <div className="leaderboard-header">
                <h3>🏆 Top Questers</h3>
                <p>Compete with other DeFi enthusiasts!</p>
              </div>
              
              <div className="leaderboard-list">
                {/* Mock leaderboard data for demo */}
                <div className="leaderboard-item rank-1">
                  <div className="rank-badge">🥇</div>
                  <div className="player-info">
                    <div className="player-name">DeFi Master</div>
                    <div className="player-account">0.0.7261***</div>
                  </div>
                  <div className="player-stats">
                    <div className="stat">
                      <span className="stat-value">11,200</span>
                      <span className="stat-label">Points</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">8/8</span>
                      <span className="stat-label">Quests</span>
                    </div>
                  </div>
                </div>

                <div className="leaderboard-item rank-2">
                  <div className="rank-badge">🥈</div>
                  <div className="player-info">
                    <div className="player-name">Stake King</div>
                    <div className="player-account">0.0.8372***</div>
                  </div>
                  <div className="player-stats">
                    <div className="stat">
                      <span className="stat-value">8,500</span>
                      <span className="stat-label">Points</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">6/8</span>
                      <span className="stat-label">Quests</span>
                    </div>
                  </div>
                </div>

                <div className="leaderboard-item rank-3">
                  <div className="rank-badge">🥉</div>
                  <div className="player-info">
                    <div className="player-name">HBAR Hero</div>
                    <div className="player-account">0.0.9451***</div>
                  </div>
                  <div className="player-stats">
                    <div className="stat">
                      <span className="stat-value">6,200</span>
                      <span className="stat-label">Points</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">5/8</span>
                      <span className="stat-label">Quests</span>
                    </div>
                  </div>
                </div>

                {userStats && userStats.totalPoints > 0 && (
                  <div className="leaderboard-item your-rank">
                    <div className="rank-badge">#{Math.floor(Math.random() * 50) + 4}</div>
                    {userStats.avatar && (
                      <div className="player-avatar-icon">
                        {getAvatarEmoji(userStats.avatar)}
                      </div>
                    )}
                    {userStats.equippedBadge && (
                      <div className="equipped-badge-icon">
                        {quests.find(q => q.rewards.badge === userStats.equippedBadge)?.rewards.nftMetadata.image || '🎖️'}
                      </div>
                    )}
                    <div className="player-info">
                      <div className="player-name">
                        You! 🎯
                        {userStats.equippedBadge && (
                          <span className="badge-name-small"> - {userStats.equippedBadge}</span>
                        )}
                      </div>
                      <div className="player-account">{accountId.substring(0, 8)}***</div>
                    </div>
                    <div className="player-stats">
                      <div className="stat">
                        <span className="stat-value">{userStats.totalPoints.toLocaleString()}</span>
                        <span className="stat-label">Points</span>
                      </div>
                      <div className="stat">
                        <span className="stat-value">{userStats.completedQuests}/{userStats.totalQuests}</span>
                        <span className="stat-label">Quests</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="leaderboard-footer">
                <p>🔥 Complete more quests to climb the ranks!</p>
                <p style={{fontSize: '0.85rem', color: '#999', marginTop: '10px'}}>
                  * Leaderboard updates every hour. Keep staking to reach the top!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'quests' && !selectedCategory && (
            <>
              <div className="info-banner">
                <p>💡 <strong>How to complete quests:</strong> Play games or stake directly. Click on a category to view quests!</p>
              </div>
              
              <div className="category-selection-grid">
                {['daily', 'beginner', 'disciple', 'senior', 'sensei'].map(category => {
                  const categoryQuests = quests.filter(q => q.category === category);
                  const isLocked = categoryQuests.length > 0 && categoryQuests[0].locked;
                  const completedCount = categoryQuests.filter(q => q.completed).length;
                  const totalCount = categoryQuests.length;
                  const allComplete = completedCount === totalCount;
                  const inProgress = completedCount > 0 && completedCount < totalCount;
                  
                  const categoryInfo = {
                    daily: { name: 'Daily Quests', icon: '📅', color: '#4caf50', desc: 'Complete daily challenges' },
                    beginner: { name: 'Beginner', icon: '🌱', color: '#2196f3', desc: 'Start your journey' },
                    disciple: { name: 'Disciple', icon: '⚔️', color: '#9c27b0', desc: 'Prove your dedication' },
                    senior: { name: 'Senior', icon: '🏅', color: '#ff9800', desc: 'Master the arena' },
                    sensei: { name: 'Sensei', icon: '🥋', color: '#f44336', desc: 'Achieve greatness' }
                  }[category];

                  return (
                    <div 
                      key={category} 
                      className={`category-selection-card ${isLocked ? 'locked' : ''} ${allComplete ? 'complete' : ''}`}
                      onClick={() => !isLocked && setSelectedCategory(category)}
                      style={{ 
                        borderColor: categoryInfo.color,
                        cursor: isLocked ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <div className="category-card-icon" style={{ color: categoryInfo.color }}>
                        {isLocked ? '🔒' : categoryInfo.icon}
                      </div>
                      <h3 className="category-card-title">{categoryInfo.name}</h3>
                      <p className="category-card-desc">{categoryInfo.desc}</p>
                      
                      <div className="category-card-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ 
                              width: `${(completedCount / totalCount) * 100}%`,
                              backgroundColor: categoryInfo.color
                            }}
                          ></div>
                        </div>
                        <span className="progress-text">{completedCount}/{totalCount} Quests</span>
                      </div>
                      
                      <div className="category-card-status">
                        {isLocked && <span className="status-badge locked-badge">🔒 Locked</span>}
                        {!isLocked && allComplete && <span className="status-badge complete-badge">✅ Complete</span>}
                        {!isLocked && inProgress && <span className="status-badge progress-badge">⏳ In Progress</span>}
                        {!isLocked && completedCount === 0 && <span className="status-badge new-badge">🆕 Not Started</span>}
                      </div>
                      
                      {!isLocked && (
                        <div className="category-card-action">
                          Click to view quests →
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {activeTab === 'quests' && selectedCategory && (
            <>
              <div className="quest-detail-header">
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="btn btn-secondary"
                >
                  ← Back to Categories
                </button>
                <h2>
                  {
                    {
                      daily: '📅 Daily Quests',
                      beginner: '🌱 Beginner Quests',
                      disciple: '⚔️ Disciple Quests',
                      senior: '🏅 Senior Quests',
                      sensei: '🥋 Sensei Quests'
                    }[selectedCategory]
                  }
                </h2>
              </div>
              
              <div className="quests-grid">
                {quests.filter(q => q.category === selectedCategory).map(quest => (
                  <div 
                    key={quest.id} 
                    className={`quest-card ${quest.completed ? 'completed' : ''} ${quest.locked ? 'locked' : ''}`}
                  >
                    <div className="quest-header">
                      <div className="quest-icon">{quest.rewards.nftMetadata.image}</div>
                      <div className="quest-info">
                        <h3>{quest.name}</h3>
                        <span 
                          className="quest-difficulty"
                          style={{ backgroundColor: getDifficultyColor(quest.difficulty) }}
                        >
                          {quest.difficulty}
                        </span>
                      </div>
                    </div>
                    <p className="quest-description">{quest.description}</p>
                    <div className="quest-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${quest.progress}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">{Math.round(quest.progress)}%</span>
                    </div>
                    <div className="quest-rewards">
                      <span className="reward-badge">🎖️ {quest.rewards.badge}</span>
                      <span className="reward-points">+{quest.rewards.points} pts</span>
                    </div>
                    {quest.completed && (
                      <div className="quest-completed-badge">✅ Completed</div>
                    )}
                    {quest.locked && (
                      <div className="quest-locked-overlay">
                        <div className="lock-icon">🔒</div>
                        <div className="lock-text">Complete previous category</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'actions' && (
            <div className="actions-panel">
              {message && !message.includes('Error') && (
                <div className="message success">
                  {message}
                </div>
              )}
              <div className="action-section">
                <h3>💎 Direct Stake HBAR</h3>
                <p>Traditional staking - choose your amount directly</p>
                
                <div className="amount-selector">
                  <label className="amount-label">Select Amount</label>
                  
                  {/* Preset Buttons */}
                  <div className="preset-buttons">
                    <button 
                      className={`preset-btn ${stakeAmount === '10' ? 'active' : ''}`}
                      onClick={() => setStakeAmount('10')}
                      type="button"
                    >
                      10 HBAR
                    </button>
                    <button 
                      className={`preset-btn ${stakeAmount === '50' ? 'active' : ''}`}
                      onClick={() => setStakeAmount('50')}
                      type="button"
                    >
                      50 HBAR
                    </button>
                    <button 
                      className={`preset-btn ${stakeAmount === '100' ? 'active' : ''}`}
                      onClick={() => setStakeAmount('100')}
                      type="button"
                    >
                      100 HBAR
                    </button>
                    <button 
                      className={`preset-btn ${stakeAmount === '200' ? 'active' : ''}`}
                      onClick={() => setStakeAmount('200')}
                      type="button"
                    >
                      200 HBAR
                    </button>
                    <button 
                      className={`preset-btn ${stakeAmount === '500' ? 'active' : ''}`}
                      onClick={() => setStakeAmount('500')}
                      type="button"
                    >
                      500 HBAR
                    </button>
                    <button 
                      className={`preset-btn ${stakeAmount === '1000' ? 'active' : ''}`}
                      onClick={() => setStakeAmount('1000')}
                      type="button"
                    >
                      1000 HBAR
                    </button>
                  </div>

                  {/* Custom Amount Input */}
                  <div className="custom-amount">
                    <div className="amount-input-wrapper">
                      <input
                        type="number"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        placeholder="Enter custom amount"
                        className="amount-input"
                        min="1"
                        step="1"
                      />
                      <span className="amount-suffix">HBAR</span>
                    </div>
                    
                    {/* Amount Controls */}
                    <div className="amount-controls">
                      <button 
                        className="control-btn"
                        onClick={() => setStakeAmount(Math.max(1, parseInt(stakeAmount || 0) - 10).toString())}
                        type="button"
                        disabled={loading}
                      >
                        -10
                      </button>
                      <button 
                        className="control-btn"
                        onClick={() => setStakeAmount(Math.max(1, parseInt(stakeAmount || 0) - 1).toString())}
                        type="button"
                        disabled={loading}
                      >
                        -1
                      </button>
                      <button 
                        className="control-btn"
                        onClick={() => setStakeAmount((parseInt(stakeAmount || 0) + 1).toString())}
                        type="button"
                        disabled={loading}
                      >
                        +1
                      </button>
                      <button 
                        className="control-btn"
                        onClick={() => setStakeAmount((parseInt(stakeAmount || 0) + 10).toString())}
                        type="button"
                        disabled={loading}
                      >
                        +10
                      </button>
                    </div>
                  </div>

                  {/* Stake Button */}
                  <button 
                    onClick={handleStake}
                    disabled={loading || !stakeAmount || parseInt(stakeAmount) < 1}
                    className="btn btn-primary btn-stake btn-large"
                  >
                    {loading ? '⏳ Staking...' : `💎 Stake ${stakeAmount || '0'} HBAR`}
                  </button>
                </div>

                <div className="action-info">
                  <div className="info-item">
                    <span className="info-label">APY</span>
                    <span className="info-value">8.5%</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Lock Period</span>
                    <span className="info-value">30 days</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Min. Amount</span>
                    <span className="info-value">1 HBAR</span>
                  </div>
                </div>
              </div>


            </div>
          )}

          {activeTab === 'badges' && (
            <div className="badges-grid">
              {userStats && userStats.badges.length > 0 ? (
                userStats.badges.map((badge, index) => {
                  const quest = quests.find(q => q.rewards.badge === badge);
                  return (
                    <div key={index} className="badge-card">
                      <div className="badge-icon">{quest?.rewards.nftMetadata.image}</div>
                      <h4>{badge}</h4>
                      <span 
                        className="badge-rarity"
                        style={{ color: getRarityColor(quest?.rewards.nftMetadata.rarity) }}
                      >
                        {quest?.rewards.nftMetadata.rarity}
                      </span>
                      <p>{quest?.rewards.nftMetadata.description}</p>
                    </div>
                  );
                })
              ) : (
                <div className="empty-state">
                  <p>🎖️ No badges earned yet</p>
                  <p>Complete quests to earn your first badge!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="history-list">
              {(() => {
                // Filter to only show stake and game_win actions with amount > 0
                const relevantActions = actionHistory.filter(action => 
                  (action.action === 'stake' || action.action === 'game_win') && 
                  action.amount > 0
                );
                
                return relevantActions.length > 0 ? (
                  relevantActions.slice().reverse().map((action, index) => {
                    // Determine stake source - QuestService stores metadata as 'gameData'
                    let stakeSource = 'Unknown';
                    let stakeIcon = '💎';
                    
                    // Check gameData (from QuestService)
                    if (action.gameData) {
                      if (action.gameData.source === 'direct') {
                        stakeSource = 'Direct Stake';
                        stakeIcon = '💎';
                      } else if (action.gameData.gameType) {
                        // Game-based stake
                        switch (action.gameData.gameType) {
                          case 'tictactoe':
                            stakeSource = 'Tic Tac Toe';
                            stakeIcon = '⭕';
                            break;
                          case 'runner':
                            stakeSource = 'Knight Runner';
                            stakeIcon = '🏃';
                            break;
                          case 'quest':
                            stakeSource = 'Knight\'s Quest';
                            stakeIcon = '⚔️';
                            break;
                          default:
                            stakeSource = `Game (${action.gameData.gameType})`;
                            stakeIcon = '🎮';
                        }
                      }
                    } else if (action.action === 'game_win') {
                      // Fallback for game wins without gameData
                      stakeSource = 'Game Win';
                      stakeIcon = '🎮';
                    } else if (action.action === 'stake') {
                      // No gameData but action is stake - assume direct
                      stakeSource = 'Direct Stake';
                      stakeIcon = '💎';
                    }
                    
                    return (
                      <div key={index} className="history-item">
                        <div className="history-icon">{stakeIcon}</div>
                        <div className="history-content">
                          <div className="history-action">
                            <strong>{action.amount} HBAR</strong> staked via <strong>{stakeSource}</strong>
                          </div>
                          <div className="history-time">
                            {new Date(action.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <a 
                          href={`https://hashscan.io/testnet/transaction/${action.transactionId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="history-link"
                        >
                          View on HashScan →
                        </a>
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-state">
                    <p>📜 No stake history yet</p>
                    <p>Start staking directly or play games to see your history!</p>
                  </div>
                );
              })()}
            </div>
          )}
          {activeTab === 'feedback' && (
            <Feedback accountId={accountId} />
          )}
        </div>

        {/* Quest Completion Modal */}
        {showQuestModal && completedQuest && (
          <div className="modal-overlay" onClick={() => setShowQuestModal(false)}>
            <div className="modal-content quest-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-icon">🎉</div>
              <h2>Quest Completed!</h2>
              <div className="quest-badge-large">
                {completedQuest.rewards.nftMetadata.image}
              </div>
              <h3>{completedQuest.name}</h3>
              <p>{completedQuest.rewards.nftMetadata.description}</p>
              <div className="modal-rewards">
                <div className="modal-reward">
                  <span className="reward-label">Badge</span>
                  <span className="reward-value">{completedQuest.rewards.badge}</span>
                </div>
                <div className="modal-reward">
                  <span className="reward-label">Points</span>
                  <span className="reward-value">+{completedQuest.rewards.points}</span>
                </div>
                <div className="modal-reward">
                  <span className="reward-label">Rarity</span>
                  <span 
                    className="reward-value"
                    style={{ color: getRarityColor(completedQuest.rewards.nftMetadata.rarity) }}
                  >
                    {completedQuest.rewards.nftMetadata.rarity}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setShowQuestModal(false)}
                className="btn btn-primary"
              >
                Awesome!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
