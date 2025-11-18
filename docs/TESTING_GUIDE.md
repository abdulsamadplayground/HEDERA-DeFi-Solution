# Testing Guide - MetaMask Integration

This guide will help you test the MetaMask integration with the Hedera NFT Receipt System.

## Pre-Testing Checklist

- [ ] MetaMask browser extension installed
- [ ] Hedera testnet account created (from portal.hedera.com)
- [ ] Browser Developer Console open (F12)
- [ ] Application running (`npm run dev`)

## Test Scenarios

### 1. MetaMask Detection

**Test Case**: Verify MetaMask detection works correctly

**Steps**:
1. Open the application
2. Check browser console for MetaMask detection logs
3. Look for connection method selector

**Expected Console Output**:
```
[App] Component mounted
[App] MetaMask installed: true
[MetaMask] Installation check:
[MetaMask] - Window exists: true
[MetaMask] - Ethereum provider exists: true
[MetaMask] - Is MetaMask: true
```

**Expected UI**:
- Two tabs visible: "🦊 MetaMask" and "🔑 Private Key"
- MetaMask tab should be active by default
- "Connect with MetaMask" button should be visible

---

### 2. MetaMask Connection Flow

**Test Case**: Connect to Hedera via MetaMask

**Steps**:
1. Click "🦊 Connect with MetaMask" button
2. Approve connection in MetaMask popup
3. Enter your Hedera Account ID when prompted (format: 0.0.xxxxx)
4. Wait for connection confirmation

**Expected Console Output**:
```
[App] ========================================
[App] Initiating MetaMask connection...
[App] ========================================
[MetaMask] ========================================
[MetaMask] Initiating connection...
[MetaMask] ========================================
[MetaMask] Requesting accounts...
[MetaMask] Accounts received: 1 account(s)
[MetaMask] Connected Ethereum address: 0x...
[MetaMask] Attempting to switch to Hedera testnet...
[MetaMask] Retrieving Hedera account ID...
[MetaMask] Found stored Hedera account ID: 0.0.xxxxx
[MetaMask] Hedera Account ID: 0.0.xxxxx
[MetaMask] Hedera client initialized for testnet
[MetaMask] Connection successful!
[MetaMask] Setting up event listeners...
[App] ========================================
[App] MetaMask connection successful!
[App] Hedera Account: 0.0.xxxxx
[App] Ethereum Address: 0x...
[App] ========================================
```

**Expected UI**:
- Success message: "✅ Connected to Hedera Testnet via MetaMask!"
- Account info displayed with 🦊 icon
- Ethereum address shown (truncated)
- "Disconnect" button visible
- Action buttons enabled

---

### 3. Network Configuration

**Test Case**: Hedera testnet network is added to MetaMask

**Steps**:
1. During connection, if Hedera testnet is not configured
2. MetaMask should prompt to add the network
3. Approve the network addition

**Expected Console Output**:
```
[MetaMask] Network switch error: [error details]
[MetaMask] Adding Hedera testnet network...
[MetaMask] Hedera testnet network added successfully
```

**Expected MetaMask**:
- Network added with name "Hedera Testnet"
- Chain ID: 296
- RPC URL: https://testnet.hashio.io/api

---

### 4. NFT Minting - Buy Action

**Test Case**: Mint an NFT receipt for "Buy" action

**Steps**:
1. Ensure connected via MetaMask
2. Click "🛒 Buy Product" button
3. Wait for transaction to complete

