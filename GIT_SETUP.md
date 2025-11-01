# Git Setup and Push to GitHub Guide

## Step 1: Check Current Git Status

```bash
git status
```

## Step 2: Add All Files to Git

```bash
git add .
```

## Step 3: Commit Your Changes

```bash
git commit -m "Initial setup: Angular + PrimeNG + Tailwind with Authentication and Inventory modules

- Setup Angular 20 with standalone components
- Integrated PrimeNG 20 and Tailwind CSS 3
- Implemented JWT authentication with login/register
- Created responsive app layout with sidebar and mobile navigation
- Built inventory management module with CRUD operations
- Added API integration with interceptors and error handling
- Configured environment files and routing
- Implemented proper folder structure for scalability"
```

## Step 4: Create a New Repository on GitHub

1. Go to https://github.com/new
2. Enter repository details:
   - **Repository name**: `jewellify-frontend` (or your preferred name)
   - **Description**: "Jewelry Inventory & Billing System - Frontend"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (you already have these files)
3. Click "Create repository"

## Step 5: Link Your Local Repository to GitHub

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

Example:
```bash
git remote add origin https://github.com/johndoe/jewellify-frontend.git
```

## Step 6: Rename Branch to Main (if needed)

```bash
git branch -M main
```

## Step 7: Push to GitHub

```bash
git push -u origin main
```

If you encounter authentication issues, you may need to use a Personal Access Token (PAT):

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` scope
3. Use the token as your password when pushing

## Complete Command Sequence

```bash
# Check status
git status

# Add all files
git add .

# Commit
git commit -m "Initial setup: Angular + PrimeNG + Tailwind with Authentication and Inventory modules"

# Add remote (replace with your details)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Rename branch
git branch -M main

# Push
git push -u origin main
```

## Verify Push

After pushing, go to your GitHub repository URL to verify all files are uploaded.

## Future Commits

For future changes, use this workflow:

```bash
# Check what changed
git status

# Add specific files or all files
git add .

# Commit with descriptive message
git commit -m "Add feature: Customer management module"

# Push to GitHub
git push
```

## Best Practices for Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Be descriptive but concise
- Include what was changed and why
- Reference issue numbers if applicable

Examples:
```bash
git commit -m "Fix: Resolve inventory filter bug on mobile devices"
git commit -m "Feature: Add customer search and pagination"
git commit -m "Refactor: Improve error handling in auth service"
git commit -m "Update: Upgrade PrimeNG to latest version"
```

## Create .gitignore (if not exists)

Create a `.gitignore` file to exclude unnecessary files:

```
# Dependencies
node_modules/

# Build outputs
dist/
.angular/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Environment files (if you have secrets)
# src/environments/environment.prod.ts

# OS
.DS_Store
Thumbs.db

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage/
.nyc_output/

# Misc
*.log
