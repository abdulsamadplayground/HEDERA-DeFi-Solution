import { 
  Client, 
  AccountId
} from '@hashgraph/sdk';

class MetaMaskService {
  constructor() {
    this.ethereum = null;
    this.accountId = null;
    this.privateKey = null;
    this.client = null;
    this.isConnected = false;
  }

  /**
   * Check if MetaMask is installed
   */
  isMetaMaskInstalled() {
    const hasWindow = typeof window !== 'undefined';
    const hasEthereum = hasWindow && typeof window.ethereum !== 'undefined';
    const isMetaMask = hasEthereum && window.ethereum.isMetaMask;
    
    console.log('[MetaMask] Installation check:');
    console.log('[MetaMask] - Window exists:', hasWindow);
    console.log('[MetaMask] - Ethereum provider exists:', hasEthereum);
    console.log('[MetaMask] - Is MetaMask:', isMetaMask);
    
    if (hasEthereum && !isMetaMask) {
      console.warn('[MetaMask] Ethereum provider detected but it may not be MetaMask');
      console.warn('[MetaMask] Provider:', window.ethereum);
    }
    
    return hasEthereum; // Return true if any ethereum provider exists
  }

  /**
   * Connect to MetaMask and get Hedera account
   */
  async connect() {
    console.log('[MetaMask] ========================================');
    console.log('[MetaMask] Initiating connection...');
    console.log('[MetaMask] User Agent:', navigator.userAgent);
    console.log('[MetaMask] ========================================');
    
    // Wait a bit for MetaMask to inject
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (!this.isMetaMaskInstalled()) {
      const error = 'MetaMask is not installed. Please install MetaMask extension from https://metamask.io/';
      console.error('[MetaMask]', error);
      console.error('[MetaMask] If you have MetaMask installed, try refreshing the page.');
      throw new Error(error);
    }

    try {
      this.ethereum = window.ethereum;
      console.log('[MetaMask] Ethereum provider:', this.ethereum);
      console.log('[MetaMask] Provider is MetaMask:', this.ethereum.isMetaMask);
      console.log('[MetaMask] Requesting accounts...');
      
      // Request account access
      const accounts = await this.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      console.log('[MetaMask] Accounts received:', accounts.length, 'account(s)');

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found in MetaMask');
      }

      // Get the Hedera account ID from MetaMask
      // Note: User should have their Hedera testnet configured in MetaMask
      const ethereumAddress = accounts[0];
      console.log('[MetaMask] Connected Ethereum address:', ethereumAddress);

      // Request Hedera-specific data if available
      await this.switchToHederaNetwork();

      // Get Hedera credentials from user
      const credentials = await this.getHederaCredentials();
      
      if (!credentials) {
        throw new Error('Hedera credentials required.');
      }

      this.accountId = AccountId.fromString(credentials.accountId);
      this.privateKey = credentials.privateKey;
      console.log('[MetaMask] Hedera Account ID:', this.accountId.toString());

      // Initialize Hedera client for testnet
      this.client = Client.forTestnet();
      console.log('[MetaMask] Hedera client initialized for testnet');

      this.isConnected = true;
      console.log('[MetaMask] Connection successful!');

      // Listen for account changes
      this.setupEventListeners();

      return {
        accountId: this.accountId.toString(),
        privateKey: this.privateKey,
        ethereumAddress
      };

    } catch (error) {
      console.error('[MetaMask] Connection error:', error);
      throw error;
    }
  }

  /**
   * Switch to Hedera testnet network in MetaMask
   */
  async switchToHederaNetwork() {
    console.log('[MetaMask] Attempting to switch to Hedera testnet...');
    
    try {
      // Try to switch to Hedera testnet
      await this.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x128' }], // 296 in hex (Hedera testnet)
      });
      console.log('[MetaMask] Switched to Hedera testnet');
    } catch (switchError) {
      console.log('[MetaMask] Network switch error:', switchError);
      
      // If network doesn't exist, add it
      if (switchError.code === 4902) {
        console.log('[MetaMask] Adding Hedera testnet network...');
        try {
          await this.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x128',
              chainName: 'Hedera Testnet',
              nativeCurrency: {
                name: 'HBAR',
                symbol: 'HBAR',
                decimals: 8
              },
              rpcUrls: ['https://testnet.hashio.io/api'],
              blockExplorerUrls: ['https://hashscan.io/testnet']
            }]
          });
          console.log('[MetaMask] Hedera testnet network added successfully');
        } catch (addError) {
          console.error('[MetaMask] Failed to add Hedera network:', addError);
          throw addError;
        }
      } else {
        throw switchError;
      }
    }
  }

  /**
   * Get Hedera account ID and private key from user
   * MetaMask doesn't have direct Hedera support, so we need the private key
   */
  async getHederaCredentials() {
    console.log('[MetaMask] Retrieving Hedera credentials...');
    
    try {
      // Try to get from localStorage
      const storedAccountId = localStorage.getItem('hedera_account_id');
      const storedPrivateKey = localStorage.getItem('hedera_private_key');
      
      if (storedAccountId && storedPrivateKey) {
        console.log('[MetaMask] Found stored Hedera credentials');
        console.log('[MetaMask] Account ID:', storedAccountId);
        return {
          accountId: storedAccountId,
          privateKey: storedPrivateKey
        };
      }

      // Prompt user to enter their Hedera credentials with clear instructions
      const accountId = prompt(
        '🔐 STEP 1: Hedera Account ID\n\n' +
        '⚠️ IMPORTANT: Enter your ACCOUNT ID, NOT your private key!\n\n' +
        'Format: 0.0.xxxxx\n' +
        'Examples: 0.0.12345 or 0.0.7261784\n\n' +
        '❌ DO NOT enter your private key here\n' +
        '❌ Private key is long (64+ characters)\n' +
        '✅ Account ID is short (0.0.xxxxx format)\n\n' +
        'Get testnet account at: portal.hedera.com'
      );

      if (!accountId) {
        throw new Error('❌ Hedera Account ID is required. Please try again.');
      }

      const trimmedAccountId = accountId.trim();
      
      // Check if user entered private key instead of account ID
      if (trimmedAccountId.length > 20) {
        throw new Error(
          '❌ You entered a PRIVATE KEY, not an Account ID!\n\n' +
          'Account ID format: 0.0.xxxxx (short)\n' +
          'Private Key: Long hex string (64+ chars)\n\n' +
          'Please refresh and enter your Account ID (0.0.xxxxx)'
        );
      }

      if (!/^0\.0\.\d+$/.test(trimmedAccountId)) {
        throw new Error(
          '❌ Invalid Account ID format!\n\n' +
          'Expected: 0.0.xxxxx (e.g., 0.0.12345)\n' +
          'You entered: ' + trimmedAccountId + '\n\n' +
          'Make sure to include the dots: 0.0.12345'
        );
      }

      const privateKey = prompt(
        '🔑 STEP 2: Hedera Private Key\n\n' +
        'Now enter your Hedera Testnet PRIVATE KEY\n' +
        '(This is the long hex string)\n\n' +
        'Format: Long string of letters and numbers\n' +
        'Example: 302e020100300506032b657004220420...\n\n' +
        '✅ Stored locally in your browser\n' +
        '✅ Never sent to any server\n' +
        '✅ Used only for Hedera transactions'
      );

      if (!privateKey) {
        throw new Error('❌ Hedera Private Key is required. Please try again.');
      }

      if (privateKey.trim().length < 32) {
        throw new Error(
          '❌ Private key seems too short!\n\n' +
          'Private keys are usually 64+ characters long.\n' +
          'Please check and enter the complete private key.'
        );
      }
      
      // Store for future use
      localStorage.setItem('hedera_account_id', trimmedAccountId);
      localStorage.setItem('hedera_private_key', privateKey.trim());
      console.log('[MetaMask] Hedera credentials saved');
      console.log('[MetaMask] Account ID:', trimmedAccountId);

      return {
        accountId: trimmedAccountId,
        privateKey: privateKey.trim()
      };
    } catch (error) {
      console.error('[MetaMask] Error getting Hedera credentials:', error);
      throw error;
    }
  }

  /**
   * Setup event listeners for MetaMask
   */
  setupEventListeners() {
    console.log('[MetaMask] Setting up event listeners...');
    
    if (!this.ethereum) return;

    // Account changed
    this.ethereum.on('accountsChanged', (accounts) => {
      console.log('[MetaMask] Accounts changed:', accounts);
      if (accounts.length === 0) {
        console.log('[MetaMask] User disconnected');
        this.disconnect();
      } else {
        console.log('[MetaMask] Account switched to:', accounts[0]);
        // Optionally reload or update UI
        window.location.reload();
      }
    });

    // Chain changed
    this.ethereum.on('chainChanged', (chainId) => {
      console.log('[MetaMask] Chain changed to:', chainId);
      // Reload the page as recommended by MetaMask
      window.location.reload();
    });

    console.log('[MetaMask] Event listeners configured');
  }

  /**
   * Get private key for signing
   */
  getPrivateKey() {
    console.log('[MetaMask] Retrieving private key for signing');
    return this.privateKey;
  }

  /**
   * Disconnect from MetaMask
   */
  disconnect() {
    console.log('[MetaMask] Disconnecting...');
    this.accountId = null;
    this.privateKey = null;
    this.client = null;
    this.isConnected = false;
    // Clear stored credentials
    localStorage.removeItem('hedera_account_id');
    localStorage.removeItem('hedera_private_key');
    console.log('[MetaMask] Disconnected and credentials cleared');
  }

  /**
   * Get current account info
   */
  getAccountInfo() {
    const info = {
      accountId: this.accountId?.toString(),
      isConnected: this.isConnected
    };
    console.log('[MetaMask] Account info:', info);
    return info;
  }
}

export default new MetaMaskService();
