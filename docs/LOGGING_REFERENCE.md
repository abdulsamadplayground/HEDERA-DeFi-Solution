# Console Logging Reference

This document describes the comprehensive logging system implemented throughout the application.

## Log Format

All logs follow a consistent format:
```
[Component] Message
```

Components:
- `[App]` - Main application component
- `[MetaMask]` - MetaMask service operations
- `[HederaService]` - Hedera blockchain operations

## Log Levels

### Info Logs
Standard operation logs showing normal flow:
```javascript
console.log('[Component] Operation description')
```

### Warning Logs
Non-critical issues that don't stop execution:
```javascript
console.warn('[Component] Warning message')
```

### Error Logs
Critical errors that prevent operation:
```javascript
console.error('[Component] Error message')
```

## Log Categories

### 1. Connection Logs

**MetaMask Detection**
```
[MetaMask] Installation check:
[MetaMask] - Window exists: true
[MetaMask] - Ethereum provider exists: true
[MetaMask] - Is MetaMask: true
```

**Connection Initiation**
```
[App] ========================================
[App] Initiating MetaMask connection...
[App] ========================================
[MetaMask] ========================================
[MetaMask] Initiating connection...
[MetaMask] User Agent: [browser info]
[MetaMask] ========================================
```

**Connection Success**
```
[MetaMask] Connection successful!
[App] ========================================
[App] MetaMask connection successful!
[App] Hedera Account: 0.0.xxxxx
[App] Ethereum Address: 0x...
[App] ========================================
```

**Connection Failure**
```
[App] ========================================
[App] MetaMask connection failed!
[App] Error: [error details]
[App] ========================================
```

### 2. Network Logs

**Network Switching**
```
[MetaMask] Attempting to switch to Hedera testnet...
[MetaMask] Switched to Hedera testnet
```

**Network Addition**
```
[MetaMask] Adding Hedera testnet network...
[MetaMask] Hedera testnet network added successfully
```

**Network Changes**
```
[MetaMask] Chain changed to: 0x128
```

### 3. Account Logs

**Account Retrieval**
```
[MetaMask] Requesting accounts...
[MetaMask] Accounts received: 1 account(s)
[MetaMask] Connected Ethereum address: 0x...
```

**Hedera Account ID**
```
[MetaMask] Retrieving Hedera account ID...
[MetaMask] Found stored Hedera account ID: 0.0.xxxxx
[MetaMask] Hedera Account ID: 0.0.xxxxx
```

**Account Changes**
```
[MetaMask] Accounts changed: ["0x..."]
[MetaMask] Account switched to: 0x...
```

### 4. Transaction Logs

**Action Initiation**
```
[App] ========================================
[App] User initiated action: Buy
[App] ========================================
[HederaService] ========================================
[HederaService] Performing action: Buy
[HederaService] Recipient: 0.0.xxxxx
[HederaService] Connection method: MetaMask
[HederaService] ========================================
```

**NFT Collection Creation**
```
[HederaService] Creating NFT collection...
[HederaService] Building TokenCreateTransaction...
[HederaService] Using MetaMask for NFT collection creation
[HederaService] Generated temporary keys for collection
[HederaService] Freezing transaction...
```

**Transaction Signing**
```
[MetaMask] Signing transaction...
[MetaMask] Transaction details: {type: "TokenCreateTransaction", operator: "0.0.xxxxx"}
[MetaMask] Transaction frozen
[MetaMask] Transaction bytes length: [number]
[MetaMask] Requesting signature from user...
[MetaMask] Transaction signed successfully
[MetaMask] Signature: 0x...
```

**Transaction Execution**
```
[MetaMask] Executing transaction...
[MetaMask] Transaction submitted: [transaction ID]
[MetaMask] Waiting for receipt...
[MetaMask] Transaction receipt received
[MetaMask] Status: SUCCESS
```

**NFT Minting**
```
[HederaService] Minting NFT receipt...
[HederaService] Action: Buy
[HederaService] Metadata: {recipient: "0.0.xxxxx", actionType: "Buy", amount: "50 HBAR"}
[HederaService] NFT metadata: {action: "Buy", timestamp: "...", ...}
[HederaService] Metadata size: [number] bytes
[HederaService] Building TokenMintTransaction...
[HederaService] Freezing mint transaction...
[HederaService] Signing mint with private key...
[HederaService] Executing mint transaction...
[HederaService] Mint transaction ID: [transaction ID]
[HederaService] Getting mint receipt...
[HederaService] NFT minted successfully!
```

