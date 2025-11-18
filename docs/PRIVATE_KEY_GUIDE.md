# 🔑 Private Key Format Guide

## ⚠️ INVALID_SIGNATURE Error?

If you're getting `INVALID_SIGNATURE` errors, it's likely a private key format issue.

## ✅ Correct Private Key Format

Hedera accepts these formats:

### 1. DER Format (Recommended)
```
302e020100300506032b657004220420...
```
- Starts with `302e020100300506032b657004220420`
- 96 characters long
- This is what Hedera Portal gives you

### 2. Raw Hex (64 characters)
```
cebaf91c8e3f8b7d9637e8213944a638...
```
- Exactly 64 hexadecimal characters
- No `0x` prefix
- Pure hex string

### 3. Hex with 0x Prefix
```
0xcebaf91c8e3f8b7d9637e8213944a638...
```
- Starts with `0x`
- 66 characters total (0x + 64 hex chars)
- System will automatically remove the `0x`

## ❌ Common Mistakes

### Wrong: Ethereum Private Key
```
0x1234567890abcdef... (Ethereum format)
```
**Problem**: This is an Ethereum private key, not Hedera

### Wrong: Mnemonic Phrase
```
word1 word2 word3 ... word12
```
**Problem**: This is a seed phrase, not a private key

### Wrong: Public Key
```
302a300506032b6570032100...
```
**Problem**: This is your PUBLIC key, not private key

## 🎯 How to Get Your Hedera Private Key

### From Hedera Portal

1. **Go to** https://portal.hedera.com
2. **Log in** to your testnet account
3. **Click** on your account
4. **Find** "Private Key" section
5. **Copy** the entire key (should start with `302e020100...`)

### Example Valid Keys

**DER Format** (what you should use):
```
302e020100300506032b657004220420cebaf91c8e3f8b7d9637e8213944a63802465277703788fcbfd1d68bd8c3559af
```

**Raw Hex** (also works):
```
cebaf91c8e3f8b7d9637e8213944a63802465277703788fcbfd1d68bd8c3559af
```

## 🔍 Verify Your Key

### Check Key Length

**DER Format**: Should be 96 characters
```javascript
// In browser console:
console.log(yourPrivateKey.length); // Should be 96
```

**Raw Hex**: Should be 64 characters
```javascript
console.log(yourPrivateKey.length); // Should be 64 or 66 (with 0x)
```

### Check Key Format

**DER Format** starts with:
```
302e020100300506032b657004220420
```

**Raw Hex** is just:
```
[64 hexadecimal characters]
```

## 🛠️ Fix Common Issues

### Issue 1: Key has 0x prefix
**Solution**: System automatically removes it, but you can manually remove it too
```
Before: 0xcebaf91c8e3f8b7d...
After:  cebaf91c8e3f8b7d...
```

### Issue 2: Key has spaces
**Solution**: Remove all spaces
```
Before: 302e 0201 0030 0506...
After:  302e020100300506...
```

### Issue 3: Key has line breaks
**Solution**: Remove all line breaks, make it one continuous string
```
Before: 302e020100300506032b6570
        04220420cebaf91c8e3f...
After:  302e020100300506032b657004220420cebaf91c8e3f...
```

### Issue 4: Using wrong key type
**Solution**: Make sure you're using PRIVATE key, not public key
- Private key (DER): Starts with `302e020100...`
- Public key (DER): Starts with `302a300506...`

## 🧪 Test Your Key

### In Browser Console

```javascript
// Test if key is valid format
const key = "YOUR_PRIVATE_KEY_HERE";

// Check length
console.log("Length:", key.length);

// Check if DER format
if (key.startsWith("302e020100")) {
  console.log("✅ Valid DER format");
} else if (key.length === 64 || (key.startsWith("0x") && key.length === 66)) {
  console.log("✅ Valid hex format");
} else {
  console.log("❌ Invalid format");
}
```

## 📝 Step-by-Step Connection

1. **Get your private key** from Hedera Portal
2. **Copy the entire key** (should be 96 characters)
3. **Paste into app** (no modifications needed)
4. **Click Connect**
5. **Check console** for any errors

## 🔐 Security Notes

### ⚠️ TESTNET ONLY
- **NEVER** use mainnet private keys in browser
- **ONLY** use testnet keys for this demo
- Testnet HBAR has no real value

### 🛡️ Best Practices
- Don't share your private key
- Don't commit keys to GitHub
- Use environment variables in production
- Consider hardware wallets for mainnet

## 🆘 Still Having Issues?

### Check Console Logs

Open browser console (F12) and look for:
```
[HederaService] Private Key (first 10 chars): 302e020100...
[HederaService] Using ED25519 key
[HederaService] Public Key: 302a300506...
```

If you see:
```
[HederaService] All key parsing attempts failed
```

Then your key format is wrong.

### Common Error Messages

**"Invalid private key format"**
- Key is not in correct format
- Try DER format from Hedera Portal

**"INVALID_SIGNATURE"**
- Key doesn't match account ID
- Using wrong key for this account
- Key format issue

**"Key length: XX"**
- Should be 64 or 96
- If different, key is wrong format

## ✅ Success Indicators

When key is correct, you'll see:
```
[HederaService] Using ED25519 key
[HederaService] Public Key: 302a300506...
[HederaService] Initialized successfully
```

Then transactions will work!

## 📞 Need Help?

1. **Check** this guide first
2. **Verify** key format and length
3. **Test** in browser console
4. **Check** console logs for specific errors
5. **Get new key** from Hedera Portal if needed

---

**Remember**: Use the FULL private key from Hedera Portal (96 characters starting with 302e020100...)
