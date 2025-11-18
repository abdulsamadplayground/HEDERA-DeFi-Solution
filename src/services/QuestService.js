/**
 * Quest Service - Enhanced with Categories and Progression
 * Categories: Daily, Beginner, Disciple, Senior, Sensei
 */

class QuestService {
  constructor() {
    this.quests = this.initializeQuests();
    this.userProgress = {};
  }

  /**
   * Initialize all quests organized by category
   */
  initializeQuests() {
    return {
      // ========== DAILY QUESTS (Reset daily, no unlock required) ==========
      daily_login: {
        id: 'daily_login',
        name: 'Daily Login',
        description: 'Log in to the arena today',
        category: 'daily',
        difficulty: 'easy',
        requirements: { action: 'login', count: 1, daily: true },
        rewards: {
          badge: 'Daily Visitor',
          points: 25,
          nftMetadata: {
            name: 'Daily Login Badge',
            description: 'Logged in today',
            rarity: 'common',
            image: '🚪'
          }
        }
      },

      daily_quest: {
        id: 'daily_quest',
        name: 'Quest Completer',
        description: 'Complete any quest today',
        category: 'daily',
        difficulty: 'easy',
        requirements: { action: 'complete_quest', count: 1, daily: true },
        rewards: {
          badge: 'Daily Achiever',
          points: 50,
          nftMetadata: {
            name: 'Quest Completer Badge',
            description: 'Completed a quest today',
            rarity: 'common',
            image: '✅'
          }
        }
      },

      daily_game: {
        id: 'daily_game',
        name: 'Daily Gamer',
        description: 'Win any game today',
        category: 'daily',
        difficulty: 'easy',
        requirements: { action: 'game_win', count: 1, daily: true },
        rewards: {
          badge: 'Daily Gamer',
          points: 50,
          nftMetadata: {
            name: 'Daily Gamer Badge',
            description: 'Won a game today',
            rarity: 'common',
            image: '🎮'
          }
        }
      },

      daily_stake: {
        id: 'daily_stake',
        name: 'Daily Staker',
        description: 'Complete 1 stake today',
        category: 'daily',
        difficulty: 'easy',
        requirements: { action: 'stake', count: 1, minAmount: 10, daily: true },
        rewards: {
          badge: 'Daily Dedication',
          points: 50,
          nftMetadata: {
            name: 'Daily Staker Badge',
            description: 'Staked today',
            rarity: 'common',
            image: '💎'
          }
        }
      },

      daily_combo: {
        id: 'daily_combo',
        name: 'Daily Combo',
        description: 'Win a game and stake in one day',
        category: 'daily',
        difficulty: 'medium',
        requirements: { action: 'daily_combo', count: 1, daily: true },
        rewards: {
          badge: 'Combo Master',
          points: 100,
          nftMetadata: {
            name: 'Daily Combo Badge',
            description: 'Completed combo today',
            rarity: 'uncommon',
            image: '🔥'
          }
        }
      },

      // ========== BEGINNER QUESTS (Always unlocked) ==========
      beginner_first_stake: {
        id: 'beginner_first_stake',
        name: 'First Steps',
        description: 'Complete your first stake',
        category: 'beginner',
        difficulty: 'easy',
        requirements: { action: 'stake', count: 1, minAmount: 10 },
        rewards: {
          badge: 'Novice Staker',
          points: 100,
          nftMetadata: {
            name: 'First Steps Badge',
            description: 'Your journey begins',
            rarity: 'common',
            image: '🌱'
          }
        }
      },

      beginner_easy_wins: {
        id: 'beginner_easy_wins',
        name: 'Easy Game Master',
        description: 'Win Tic Tac Toe 5 times',
        category: 'beginner',
        difficulty: 'easy',
        requirements: { action: 'game_win', gameType: 'tictactoe', count: 5 },
        rewards: {
          badge: 'Easy Master',
          points: 150,
          nftMetadata: {
            name: 'Easy Game Master Badge',
            description: 'Won easy game 5 times',
            rarity: 'common',
            image: '⭕'
          }
        }
      },

      beginner_medium_wins: {
        id: 'beginner_medium_wins',
        name: 'Pattern Pro',
        description: 'Win Pattern Match 3 times',
        category: 'beginner',
        difficulty: 'medium',
        requirements: { action: 'game_win', gameType: 'pattern', count: 3 },
        rewards: {
          badge: 'Pattern Pro',
          points: 200,
          nftMetadata: {
            name: 'Pattern Pro Badge',
            description: 'Won medium game 3 times',
            rarity: 'uncommon',
            image: '🍬'
          }
        }
      },

      beginner_high_score: {
        id: 'beginner_high_score',
        name: 'Score Chaser',
        description: 'Score 1000+ in Space Shooter',
        category: 'beginner',
        difficulty: 'hard',
        requirements: { action: 'game_score', gameType: 'shooter', minScore: 1000 },
        rewards: {
          badge: 'Score Chaser',
          points: 250,
          nftMetadata: {
            name: 'Score Chaser Badge',
            description: 'Scored 1000+ in hard game',
            rarity: 'rare',
            image: '🚀'
          }
        }
      },

      beginner_first_game: {
        id: 'beginner_first_game',
        name: 'Game Initiate',
        description: 'Win your first game',
        category: 'beginner',
        difficulty: 'easy',
        requirements: { action: 'game_win', count: 1 },
        rewards: {
          badge: 'Game Initiate',
          points: 100,
          nftMetadata: {
            name: 'Game Initiate Badge',
            description: 'First game victory',
            rarity: 'common',
            image: '🎯'
          }
        }
      },

      beginner_tic_tac_toe: {
        id: 'beginner_tic_tac_toe',
        name: 'Tic Tac Master',
        description: 'Win 3 Tic Tac Toe games',
        category: 'beginner',
        difficulty: 'easy',
        requirements: { action: 'game_win', gameType: 'tictactoe', count: 3 },
        rewards: {
          badge: 'Tic Tac Master',
          points: 150,
          nftMetadata: {
            name: 'Tic Tac Master Badge',
            description: 'Master of strategy',
            rarity: 'common',
            image: '⭕'
          }
        }
      },

      beginner_stake_50: {
        id: 'beginner_stake_50',
        name: 'Growing Confidence',
        description: 'Stake 50+ HBAR in one transaction',
        category: 'beginner',
        difficulty: 'easy',
        requirements: { action: 'stake', count: 1, minAmount: 50 },
        rewards: {
          badge: 'Confident Staker',
          points: 150,
          nftMetadata: {
            name: 'Growing Confidence Badge',
            description: 'Building momentum',
            rarity: 'common',
            image: '💪'
          }
        }
      },

      beginner_5_stakes: {
        id: 'beginner_5_stakes',
        name: 'Consistent Beginner',
        description: 'Complete 5 stakes',
        category: 'beginner',
        difficulty: 'easy',
        requirements: { action: 'stake', count: 5, minAmount: 10 },
        rewards: {
          badge: 'Consistent Beginner',
          points: 200,
          nftMetadata: {
            name: 'Consistent Beginner Badge',
            description: 'Building habits',
            rarity: 'common',
            image: '🔄'
          }
        }
      },

      beginner_all_games: {
        id: 'beginner_all_games',
        name: 'Game Explorer',
        description: 'Win at least one of each game type',
        category: 'beginner',
        difficulty: 'medium',
        requirements: { action: 'game_variety', games: ['tictactoe', 'pattern', 'shooter'] },
        rewards: {
          badge: 'Game Explorer',
          points: 250,
          nftMetadata: {
            name: 'Game Explorer Badge',
            description: 'Tried all games',
            rarity: 'uncommon',
            image: '🗺️'
          }
        }
      },

      beginner_100_total: {
        id: 'beginner_100_total',
        name: 'Century Staker',
        description: 'Stake 100+ HBAR total',
        category: 'beginner',
        difficulty: 'medium',
        requirements: { action: 'stake_total', minAmount: 100 },
        rewards: {
          badge: 'Century Staker',
          points: 300,
          nftMetadata: {
            name: 'Century Staker Badge',
            description: 'Reached 100 HBAR',
            rarity: 'uncommon',
            image: '💯'
          }
        }
      },

      beginner_pattern_match: {
        id: 'beginner_pattern_match',
        name: 'Pattern Seeker',
        description: 'Win 2 Pattern Match games',
        category: 'beginner',
        difficulty: 'medium',
        requirements: { action: 'game_win', gameType: 'pattern', count: 2 },
        rewards: {
          badge: 'Pattern Seeker',
          points: 200,
          nftMetadata: {
            name: 'Pattern Seeker Badge',
            description: 'Pattern master',
            rarity: 'uncommon',
            image: '🍬'
          }
        }
      },

      // ========== DISCIPLE QUESTS (Unlocked after completing all Beginner) ==========
      disciple_10_stakes: {
        id: 'disciple_10_stakes',
        name: 'Dedicated Disciple',
        description: 'Complete 10 stakes',
        category: 'disciple',
        difficulty: 'medium',
        requirements: { action: 'stake', count: 10, minAmount: 10 },
        rewards: {
          badge: 'Dedicated Disciple',
          points: 400,
          nftMetadata: {
            name: 'Dedicated Disciple Badge',
            description: 'True dedication shown',
            rarity: 'rare',
            image: '🎓'
          }
        }
      },

      disciple_stake_200: {
        id: 'disciple_stake_200',
        name: 'Power Player',
        description: 'Stake 200+ HBAR in one transaction',
        category: 'disciple',
        difficulty: 'medium',
        requirements: { action: 'stake', count: 1, minAmount: 200 },
        rewards: {
          badge: 'Power Player',
          points: 500,
          nftMetadata: {
            name: 'Power Player Badge',
            description: 'High stakes player',
            rarity: 'rare',
            image: '⚡'
          }
        }
      },

      disciple_5_pattern: {
        id: 'disciple_5_pattern',
        name: 'Pattern Virtuoso',
        description: 'Win 5 Pattern Match games',
        category: 'disciple',
        difficulty: 'medium',
        requirements: { action: 'game_win', gameType: 'pattern', count: 5 },
        rewards: {
          badge: 'Pattern Virtuoso',
          points: 450,
          nftMetadata: {
            name: 'Pattern Virtuoso Badge',
            description: 'Pattern game expert',
            rarity: 'rare',
            image: '🎨'
          }
        }
      },

      disciple_shooter_500: {
        id: 'disciple_shooter_500',
        name: 'Space Ace',
        description: 'Score 500+ in Space Shooter',
        category: 'disciple',
        difficulty: 'hard',
        requirements: { action: 'game_score', gameType: 'shooter', minScore: 500 },
        rewards: {
          badge: 'Space Ace',
          points: 600,
          nftMetadata: {
            name: 'Space Ace Badge',
            description: 'Elite pilot',
            rarity: 'rare',
            image: '🚀'
          }
        }
      },

      disciple_500_total: {
        id: 'disciple_500_total',
        name: 'Half-K Achiever',
        description: 'Stake 500+ HBAR total',
        category: 'disciple',
        difficulty: 'medium',
        requirements: { action: 'stake_total', minAmount: 500 },
        rewards: {
          badge: 'Half-K Achiever',
          points: 550,
          nftMetadata: {
            name: 'Half-K Achiever Badge',
            description: 'Reached 500 HBAR',
            rarity: 'rare',
            image: '🎯'
          }
        }
      },

      disciple_15_games: {
        id: 'disciple_15_games',
        name: 'Game Enthusiast',
        description: 'Win 15 games total',
        category: 'disciple',
        difficulty: 'medium',
        requirements: { action: 'game_win', count: 15 },
        rewards: {
          badge: 'Game Enthusiast',
          points: 500,
          nftMetadata: {
            name: 'Game Enthusiast Badge',
            description: 'Gaming dedication',
            rarity: 'rare',
            image: '🎪'
          }
        }
      },

      disciple_combo_master: {
        id: 'disciple_combo_master',
        name: 'Combo Specialist',
        description: 'Complete 5 game+stake combos',
        category: 'disciple',
        difficulty: 'hard',
        requirements: { action: 'combo_count', count: 5 },
        rewards: {
          badge: 'Combo Specialist',
          points: 650,
          nftMetadata: {
            name: 'Combo Specialist Badge',
            description: 'Master of combinations',
            rarity: 'epic',
            image: '🌟'
          }
        }
      },

      disciple_perfect_week: {
        id: 'disciple_perfect_week',
        name: 'Perfect Week',
        description: 'Complete daily quests 7 days in a row',
        category: 'disciple',
        difficulty: 'hard',
        requirements: { action: 'daily_streak', count: 7 },
        rewards: {
          badge: 'Perfect Week',
          points: 700,
          nftMetadata: {
            name: 'Perfect Week Badge',
            description: 'Week of dedication',
            rarity: 'epic',
            image: '📆'
          }
        }
      },

      // ========== SENIOR QUESTS (Unlocked after completing all Disciple) ==========
      senior_25_stakes: {
        id: 'senior_25_stakes',
        name: 'Senior Staker',
        description: 'Complete 25 stakes',
        category: 'senior',
        difficulty: 'hard',
        requirements: { action: 'stake', count: 25, minAmount: 10 },
        rewards: {
          badge: 'Senior Staker',
          points: 800,
          nftMetadata: {
            name: 'Senior Staker Badge',
            description: 'Veteran status achieved',
            rarity: 'epic',
            image: '🏅'
          }
        }
      },

      senior_stake_500: {
        id: 'senior_stake_500',
        name: 'Whale Watcher',
        description: 'Stake 500+ HBAR in one transaction',
        category: 'senior',
        difficulty: 'hard',
        requirements: { action: 'stake', count: 1, minAmount: 500 },
        rewards: {
          badge: 'Whale Watcher',
          points: 900,
          nftMetadata: {
            name: 'Whale Watcher Badge',
            description: 'Big league player',
            rarity: 'epic',
            image: '🐋'
          }
        }
      },

      senior_1000_total: {
        id: 'senior_1000_total',
        name: 'Thousand Club',
        description: 'Stake 1000+ HBAR total',
        category: 'senior',
        difficulty: 'hard',
        requirements: { action: 'stake_total', minAmount: 1000 },
        rewards: {
          badge: 'Thousand Club',
          points: 1000,
          nftMetadata: {
            name: 'Thousand Club Badge',
            description: 'Elite staker',
            rarity: 'epic',
            image: '💎'
          }
        }
      },

      senior_30_games: {
        id: 'senior_30_games',
        name: 'Game Veteran',
        description: 'Win 30 games total',
        category: 'senior',
        difficulty: 'hard',
        requirements: { action: 'game_win', count: 30 },
        rewards: {
          badge: 'Game Veteran',
          points: 850,
          nftMetadata: {
            name: 'Game Veteran Badge',
            description: 'Gaming mastery',
            rarity: 'epic',
            image: '🎖️'
          }
        }
      },

      senior_shooter_1000: {
        id: 'senior_shooter_1000',
        name: 'Space Legend',
        description: 'Score 1000+ in Space Shooter',
        category: 'senior',
        difficulty: 'legendary',
        requirements: { action: 'game_score', gameType: 'shooter', minScore: 1000 },
        rewards: {
          badge: 'Space Legend',
          points: 1200,
          nftMetadata: {
            name: 'Space Legend Badge',
            description: 'Legendary pilot',
            rarity: 'legendary',
            image: '🌌'
          }
        }
      },

      senior_10_pattern: {
        id: 'senior_10_pattern',
        name: 'Pattern Grandmaster',
        description: 'Win 10 Pattern Match games',
        category: 'senior',
        difficulty: 'hard',
        requirements: { action: 'game_win', gameType: 'pattern', count: 10 },
        rewards: {
          badge: 'Pattern Grandmaster',
          points: 900,
          nftMetadata: {
            name: 'Pattern Grandmaster Badge',
            description: 'Pattern perfection',
            rarity: 'epic',
            image: '🎭'
          }
        }
      },

      senior_perfect_month: {
        id: 'senior_perfect_month',
        name: 'Perfect Month',
        description: 'Complete daily quests 30 days in a row',
        category: 'senior',
        difficulty: 'legendary',
        requirements: { action: 'daily_streak', count: 30 },
        rewards: {
          badge: 'Perfect Month',
          points: 1500,
          nftMetadata: {
            name: 'Perfect Month Badge',
            description: 'Month of perfection',
            rarity: 'legendary',
            image: '📅'
          }
        }
      },

      senior_all_games_10: {
        id: 'senior_all_games_10',
        name: 'Tri-Game Master',
        description: 'Win 10+ of each game type',
        category: 'senior',
        difficulty: 'legendary',
        requirements: { action: 'game_balance', minEach: 10 },
        rewards: {
          badge: 'Tri-Game Master',
          points: 1300,
          nftMetadata: {
            name: 'Tri-Game Master Badge',
            description: 'Master of all games',
            rarity: 'legendary',
            image: '🏆'
          }
        }
      },

      // ========== SENSEI QUESTS (Unlocked after completing all Senior) ==========
      sensei_50_stakes: {
        id: 'sensei_50_stakes',
        name: 'Sensei of Stakes',
        description: 'Complete 50 stakes',
        category: 'sensei',
        difficulty: 'legendary',
        requirements: { action: 'stake', count: 50, minAmount: 10 },
        rewards: {
          badge: 'Sensei of Stakes',
          points: 2000,
          nftMetadata: {
            name: 'Sensei of Stakes Badge',
            description: 'Ultimate staking mastery',
            rarity: 'legendary',
            image: '🥋'
          }
        }
      },

      sensei_stake_1000: {
        id: 'sensei_stake_1000',
        name: 'Mega Whale',
        description: 'Stake 1000+ HBAR in one transaction',
        category: 'sensei',
        difficulty: 'legendary',
        requirements: { action: 'stake', count: 1, minAmount: 1000 },
        rewards: {
          badge: 'Mega Whale',
          points: 2500,
          nftMetadata: {
            name: 'Mega Whale Badge',
            description: 'Legendary whale status',
            rarity: 'legendary',
            image: '🐳'
          }
        }
      },

      sensei_5000_total: {
        id: 'sensei_5000_total',
        name: 'Five-K Legend',
        description: 'Stake 5000+ HBAR total',
        category: 'sensei',
        difficulty: 'legendary',
        requirements: { action: 'stake_total', minAmount: 5000 },
        rewards: {
          badge: 'Five-K Legend',
          points: 3000,
          nftMetadata: {
            name: 'Five-K Legend Badge',
            description: 'Legendary accumulation',
            rarity: 'legendary',
            image: '💰'
          }
        }
      },

      sensei_100_games: {
        id: 'sensei_100_games',
        name: 'Century Gamer',
        description: 'Win 100 games total',
        category: 'sensei',
        difficulty: 'legendary',
        requirements: { action: 'game_win', count: 100 },
        rewards: {
          badge: 'Century Gamer',
          points: 2500,
          nftMetadata: {
            name: 'Century Gamer Badge',
            description: '100 victories achieved',
            rarity: 'legendary',
            image: '🎯'
          }
        }
      },

      sensei_shooter_2000: {
        id: 'sensei_shooter_2000',
        name: 'Cosmic Emperor',
        description: 'Score 2000+ in Space Shooter',
        category: 'sensei',
        difficulty: 'legendary',
        requirements: { action: 'game_score', gameType: 'shooter', minScore: 2000 },
        rewards: {
          badge: 'Cosmic Emperor',
          points: 3500,
          nftMetadata: {
            name: 'Cosmic Emperor Badge',
            description: 'Supreme space mastery',
            rarity: 'legendary',
            image: '👑'
          }
        }
      },

      sensei_20_pattern: {
        id: 'sensei_20_pattern',
        name: 'Pattern Deity',
        description: 'Win 20 Pattern Match games',
        category: 'sensei',
        difficulty: 'legendary',
        requirements: { action: 'game_win', gameType: 'pattern', count: 20 },
        rewards: {
          badge: 'Pattern Deity',
          points: 2200,
          nftMetadata: {
            name: 'Pattern Deity Badge',
            description: 'Divine pattern mastery',
            rarity: 'legendary',
            image: '✨'
          }
        }
      },

      sensei_perfect_100: {
        id: 'sensei_perfect_100',
        name: 'Eternal Dedication',
        description: 'Complete daily quests 100 days in a row',
        category: 'sensei',
        difficulty: 'legendary',
        requirements: { action: 'daily_streak', count: 100 },
        rewards: {
          badge: 'Eternal Dedication',
          points: 5000,
          nftMetadata: {
            name: 'Eternal Dedication Badge',
            description: '100 days of perfection',
            rarity: 'legendary',
            image: '🌟'
          }
        }
      },

      sensei_all_games_50: {
        id: 'sensei_all_games_50',
        name: 'Omnigamer',
        description: 'Win 50+ of each game type',
        category: 'sensei',
        difficulty: 'legendary',
        requirements: { action: 'game_balance', minEach: 50 },
        rewards: {
          badge: 'Omnigamer',
          points: 4000,
          nftMetadata: {
            name: 'Omnigamer Badge',
            description: 'Master of all realms',
            rarity: 'legendary',
            image: '🌈'
          }
        }
      },

      sensei_ultimate: {
        id: 'sensei_ultimate',
        name: 'DeFi Sensei',
        description: 'Complete all other quests',
        category: 'sensei',
        difficulty: 'legendary',
        requirements: { action: 'complete_all_category', category: 'sensei' },
        rewards: {
          badge: 'DeFi Sensei',
          points: 10000,
          nftMetadata: {
            name: 'DeFi Sensei Badge',
            description: 'Ultimate achievement - True Sensei',
            rarity: 'legendary',
            image: '🏯'
          }
        }
      }
    };
  }


