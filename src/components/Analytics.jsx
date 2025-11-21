import { useState, useEffect } from 'react';
import AnalyticsService from '../services/AnalyticsService';
import './Analytics.css';

function Analytics() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = () => {
    const data = AnalyticsService.getDashboardMetrics();
    setMetrics(data);
  };

  const handleExport = () => {
    const exported = AnalyticsService.exportMetrics();
    const blob = new Blob([exported], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  if (!metrics) {
    return <div className="analytics-loading">Loading analytics...</div>;
  }

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>📊 Platform Analytics</h2>
        <button onClick={handleExport} className="btn btn-secondary">
          Export Data
        </button>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="card-icon">👥</div>
          <div className="card-content">
            <div className="card-value">{metrics.totalUsers}</div>
            <div className="card-label">Total Users</div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon">🔥</div>
          <div className="card-content">
            <div className="card-value">{metrics.dailyActiveUsers}</div>
            <div className="card-label">Daily Active Users</div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon">📅</div>
          <div className="card-content">
            <div className="card-value">{metrics.monthlyActiveUsers}</div>
            <div className="card-label">Monthly Active Users</div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon">💎</div>
          <div className="card-content">
            <div className="card-value">{metrics.totalHBARStaked}</div>
            <div className="card-label">HBAR Staked</div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon">🔄</div>
          <div className="card-content">
            <div className="card-value">{metrics.totalTransactions}</div>
            <div className="card-label">Total Transactions</div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon">⚡</div>
          <div className="card-content">
            <div className="card-value">{metrics.estimatedTPS}</div>
            <div className="card-label">Estimated TPS</div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon">🎮</div>
          <div className="card-content">
            <div className="card-value">{metrics.totalGamesPlayed}</div>
            <div className="card-label">Games Played</div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon">🎯</div>
          <div className="card-content">
            <div className="card-value">{metrics.totalQuestsCompleted}</div>
            <div className="card-label">Quests Completed</div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon">🎖️</div>
          <div className="card-content">
            <div className="card-value">{metrics.totalNFTsMinted}</div>
            <div className="card-label">NFTs Minted</div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon">⏱️</div>
          <div className="card-content">
            <div className="card-value">{metrics.averageSessionTime}s</div>
            <div className="card-label">Avg Session Time</div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon">📈</div>
          <div className="card-content">
            <div className="card-value">{metrics.engagementRate}%</div>
            <div className="card-label">Engagement Rate</div>
          </div>
        </div>
      </div>

      <div className="analytics-info">
        <h3>About These Metrics</h3>
        <ul>
          <li><strong>TPS:</strong> Estimated transactions per second contribution to Hedera network</li>
          <li><strong>Engagement Rate:</strong> Percentage of users active daily</li>
          <li><strong>Session Time:</strong> Average time users spend in the platform</li>
        </ul>
      </div>
    </div>
  );
}

export default Analytics;
