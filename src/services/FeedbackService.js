/**
 * Feedback Service - Collect and manage user feedback
 * Supports Validation criteria: Market feedback cycles, user sentiment
 */

class FeedbackService {
  constructor() {
    this.feedback = this.loadFeedback();
  }

  /**
   * Load feedback from localStorage
   */
  loadFeedback() {
    const stored = localStorage.getItem('user_feedback');
    if (stored) {
      return JSON.parse(stored);
    }
    
    return {
      surveys: [],
      ratings: [],
      featureRequests: [],
      bugReports: [],
      nps: [],
      sentiment: {
        positive: 0,
        neutral: 0,
        negative: 0
      }
    };
  }

  /**
   * Save feedback to localStorage
   */
  saveFeedback() {
    localStorage.setItem('user_feedback', JSON.stringify(this.feedback));
  }

  /**
   * Submit user rating (1-5 stars)
   */
  submitRating(accountId, rating, category, comment = '') {
    const ratingData = {
      accountId,
      rating,
      category, // 'overall', 'games', 'quests', 'ui', 'performance'
      comment,
      timestamp: new Date().toISOString()
    };
    
    this.feedback.ratings.push(ratingData);
    this.updateSentiment(rating);
    this.saveFeedback();
    
    console.log('[Feedback] Rating submitted:', rating, 'stars');
    return true;
  }

  /**
   * Submit NPS score (0-10)
   */
  submitNPS(accountId, score, reason = '') {
    const npsData = {
      accountId,
      score,
      reason,
      timestamp: new Date().toISOString()
    };
    
    this.feedback.nps.push(npsData);
    this.saveFeedback();
    
    console.log('[Feedback] NPS submitted:', score);
    return true;
  }

  /**
   * Submit feature request
   */
  submitFeatureRequest(accountId, title, description, priority = 'medium') {
    const request = {
      id: Date.now(),
      accountId,
      title,
      description,
      priority, // 'low', 'medium', 'high'
      votes: 1,
      status: 'submitted', // 'submitted', 'reviewing', 'planned', 'in-progress', 'completed'
      timestamp: new Date().toISOString()
    };
    
    this.feedback.featureRequests.push(request);
    this.saveFeedback();
    
    console.log('[Feedback] Feature request submitted:', title);
    return request.id;
  }

  /**
   * Submit bug report
   */
  submitBugReport(accountId, title, description, severity = 'medium') {
    const bug = {
      id: Date.now(),
      accountId,
      title,
      description,
      severity, // 'low', 'medium', 'high', 'critical'
      status: 'open', // 'open', 'investigating', 'fixed', 'closed'
      timestamp: new Date().toISOString()
    };
    
    this.feedback.bugReports.push(bug);
    this.saveFeedback();
    
    console.log('[Feedback] Bug report submitted:', title);
    return bug.id;
  }

  /**
   * Submit survey response
   */
  submitSurvey(accountId, surveyId, responses) {
    const survey = {
      accountId,
      surveyId,
      responses, // Object with question IDs and answers
      timestamp: new Date().toISOString()
    };
    
    this.feedback.surveys.push(survey);
    this.saveFeedback();
    
    console.log('[Feedback] Survey submitted:', surveyId);
    return true;
  }

  /**
   * Vote for a feature request
   */
  voteFeatureRequest(requestId) {
    const request = this.feedback.featureRequests.find(r => r.id === requestId);
    if (request) {
      request.votes++;
      this.saveFeedback();
      console.log('[Feedback] Feature request voted:', requestId);
      return true;
    }
    return false;
  }

  /**
   * Update sentiment based on rating
   */
  updateSentiment(rating) {
    if (rating >= 4) {
      this.feedback.sentiment.positive++;
    } else if (rating >= 3) {
      this.feedback.sentiment.neutral++;
    } else {
      this.feedback.sentiment.negative++;
    }
  }

  /**
   * Calculate NPS score
   */
  calculateNPS() {
    if (this.feedback.nps.length === 0) return 0;
    
    const promoters = this.feedback.nps.filter(n => n.score >= 9).length;
    const detractors = this.feedback.nps.filter(n => n.score <= 6).length;
    const total = this.feedback.nps.length;
    
    const nps = ((promoters - detractors) / total) * 100;
    return Math.round(nps);
  }

  /**
   * Get average rating
   */
  getAverageRating(category = null) {
    let ratings = this.feedback.ratings;
    
    if (category) {
      ratings = ratings.filter(r => r.category === category);
    }
    
    if (ratings.length === 0) return 0;
    
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return (sum / ratings.length).toFixed(2);
  }

  /**
   * Get sentiment analysis
   */
  getSentimentAnalysis() {
    const total = this.feedback.sentiment.positive + 
                  this.feedback.sentiment.neutral + 
                  this.feedback.sentiment.negative;
    
    if (total === 0) {
      return {
        positive: 0,
        neutral: 0,
        negative: 0,
        overall: 'neutral'
      };
    }
    
    const positive = (this.feedback.sentiment.positive / total) * 100;
    const neutral = (this.feedback.sentiment.neutral / total) * 100;
    const negative = (this.feedback.sentiment.negative / total) * 100;
    
    let overall = 'neutral';
    if (positive > 60) overall = 'positive';
    else if (negative > 40) overall = 'negative';
    
    return {
      positive: positive.toFixed(1),
      neutral: neutral.toFixed(1),
      negative: negative.toFixed(1),
      overall
    };
  }

  /**
   * Get top feature requests
   */
  getTopFeatureRequests(limit = 10) {
    return this.feedback.featureRequests
      .sort((a, b) => b.votes - a.votes)
      .slice(0, limit);
  }

  /**
   * Get recent feedback
   */
  getRecentFeedback(limit = 20) {
    const allFeedback = [
      ...this.feedback.ratings.map(r => ({ ...r, type: 'rating' })),
      ...this.feedback.featureRequests.map(r => ({ ...r, type: 'feature' })),
      ...this.feedback.bugReports.map(r => ({ ...r, type: 'bug' })),
      ...this.feedback.nps.map(r => ({ ...r, type: 'nps' }))
    ];
    
    return allFeedback
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  /**
   * Get feedback summary
   */
  getFeedbackSummary() {
    return {
      totalRatings: this.feedback.ratings.length,
      averageRating: this.getAverageRating(),
      npsScore: this.calculateNPS(),
      sentiment: this.getSentimentAnalysis(),
      featureRequests: this.feedback.featureRequests.length,
      bugReports: this.feedback.bugReports.length,
      surveys: this.feedback.surveys.length
    };
  }

  /**
   * Export feedback data
   */
  exportFeedback() {
    const summary = this.getFeedbackSummary();
    const report = {
      summary,
      topFeatures: this.getTopFeatureRequests(5),
      recentFeedback: this.getRecentFeedback(10),
      generatedAt: new Date().toISOString()
    };
    
    return JSON.stringify(report, null, 2);
  }

  /**
   * Reset all feedback (for testing)
   */
  resetFeedback() {
    this.feedback = {
      surveys: [],
      ratings: [],
      featureRequests: [],
      bugReports: [],
      nps: [],
      sentiment: {
        positive: 0,
        neutral: 0,
        negative: 0
      }
    };
    this.saveFeedback();
    console.log('[Feedback] All feedback reset');
  }
}

export default new FeedbackService();
