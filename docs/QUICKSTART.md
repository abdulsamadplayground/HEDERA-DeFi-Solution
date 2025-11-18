# Quick Start Guide

Get up and running with MetaMask integration in 5 minutes!

## Prerequisites

- [ ] Node.js installed
- [ ] MetaMask browser extension installed
- [ ] Hedera testnet account (get one at [portal.hedera.com](https://portal.hedera.com))

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Step 3: Configure MetaMask

### Add Hedera Testnet to MetaMask:

1. Open MetaMask
2. Click network dropdown → "Add Network"
3. Enter these details:

```
Network Name: Hedera Testnet
RPC URL: https://testnet.hashio.io/api
Chain ID: 296
Currency Symbol: HBAR
Block Explorer: https://hashscan.io/testnet
```

4. Click "Save"

## Step 4: Connect to the App

1. Open the application
2. Click "🦊 Connect with MetaMask"
3. Approve connection in MetaMask popup
4. Enter your Hedera Account ID (format: `0.0.12345`)
5. Enter your Hedera Private Key
   - **Why?** MetaMask doesn't natively support Hedera, so we need your key to sign transactions
   - **Safe?** Yes! It's stored only in your browser and never sent anywhere
6. Done! You're connected

## Step 5: Mint Your First NFT Receipt

1. Click any action button:
   - 🛒 Buy Product
   - 📝 Register Service
   - ⭐ Subscribe
   - 💝 Donate

2. Wait for transaction to complete
3. View your NFT receipt below!

## Monitoring

Open browser console (F12) to see detailed logs:
- Connection status
- Transaction details
- NFT minting progress
- Any errors

## Troubleshooting

### MetaMask not detected?
- Ensure MetaMask is installed
- Refresh the page
- Check console for errors

### Connection fails?
- Unlock MetaMask
- Verify Hedera testnet is added
- Check Account ID format (0.0.xxxxx)

### Transaction fails?
- Check console for error details
- Verify you have testnet HBAR
- Ensure correct network selected

## Alternative: Private Key Method

Don't want to use MetaMask?

1. Click "🔑 Private Key" tab
2. Enter your Account ID and Private Key
3. Click "Connect to Testnet"

## Next Steps

- Read `METAMASK_SETUP.md` for detailed setup
- Check `TESTING_GUIDE.md` for testing scenarios
- Review `LOGGING_REFERENCE.md` for log details

## Need Help?

- Check browser console for detailed logs
- Review documentation files
- Visit [Hedera Discord](https://hedera.com/discord)

---

**That's it! You're ready to mint NFT receipts on Hedera! 🎉**
