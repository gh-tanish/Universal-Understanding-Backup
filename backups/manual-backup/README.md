# Website Backup

This repository contains a static website backup from the workspace.

## Quick steps to publish on GitHub

Open PowerShell at the repository root (the folder containing this README).

1. Initialize and commit locally:

```powershell
git init
git add .
git commit -m "Initial commit"
```

2a. Create and push a GitHub repo using the GitHub CLI (`gh`) (recommended):

```powershell
# replace YOUR-USERNAME and REPO-NAME
gh repo create YOUR-USERNAME/REPO-NAME --public --source . --remote origin --push
```

2b. Or create a repo on github.com, then run:

```powershell
# replace URL with your repo URL
git remote add origin https://github.com/YOUR-USERNAME/REPO-NAME.git
git branch -M main
git push -u origin main
```

3. (Optional) Enable GitHub Pages in the repository Settings → Pages to serve this site as a static website.

If you want, I can run the `git init`/commit/push steps for you — tell me whether you want to use `gh` or create the repo manually on GitHub.