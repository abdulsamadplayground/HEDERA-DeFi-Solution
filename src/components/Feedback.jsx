import { useState, useEffect } from 'react';
import FeedbackService from '../services/FeedbackService';
import './Feedback.css';

function Feedback({ accountId }) {
  const [activeTab, setActiveTab] = useState('rate');
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState('overall');
  const [comment, setComment] = useState('');
  const [npsScore, setNpsScore] = useState(-1);
  const [npsReason, setNpsReason] = useState('');
  const [featureTitle, setFeatureTitle] = useState('');
  const [featureDesc, setFeatureDesc] = useState('');
  const [summary, setSummary] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = () => {
    const data = FeedbackService.getFeedbackSummary();
    setSummary(data);
  };

  const handleRatingSubmit = () => {
    if (rating === 0) {
      setMessage('Please select a rating');
      return;
    }

    FeedbackService.submitRating(accountId, rating, category, comment);
    setMessage('✅ Thank you for your feedback!');
    setRating(0);
    setComment('');
    loadSummary();
    setTimeout(() => setMessage(''), 3000);
  };

  const handleNPSSubmit = () => {
    if (npsScore === -1) {
      setMessage('Please select a score');
      return;
    }

    FeedbackService.submitNPS(accountId, npsScore, npsReason);
    setMessage('✅ Thank you for your feedback!');
    setNpsScore(-1);
    setNpsReason('');
    loadSummary();
    setTimeout(() => setMessage(''), 3000);
  };

  const handleFeatureSubmit = () => {
    if (!featureTitle.trim()) {
      setMessage('Please enter a title');
      return;
    }

    FeedbackService.submitFeatureRequest(accountId, featureTitle, featureDesc);
    setMessage('✅ Feature request submitted!');
    setFeatureTitle('');
    setFeatureDesc('');
    loadSummary();
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="feedback-container">
      <h2>💬 Feedback & Suggestions</h2>

      {message && (
        <div className={`feedback-message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="feedback-tabs">
        <button 
          className={`tab-btn ${activeTab === 'rate' ? 'active' : ''}`}
          onClick={() => setActiveTab('rate')}
        >
          ⭐ Rate Us
        </button>
        <button 
          className={`tab-btn ${activeTab === 'nps' ? 'active' : ''}`}
          onClick={() => setActiveTab('nps')}
        >
          📊 NPS Score
        </button>
        <button 
          className={`tab-btn ${activeTab === 'feature' ? 'active' : ''}`}
          onClick={() => setActiveTab('feature')}
        >
          💡 Request Feature
        </button>
        <button 
          className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          📈 Summary
        </button>
      </div>

      <div className="feedback-content">
        {activeTab === 'rate' && (
          <div className="feedback-form">
            <h3>Rate Your Experience</h3>
            
            <div className="rating-selector">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  className={`star-btn ${rating >= star ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                >
                  ⭐
                </button>
              ))}
            </div>

            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="feedback-select"
            >
              <option value="overall">Overall Experience</option>
              <option value="games">Games</option>
              <option value="quests">Quests</option>
              <option value="ui">User Interface</option>
              <option value="performance">Performance</option>
            </select>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us more about your experience (optional)"
              className="feedback-textarea"
              rows="4"
            />

            <button onClick={handleRatingSubmit} className="btn btn-primary">
              Submit Rating
            </button>
          </div>
        )}

        {activeTab === 'nps' && (
          <div className="feedback-form">
            <h3>How likely are you to recommend us?</h3>
            <p className="nps-subtitle">0 = Not likely, 10 = Very likely</p>
            
            <div className="nps-selector">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
                <button
                  key={score}
                  className={`nps-btn ${npsScore === score ? 'active' : ''} ${score <= 6 ? 'detractor' : score <= 8 ? 'passive' : 'promoter'}`}
                  onClick={() => setNpsScore(score)}
                >
                  {score}
                </button>
              ))}
            </div>

            <textarea
              value={npsReason}
              onChange={(e) => setNpsReason(e.target.value)}
              placeholder="What's the main reason for your score? (optional)"
              className="feedback-textarea"
              rows="4"
            />

            <button onClick={handleNPSSubmit} className="btn btn-primary">
              Submit Score
            </button>
          </div>
        )}

        {activeTab === 'feature' && (
          <div className="feedback-form">
            <h3>Request a Feature</h3>
            
            <input
              type="text"
              value={featureTitle}
              onChange={(e) => setFeatureTitle(e.target.value)}
              placeholder="Feature title"
              className="feedback-input"
            />

            <textarea
              value={featureDesc}
              onChange={(e) => setFeatureDesc(e.target.value)}
              placeholder="Describe the feature you'd like to see"
              className="feedback-textarea"
              rows="6"
            />

            <button onClick={handleFeatureSubmit} className="btn btn-primary">
              Submit Request
            </button>
          </div>
        )}

        {activeTab === 'summary' && summary && (
          <div className="feedback-summary">
            <h3>Feedback Summary</h3>
            
            <div className="summary-grid">
              <div className="summary-card">
                <div className="summary-value">{summary.totalRatings}</div>
                <div className="summary-label">Total Ratings</div>
              </div>
              <div className="summary-card">
                <div className="summary-value">{summary.averageRating} ⭐</div>
                <div className="summary-label">Average Rating</div>
              </div>
              <div className="summary-card">
                <div className="summary-value">{summary.npsScore}</div>
                <div className="summary-label">NPS Score</div>
              </div>
              <div className="summary-card">
                <div className="summary-value">{summary.featureRequests}</div>
                <div className="summary-label">Feature Requests</div>
              </div>
            </div>

            <div className="sentiment-analysis">
              <h4>Sentiment Analysis</h4>
              <div className="sentiment-bars">
                <div className="sentiment-bar">
                  <span className="sentiment-label">Positive</span>
                  <div className="sentiment-progress">
                    <div 
                      className="sentiment-fill positive"
                      style={{ width: `${summary.sentiment.positive}%` }}
                    ></div>
                  </div>
                  <span className="sentiment-value">{summary.sentiment.positive}%</span>
                </div>
                <div className="sentiment-bar">
                  <span className="sentiment-label">Neutral</span>
                  <div className="sentiment-progress">
                    <div 
                      className="sentiment-fill neutral"
                      style={{ width: `${summary.sentiment.neutral}%` }}
                    ></div>
                  </div>
                  <span className="sentiment-value">{summary.sentiment.neutral}%</span>
                </div>
                <div className="sentiment-bar">
                  <span className="sentiment-label">Negative</span>
                  <div className="sentiment-progress">
                    <div 
                      className="sentiment-fill negative"
                      style={{ width: `${summary.sentiment.negative}%` }}
                    ></div>
                  </div>
                  <span className="sentiment-value">{summary.sentiment.negative}%</span>
                </div>
              </div>
              <div className="sentiment-overall">
                Overall Sentiment: <strong>{summary.sentiment.overall}</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Feedback;