**Expected Console Output**:
```
[App] ========================================
[App] User initiated action: Buy
[App] ========================================
[HederaService] ========================================
[HederaService] Performing action: Buy
[HederaService] Recipient: 0.0.xxxxx
[HederaService] Connection method: MetaMask
[HederaService] ========================================
[HederaService] Starting NFT receipt minting...
[HederaService] Minting NFT receipt...
[HederaService] Action: Buy
[HederaService] Metadata: {recipient: "0.0.xxxxx", actionType: "Buy", amount: "50 HBAR"}
[HederaService] Creating NFT collection...
[HederaService] Building TokenCreateTransaction...
[HederaService] Using MetaMask for NFT collection creation
[HederaService] Generated temporary keys for collection
[HederaService] Freezing transaction...
[HederaService] Signing with MetaMask...
[MetaMask] Signing transaction...
[MetaMask] Transaction details: {type: "TokenCreateTransaction", operator: "0.0.xxxxx"}
[MetaMask] Transaction frozen
[MetaMask] Transaction bytes length: [number]
[MetaMask] Requesting signature from user...
[MetaMask] Transaction signed successfully
[MetaMask] Signature: 0x...
[MetaMask] Executing transaction...
[MetaMask] Transaction submitted: [transaction ID]
[MetaMask] Waiting for receipt...
[MetaMask] Transaction receipt received
[MetaMask] Status: SUCCESS
[HederaService] Transaction ID: [transaction ID]
[HederaService] Getting receipt...
[HederaService] NFT collection created successfully!
[HederaService] Token ID: 0.0.xxxxx
[HederaService] NFT metadata: {action: "Buy", timestamp: "...", ...}
[HederaService] Metadata size: [number] bytes
[HederaService] Building TokenMintTransaction...
[HederaService] Freezing mint transaction...
[HederaService] Signing mint with private key...
[HederaService] Executing mint transaction...
[HederaService] Mint transaction ID: [transaction ID]
[HederaService] Getting mint receipt...
[HederaService] NFT minted successfully!
[HederaService] Result: {tokenId: "0.0.xxxxx", serialNumber: "1", transactionId: "..."}
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

**Expected UI**:
- Loading state during transaction
- Success message: "✅ Buy successful! NFT Receipt minted."
- New receipt card appears in "Your NFT Receipts" section
- Receipt shows: action type, NFT ID, serial number, transaction ID, timestamp

---

### 5. Multiple Actions

**Test Case**: Mint multiple NFT receipts

**Steps**:
1. Click "📝 Register Service" button
2. Wait for completion
3. Click "⭐ Subscribe" button
4. Wait for completion
5. Click "💝 Donate" button
6. Wait for completion

**Expected Console Output**:
- Similar logs as Test 4 for each action
- Each action should show its specific type and amount
- Serial numbers should increment (1, 2, 3, 4)

**Expected UI**:
- 4 receipt cards total
- Each with different action type and color
- Receipts ordered newest first
- All showing same Token ID but different serial numbers

---

### 6. Account Switching

**Test Case**: Handle MetaMask account changes

**Steps**:
1. While connected, switch accounts in MetaMask
2. Observe application behavior

**Expected Console Output**:
```
[MetaMask] Accounts changed: ["0x..."]
[MetaMask] Account switched to: 0x...
```

**Expected Behavior**:
- Page should reload automatically
- User needs to reconnect

---

### 7. Network Switching

**Test Case**: Handle network changes in MetaMask

**Steps**:
1. While connected, switch to different network in MetaMask
2. Observe application behavior

**Expected Console Output**:
```
[MetaMask] Chain changed to: 0x1
```

**Expected Behavior**:
- Page should reload automatically
- User needs to reconnect to Hedera testnet

---

### 8. Disconnect

**Test Case**: Disconnect from MetaMask

**Steps**:
1. While connected, click "Disconnect" button
2. Verify clean disconnection

**Expected Console Output**:
```
[App] ========================================
[App] Disconnecting...
[App] ========================================
[MetaMask] Disconnecting...
[MetaMask] Disconnected
[App] Disconnected successfully
```

**Expected UI**:
- Returns to connection screen
- All receipts cleared
- Connection method selector visible

---

### 9. Private Key Fallback

**Test Case**: Verify private key connection still works

**Steps**:
1. Click "🔑 Private Key" tab
2. Enter Account ID and Private Key
3. Click "Connect to Testnet"
4. Perform an action

**Expected Console Output**:
```
[App] ========================================
[App] Connecting with private key...
[App] Account ID: 0.0.xxxxx
[App] ========================================
[HederaService] Initializing with private key...
[HederaService] Account ID: 0.0.xxxxx
[HederaService] Initialized successfully with private key
[App] ========================================
[App] Private key connection successful!
[App] ========================================
```

**Expected UI**:
- Connection successful with 🔑 icon
- Actions work normally
- No MetaMask prompts

---

### 10. Error Handling

**Test Case**: Handle various error scenarios

**Scenarios to Test**:

a) **MetaMask Locked**
- Lock MetaMask
- Try to connect
- Should show error about unlocking MetaMask

b) **User Rejects Connection**
- Click connect
- Reject in MetaMask popup
- Should show user rejection error

c) **Invalid Account ID**
- Enter invalid format (e.g., "123" instead of "0.0.123")
- Should show validation error

d) **Network Error**
- Disconnect internet
- Try to perform action
- Should show network error

**Expected**:
- All errors logged to console with details
- User-friendly error messages in UI
- Application remains stable

---

## Common Issues & Solutions

### Issue: MetaMask not detected
**Solution**: 
- Verify MetaMask is installed
- Refresh the page
- Check console for specific error

### Issue: Connection fails
**Solution**:
- Ensure MetaMask is unlocked
- Check Hedera testnet is configured
- Verify Account ID format

### Issue: Transaction fails
**Solution**:
- Check console for detailed error
- Verify sufficient testnet HBAR
- Ensure correct network selected

### Issue: No logs appearing
**Solution**:
- Open Developer Console (F12)
- Go to Console tab
- Clear console and try again
- Check console filter settings

---

## Success Criteria

✅ All test scenarios pass
✅ Console logs are clear and informative
✅ No JavaScript errors in console
✅ UI updates correctly for all states
✅ MetaMask integration works smoothly
✅ Private key fallback works
✅ Error handling is graceful
✅ Receipts display correctly

---

## Reporting Issues

When reporting issues, include:
1. Test scenario number
2. Steps to reproduce
3. Expected vs actual behavior
4. Full console output
5. Screenshots if applicable
6. Browser and MetaMask version
