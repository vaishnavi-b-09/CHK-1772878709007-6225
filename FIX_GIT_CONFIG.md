# Fix Git Configuration for Different GitHub Account

## Current Issue
You have multiple Git configurations and need to push to a different GitHub account.

## Solution

### Option 1: Configure for This Project Only (Recommended)
This sets the Git config only for this project, not globally.

```bash
# Set your GitHub username and email for THIS project only
git config user.name "YourGitHubUsername"
git config user.email "your-github-email@example.com"

# Verify it's set correctly
git config user.name
git config user.email
```

### Option 2: Use GitHub Personal Access Token (Most Secure)
If you're using a different account, you'll need authentication.

1. **Create Personal Access Token:**
   - Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Give it a name: "Gyan Setu Deploy"
   - Select scopes: `repo` (full control of private repositories)
   - Click "Generate token"
   - **COPY THE TOKEN** (you won't see it again!)

2. **Configure Git to use the token:**
   ```bash
   # When pushing, use this format:
   git remote add origin https://YOUR_TOKEN@github.com/username/gyan-setu.git
   
   # Or if remote already exists:
   git remote set-url origin https://YOUR_TOKEN@github.com/username/gyan-setu.git
   ```

### Option 3: Use SSH Key (Alternative)
If you prefer SSH:

1. **Generate SSH key:**
   ```bash
   ssh-keygen -t ed25519 -C "your-github-email@example.com"
   ```

2. **Add to GitHub:**
   - Copy the public key: `cat ~/.ssh/id_ed25519.pub`
   - Go to GitHub → Settings → SSH and GPG keys → New SSH key
   - Paste and save

3. **Use SSH URL:**
   ```bash
   git remote add origin git@github.com:username/gyan-setu.git
   ```

## Quick Fix Commands

### Check current config:
```bash
git config --list | grep user
```

### Set for this project:
```bash
git config user.name "YourName"
git config user.email "your-email@example.com"
```

### Remove wrong config:
```bash
git config --unset user.name
git config --unset user.email
```

### Test connection:
```bash
# For HTTPS:
git ls-remote https://github.com/username/gyan-setu.git

# For SSH:
ssh -T git@github.com
```

## What to Tell Kiro

Provide:
1. **GitHub Username**: (e.g., "john-doe")
2. **GitHub Email**: (e.g., "john@example.com")
3. **Repository URL**: (e.g., "https://github.com/john-doe/gyan-setu.git")
4. **Authentication Method**: (Token, SSH, or Password)

Then I'll configure everything and push Phase 1!