  /**
   * Load user progress from localStorage
   */
  loadUserProgress(accountId) {
    console.log('[QuestService] Loading progress for:', accountId);
    const key = `quest_progress_${accountId}`;
    const stored = localStorage.getItem(key);
    
    if (stored) {
      this.userProgress = JSON.parse(stored);
      console.log('[QuestService] Progress loaded');
    } else {
      this.userProgress = {
        accountId,
        avatar: null, // User's selected avatar
        totalPoints: 0,
        completedQuests: [],
        actionHistory: [],
        badges: [],
        equippedBadge: null,
        categoryProgress: {
          daily: { completed: [], unlocked: true },
          beginner: { completed: [], unlocked: true },
          disciple: { completed: [], unlocked: false },
          senior: { completed: [], unlocked: false },
          sensei: { completed: [], unlocked: false }
        },
        stats: {
          totalStakes: 0,
          totalGameWins: 0,
          totalActions: 0,
          totalValue: 0,
          gameStats: {
            tictactoe: 0,
            pattern: 0,
            shooter: 0
          },
          highScores: {
            shooter: 0
          },
          dailyStreak: 0,
          lastDailyComplete: null
        }
      };
      console.log('[QuestService] New progress initialized');
    }
    
    // Check and unlock categories
    this.checkCategoryUnlocks();
    
    return this.userProgress;
  }

