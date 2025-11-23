# Deployment Instructions

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the repository details:
   - **Repository name**: `qr-code-generator` (or your preferred name)
   - **Description**: "A simple QR code generator web application"
   - **Visibility**: Public (required for free GitHub Pages)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

## Step 2: Push Your Code to GitHub

After creating the repository, GitHub will show you commands. Use these commands in your terminal:

```bash
# Navigate to your project directory (if not already there)
cd /Users/STS-ThanhTran/Downloads/qr-code-generator

# Add the remote repository (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/qr-code-generator.git

# Push your code to GitHub
git push -u origin main
```

**Note**: Replace `YOUR-USERNAME` with your actual GitHub username.

If you're using SSH instead of HTTPS:
```bash
git remote add origin git@github.com:YOUR-USERNAME/qr-code-generator.git
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** (top menu)
3. Scroll down and click on **Pages** in the left sidebar
4. Under "Build and deployment":
   - **Source**: Select "Deploy from a branch"
   - **Branch**: Select `main` and `/ (root)`
   - Click **Save**

## Step 4: Wait for Deployment

- GitHub will build and deploy your site (usually takes 1-2 minutes)
- You'll see a message at the top of the Pages settings with your site URL
- Your site will be available at: `https://YOUR-USERNAME.github.io/qr-code-generator`

## Step 5: Update README

Once deployed, update the live demo URL in your README.md:

1. Open `README.md`
2. Find the line: `Visit the live application: [QR Code Generator](https://your-username.github.io/qr-code-generator)`
3. Replace `your-username` with your actual GitHub username
4. Commit and push the change:

```bash
git add README.md
git commit -m "Update live demo URL in README"
git push
```

## Troubleshooting

### Site not loading?
- Wait a few minutes - initial deployment can take up to 10 minutes
- Check the Actions tab in your repository for build status
- Ensure your repository is public

### 404 Error?
- Verify GitHub Pages is enabled in Settings → Pages
- Check that you selected the `main` branch and `/ (root)` folder
- Make sure `index.html` is in the root directory

### Need to make changes?
Simply edit your files locally, then:
```bash
git add .
git commit -m "Your commit message"
git push
```

GitHub Pages will automatically rebuild and redeploy your site.

## Custom Domain (Optional)

If you want to use a custom domain:

1. Go to Settings → Pages
2. Under "Custom domain", enter your domain name
3. Follow GitHub's instructions to configure your DNS settings
4. Wait for DNS propagation (can take up to 48 hours)

## Security Note

This application runs entirely in the browser. No data is sent to any server - all QR code generation happens client-side using JavaScript.

---

🎉 **Congratulations!** Your QR Code Generator is now live on the web!

