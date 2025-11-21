/**
 * Analytics Service - Track user engagement and platform metrics
 * Supports Success criteria: TPS tracking, user engagement, growth metrics
 */

class AnalyticsService {
  constructor() {
    this.sessionStart = null;
    this.actionsThisSession = 0;
    this.metrics = this.loadMetrics();
  }

  /**
   * Load metrics from localStorage
   */
  loadMetrics() {
    const stored = localStorage.getItem('platform_metrics');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert arrays back to Sets
      return {
        ...parsed,
        dailyActiveUsers: new Set(parsed.dailyActiveUsers || []),
        monthlyActiveUsers: new Set(parsed.monthlyActiveUsers || [])
      };
    }
    
    return {
      totalUsers: 0,
      totalTransactions: 0,
      totalHBARStaked: 0,
      totalGamesPlayed: 0,
      totalQuestsCompleted: 0,
      totalNFTsMinted: 0,
      dailyActiveUsers: new Set(),
      monthlyActiveUsers: new Set(),
      userSessions: [],
      averageSessionTime: 0,
      retentionRate: 0,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Save metrics to localStorage
   */
  saveMetrics() {
    // Convert Sets to Arrays for storage
    const metricsToSave = {
      ...this.metrics,
      dailyActiveUsers: Array.from(this.metrics.dailyActiveUsers),
      monthlyActiveUsers: Array.from(this.metrics.monthlyActiveUsers)
    };
    localStorage.setItem('platform_metrics', JSON.stringify(metricsToSave));
  }

  /**
   * Start tracking a user session
   */
  startSession(accountId) {
    this.sessionStart = Date.now();
    this.actionsThisSession = 0;
    
    // Track daily active user
    const today = new Date().toDateString();
    this.metrics.dailyActiveUsers.add(`${accountId}-${today}`);
    
    // Track monthly active user
    const thisMonth = new Date().toISOString().substring(0, 7);
    this.metrics.monthlyActiveUsers.add(`${accountId}-${thisMonth}`);
    
    console.log('[Analytics] Session started for:', accountId);
  }

  /**
   * End tracking a user session
   */
  endSession() {
    if (this.sessionStart) {
      const sessionDuration = (Date.now() - this.sessionStart) / 1000; // seconds
      
      this.metrics.userSessions.push({
        duration: sessionDuration,
        actions: this.actionsThisSession,
        timestamp: new Date().toISOString()
      });
      
      // Update average session time
      const totalDuration = this.metrics.userSessions.reduce((sum, s) => sum + s.duration, 0);
      this.metrics.averageSessionTime = totalDuration / this.metrics.userSessions.length;
      
      this.saveMetrics();
      console.log('[Analytics] Session ended. Duration:', sessionDuration, 'seconds');
    }
  }

  /**
   * Track a transaction (contributes to TPS)
   */
  trackTransaction(type, amount = 0) {
    this.metrics.totalTransactions++;
    this.actionsThisSession++;
    
    if (type === 'stake' || type === 'game_win') {
      this.metrics.totalHBARStaked += amount;
    }
    
    this.saveMetrics();
    console.log('[Analytics] Transaction tracked:', type, amount);
  }

  /**
   * Track game played
   */
  trackGamePlayed(gameType, won = false) {
    this.metrics.totalGamesPlayed++;
    this.actionsThisSession++;
    this.saveMetrics();
    console.log('[Analytics] Game tracked:', gameType, won ? 'won' : 'lost');
  }

  /**
   * Track quest completion
   */
  trackQuestCompleted(questId) {
    this.metrics.totalQuestsCompleted++;
    this.actionsThisSession++;
    this.saveMetrics();
    console.log('[Analytics] Quest completed:', questId);
  }

  /**
   * Track NFT minted
   */
  trackNFTMinted(badgeName) {
    this.metrics.totalNFTsMinted++;
    this.saveMetrics();
    console.log('[Analytics] NFT minted:', badgeName);
  }

  /**
   * Track new user registration
   */
  trackNewUser(accountId) {
    this.metrics.totalUsers++;
    this.saveMetrics();
    console.log('[Analytics] New user registered:', accountId);
  }

  /**
   * Get current metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      dailyActiveUsers: this.metrics.dailyActiveUsers.size,
      monthlyActiveUsers: this.metrics.monthlyActiveUsers.size,
      estimatedTPS: this.calculateTPS(),
      engagementRate: this.calculateEngagementRate()
    };
  }

  /**
   * Calculate estimated TPS contribution
   */
  calculateTPS() {
    // Average transactions per user per day
    const avgTransactionsPerDay = this.metrics.totalTransactions / Math.max(1, this.metrics.totalUsers);
    const dailyUsers = this.metrics.dailyActiveUsers.size;
    const estimatedDailyTransactions = avgTransactionsPerDay * dailyUsers;
    const estimatedTPS = estimatedDailyTransactions / (24 * 60 * 60); // per second
    
    return estimatedTPS.toFixed(4);
  }

  /**
   * Calculate engagement rate
   */
  calculateEngagementRate() {
    if (this.metrics.totalUsers === 0) return 0;
    const rate = (this.metrics.dailyActiveUsers.size / this.metrics.totalUsers) * 100;
    return rate.toFixed(2);
  }

  /**
   * Get dashboard metrics for display
   */
  getDashboardMetrics() {
    return {
      totalUsers: this.metrics.totalUsers,
      dailyActiveUsers: this.metrics.dailyActiveUsers.size,
      monthlyActiveUsers: this.metrics.monthlyActiveUsers.size,
      totalTransactions: this.metrics.totalTransactions,
      totalHBARStaked: this.metrics.totalHBARStaked.toFixed(2),
      totalGamesPlayed: this.metrics.totalGamesPlayed,
      totalQuestsCompleted: this.metrics.totalQuestsCompleted,
      totalNFTsMinted: this.metrics.totalNFTsMinted,
      averageSessionTime: Math.round(this.metrics.averageSessionTime),
      estimatedTPS: this.calculateTPS(),
      engagementRate: this.calculateEngagementRate()
    };
  }

  /**
   * Export metrics for reporting
   */
  exportMetrics() {
    const metrics = this.getDashboardMetrics();
    const report = {
      ...metrics,
      generatedAt: new Date().toISOString(),
      platform: 'DeFi Quest Arena',
      network: 'Hedera Testnet'
    };
    
    return JSON.stringify(report, null, 2);
  }

  /**
   * Reset all metrics (for testing)
   */
  resetMetrics() {
    this.metrics = {
      totalUsers: 0,
      totalTransactions: 0,
      totalHBARStaked: 0,
      totalGamesPlayed: 0,
      totalQuestsCompleted: 0,
      totalNFTsMinted: 0,
      dailyActiveUsers: new Set(),
      monthlyActiveUsers: new Set(),
      userSessions: [],
      averageSessionTime: 0,
      retentionRate: 0,
      lastUpdated: new Date().toISOString()
    };
    this.saveMetrics();
    console.log('[Analytics] Metrics reset');
  }
}

export default new AnalyticsService();
