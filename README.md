# 🎮 DeFi Quest Arena

> Gamifying DeFi on Hedera Hashgraph - Turn staking into quests, earn NFT badges!

[![Hedera](https://img.shields.io/badge/Hedera-Testnet-purple)](https://hedera.com)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## 📋 Table of Contents

- [Overview](#overview)
- [Problem & Solution](#problem--solution)
- [Features](#features)
- [Quick Start](#quick-start)
- [How to Play](#how-to-play)
- [Technical Details](#technical-details)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

**DeFi Quest Arena** is a gamification platform built on Hedera Hashgraph that transforms traditional DeFi actions (staking) into an engaging quest-based game. Complete quests, earn NFT badges, accumulate points, and become a DeFi Legend!

### What Makes It Special?

- 🎮 **3 Interactive Mini-Games** - Earn stakes through gameplay!
- 🎯 **8 Progressive Quests** - From beginner to legendary
- 🎖️ **NFT Badge Rewards** - Unique, verifiable badges on Hedera blockchain
- ⚡ **Automatic Detection** - Quests complete automatically when you stake
- 🏆 **Points System** - Compete and track your progress
- 📊 **Real-time Tracking** - See your progress update instantly
- ✅ **On-chain Verification** - All actions verifiable on HashScan

---

## 🎯 Problem & Solution

### The Challenge

**DeFi Gamification Problem Statement:**
> Develop a dApp on Hedera that gamifies DeFi actions by turning activities such as staking or providing liquidity into "quests." The dApp should track users' on-chain activity and automatically reward them with unique tokens or NFT badges upon completing these predefined quests, creating an engaging and interactive DeFi experience.

### Our Solution

**DeFi Quest Arena** addresses every requirement:

✅ **Gamifies DeFi Actions**
- Staking HBAR becomes quest objectives
- 8 progressive quests with increasing difficulty
- Clear goals and rewards

✅ **Tracks On-Chain Activity**
- Every stake creates NFT receipt on Hedera
- Immutable blockchain records
- Verifiable on HashScan

✅ **Automatic Rewards**
- Quest completion detected automatically
- NFT badges minted instantly
- No manual claiming needed

✅ **Engaging Experience**
- Visual progress tracking
- Achievement celebrations
- Points and badge collection
- Interactive UI

---

## ✨ Features

### Core Gameplay

- **🎮 Mini-Games** - Play games to earn the right to stake HBAR
  - **Tic Tac Toe** (Easy) - Win to stake 25 HBAR
  - **Pattern Match** (Medium) - Score 500 points to stake 100 HBAR
  - **Space Shooter** (Hard) - Score determines stake (10-500 HBAR)
- **🎯 Quest System** - 8 unique quests across 4 difficulty levels
- **💎 Staking** - Stake HBAR directly or through games
- **🎖️ NFT Badges** - Earn unique badges for each quest
- **🏆 Points** - Accumulate points (100-5000 per quest)
- **📊 Stats Dashboard** - Track your progress in real-time
- **📜 History** - Complete transaction log with HashScan links

### Quest Categories

| Category | Quests | Points Range |
|----------|--------|--------------|
| **Beginner** | First Steps, Stake Enthusiast | 100-150 |
| **Intermediate** | Stake Master, Power Staker | 500-750 |
| **Advanced** | DeFi Veteran, Consistent Staker | 1000-1200 |
| **Expert** | High Roller, DeFi Legend | 2500-5000 |

### Technical Features

- **Hedera Native** - Uses Hedera Token Service (HTS)
- **Fast Transactions** - 3-5 second confirmation
- **Low Cost** - ~$0.001 per NFT
- **Eco-Friendly** - Hedera's sustainable consensus
- **Browser-Based** - No backend server needed
- **Comprehensive Logging** - Full console monitoring

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v16 or higher
- **npm** or **yarn**
- **Hedera Testnet Account** ([Get one here](https://portal.hedera.com))
- **Web Browser** (Chrome, Firefox, Edge, or Brave)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd defi-quest-arena

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Deploy

```bash
# Deploy to Vercel
npm install -g vercel
vercel --prod

# Deploy to Netlify
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

---

## 🎮 How to Play

### Step 1: Get Testnet Credentials

1. Visit [portal.hedera.com](https://portal.hedera.com)
2. Create or log into your testnet account
3. Copy your **Account ID** (format: 0.0.xxxxx)
4. Copy your **Private Key** (96 characters starting with 302e020100...)

### Step 2: Connect

1. Open the application
2. Choose connection method:
   - **🔑 Private Key** (recommended for demo)
   - **🦊 MetaMask** (requires setup)
3. Enter your credentials
4. Click "Connect"

### Step 3: Complete Your First Quest

1. **Go to Actions Tab** (⚡ Actions)
2. **Enter Amount**: Type `100` in the Stake field
3. **Click "💎 Stake"**
4. **Wait 5-10 seconds** for confirmation
5. **Quest Complete!** 🎉
   - Modal appears showing achievement
   - NFT badge minted on Hedera
   - 100 points awarded
   - Badge appears in collection

### Step 4: Continue Your Journey

- **Check Progress**: Go to Quests tab to see updated progress
- **View Badges**: Go to Badges tab to see your collection
- **Review History**: Go to History tab to see all transactions
- **Complete More**: Stake more to complete additional quests

### Quest List

| Quest | Requirement | Reward |
|-------|-------------|--------|
| 🌱 First Steps | Stake 10+ HBAR once | 100 pts + Staking Novice badge |
| 💪 Stake Enthusiast | Stake 50+ HBAR once | 150 pts + Stake Enthusiast badge |
| ⚡ Stake Master | 5 stakes of 10+ HBAR | 500 pts + Stake Master badge |
| 🐋 Power Staker | Stake 200+ HBAR once | 750 pts + Power Staker badge |
| 🏆 DeFi Veteran | 10 total actions | 1000 pts + DeFi Veteran badge |
| 🌾 Consistent Staker | 15 stakes | 1200 pts + Consistent Staker badge |
| 💎 High Roller | 1000+ HBAR stake | 2500 pts + High Roller badge |
| 👑 DeFi Legend | Complete all quests | 5000 pts + DeFi Legend badge |

**Total Possible Points**: 11,200

---

## 🛠️ Technical Details

### Architecture

```
Frontend (React)
    ↓
Services Layer
├── QuestService.js (Quest logic & tracking)
├── HederaService.js (Blockchain interactions)
└── MetaMaskService.js (Wallet connection)
    ↓
Hedera Blockchain
├── Token Service (NFT minting)
├── Transaction Service (On-chain actions)
└── Consensus (Verification)
```

### Technology Stack

**Blockchain:**
- Hedera Hashgraph (Testnet)
- Hedera Token Service (HTS)
- Hedera SDK v2.49.2

**Frontend:**
- React 18
- Vite 5
- CSS3 with animations

**Storage:**
- LocalStorage (user progress)
- Blockchain (immutable records)

### How It Works

```
1. User Stakes HBAR
   ↓
2. Transaction Submitted to Hedera
   ↓
3. NFT Receipt Minted (Proof of Action)
   ↓
4. Quest System Checks Progress
   ↓
5. If Quest Complete:
   - Badge NFT Minted
   - Points Awarded
   - Modal Displayed
   ↓
6. Dashboard Updated
```

### NFT Structure

**Receipt NFT** (for each stake):
```json
{
  "action": "stake",
  "timestamp": "2025-11-17T12:00:00Z",
  "amount": 100,
  "account": "0.0.7261784"
}
```

**Badge NFT** (for quest completion):
```json
{
  "q": "first_stake",
  "b": "Staking Novice",
  "a": "0.0.7261784"
}
```

---

## 📁 Project Structure

```
defi-quest-arena/
├── src/
│   ├── services/
│   │   ├── HederaService.js      # Blockchain interactions
│   │   ├── QuestService.js       # Quest management
│   │   └── MetaMaskService.js    # Wallet integration
│   ├── App.jsx                   # Main application
│   ├── App.css                   # Base styles
│   ├── DeFi.css                  # DeFi-specific styles
│   └── main.jsx                  # Entry point
├── docs/                         # Documentation
│   ├── HOW_TO_PLAY.md           # Detailed gameplay guide
│   ├── SOLUTION_EXPLANATION.md   # Problem/solution analysis
│   ├── TROUBLESHOOTING.md        # Common issues
│   ├── PRIVATE_KEY_GUIDE.md      # Key format guide
│   └── ...                       # Additional docs
├── public/                       # Static assets
├── package.json                  # Dependencies
├── vite.config.js               # Vite configuration
└── README.md                     # This file
```

---

## 📚 Documentation

### User Guides

- **[HOW_TO_PLAY.md](docs/HOW_TO_PLAY.md)** - Complete gameplay guide
- **[QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md)** - Quick cheat sheet
- **[PRIVATE_KEY_GUIDE.md](docs/PRIVATE_KEY_GUIDE.md)** - Key format help

### Technical Documentation

- **[SOLUTION_EXPLANATION.md](docs/SOLUTION_EXPLANATION.md)** - Problem/solution analysis
- **[DEFI_GAMIFICATION_GUIDE.md](docs/DEFI_GAMIFICATION_GUIDE.md)** - Technical deep dive
- **[VISUAL_GUIDE.md](docs/VISUAL_GUIDE.md)** - UI components

### Support

- **[TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** - Common issues & solutions
- **[TESTING_GUIDE.md](docs/TESTING_GUIDE.md)** - Testing scenarios

---

## 🐛 Troubleshooting

### Common Issues

**"MetaMask Not Detected"**
- Install MetaMask from [metamask.io](https://metamask.io)
- Refresh the page after installation
- Or use Private Key method instead

**"INVALID_SIGNATURE Error"**
- Verify you're using the correct private key for your account
- Get the key from [portal.hedera.com](https://portal.hedera.com)
- Key should be 96 characters starting with `302e020100...`
- See [PRIVATE_KEY_GUIDE.md](docs/PRIVATE_KEY_GUIDE.md)

**"METADATA_TOO_LONG Error"**
- This has been fixed in the latest version
- Refresh and try again

**"Quest Not Completing"**
- Check you met the requirements (amount and count)
- Verify transaction succeeded (check console)
- See progress in Quests tab

**"Transaction Fails"**
- Ensure you have testnet HBAR
- Get free testnet HBAR from [portal.hedera.com](https://portal.hedera.com)
- Check your internet connection

### Debug Mode

Open browser console (F12) to see detailed logs:
```
[App] User initiated action: stake
[HederaService] Performing STAKE action
[HederaService] Transaction ID: 0.0.xxx@xxx
[QuestService] Quest completed: First Steps
```

### Get Help

1. Check [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
2. Review console logs (F12)
3. Verify transaction on [HashScan](https://hashscan.io/testnet)
4. Join [Hedera Discord](https://hedera.com/discord)

---

## 🎨 Screenshots

### Dashboard
![Dashboard showing stats and quests]

### Quest Completion
![Modal celebrating quest completion]

### Badge Collection
![Collection of earned NFT badges]

---

## 🔐 Security

### Important Notes

⚠️ **TESTNET ONLY**
- This application is for Hedera testnet only
- Never use mainnet private keys
- Testnet HBAR has no real value

🛡️ **Private Key Storage**
- Keys stored in browser localStorage only
- Never sent to any server
- Used only for signing transactions
- Clear on disconnect

✅ **Best Practices**
- Use testnet accounts only
- Don't share your private key
- Clear localStorage after testing
- Use incognito mode for temporary sessions

---

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

### Development Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests (if available)
npm test

# Build for production
npm run build
```

### Code Style

- Use ES6+ features
- Follow React best practices
- Add console logging for debugging
- Comment complex logic
- Keep functions small and focused

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🙏 Acknowledgments

- **Hedera Hashgraph** - For the excellent SDK and documentation
- **Hedera Community** - For support and resources
- **Hackathon Organizers** - For the opportunity

---

## 📞 Contact & Links

- **Demo**: [Your deployment URL]
- **Video**: [Your demo video]
- **GitHub**: [Your repository]
- **Hedera Portal**: https://portal.hedera.com
- **HashScan**: https://hashscan.io/testnet
- **Hedera Docs**: https://docs.hedera.com
- **Discord**: https://hedera.com/discord

---

## 🎯 Quick Commands Reference

```bash
# Installation
npm install

# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Deployment
vercel --prod           # Deploy to Vercel
netlify deploy --prod   # Deploy to Netlify

# Testing
npm test                # Run tests (if available)
```

---

## 🌟 Star History

If you find this project useful, please consider giving it a star! ⭐

---

**Built with ❤️ on Hedera Hashgraph**

🎮 **Start your DeFi quest today!** 🚀
