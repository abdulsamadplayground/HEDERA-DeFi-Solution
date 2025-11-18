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

      // Prompt user to enter their Hedera credentials
      const accountId = prompt(
        'Please enter your Hedera Testnet Account ID (format: 0.0.xxxxx):\n\n' +
        'Note: MetaMask is used for connection, but Hedera transactions require your private key.'
      );

      if (!accountId || !/^0\.0\.\d+$/.test(accountId)) {
        throw new Error('Invalid Hedera account ID format. Expected: 0.0.xxxxx');
      }

      const privateKey = prompt(
        'Please enter your Hedera Private Key:\n\n' +
        'This will be stored locally and used to sign transactions.\n' +
        'Your key never leaves your browser.'
      );

      if (!privateKey) {
        throw new Error('Private key is required for Hedera transactions');
      }
      
      // Store for future use
      localStorage.setItem('hedera_account_id', accountId);
      localStorage.setItem('hedera_private_key', privateKey);
      console.log('[MetaMask] Hedera credentials saved');
      console.log('[MetaMask] Account ID:', accountId);

      return {
        accountId,
        privateKey
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
