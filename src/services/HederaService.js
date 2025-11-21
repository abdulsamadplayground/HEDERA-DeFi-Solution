import {
  Client,
  PrivateKey,
  AccountId,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  TokenMintTransaction,
  TransferTransaction,
  TokenAssociateTransaction
} from '@hashgraph/sdk';

class HederaService {
  constructor() {
    this.client = null;
    this.operatorId = null;
    this.operatorKey = null;
    this.nftTokenId = null;
    this.useMetaMask = false;
    this.metaMaskService = null;
  }

  /**
   * Initialize with private key (legacy method)
   */
  initialize(accountId, privateKey) {
    console.log('[HederaService] Initializing with private key...');
    console.log('[HederaService] Account ID:', accountId);
    console.log('[HederaService] Private Key (first 10 chars):', privateKey.substring(0, 10) + '...');
    
    try {
      this.operatorId = AccountId.fromString(accountId);
      
      // Handle both hex and DER formats
      let key;
      let cleanKey = privateKey.trim();
      
      // Remove 0x prefix if present (Ethereum format)
      if (cleanKey.startsWith('0x') || cleanKey.startsWith('0X')) {
        cleanKey = cleanKey.substring(2);
        console.log('[HederaService] Removed 0x prefix from key');
      }
      
      // Try to parse the private key
      try {
        // Try ED25519 first (most common for Hedera)
        key = PrivateKey.fromStringED25519(cleanKey);
        console.log('[HederaService] Using ED25519 key');
      } catch (e) {
        try {
          // Try ECDSA
          key = PrivateKey.fromStringECDSA(cleanKey);
          console.log('[HederaService] Using ECDSA key');
        } catch (e2) {
          try {
            // Try raw hex string (32 bytes)
            if (cleanKey.length === 64) {
              key = PrivateKey.fromBytesED25519(Buffer.from(cleanKey, 'hex'));
              console.log('[HederaService] Using ED25519 key from hex bytes');
            } else {
              throw new Error('Invalid key length');
            }
          } catch (e3) {
            console.error('[HederaService] All key parsing attempts failed');
            console.error('[HederaService] Key length:', cleanKey.length);
            console.error('[HederaService] ED25519 error:', e.message);
            console.error('[HederaService] ECDSA error:', e2.message);
            throw new Error('Invalid private key format. Expected Hedera DER format or 64-character hex string.');
          }
        }
      }
      
      this.operatorKey = key;
      
      this.client = Client.forTestnet();
      this.client.setOperator(this.operatorId, this.operatorKey);
      this.useMetaMask = false;
      
      console.log('[HederaService] Initialized successfully with private key');
      console.log('[HederaService] Public Key:', this.operatorKey.publicKey.toString());
    } catch (error) {
      console.error('[HederaService] Initialization error:', error);
      throw error;
    }
  }

  /**
   * Initialize with MetaMask
   */
  initializeWithMetaMask(metaMaskService, accountId, privateKey) {
    console.log('[HederaService] Initializing with MetaMask...');
    console.log('[HederaService] Account ID:', accountId);
    console.log('[HederaService] Private Key (first 10 chars):', privateKey.substring(0, 10) + '...');
    
    try {
      this.metaMaskService = metaMaskService;
      this.operatorId = AccountId.fromString(accountId);
      
      // Handle both hex and DER formats
      let key;
      let cleanKey = privateKey.trim();
      
      // Remove 0x prefix if present (Ethereum format)
      if (cleanKey.startsWith('0x') || cleanKey.startsWith('0X')) {
        cleanKey = cleanKey.substring(2);
        console.log('[HederaService] Removed 0x prefix from key');
      }
      
      // Try to parse the private key
      try {
        // Try ED25519 first (most common for Hedera)
        key = PrivateKey.fromStringED25519(cleanKey);
        console.log('[HederaService] Using ED25519 key');
      } catch (e) {
        try {
          // Try ECDSA
          key = PrivateKey.fromStringECDSA(cleanKey);
          console.log('[HederaService] Using ECDSA key');
        } catch (e2) {
          try {
            // Try raw hex string (32 bytes)
            if (cleanKey.length === 64) {
              key = PrivateKey.fromBytesED25519(Buffer.from(cleanKey, 'hex'));
              console.log('[HederaService] Using ED25519 key from hex bytes');
            } else {
              throw new Error('Invalid key length');
            }
          } catch (e3) {
            console.error('[HederaService] All key parsing attempts failed');
            console.error('[HederaService] Key length:', cleanKey.length);
            console.error('[HederaService] ED25519 error:', e.message);
            console.error('[HederaService] ECDSA error:', e2.message);
            throw new Error('Invalid private key format. Expected Hedera DER format or 64-character hex string.');
          }
        }
      }
      
      this.operatorKey = key;
      
      this.client = Client.forTestnet();
      this.client.setOperator(this.operatorId, this.operatorKey);
      this.useMetaMask = true;
      
      console.log('[HederaService] Initialized successfully with MetaMask');
      console.log('[HederaService] Public Key:', this.operatorKey.publicKey.toString());
      console.log('[HederaService] Client operator set');
    } catch (error) {
      console.error('[HederaService] Initialization error:', error);
      throw error;
    }
  }