  /**
   * Save user progress to localStorage
   */
  saveUserProgress(accountId) {
    const key = `quest_progress_${accountId}`;
    localStorage.setItem(key, JSON.stringify(this.userProgress));
    console.log('[QuestService] Progress saved');
  }


  /**
   * Check and unlock quest categories based on completion
   */
  checkCategoryUnlocks() {
    // Ensure categoryProgress exists
    if (!this.userProgress.categoryProgress) {
      this.userProgress.categoryProgress = {
        daily: { completed: [], unlocked: true },
        beginner: { completed: [], unlocked: true },
        disciple: { completed: [], unlocked: false },
        senior: { completed: [], unlocked: false },
        sensei: { completed: [], unlocked: false }
      };
    }

    // Ensure stats structure exists
    if (!this.userProgress.stats) {
      this.userProgress.stats = {
        totalStakes: 0,
        totalGameWins: 0,
        totalActions: 0,
        totalValue: 0,
        gameStats: {
          tictactoe: 0,
          pattern: 0,
          shooter: 0
        },
        highScores: {
          shooter: 0
        },
        dailyStreak: 0,
        lastDailyComplete: null
      };
    }

    // Ensure highScores exists
    if (!this.userProgress.stats.highScores) {
      this.userProgress.stats.highScores = { shooter: 0 };
    }

    // Ensure gameStats exists
    if (!this.userProgress.stats.gameStats) {
      this.userProgress.stats.gameStats = {
        tictactoe: 0,
        pattern: 0,
        shooter: 0
      };
    }

    const categories = ['beginner', 'disciple', 'senior', 'sensei'];
    
    for (let i = 0; i < categories.length - 1; i++) {
      const currentCategory = categories[i];
      const nextCategory = categories[i + 1];
      
      // Get all quests in current category
      const categoryQuests = Object.values(this.quests).filter(
        q => q.category === currentCategory
      );
      
      // Check if all are completed
      const allCompleted = categoryQuests.every(q =>
        this.userProgress.completedQuests.includes(q.id)
      );
      
      if (allCompleted && !this.userProgress.categoryProgress[nextCategory].unlocked) {
        this.userProgress.categoryProgress[nextCategory].unlocked = true;
        console.log(`[QuestService] 🎉 ${nextCategory} category unlocked!`);
      }
    }
  }

