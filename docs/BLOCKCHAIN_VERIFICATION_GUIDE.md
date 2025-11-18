# 🔍 Blockchain Verification Guide

## How to Verify Transactions on Hedera

This guide shows you how to verify that your transactions are actually happening on the Hedera blockchain and that NFTs are being created.

---

## 📋 Table of Contents

1. [Quick Verification](#quick-verification)
2. [Verify Transactions](#verify-transactions)
3. [Verify NFT Collection](#verify-nft-collection)
4. [Verify NFT Badges](#verify-nft-badges)
5. [Using HashScan Explorer](#using-hashscan-explorer)
6. [Console Logs](#console-logs)
7. [Troubleshooting](#troubleshooting)

---

## ⚡ Quick Verification

### Step 1: Perform a Stake

1. **Connect** to the app with your credentials
2. **Go to Actions tab**
3. **Stake 100 HBAR**
4. **Wait for confirmation**

### Step 2: Check Console Logs

Open browser console (F12) and look for:

```
[HederaService] Transaction ID: 0.0.7261784@1763380827.469530023
[HederaService] Token ID: 0.0.7273508
[HederaService] NFT minted successfully!
```

**Key Information:**
- **Transaction ID**: Proof transaction was submitted
- **Token ID**: Your NFT collection ID
- **Serial Number**: Unique NFT identifier

### Step 3: Verify on HashScan

1. **Copy Transaction ID** from console
2. **Go to**: https://hashscan.io/testnet
3. **Paste Transaction ID** in search
4. **View transaction details**

---

## 🔗 Verify Transactions

### Method 1: Using Transaction ID from Console

**Step 1: Get Transaction ID**

After staking, check console for:
```
[HederaService] Transaction ID: 0.0.7261784@1763380827.469530023
```

**Step 2: Open HashScan**

Go to: https://hashscan.io/testnet

**Step 3: Search Transaction**

Paste the Transaction ID in the search bar:
```
0.0.7261784@1763380827.469530023
```

**Step 4: View Details**

You'll see:
- ✅ **Status**: SUCCESS
- ✅ **Type**: TokenMint or TokenCreate
- ✅ **Account**: Your account ID
- ✅ **Timestamp**: When it happened
- ✅ **Fee**: Transaction cost
- ✅ **Memo**: Transaction details

### Method 2: Using History Tab

**Step 1: Go to History Tab**

In the app, click "📜 History"

**Step 2: Find Your Transaction**

You'll see all your stakes listed:
```
💎 Staked
100 HBAR
2025-11-17 12:00:00
[View on HashScan →]
```

**Step 3: Click "View on HashScan"**

This opens the transaction directly in HashScan

**Step 4: Verify Details**

Confirm:
- ✅ Transaction succeeded
- ✅ Correct amount
- ✅ Correct timestamp
- ✅ Your account ID

### Method 3: Manual Search on HashScan

**Step 1: Go to HashScan**

https://hashscan.io/testnet

**Step 2: Search Your Account**

Enter your Account ID:
```
0.0.7261784
```

**Step 3: View Account Page**

You'll see:
- Account balance
- Transaction history
- Token associations
- NFT holdings

**Step 4: Check Recent Transactions**

Scroll to "Recent Transactions" section:
- All your stakes listed
- Click any to see details

---

## 🎨 Verify NFT Collection

### What is the NFT Collection?

When you stake for the first time, the app creates an NFT collection (token) that will hold all your receipt and badge NFTs.

### Finding Your Collection

**Method 1: From Console Logs**

After first stake, check console:
```
[HederaService] NFT collection created successfully!
[HederaService] Token ID: 0.0.7273508
```

**Copy this Token ID**: `0.0.7273508`

**Method 2: From Transaction**

1. Find your first stake transaction on HashScan
2. Look for "Token Create" transaction
3. Note the Token ID

### Verifying the Collection on HashScan

**Step 1: Go to HashScan**

https://hashscan.io/testnet

**Step 2: Search Token ID**

Paste your Token ID:
```
0.0.7273508
```

**Step 3: View Token Details**

You'll see:
```
Token Information
─────────────────
Name: Receipt NFT Collection
Symbol: RCPT
Type: NON_FUNGIBLE_UNIQUE
Total Supply: [Number of NFTs minted]
Treasury: [Your Account ID]
Supply Key: [Your Public Key]
Admin Key: [Your Public Key]
```

**Step 4: View NFTs**

Scroll to "NFTs" section to see all minted NFTs:
- Receipt NFTs (from stakes)
- Badge NFTs (from quest completions)

### Collection Details Explained

**Name**: `Receipt NFT Collection`
- This is your personal NFT collection

**Symbol**: `RCPT`
- Short identifier for the collection

**Type**: `NON_FUNGIBLE_UNIQUE`
- Each NFT is unique (not fungible)

**Total Supply**: Number of NFTs
- Increases each time you stake or complete a quest

**Treasury**: Your Account ID
- You own this collection

**Supply Key**: Your Public Key
- Allows minting new NFTs

---

## 🎖️ Verify NFT Badges

### What are NFT Badges?

When you complete a quest, a unique NFT badge is minted to your collection.

### Finding Your Badges

**Method 1: In the App**

1. **Go to Badges tab** (🎖️ Badges)
2. **See all earned badges**
3. Each badge is a real NFT on Hedera

**Method 2: On HashScan**

1. **Search your Token ID** on HashScan
2. **Click "NFTs" tab**
3. **See all minted NFTs**

### Verifying Individual NFTs

**Step 1: Get Serial Number**

From console after quest completion:
```
[HederaService] Serial Number: 1
```

Or from Badges tab in the app.

**Step 2: View on HashScan**

Go to your token page and click on the NFT:
```
Token ID: 0.0.7273508
Serial Number: 1
```

**Step 3: View NFT Metadata**

You'll see:
```
NFT Details
───────────
Token ID: 0.0.7273508
Serial Number: 1
Owner: 0.0.7261784 (You!)
Metadata: [JSON data]
Created: [Timestamp]
```

**Step 4: Check Metadata**

Click "View Metadata" to see:
```json
{
  "action": "stake",
  "timestamp": "2025-11-17T12:00:00Z",
  "amount": 100,
  "account": "0.0.7261784"
}
```

Or for badges:
```json
{
  "q": "first_stake",
  "b": "Staking Novice",
  "a": "0.0.7261784"
}
```

---

## 🔎 Using HashScan Explorer

### HashScan Overview

**URL**: https://hashscan.io/testnet

**What You Can Search:**
- Account IDs (0.0.xxxxx)
- Transaction IDs (0.0.xxxxx@timestamp)
- Token IDs (0.0.xxxxx)
- Topics, Contracts, etc.

### Search by Account

**Step 1: Enter Account ID**
```
0.0.7261784
```

**Step 2: View Account Dashboard**

See:
- **Balance**: Current HBAR balance
- **Transactions**: All transactions
- **Tokens**: Associated tokens
- **NFTs**: Owned NFTs

**Step 3: Filter Transactions**

Use filters to see:
- Token Mints
- Token Creates
- Transfers
- etc.

### Search by Transaction

**Step 1: Enter Transaction ID**
```
0.0.7261784@1763380827.469530023
```

**Step 2: View Transaction Details**

See:
- **Status**: SUCCESS or FAILED
- **Type**: Transaction type
- **Fee**: Cost in HBAR
- **Timestamp**: When it happened
- **Memo**: Additional data

**Step 3: View Related Entities**

Click on:
- Account ID → See account details
- Token ID → See token details
- Parent/Child transactions

### Search by Token

**Step 1: Enter Token ID**
```
0.0.7273508
```

**Step 2: View Token Dashboard**

See:
- **Token Info**: Name, symbol, type
- **Supply**: Total NFTs minted
- **Holders**: Who owns NFTs
- **NFTs**: List of all NFTs

**Step 3: Browse NFTs**

Click on any NFT to see:
- Serial number
- Owner
- Metadata
- Transaction history

---

## 📊 Console Logs

### What to Look For

Open browser console (F12) and monitor these logs:

### Successful Stake

```
[App] User initiated action: stake
[HederaService] Performing STAKE action
[HederaService] Amount: 100 HBAR
[HederaService] Building TokenCreateTransaction...
[HederaService] Transaction ID: 0.0.xxx@xxx
[HederaService] Token ID: 0.0.xxx
[HederaService] NFT minted successfully!
[QuestService] Recording action: stake
[QuestService] Quest completed: First Steps
```

### Key Information

**Transaction ID**: `0.0.7261784@1763380827.469530023`
- Use this to verify on HashScan

**Token ID**: `0.0.7273508`
- Your NFT collection ID

**Serial Number**: `1, 2, 3...`
- Unique NFT identifier

### Copy Information

**To Copy Transaction ID:**
1. Right-click on the log line
2. Select "Copy message"
3. Paste into HashScan

**To Copy Token ID:**
1. Find the log with Token ID
2. Copy the number
3. Search on HashScan

---

## 🎯 Complete Verification Checklist

### After Each Stake

- [ ] Check console for Transaction ID
- [ ] Copy Transaction ID
- [ ] Search on HashScan
- [ ] Verify status is SUCCESS
- [ ] Confirm correct amount
- [ ] Check timestamp matches

### After First Stake

- [ ] Check console for Token ID
- [ ] Copy Token ID
- [ ] Search token on HashScan
- [ ] Verify token name is "Receipt NFT Collection"
- [ ] Confirm you are the treasury
- [ ] Check supply increased

### After Quest Completion

- [ ] Check console for badge minting
- [ ] Note serial number
- [ ] View NFT on HashScan
- [ ] Check metadata contains quest info
- [ ] Verify you are the owner
- [ ] Confirm badge appears in app

---

## 🔧 Troubleshooting

### Transaction Not Found

**Problem**: HashScan says "Transaction not found"

**Solutions:**
1. Wait 10-30 seconds (network delay)
2. Refresh HashScan page
3. Check you're on testnet (not mainnet)
4. Verify Transaction ID format is correct

### Token Not Showing

**Problem**: Token doesn't appear on HashScan

**Solutions:**
1. Wait for network confirmation
2. Check Token ID is correct
3. Verify transaction succeeded
4. Refresh the page

### NFT Not Visible

**Problem**: NFT doesn't show in collection

**Solutions:**
1. Check transaction succeeded
2. Verify serial number
3. Wait for indexing (can take 1-2 minutes)
4. Refresh HashScan

### Wrong Network

**Problem**: Can't find anything on HashScan

**Solution:**
Make sure you're on TESTNET:
- URL should be: https://hashscan.io/testnet
- NOT: https://hashscan.io (mainnet)

---

## 📱 Mobile Verification

### Using Mobile Browser

1. **Open HashScan** on mobile
2. **Search** your account or transaction
3. **View details** (same as desktop)
4. **Bookmark** your account page

### Using HashScan App

1. **Download** HashScan mobile app (if available)
2. **Search** your account
3. **Enable notifications** for transactions
4. **Track** your NFTs

---

## 🎓 Understanding the Data

### Transaction Status

**SUCCESS**: ✅ Transaction completed
- NFT was minted
- HBAR was transferred
- Quest may have completed

**FAILED**: ❌ Transaction failed
- Check error message
- Verify you have enough HBAR
- Try again

### Transaction Types

**TokenCreate**: Creating NFT collection
- Happens on first stake
- Creates the RCPT token
- Sets you as treasury

**TokenMint**: Minting new NFT
- Happens on each stake
- Creates receipt NFT
- Increases supply

### NFT Metadata

**Receipt NFT**:
```json
{
  "action": "stake",
  "timestamp": "2025-11-17T12:00:00Z",
  "amount": 100,
  "account": "0.0.7261784"
}
```

**Badge NFT**:
```json
{
  "q": "first_stake",
  "b": "Staking Novice",
  "a": "0.0.7261784"
}
```

---

## 🎉 Verification Success!

### You've Successfully Verified When:

✅ Transaction appears on HashScan
✅ Status shows SUCCESS
✅ Token ID is visible
✅ NFT collection exists
✅ NFTs are minted
✅ Metadata is correct
✅ You are the owner

### Share Your Success

Take screenshots of:
- HashScan transaction page
- Your NFT collection
- Individual NFT details
- Your badge collection

---

## 📞 Need Help?

**Can't find transaction?**
- Check console logs for Transaction ID
- Verify you're on testnet
- Wait 30 seconds and refresh

**Token not showing?**
- Check console for Token ID
- Verify transaction succeeded
- Wait for network confirmation

**NFT missing?**
- Check serial number
- Verify minting succeeded
- Wait for indexing

**Still stuck?**
- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- Review console logs
- Join [Hedera Discord](https://hedera.com/discord)

---

**Your transactions are real, verifiable, and permanent on the Hedera blockchain! 🎉**