  async createNFTCollection() {
    console.log('[HederaService] Creating NFT collection...');
    
    if (this.nftTokenId) {
      console.log('[HederaService] NFT collection already exists:', this.nftTokenId.toString());
      return this.nftTokenId;
    }

    try {
      console.log('[HederaService] Building TokenCreateTransaction...');
      const transaction = new TokenCreateTransaction()
        .setTokenName('Receipt NFT Collection')
        .setTokenSymbol('RCPT')
        .setTokenType(TokenType.NonFungibleUnique)
        .setDecimals(0)
        .setInitialSupply(0)
        .setTreasuryAccountId(this.operatorId)
        .setSupplyType(TokenSupplyType.Infinite)
        .setSupplyKey(this.operatorKey)
        .setAdminKey(this.operatorKey);

      console.log('[HederaService] Using operator key for collection');
      console.log('[HederaService] Treasury Account:', this.operatorId.toString());
      console.log('[HederaService] Supply Key:', this.operatorKey.publicKey.toString());
      console.log('[HederaService] Freezing transaction...');
      const frozenTx = transaction.freezeWith(this.client);

      console.log('[HederaService] Signing with private key...');
      const signedTx = await frozenTx.sign(this.operatorKey);
      console.log('[HederaService] Executing transaction...');
      const txResponse = await signedTx.execute(this.client);

      console.log('[HederaService] Transaction ID:', txResponse.transactionId.toString());
      console.log('[HederaService] Getting receipt...');
      const receipt = await txResponse.getReceipt(this.client);
      
      this.nftTokenId = receipt.tokenId;
      console.log('[HederaService] NFT collection created successfully!');
      console.log('[HederaService] Token ID:', this.nftTokenId.toString());
      
      return this.nftTokenId;
    } catch (error) {
      console.error('[HederaService] Error creating NFT collection:', error);
      throw error;
    }
  }

  async mintNFTReceipt(action, metadata) {
    console.log('[HederaService] Minting NFT receipt...');
    console.log('[HederaService] Action:', action);
    console.log('[HederaService] Metadata:', metadata);
    
    try {
      const tokenId = await this.createNFTCollection();

      const metadataObj = {
        action,
        timestamp: new Date().toISOString(),
        ...metadata
      };
      console.log('[HederaService] NFT metadata:', metadataObj);
      
      const metadataString = JSON.stringify(metadataObj);
      // Convert string to Uint8Array (browser-compatible)
      const encoder = new TextEncoder();
      const metadataBytes = encoder.encode(metadataString);
      console.log('[HederaService] Metadata size:', metadataBytes.length, 'bytes');

      console.log('[HederaService] Building TokenMintTransaction...');
      const mintTx = new TokenMintTransaction()
        .setTokenId(tokenId)
        .setMetadata([metadataBytes]);

      console.log('[HederaService] Freezing mint transaction...');
      const frozenMintTx = mintTx.freezeWith(this.client);

      console.log('[HederaService] Signing mint with private key...');
      const signedMintTx = await frozenMintTx.sign(this.operatorKey);
      console.log('[HederaService] Executing mint transaction...');
      const mintResponse = await signedMintTx.execute(this.client);

      console.log('[HederaService] Mint transaction ID:', mintResponse.transactionId.toString());
      console.log('[HederaService] Getting mint receipt...');
      const mintReceipt = await mintResponse.getReceipt(this.client);

      const result = {
        tokenId: tokenId.toString(),
        serialNumber: mintReceipt.serials[0].toString(),
        transactionId: mintResponse.transactionId.toString()
      };

      console.log('[HederaService] NFT minted successfully!');
      console.log('[HederaService] Result:', result);

      return result;
    } catch (error) {
      console.error('[HederaService] Error minting NFT receipt:', error);
      throw error;
    }
  }

  async performAction(actionType, recipientAccountId) {
    console.log('[HederaService] ========================================');
    console.log('[HederaService] Performing action:', actionType);
    console.log('[HederaService] Recipient:', recipientAccountId);
    console.log('[HederaService] Connection method:', this.useMetaMask ? 'MetaMask' : 'Private Key');
    console.log('[HederaService] ========================================');
    
    try {
      const metadata = {
        recipient: recipientAccountId,
        actionType: actionType,
        amount: this.getActionAmount(actionType)
      };

      console.log('[HederaService] Starting NFT receipt minting...');
      const result = await this.mintNFTReceipt(actionType, metadata);

      const receipt = {
        action: actionType,
        nftId: result.tokenId,
        serialNumber: result.serialNumber,
        transactionId: result.transactionId,
        timestamp: new Date().toLocaleString()
      };

      console.log('[HederaService] ========================================');
      console.log('[HederaService] Action completed successfully!');
      console.log('[HederaService] Receipt:', receipt);
      console.log('[HederaService] ========================================');

      return receipt;
    } catch (error) {
      console.error('[HederaService] ========================================');
      console.error('[HederaService] Action failed!');
      console.error('[HederaService] Error:', error);
      console.error('[HederaService] ========================================');
      throw error;
    }
  }