  /**
   * Record a DeFi action and check quest progress
   */
  recordAction(accountId, action, amount, transactionId, gameData = {}) {
    console.log('[QuestService] ========================================');
    console.log('[QuestService] Recording action:', action);
    console.log('[QuestService] Amount:', amount, 'HBAR');
    console.log('[QuestService] Game Data:', gameData);
    console.log('[QuestService] ========================================');

    // Load progress if not loaded
    if (!this.userProgress.accountId) {
      this.loadUserProgress(accountId);
    }

    // Record action in history
    const actionRecord = {
      action,
      amount,
      transactionId,
      gameData,
      timestamp: new Date().toISOString()
    };
    this.userProgress.actionHistory.push(actionRecord);

    // Update stats
    this.userProgress.stats.totalActions++;
    this.userProgress.stats.totalValue += amount;
    
    if (action === 'stake' || action === 'game_win') {
      this.userProgress.stats.totalStakes++;
    }
    
    if (action === 'game_win') {
      this.userProgress.stats.totalGameWins++;
      if (gameData.gameType) {
        this.userProgress.stats.gameStats[gameData.gameType] = 
          (this.userProgress.stats.gameStats[gameData.gameType] || 0) + 1;
      }
      if (gameData.score && gameData.gameType === 'shooter') {
        this.userProgress.stats.highScores.shooter = Math.max(
          this.userProgress.stats.highScores.shooter || 0,
          gameData.score
        );
      }
    }

    // Check daily streak
    this.updateDailyStreak();

    console.log('[QuestService] Updated stats:', this.userProgress.stats);

    // Check quest completion
    const completedQuests = this.checkQuestCompletion(action, amount, gameData);

    // Check category unlocks
    this.checkCategoryUnlocks();

    // Save progress
    this.saveUserProgress(accountId);

    console.log('[QuestService] ========================================');
    console.log('[QuestService] Action recorded successfully');
    console.log('[QuestService] Completed quests:', completedQuests.length);
    console.log('[QuestService] ========================================');

    return {
      completedQuests,
      totalPoints: this.userProgress.totalPoints,
      stats: this.userProgress.stats,
      unlockedCategories: this.getUnlockedCategories()
    };
  }


