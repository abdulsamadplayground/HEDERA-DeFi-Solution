# 💎 Modern HBAR Amount Selector - User Guide

## Overview

The new HBAR amount selector provides a modern, intuitive interface for selecting stake amounts with multiple input methods.

## Features

### 1. 🎯 Preset Amount Buttons

Quick-select common amounts with one click:

```
┌─────────┬─────────┬─────────┐
│ 10 HBAR │ 50 HBAR │100 HBAR │
├─────────┼─────────┼─────────┤
│200 HBAR │500 HBAR │1000HBAR │
└─────────┴─────────┴─────────┘
```

**Features:**
- ✅ One-click selection
- ✅ Visual active state (purple gradient)
- ✅ Checkmark on selected
- ✅ Hover effects
- ✅ Covers common quest amounts

**Usage:**
- Click any preset button
- Selected amount highlights in purple
- Checkmark appears on active button

### 2. ⌨️ Custom Amount Input

Large, centered input for custom amounts:

```
┌─────────────────────────────┐
│                             │
│         500        HBAR     │
│                             │
└─────────────────────────────┘
```

**Features:**
- ✅ Large, easy-to-read text (1.5rem)
- ✅ Centered display
- ✅ HBAR suffix always visible
- ✅ Focus state with blue glow
- ✅ Accepts any positive number

**Usage:**
- Click input field
- Type your desired amount
- HBAR suffix updates automatically

### 3. 🎛️ Fine-Tune Controls

Increment/decrement buttons for precise control:

```
┌─────┬─────┬─────┬─────┐
│ -10 │ -1  │ +1  │ +10 │
└─────┴─────┴─────┴─────┘
```

**Features:**
- ✅ Quick adjustments
- ✅ -10 / +10 for large changes
- ✅ -1 / +1 for fine-tuning
- ✅ Prevents negative amounts
- ✅ Hover scale effect

**Usage:**
- Click -10 to decrease by 10
- Click -1 to decrease by 1
- Click +1 to increase by 1
- Click +10 to increase by 10

### 4. 💎 Dynamic Stake Button

Large, prominent button showing selected amount:

```
┌─────────────────────────────┐
│   💎 Stake 100 HBAR         │
└─────────────────────────────┘
```

**Features:**
- ✅ Shows exact amount to stake
- ✅ Large, easy to click
- ✅ Disabled if amount invalid
- ✅ Loading state during transaction
- ✅ Gradient background
- ✅ Shadow and hover effects

**States:**
- **Ready**: `💎 Stake 100 HBAR`
- **Loading**: `⏳ Staking...`
- **Disabled**: Grayed out (amount < 1)

### 5. 📊 Info Panel

Clean, organized information display:

```
┌─────────┬─────────┬─────────┐
│   APY   │  Lock   │   Min   │
│  8.5%   │ 30 days │ 1 HBAR  │
└─────────┴─────────┴─────────┘
```

**Features:**
- ✅ Three-column grid
- ✅ Clear labels
- ✅ Purple accent values
- ✅ Gradient background
- ✅ Responsive layout

## User Flows

### Quick Stake (Preset)

1. **Click preset button** (e.g., "100 HBAR")
2. **Button highlights** in purple with checkmark
3. **Stake button updates** to "💎 Stake 100 HBAR"
4. **Click stake button**
5. **Transaction processes**

**Time**: ~3 seconds

### Custom Amount

1. **Click input field**
2. **Type amount** (e.g., "250")
3. **Input shows** "250 HBAR"
4. **Stake button updates** to "💎 Stake 250 HBAR"
5. **Click stake button**
6. **Transaction processes**

**Time**: ~5 seconds

### Fine-Tune Amount

1. **Select preset** (e.g., "100 HBAR")
2. **Click +10** twice → 120 HBAR
3. **Click +1** five times → 125 HBAR
4. **Stake button shows** "💎 Stake 125 HBAR"
5. **Click stake button**
6. **Transaction processes**

**Time**: ~8 seconds

## Visual States

### Default State
```
Preset buttons: White with gray border
Input: Empty with placeholder
Controls: White with gray border
Stake button: Purple gradient
```

### Active State
```
Selected preset: Purple gradient with checkmark
Input: Focused with blue glow
Controls: Hover scale effect
Stake button: Elevated with shadow
```

### Loading State
```
All inputs: Disabled
Stake button: "⏳ Staking..."
Controls: Grayed out
```

### Error State
```
Amount < 1: Stake button disabled
Invalid input: Red border (future)
```

## Responsive Design

### Desktop (> 768px)
- Preset buttons: 3 columns
- Full-size input
- 4 control buttons
- 3-column info panel

### Mobile (< 768px)
- Preset buttons: 2 columns
- Smaller input text
- 2x2 control grid
- Single-column info panel

## Accessibility

### Keyboard Navigation
- ✅ Tab through all buttons
- ✅ Enter to activate
- ✅ Arrow keys in input
- ✅ Focus indicators

### Screen Readers
- ✅ Button labels clear
- ✅ Input has placeholder
- ✅ Amount announced
- ✅ State changes announced

### Visual
- ✅ High contrast text
- ✅ Large touch targets
- ✅ Clear hover states
- ✅ Disabled states obvious

## Tips & Tricks

### For Quest Completion

**First Steps (10+ HBAR):**
- Click "10 HBAR" preset
- Or type "10" in input

**Stake Enthusiast (50+ HBAR):**
- Click "50 HBAR" preset
- Or type "50" in input

**Stake Master (5x 10+ HBAR):**
- Use "10 HBAR" preset 5 times
- Or vary amounts: 10, 20, 15, 25, 30

**Power Staker (200+ HBAR):**
- Click "200 HBAR" preset
- Or type "200" in input

**High Roller (1000+ HBAR):**
- Click "1000 HBAR" preset
- Or type "1000" in input

### Efficient Staking

**Small Adjustments:**
- Use +1/-1 buttons
- Fine-tune to exact amount

**Large Changes:**
- Use +10/-10 buttons
- Quick increments

**Exact Amounts:**
- Type directly in input
- Fastest for specific values

**Common Amounts:**
- Use preset buttons
- One-click selection

## Design Philosophy

### Modern & Clean
- Minimal clutter
- Clear hierarchy
- Ample whitespace
- Smooth animations

### User-Friendly
- Multiple input methods
- Visual feedback
- Clear states
- Intuitive controls

### Professional
- Gradient accents
- Consistent styling
- Polished interactions
- Attention to detail

## Technical Details

### Components
- Preset buttons (6)
- Custom input (1)
- Control buttons (4)
- Stake button (1)
- Info panel (1)

### Styling
- CSS Grid layouts
- Flexbox alignment
- CSS transitions
- Gradient backgrounds
- Box shadows

### Interactions
- Click handlers
- Input validation
- State management
- Disabled states
- Loading states

## Future Enhancements

### Planned Features
- [ ] Slider input
- [ ] Balance display
- [ ] Max button
- [ ] Recent amounts
- [ ] Favorite amounts
- [ ] Amount suggestions
- [ ] Calculator mode
- [ ] Batch staking

### Improvements
- [ ] Haptic feedback
- [ ] Sound effects
- [ ] Animations
- [ ] Tooltips
- [ ] Help hints
- [ ] Keyboard shortcuts

---

**The modern amount selector makes staking HBAR intuitive, fast, and enjoyable! 💎✨**
