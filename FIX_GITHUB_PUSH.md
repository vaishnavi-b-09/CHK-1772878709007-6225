# Fix GitHub Push Error - Windows Credential Issue

## The Problem
Windows has cached credentials for a different GitHub account (atharvb07-rgb), but you're trying to push to vaishnavi-b-09's repository.

## Solution: Clear Windows Credentials

### Method 1: Using Command Line (Easiest)

```bash
# Remove cached GitHub credentials
git credential-manager-core erase https://github.com

# Or try this if above doesn't work:
git credential reject
# Then type:
protocol=https
host=github.com
# Press Enter twice
```

### Method 2: Windows Credential Manager (Manual)

1. Press `Windows + R`
2. Type: `control /name Microsoft.CredentialManager`
3. Press Enter
4. Click "Windows Credentials"
5. Look for entries starting with `git:https://github.com`
6. Click each one and select "Remove"
7. Close the window

### Method 3: Use Personal Access Token (Recommended)

This bypasses the credential issue entirely.

#### Step 1: Create GitHub Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name it: "Gyan Setu Deploy"
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
5. Click "Generate token"
6. **COPY THE TOKEN** (you won't see it again!)

#### Step 2: Update Git Remote with Token

```bash
# Remove old remote
git remote remove origin

# Add new remote with token
git remote add origin https://YOUR_TOKEN@github.com/vaishnavi-b-09/gyan-setu.git

# Verify
git remote -v
```

Replace `YOUR_TOKEN` with the actual token you copied.

### Method 4: Use SSH (Alternative)

If you prefer SSH keys:

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "vaishnavidipakbhosale@gmail.com"

# Copy the public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub:
# 1. Go to https://github.com/settings/keys
# 2. Click "New SSH key"
# 3. Paste the key
# 4. Save

# Update remote to use SSH
git remote set-url origin git@github.com:vaishnavi-b-09/gyan-setu.git
```

## After Fixing Credentials

Once credentials are cleared, try pushing again:

```bash
# Check current branch
git branch

# Push Phase 1
git push -u origin develop
git push -u origin feature/project-setup
```

## Quick Test

Test if credentials are working:

```bash
# This should prompt for username/password or use token
git ls-remote https://github.com/vaishnavi-b-09/gyan-setu.git
```

## If Still Getting 403 Error

The repository might not exist or you don't have access. Verify:

1. Go to: https://github.com/vaishnavi-b-09/gyan-setu
2. Make sure the repository exists
3. Make sure you're logged in as vaishnavi-b-09
4. Check if the repository is public or if you have access

## Need Help?

Tell me which method you want to use:
1. Personal Access Token (Easiest)
2. Clear Credentials Manually
3. SSH Keys

I'll guide you through it step by step!