  /**
   * Update daily streak
   */
  updateDailyStreak() {
    const today = new Date().toDateString();
    const lastDaily = this.userProgress.stats.lastDailyComplete;
    
    if (lastDaily) {
      const lastDate = new Date(lastDaily).toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
      if (lastDate === today) {
        // Already completed today
        return;
      } else if (lastDate === yesterday) {
        // Consecutive day
        this.userProgress.stats.dailyStreak++;
      } else {
        // Streak broken
        this.userProgress.stats.dailyStreak = 1;
      }
    } else {
      this.userProgress.stats.dailyStreak = 1;
    }
    
    this.userProgress.stats.lastDailyComplete = new Date().toISOString();
  }

  /**
   * Check if any quests were completed
   */
  checkQuestCompletion(action, amount, gameData) {
    const completedQuests = [];

    Object.values(this.quests).forEach(quest => {
      // Skip already completed quests
      if (this.userProgress.completedQuests.includes(quest.id)) {
        return;
      }

      // Skip locked categories
      if (!this.userProgress.categoryProgress[quest.category]?.unlocked) {
        return;
      }

      let isCompleted = false;
      const req = quest.requirements;

      // Check different quest types
      if (req.action === 'login') {
        // Check if logged in today
        const today = new Date().toDateString();
        const todayLogins = this.userProgress.actionHistory.filter(a => 
          a.action === 'login' && new Date(a.timestamp).toDateString() === today
        );
        isCompleted = todayLogins.length >= req.count;
      }
      else if (req.action === 'complete_quest') {
        // Check if completed any quest today
        const today = new Date().toDateString();
        const todayCompletions = this.userProgress.actionHistory.filter(a => 
          a.action === 'quest_completed' && new Date(a.timestamp).toDateString() === today
        );
        isCompleted = todayCompletions.length >= req.count;
      }
      else if (req.action === 'daily_combo') {
        // Check if won game and staked today
        const today = new Date().toDateString();
        const todayActions = this.userProgress.actionHistory.filter(a => 
          new Date(a.timestamp).toDateString() === today
        );
        const hasGameWin = todayActions.some(a => a.action === 'game_win');
        const hasStake = todayActions.some(a => a.action === 'stake' || a.action === 'game_win');
        isCompleted = hasGameWin && hasStake;
      }
      else if (req.action === 'stake') {
        const stakes = this.userProgress.actionHistory.filter(a => 
          a.action === 'stake' || a.action === 'game_win'
        );
        if (req.minAmount) {
          isCompleted = stakes.some(s => s.amount >= req.minAmount);
        } else {
          isCompleted = stakes.length >= req.count;
        }
      }
      else if (req.action === 'stake_total') {
        isCompleted = this.userProgress.stats.totalValue >= req.minAmount;
      }
      else if (req.action === 'game_win') {
        const gameWins = this.userProgress.actionHistory.filter(a => a.action === 'game_win');
        if (req.gameType) {
          const typeWins = gameWins.filter(g => g.gameData?.gameType === req.gameType);
          isCompleted = typeWins.length >= req.count;
        } else {
          isCompleted = gameWins.length >= req.count;
        }
      }
      else if (req.action === 'game_score') {
        const highScores = this.userProgress.stats?.highScores || {};
        isCompleted = (highScores[req.gameType] || 0) >= req.minScore;
      }
      else if (req.action === 'game_variety') {
        const gameTypes = new Set(
          this.userProgress.actionHistory
            .filter(a => a.action === 'game_win')
            .map(a => a.gameData?.gameType)
        );
        isCompleted = req.games.every(g => gameTypes.has(g));
      }
      else if (req.action === 'game_balance') {
        const stats = this.userProgress.stats.gameStats;
        isCompleted = Object.values(stats).every(count => count >= req.minEach);
      }
      else if (req.action === 'daily_streak') {
        isCompleted = this.userProgress.stats.dailyStreak >= req.count;
      }
      else if (req.action === 'combo') {
        // Check if both actions happened today
        const today = new Date().toDateString();
        const todayActions = this.userProgress.actionHistory.filter(a => 
          new Date(a.timestamp).toDateString() === today
        );
        const actionTypes = new Set(todayActions.map(a => a.action));
        isCompleted = req.actions.every(a => actionTypes.has(a));
      }
      else if (req.action === 'combo_count') {
        // Count game+stake combos (within 1 hour)
        let comboCount = 0;
        const sorted = [...this.userProgress.actionHistory].sort((a, b) => 
          new Date(a.timestamp) - new Date(b.timestamp)
        );
        for (let i = 0; i < sorted.length - 1; i++) {
          if (sorted[i].action === 'game_win' && sorted[i + 1].action === 'stake') {
            const timeDiff = new Date(sorted[i + 1].timestamp) - new Date(sorted[i].timestamp);
            if (timeDiff < 3600000) comboCount++; // Within 1 hour
          }
        }
        isCompleted = comboCount >= req.count;
      }
      else if (req.action === 'complete_all_category') {
        const categoryQuests = Object.values(this.quests).filter(
          q => q.category === req.category && q.id !== quest.id
        );
        isCompleted = categoryQuests.every(q => 
          this.userProgress.completedQuests.includes(q.id)
        );
      }

      if (isCompleted) {
        console.log('[QuestService] 🎉 Quest completed:', quest.name);
        this.userProgress.completedQuests.push(quest.id);
        this.userProgress.totalPoints += quest.rewards.points;
        this.userProgress.badges.push(quest.rewards.badge);
        this.userProgress.categoryProgress[quest.category].completed.push(quest.id);
        completedQuests.push(quest);
        
        // Record quest completion for daily quest tracking
        this.userProgress.actionHistory.push({
          action: 'quest_completed',
          questId: quest.id,
          timestamp: new Date().toISOString()
        });
      }
    });

    return completedQuests;
  }


