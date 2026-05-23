# GitHub Authentication Setup

## Option 1: GitHub CLI (Recommended)

```bash
# Install GitHub CLI (if not installed)
brew install gh

# Login to GitHub
gh auth login

# Follow prompts:
# - Choose HTTPS or SSH (pick HTTPS for ease)
# - Authenticate with your GitHub account
# - Create personal access token if needed

# Update repository
cd /Users/apple/Desktop/DataMirror
git remote set-url origin https://github.com/HamidKhan1001/datamirror.git

# Push to GitHub
git push -u origin main
```

## Option 2: SSH Keys

```bash
# Check if you have SSH key
ls ~/.ssh/id_rsa

# If not, generate one
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N ""

# Add to SSH agent
ssh-add ~/.ssh/id_rsa

# Copy public key to clipboard
cat ~/.ssh/id_rsa.pub | pbcopy

# Go to GitHub Settings > SSH and GPG keys > New SSH key
# Paste the key

# Update repository to use SSH
cd /Users/apple/Desktop/DataMirror
git remote set-url origin git@github.com:HamidKhan1001/datamirror.git

# Push
git push -u origin main
```

## Option 3: Personal Access Token (PAT)

```bash
# Create token at: https://github.com/settings/tokens
# Select scopes: repo, workflow, write:packages

# Update remote with PAT
git remote set-url origin https://YOUR_USERNAME:YOUR_TOKEN@github.com/HamidKhan1001/datamirror.git

# Push
git push -u origin main
```

---

**After successful push, your repository will be available at:**
https://github.com/HamidKhan1001/datamirror