  /**
   * Perform a DeFi staking action
   */
  async performStake(accountId, amount) {
    console.log('[HederaService] ========================================');
    console.log('[HederaService] Performing STAKE action');
    console.log('[HederaService] Amount:', amount, 'HBAR');
    console.log('[HederaService] ========================================');

    try {
      const metadata = {
        action: 'stake',
        amount: amount,
        account: accountId
      };

      const result = await this.mintNFTReceipt('Stake', metadata);

      const receipt = {
        action: 'Stake',
        amount: amount,
        nftId: result.tokenId,
        serialNumber: result.serialNumber,
        transactionId: result.transactionId,
        timestamp: new Date().toLocaleString(),
        verified: true
      };

      console.log('[HederaService] ========================================');
      console.log('[HederaService] Stake completed successfully!');
      console.log('[HederaService] ========================================');

      return receipt;
    } catch (error) {
      console.error('[HederaService] Stake failed:', error);
      throw error;
    }
  }

  /**
   * Perform a DeFi liquidity provision action
   */
  async performLiquidityProvision(accountId, amount) {
    console.log('[HederaService] ========================================');
    console.log('[HederaService] Performing LIQUIDITY PROVISION action');
    console.log('[HederaService] Amount:', amount, 'HBAR');
    console.log('[HederaService] ========================================');

    try {
      const metadata = {
        action: 'liquidity',
        amount: amount,
        account: accountId
      };

      const result = await this.mintNFTReceipt('Provide Liquidity', metadata);

      const receipt = {
        action: 'Provide Liquidity',
        amount: amount,
        nftId: result.tokenId,
        serialNumber: result.serialNumber,
        transactionId: result.transactionId,
        timestamp: new Date().toLocaleString(),
        verified: true
      };

      console.log('[HederaService] ========================================');
      console.log('[HederaService] Liquidity provision completed successfully!');
      console.log('[HederaService] ========================================');

      return receipt;
    } catch (error) {
      console.error('[HederaService] Liquidity provision failed:', error);
      throw error;
    }
  }

  /**
   * Mint a quest completion badge NFT
   */
  async mintQuestBadge(accountId, questData) {
    console.log('[HederaService] ========================================');
    console.log('[HederaService] Minting QUEST BADGE');
    console.log('[HederaService] Quest:', questData.name);
    console.log('[HederaService] ========================================');

    try {
      const tokenId = await this.createNFTCollection();

      // Minimal metadata to stay under 100 bytes
      const metadataObj = {
        q: questData.id,  // shortened field name
        b: questData.rewards.badge.substring(0, 20),  // shortened badge name
        a: accountId
      };
      
      console.log('[HederaService] Badge metadata:', metadataObj);
      
      const metadataString = JSON.stringify(metadataObj);
      const encoder = new TextEncoder();
      const metadataBytes = encoder.encode(metadataString);
      console.log('[HederaService] Metadata size:', metadataBytes.length, 'bytes');

      console.log('[HederaService] Building TokenMintTransaction...');
      const mintTx = new TokenMintTransaction()
        .setTokenId(tokenId)
        .setMetadata([metadataBytes]);

      console.log('[HederaService] Freezing mint transaction...');
      const frozenMintTx = mintTx.freezeWith(this.client);

      console.log('[HederaService] Signing mint with private key...');
      const signedMintTx = await frozenMintTx.sign(this.operatorKey);
      console.log('[HederaService] Executing mint transaction...');
      const mintResponse = await signedMintTx.execute(this.client);

      console.log('[HederaService] Mint transaction ID:', mintResponse.transactionId.toString());
      console.log('[HederaService] Getting mint receipt...');
      const mintReceipt = await mintResponse.getReceipt(this.client);

      const receipt = {
        action: 'Quest Badge',
        questName: questData.name,
        badge: questData.rewards.badge,
        nftId: tokenId.toString(),
        serialNumber: mintReceipt.serials[0].toString(),
        transactionId: mintResponse.transactionId.toString(),
        timestamp: new Date().toLocaleString(),
        verified: true
      };

      console.log('[HederaService] ========================================');
      console.log('[HederaService] Quest badge minted successfully!');
      console.log('[HederaService] ========================================');

      return receipt;
    } catch (error) {
      console.error('[HederaService] Quest badge minting failed:', error);
      throw error;
    }
  }

  getActionAmount(actionType) {
    const amounts = {
      'Buy': '50 HBAR',
      'Register': '10 HBAR',
      'Subscribe': '25 HBAR',
      'Donate': '5 HBAR'
    };
    return amounts[actionType] || '0 HBAR';
  }
}

export default new HederaService();