**Action Completion**
```
[HederaService] ========================================
[HederaService] Action completed successfully!
[HederaService] Receipt: {action: "Buy", nftId: "0.0.xxxxx", ...}
[HederaService] ========================================
[App] ========================================
[App] Action completed successfully!
[App] New receipt added to list
[App] Total receipts: 1
[App] ========================================
```

**Transaction Failure**
```
[HederaService] ========================================
[HederaService] Action failed!
[HederaService] Error: [error details]
[HederaService] ========================================
```

### 5. Initialization Logs

**HederaService with MetaMask**
```
[HederaService] Initializing with MetaMask...
[HederaService] Account ID: 0.0.xxxxx
[HederaService] Initialized successfully with MetaMask
```

**HederaService with Private Key**
```
[HederaService] Initializing with private key...
[HederaService] Account ID: 0.0.xxxxx
[HederaService] Initialized successfully with private key
```

### 6. Event Listener Logs

**Setup**
```
[MetaMask] Setting up event listeners...
[MetaMask] Event listeners configured
```

**Events**
```
[MetaMask] Accounts changed: ["0x..."]
[MetaMask] Chain changed to: 0x128
```

### 7. Disconnection Logs

```
[App] ========================================
[App] Disconnecting...
[App] ========================================
[MetaMask] Disconnecting...
[MetaMask] Disconnected
[App] Disconnected successfully
```

## Debugging Tips

### Finding Specific Operations

**Search for connection issues:**
```
Filter: [MetaMask] connection
```

**Search for transaction issues:**
```
Filter: [HederaService] transaction
```

**Search for errors only:**
```
Filter: Error
```

**Search for specific action:**
```
Filter: action: Buy
```

### Understanding Transaction Flow

1. Look for `User initiated action`
2. Follow `Performing action` logs
3. Check `Creating NFT collection` or use existing
4. Watch `Signing transaction` for MetaMask interaction
5. Monitor `Executing transaction` for submission
6. Verify `Action completed successfully`

### Common Error Patterns

**MetaMask Not Installed**
```
[MetaMask] Installation check:
[MetaMask] - Window exists: true
[MetaMask] - Ethereum provider exists: false
```

**User Rejected**
```
[MetaMask] Signing error: User rejected the request
```

**Network Error**
```
[HederaService] Error: UNAVAILABLE: io exception
```

**Insufficient Balance**
```
[HederaService] Error: INSUFFICIENT_ACCOUNT_BALANCE
```

## Performance Monitoring

Track operation timing by looking at timestamp differences between:
- Connection start → Connection success
- Action initiation → Action completion
- Transaction submission → Receipt received

## Best Practices

1. **Always check console first** when debugging issues
2. **Copy full log output** when reporting bugs
3. **Look for error patterns** in the logs
4. **Check timestamps** for performance issues
5. **Verify transaction IDs** on HashScan explorer

## Console Commands

Useful commands to run in browser console:

**Check MetaMask status:**
```javascript
console.log('MetaMask:', window.ethereum?.isMetaMask);
console.log('Accounts:', await window.ethereum?.request({method: 'eth_accounts'}));
```

**Check current network:**
```javascript
console.log('Chain ID:', await window.ethereum?.request({method: 'eth_chainId'}));
```

**Clear stored Hedera Account ID:**
```javascript
localStorage.removeItem('hedera_account_id');
console.log('Hedera Account ID cleared');
```

## Log Filtering in DevTools

Chrome/Edge DevTools filters:
- `[MetaMask]` - Show only MetaMask logs
- `[HederaService]` - Show only Hedera operations
- `[App]` - Show only app-level logs
- `-[MetaMask]` - Hide MetaMask logs
- `Error` - Show only errors
- `========` - Show only section separators

## Exporting Logs

To save logs for analysis:
1. Right-click in console
2. Select "Save as..."
3. Save as .log file
4. Share with support/developers

## Privacy Note

Logs may contain:
- Account IDs (public information)
- Transaction IDs (public information)
- Ethereum addresses (public information)

Logs do NOT contain:
- Private keys
- Passwords
- Sensitive personal information

Safe to share logs for debugging purposes.