  /**
   * Get all quests with completion status
   */
  getAllQuests() {
    return Object.values(this.quests).map(quest => ({
      ...quest,
      completed: this.userProgress.completedQuests?.includes(quest.id) || false,
      locked: !this.userProgress.categoryProgress?.[quest.category]?.unlocked,
      progress: this.getQuestProgress(quest)
    }));
  }

  /**
   * Get quests by category
   */
  getQuestsByCategory(category) {
    return this.getAllQuests().filter(q => q.category === category);
  }

  /**
   * Get progress for a specific quest
   */
  getQuestProgress(quest) {
    if (!this.userProgress.actionHistory) return 0;
    if (this.userProgress.completedQuests?.includes(quest.id)) return 100;

    const req = quest.requirements;

    if (req.action === 'stake') {
      const stakes = this.userProgress.actionHistory.filter(a => 
        a.action === 'stake' || a.action === 'game_win'
      );
      if (req.minAmount) {
        return stakes.some(s => s.amount >= req.minAmount) ? 100 : 0;
      }
      return Math.min(100, (stakes.length / req.count) * 100);
    }

    if (req.action === 'stake_total') {
      return Math.min(100, (this.userProgress.stats.totalValue / req.minAmount) * 100);
    }

    if (req.action === 'game_win') {
      const gameWins = this.userProgress.actionHistory.filter(a => a.action === 'game_win');
      if (req.gameType) {
        const typeWins = gameWins.filter(g => g.gameData?.gameType === req.gameType);
        return Math.min(100, (typeWins.length / req.count) * 100);
      }
      return Math.min(100, (gameWins.length / req.count) * 100);
    }

    if (req.action === 'game_score') {
      const highScores = this.userProgress.stats?.highScores || {};
      const current = highScores[req.gameType] || 0;
      return Math.min(100, (current / req.minScore) * 100);
    }

    if (req.action === 'daily_streak') {
      return Math.min(100, (this.userProgress.stats.dailyStreak / req.count) * 100);
    }

    return 0;
  }

