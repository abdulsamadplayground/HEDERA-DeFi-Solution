# Troubleshooting Guide

## Current Issue: MetaMask Not Detected

If you're seeing this error in console:
```
[MetaMask] MetaMask is not installed. Please install MetaMask extension.
```

### Solution Steps

#### 1. Verify MetaMask Installation

**Check if MetaMask is installed:**
1. Look for the MetaMask fox icon in your browser toolbar
2. If not visible, check browser extensions:
   - Chrome: `chrome://extensions/`
   - Firefox: `about:addons`
   - Edge: `edge://extensions/`

**Install MetaMask if needed:**
- Visit: https://metamask.io/download/
- Click "Install MetaMask for [Your Browser]"
- Follow installation instructions
- **Important:** Restart your browser after installation

#### 2. Enable MetaMask

If installed but not working:
1. Go to browser extensions page
2. Find MetaMask
3. Ensure it's **enabled** (toggle should be ON)
4. Refresh the application page

#### 3. Check Browser Console

Open Developer Tools (F12) and run:
```javascript
console.log('Window:', typeof window);
console.log('Ethereum:', typeof window.ethereum);
console.log('Is MetaMask:', window.ethereum?.isMetaMask);
```

**Expected output:**
```
Window: object
Ethereum: object
Is MetaMask: true
```

**If you see:**
```
Ethereum: undefined
```
→ MetaMask is not injecting properly. Try restarting browser.

#### 4. Refresh After Installation

MetaMask needs to inject into the page:
1. Close all browser tabs
2. Restart browser completely
3. Open application again
4. Try connecting

#### 5. Check for Conflicts

Other wallet extensions can conflict:
- Coinbase Wallet
- Phantom
- Brave Wallet (built-in)

**Solution:**
1. Disable other wallet extensions temporarily
2. Or set MetaMask as default wallet
3. Refresh the page

#### 6. Use Private Key Method (Temporary)

While troubleshooting MetaMask:
1. Click "🔑 Private Key" tab
2. Enter your Hedera credentials
3. This bypasses MetaMask entirely

---

## Common Issues & Solutions

### Issue: "User rejected the request"

**Cause:** User clicked "Cancel" in MetaMask popup

**Solution:**
- Click connect again
- Approve the connection in MetaMask
- Check "Trust this site" if available

---

### Issue: "Chain 296 not found"

**Cause:** Hedera testnet not configured in MetaMask

**Solution:**
1. The app will automatically prompt to add it
2. Click "Approve" when MetaMask asks to add network
3. Or manually add network (see METAMASK_SETUP.md)

---

### Issue: "Invalid Hedera account ID format"

**Cause:** Incorrect Account ID format entered

**Solution:**
- Format must be: `0.0.12345`
- Include the dots
- Only numbers after second dot
- Example: `0.0.4815162342`

---

### Issue: Transaction fails with "INSUFFICIENT_ACCOUNT_BALANCE"

**Cause:** Not enough HBAR in testnet account

**Solution:**
1. Visit https://portal.hedera.com
2. Log into your testnet account
3. Use the faucet to get free testnet HBAR
4. Wait a moment for balance to update
5. Try transaction again

---

### Issue: "Network Error" or "UNAVAILABLE"

**Cause:** Connection to Hedera network failed

**Solution:**
1. Check your internet connection
2. Verify RPC URL: `https://testnet.hashio.io/api`
3. Try switching MetaMask network and back
4. Check Hedera network status: https://status.hedera.com

---

### Issue: MetaMask popup doesn't appear

**Cause:** Popup blocked or MetaMask locked

**Solution:**
1. Check if browser blocked popup (look for icon in address bar)
2. Allow popups for this site
3. Unlock MetaMask if locked
4. Try clicking connect again

---

### Issue: "Account changed" keeps appearing

**Cause:** MetaMask account switching detected

**Solution:**
- This is normal behavior
- Page reloads to ensure correct account
- Reconnect with desired account
- Don't switch accounts while using app

---

### Issue: Logs not appearing in console

**Cause:** Console filter or settings

**Solution:**
1. Open DevTools (F12)
2. Go to Console tab
3. Check filter settings (top of console)
4. Ensure "All levels" is selected
5. Clear any text filters
6. Try action again

---

### Issue: "Transaction timeout"

**Cause:** Hedera network congestion or slow response

**Solution:**
1. Wait a bit longer (can take 10-30 seconds)
2. Check transaction on HashScan
3. If failed, try again
4. Check console for specific error

---

### Issue: NFT receipt not showing

**Cause:** UI not updating or transaction failed

**Solution:**
1. Check console for "Action completed successfully"
2. Verify transaction ID on HashScan
3. Refresh page if needed
4. Check if receipt is at top of list

---

## Browser-Specific Issues

### Chrome/Brave
- Ensure MetaMask has permission to run on all sites
- Check: `chrome://extensions/` → MetaMask → Details → "Site access"

### Firefox
- MetaMask may need manual permission
- Check: `about:addons` → MetaMask → Permissions

### Edge
- Same as Chrome
- Ensure Edge is up to date

---

## Debug Mode

To get maximum debugging information:

1. Open Console (F12)
2. Run this command:
```javascript
localStorage.setItem('debug', 'true');
location.reload();
```

3. Try your operation again
4. All logs will be extra verbose

To disable:
```javascript
localStorage.removeItem('debug');
location.reload();
```

---

## Still Having Issues?

### Collect Debug Information

1. Open Console (F12)
2. Clear console
3. Try the failing operation
4. Right-click in console → "Save as..."
5. Save the log file

### Check These

- [ ] Browser version (Help → About)
- [ ] MetaMask version (MetaMask → Settings → About)
- [ ] Operating system
- [ ] Exact error message
- [ ] Steps to reproduce

### Get Help

1. Review all documentation files
2. Check Hedera Discord: https://hedera.com/discord
3. Visit Hedera docs: https://docs.hedera.com
4. Check MetaMask support: https://support.metamask.io

---

## Prevention Tips

✅ **Keep MetaMask updated** - Check for updates regularly
✅ **Use supported browsers** - Chrome, Firefox, Edge, Brave
✅ **One wallet at a time** - Disable conflicting extensions
✅ **Check console first** - Logs show exactly what's wrong
✅ **Testnet only** - Never use mainnet credentials for testing
✅ **Backup credentials** - Save your Hedera Account ID safely

---

## Emergency: Reset Everything

If nothing works, nuclear option:

1. **Clear browser cache:**
   - Settings → Privacy → Clear browsing data
   - Select "Cached images and files"
   - Clear

2. **Clear localStorage:**
   ```javascript
   // Clear all stored data
   localStorage.clear();
   
   // Or clear only Hedera credentials
   localStorage.removeItem('hedera_account_id');
   localStorage.removeItem('hedera_private_key');
   ```

3. **Reinstall MetaMask:**
   - **BACKUP YOUR SEED PHRASE FIRST!**
   - Uninstall MetaMask
   - Restart browser
   - Reinstall MetaMask
   - Restore from seed phrase

4. **Try fresh browser profile:**
   - Create new browser profile
   - Install MetaMask
   - Test application

---

## Success Checklist

Before reporting an issue, verify:

- [ ] MetaMask is installed and enabled
- [ ] Browser is restarted after MetaMask installation
- [ ] Hedera testnet is configured in MetaMask
- [ ] Account has testnet HBAR
- [ ] Console shows detailed logs
- [ ] No other wallet extensions interfering
- [ ] Internet connection is stable
- [ ] Using supported browser

If all checked and still failing, you've found a real bug! 🐛
