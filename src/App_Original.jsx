import React, { useState, useEffect } from 'react';
import './App.css';
import HederaService from './services/HederaService';
import MetaMaskService from './services/MetaMaskService';

function App() {
  const [accountId, setAccountId] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [connectionMethod, setConnectionMethod] = useState('metamask'); // 'metamask' or 'privatekey'
  const [ethereumAddress, setEthereumAddress] = useState('');

  useEffect(() => {
    console.log('[App] Component mounted');
    console.log('[App] MetaMask installed:', MetaMaskService.isMetaMaskInstalled());
  }, []);

  const handleMetaMaskConnect = async () => {
    console.log('[App] ========================================');
    console.log('[App] Initiating MetaMask connection...');
    console.log('[App] ========================================');
    
    setLoading(true);
    setMessage('Connecting to MetaMask...');
    
    try {
      const result = await MetaMaskService.connect();
      console.log('[App] MetaMask connection result:', result);
      
      setAccountId(result.accountId);
      setEthereumAddress(result.ethereumAddress);
      
      console.log('[App] Initializing HederaService with MetaMask...');
      HederaService.initializeWithMetaMask(MetaMaskService, result.accountId, result.privateKey);
      
      setIsConnected(true);
      setMessage('✅ Connected to Hedera Testnet via MetaMask!');
      
      console.log('[App] ========================================');
      console.log('[App] MetaMask connection successful!');
      console.log('[App] Hedera Account:', result.accountId);
      console.log('[App] Ethereum Address:', result.ethereumAddress);
      console.log('[App] ========================================');
      
    } catch (error) {
      console.error('[App] ========================================');
      console.error('[App] MetaMask connection failed!');
      console.error('[App] Error:', error);
      console.error('[App] ========================================');
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePrivateKeyConnect = () => {
    console.log('[App] ========================================');
    console.log('[App] Connecting with private key...');
    console.log('[App] Account ID:', accountId);
    console.log('[App] ========================================');
    
    if (accountId && privateKey) {
      try {
        HederaService.initialize(accountId, privateKey);
        setIsConnected(true);
        setMessage('✅ Connected to Hedera Testnet!');
        
        console.log('[App] ========================================');
        console.log('[App] Private key connection successful!');
        console.log('[App] ========================================');
      } catch (error) {
        console.error('[App] ========================================');
        console.error('[App] Private key connection failed!');
        console.error('[App] Error:', error);
        console.error('[App] ========================================');
        setMessage(`❌ Error: ${error.message}`);
      }
    } else {
      setMessage('❌ Please enter both Account ID and Private Key');
    }
  };

  const handleAction = async (actionType) => {
    console.log('[App] ========================================');
    console.log('[App] User initiated action:', actionType);
    console.log('[App] ========================================');
    
    setLoading(true);
    setMessage(`⏳ Processing ${actionType}...`);
    
    try {
      const receipt = await HederaService.performAction(actionType, accountId);
      setReceipts([receipt, ...receipts]);
      setMessage(`✅ ${actionType} successful! NFT Receipt minted.`);
      
      console.log('[App] ========================================');
      console.log('[App] Action completed successfully!');
      console.log('[App] New receipt added to list');
      console.log('[App] Total receipts:', receipts.length + 1);
      console.log('[App] ========================================');
      
    } catch (error) {
      console.error('[App] ========================================');
      console.error('[App] Action failed!');
      console.error('[App] Error:', error);
      console.error('[App] ========================================');
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    console.log('[App] ========================================');
    console.log('[App] Disconnecting...');
    console.log('[App] ========================================');
    
    if (connectionMethod === 'metamask') {
      MetaMaskService.disconnect();
    }
    
    setIsConnected(false);
    setAccountId('');
    setPrivateKey('');
    setEthereumAddress('');
    setReceipts([]);
    setMessage('');
    
    console.log('[App] Disconnected successfully');
  };

  return (
    <div className="app">
      <div className="container">
        <h1>🎫 Hedera NFT Receipt System</h1>
        <p className="subtitle">Every action gets an immutable NFT receipt on Hedera</p>

        {!isConnected ? (
          <div className="connect-section">
            <h2>Connect Your Hedera Account</h2>
            
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
                      <p style={{ marginTop: '15px', fontSize: '0.9rem', color: '#666' }}>
                        After installing, refresh this page.
                      </p>
                    </div>
                  ) : (
                    <button 
                      onClick={handleMetaMaskConnect} 
                      className="btn btn-primary btn-metamask"
                      disabled={loading}
                    >
                      {loading ? '⏳ Connecting...' : '🦊 Connect with MetaMask'}
                    </button>
                  )}
                  
                  <div className="info-box">
                    <p><strong>Requirements:</strong></p>
                    <ul>
                      <li>MetaMask extension installed</li>
                      <li>Hedera testnet configured in MetaMask</li>
                      <li>Your Hedera account ID ready</li>
                    </ul>
                  </div>
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
                    Connect to Testnet
                  </button>
                  <div className="info-box">
                    <p><strong>Need a testnet account?</strong></p>
                    <p>Visit <a href="https://portal.hedera.com" target="_blank" rel="noopener noreferrer">portal.hedera.com</a> to create one</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="account-info">
              <div className="account-details">
                <p>
                  {connectionMethod === 'metamask' ? '🦊' : '🔑'} Connected: <strong>{accountId}</strong>
                </p>
                {ethereumAddress && (
                  <p className="eth-address">
                    Ethereum: <strong>{ethereumAddress.substring(0, 6)}...{ethereumAddress.substring(38)}</strong>
                  </p>
                )}
              </div>
              <button onClick={handleDisconnect} className="btn btn-disconnect">
                Disconnect
              </button>
            </div>

            <div className="actions-section">
              <h2>Perform Actions</h2>
              <div className="action-buttons">
                <button 
                  onClick={() => handleAction('Buy')} 
                  disabled={loading}
                  className="btn btn-action btn-buy"
                >
                  🛒 Buy Product
                </button>
                <button 
                  onClick={() => handleAction('Register')} 
                  disabled={loading}
                  className="btn btn-action btn-register"
                >
                  📝 Register Service
                </button>
                <button 
                  onClick={() => handleAction('Subscribe')} 
                  disabled={loading}
                  className="btn btn-action btn-subscribe"
                >
                  ⭐ Subscribe
                </button>
                <button 
                  onClick={() => handleAction('Donate')} 
                  disabled={loading}
                  className="btn btn-action btn-donate"
                >
                  💝 Donate
                </button>
              </div>
            </div>

            {message && (
              <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                {message}
              </div>
            )}

            {receipts.length > 0 && (
              <div className="receipts-section">
                <h2>Your NFT Receipts</h2>
                <div className="receipts-grid">
                  {receipts.map((receipt, index) => (
                    <div key={index} className="receipt-card">
                      <div className="receipt-header">
                        <span className="receipt-type">{receipt.action}</span>
                        <span className="receipt-date">{receipt.timestamp}</span>
                      </div>
                      <div className="receipt-body">
                        <p><strong>NFT ID:</strong> {receipt.nftId}</p>
                        <p><strong>Serial:</strong> {receipt.serialNumber}</p>
                        <p><strong>Transaction:</strong> {receipt.transactionId}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