  /**
   * Get user statistics
   */
  getUserStats() {
    return {
      ...this.userProgress.stats,
      totalPoints: this.userProgress.totalPoints,
      completedQuests: this.userProgress.completedQuests?.length || 0,
      totalQuests: Object.keys(this.quests).length,
      badges: this.userProgress.badges || [],
      equippedBadge: this.userProgress.equippedBadge,
      avatar: this.userProgress.avatar,
      categoryProgress: this.userProgress.categoryProgress
    };
  }

  /**
   * Get unlocked categories
   */
  getUnlockedCategories() {
    return Object.entries(this.userProgress.categoryProgress || {})
      .filter(([_, data]) => data.unlocked)
      .map(([category]) => category);
  }

  /**
   * Equip a badge
   */
  equipBadge(badgeName) {
    if (this.userProgress.badges.includes(badgeName)) {
      this.userProgress.equippedBadge = badgeName;
      this.saveUserProgress(this.userProgress.accountId);
      console.log('[QuestService] Badge equipped:', badgeName);
      return true;
    }
    return false;
  }

  /**
   * Unequip badge
   */
  unequipBadge() {
    this.userProgress.equippedBadge = null;
    this.saveUserProgress(this.userProgress.accountId);
    console.log('[QuestService] Badge unequipped');
  }

