/**
 * Onboarding Service - Guide new users through the platform
 * Supports Execution criteria: User experience, accessibility
 */

class OnboardingService {
  constructor() {
    this.onboardingData = this.loadOnboardingData();
  }

  /**
   * Load onboarding data from localStorage
   */
  loadOnboardingData() {
    const stored = localStorage.getItem('onboarding_data');
    if (stored) {
      return JSON.parse(stored);
    }
    
    return {
      users: {},
      completionRate: 0
    };
  }

  /**
   * Save onboarding data
   */
  saveOnboardingData() {
    localStorage.setItem('onboarding_data', JSON.stringify(this.onboardingData));
  }

  /**
   * Initialize onboarding for new user
   */
  initializeUser(accountId) {
    if (!this.onboardingData.users[accountId]) {
      this.onboardingData.users[accountId] = {
        currentStep: 0,
        completedSteps: [],
        startedAt: new Date().toISOString(),
        completedAt: null,
        skipped: false
      };
      this.saveOnboardingData();
      console.log('[Onboarding] User initialized:', accountId);
    }
    return this.onboardingData.users[accountId];
  }

  /**
   * Get onboarding steps
   */
  getSteps() {
    return [
      {
        id: 'welcome',
        title: 'Welcome to DeFi Quest Arena! 🎮',
        description: 'Transform your DeFi journey into an exciting adventure',
        action: 'Get Started',
        tips: [
          'Play games to earn the right to stake HBAR',
          'Complete quests to unlock achievements',
          'Earn NFT badges verified on Hedera blockchain'
        ]
      },
      {
        id: 'avatar',
        title: 'Choose Your Avatar 🎭',
        description: 'Select a character to represent you in the arena',
        action: 'Select Avatar',
        tips: [
          'Your avatar shows on your profile',
          'Visible on the leaderboard',
          'Can be changed anytime'
        ]
      },
      {
        id: 'dashboard',
        title: 'Your Dashboard 📊',
        description: 'Track your progress and achievements',
        action: 'View Dashboard',
        tips: [
          'Total Points: Quest rewards',
          'Quests Completed: Your progress',
          'HBAR Staked: Total staked amount',
          'Games Won: Victory count'
        ]
      },
      {
        id: 'quests',
        title: 'Quest System 🎯',
        description: 'Complete quests to earn points and badges',
        action: 'View Quests',
        tips: [
          'Daily Quests: Reset at midnight',
          'Beginner: Always unlocked',
          'Other categories: Unlock by completing previous',
          'Each quest awards an NFT badge'
        ]
      },
      {
        id: 'games',
        title: 'Play to Earn 🎮',
        description: 'Win games to earn the right to stake HBAR',
        action: 'Play Games',
        tips: [
          'Easy Games: 25 HBAR stake',
          'Medium Games: 100 HBAR stake',
          'Hard Games: Up to 500 HBAR stake',
          'Winning auto-stakes your HBAR'
        ]
      },
      {
        id: 'first_game',
        title: 'Play Your First Game ⭕',
        description: 'Try Tic Tac Toe - beat the AI to earn 25 HBAR stake',
        action: 'Play Tic Tac Toe',
        tips: [
          'Click any empty cell to place X',
          'Get 3 in a row to win',
          'Win = Auto-stake 25 HBAR',
          'Lose = Try again for free'
        ]
      },
      {
        id: 'profile',
        title: 'Your Profile 👤',
        description: 'View your achievements and customize your presence',
        action: 'View Profile',
        tips: [
          'See all your badges',
          'Track category progress',
          'View detailed statistics',
          'Equip badges for leaderboard'
        ]
      },
      {
        id: 'complete',
        title: 'You\'re All Set! 🎉',
        description: 'Start your journey to become a DeFi Sensei',
        action: 'Start Playing',
        tips: [
          'Complete daily quests for consistent rewards',
          'Try all three game types',
          'Unlock all quest categories',
          'Collect all 40 NFT badges'
        ]
      }
    ];
  }

  /**
   * Get current step for user
   */
  getCurrentStep(accountId) {
    const userData = this.onboardingData.users[accountId];
    if (!userData) return null;
    
    const steps = this.getSteps();
    return steps[userData.currentStep] || null;
  }

  /**
   * Complete current step and move to next
   */
  completeStep(accountId, stepId) {
    const userData = this.onboardingData.users[accountId];
    if (!userData) return false;
    
    if (!userData.completedSteps.includes(stepId)) {
      userData.completedSteps.push(stepId);
    }
    
    const steps = this.getSteps();
    if (userData.currentStep < steps.length - 1) {
      userData.currentStep++;
    } else {
      userData.completedAt = new Date().toISOString();
    }
    
    this.saveOnboardingData();
    this.updateCompletionRate();
    
    console.log('[Onboarding] Step completed:', stepId);
    return true;
  }

  /**
   * Skip onboarding
   */
  skipOnboarding(accountId) {
    const userData = this.onboardingData.users[accountId];
    if (!userData) return false;
    
    userData.skipped = true;
    userData.completedAt = new Date().toISOString();
    this.saveOnboardingData();
    
    console.log('[Onboarding] Onboarding skipped:', accountId);
    return true;
  }

  /**
   * Check if user has completed onboarding
   */
  isOnboardingComplete(accountId) {
    const userData = this.onboardingData.users[accountId];
    if (!userData) return false;
    
    return userData.completedAt !== null;
  }

  /**
   * Get onboarding progress
   */
  getProgress(accountId) {
    const userData = this.onboardingData.users[accountId];
    if (!userData) return 0;
    
    const steps = this.getSteps();
    return (userData.completedSteps.length / steps.length) * 100;
  }

  /**
   * Update overall completion rate
   */
  updateCompletionRate() {
    const users = Object.values(this.onboardingData.users);
    if (users.length === 0) {
      this.onboardingData.completionRate = 0;
      return;
    }
    
    const completed = users.filter(u => u.completedAt !== null).length;
    this.onboardingData.completionRate = (completed / users.length) * 100;
    this.saveOnboardingData();
  }

  /**
   * Get onboarding statistics
   */
  getStatistics() {
    const users = Object.values(this.onboardingData.users);
    const completed = users.filter(u => u.completedAt !== null && !u.skipped);
    const skipped = users.filter(u => u.skipped);
    const inProgress = users.filter(u => u.completedAt === null && !u.skipped);
    
    // Calculate average completion time
    let avgCompletionTime = 0;
    if (completed.length > 0) {
      const times = completed.map(u => {
        const start = new Date(u.startedAt);
        const end = new Date(u.completedAt);
        return (end - start) / 1000 / 60; // minutes
      });
      avgCompletionTime = times.reduce((a, b) => a + b, 0) / times.length;
    }
    
    return {
      totalUsers: users.length,
      completed: completed.length,
      skipped: skipped.length,
      inProgress: inProgress.length,
      completionRate: this.onboardingData.completionRate.toFixed(1),
      averageCompletionTime: Math.round(avgCompletionTime)
    };
  }

  /**
   * Reset onboarding for user (for testing)
   */
  resetUser(accountId) {
    delete this.onboardingData.users[accountId];
    this.saveOnboardingData();
    console.log('[Onboarding] User reset:', accountId);
  }

  /**
   * Reset all onboarding data
   */
  resetAll() {
    this.onboardingData = {
      users: {},
      completionRate: 0
    };
    this.saveOnboardingData();
    console.log('[Onboarding] All data reset');
  }
}

export default new OnboardingService();
