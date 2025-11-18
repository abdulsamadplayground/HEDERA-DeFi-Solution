# MetaMask Setup Guide for Hedera Testnet

This guide will help you configure MetaMask to work with Hedera Testnet.

## Prerequisites

- MetaMask browser extension installed ([Download here](https://metamask.io/))
- A Hedera Testnet account ([Create one here](https://portal.hedera.com))

## Step 1: Add Hedera Testnet to MetaMask

1. Open MetaMask extension
2. Click on the network dropdown (top center)
3. Click "Add Network" or "Add a network manually"
4. Enter the following details:

   ```
   Network Name: Hedera Testnet
   RPC URL: https://testnet.hashio.io/api
   Chain ID: 296
   Currency Symbol: HBAR
   Block Explorer URL: https://hashscan.io/testnet
   ```

5. Click "Save"

## Step 2: Connect Your Hedera Account

Your Hedera account credentials are separate from your Ethereum address in MetaMask. You'll need to:

1. Have your Hedera Account ID ready (format: 0.0.xxxxx)
2. Have your Hedera Private Key ready
3. When connecting to the dApp, you'll be prompted to enter both
4. The app will store them locally in your browser for future sessions

**Why do I need my private key?**
- MetaMask doesn't natively support Hedera transactions
- Your private key is used to sign Hedera-specific operations
- It's stored only in your browser's localStorage
- It never leaves your computer

## Step 3: Using the dApp

1. Open the Hedera NFT Receipt System
2. Click "🦊 Connect with MetaMask"
3. Approve the connection in MetaMask popup
4. Enter your Hedera Account ID when prompted (format: 0.0.xxxxx)
5. Enter your Hedera Private Key when prompted
6. Start minting NFT receipts!

## Monitoring Transactions

All transactions and operations are logged to the browser console:

1. Open Developer Tools (F12 or Right-click → Inspect)
2. Go to the "Console" tab
3. You'll see detailed logs for:
   - Connection attempts
   - Transaction submissions
   - NFT minting operations
   - MetaMask interactions
   - Any errors or issues

## Troubleshooting

### MetaMask not detected
- Ensure MetaMask extension is installed and enabled
- Refresh the page
- Check browser console for errors

### Connection fails
- Verify Hedera Testnet is added to MetaMask
- Check that you're on the correct network
- Ensure your Hedera Account ID format is correct (0.0.xxxxx)

### Transaction fails
- Check browser console for detailed error messages
- Verify you have sufficient HBAR in your testnet account
- Ensure MetaMask is unlocked

### Network issues
- Verify RPC URL is correct: `https://testnet.hashio.io/api`
- Try switching networks and back to Hedera Testnet
- Check your internet connection

## Important Notes

- **Testnet Only**: This setup is for Hedera Testnet. Do not use mainnet credentials.
- **Credential Storage**: Your Hedera Account ID and Private Key are stored in browser localStorage for convenience.
- **Security**: Your private key is stored locally in your browser and used only for signing Hedera transactions. It never leaves your computer.
- **MetaMask Role**: MetaMask is used for wallet connection and network management, while your Hedera private key handles transaction signing.
- **Logging**: All operations are logged to console for transparency and debugging.

## Getting Testnet HBAR

If you need testnet HBAR:

1. Visit [Hedera Portal](https://portal.hedera.com)
2. Create or log into your testnet account
3. Use the faucet to get free testnet HBAR
4. Testnet HBAR has no real value and is for testing only

## Support

For issues or questions:
- Check the browser console for detailed error logs
- Review the [Hedera Documentation](https://docs.hedera.com)
- Visit [Hedera Discord](https://hedera.com/discord)