  /**
   * Set user avatar
   */
  setAvatar(avatarId) {
    this.userProgress.avatar = avatarId;
    this.saveUserProgress(this.userProgress.accountId);
    console.log('[QuestService] Avatar set:', avatarId);
    return true;
  }

  /**
   * Get user avatar
   */
  getAvatar() {
    return this.userProgress.avatar;
  }

  /**
   * Get category completion badge
   */
  getCategoryBadge(category) {
    const badges = {
      beginner: { name: 'Beginner Graduate', icon: '🎓', rarity: 'uncommon' },
      disciple: { name: 'Disciple Master', icon: '⚔️', rarity: 'rare' },
      senior: { name: 'Senior Elite', icon: '🏅', rarity: 'epic' },
      sensei: { name: 'True Sensei', icon: '🥋', rarity: 'legendary' }
    };
    return badges[category];
  }

  /**
   * Check if category is complete
   */
  isCategoryComplete(category) {
    const categoryQuests = Object.values(this.quests).filter(q => q.category === category);
    return categoryQuests.every(q => this.userProgress.completedQuests?.includes(q.id));
  }

  /**
   * Reset user progress (for testing)
   */
  resetProgress(accountId) {
    console.log('[QuestService] Resetting progress for:', accountId);
    const key = `quest_progress_${accountId}`;
    localStorage.removeItem(key);
    this.userProgress = {};
    console.log('[QuestService] Progress reset complete');
  }
}

export default new QuestService();
