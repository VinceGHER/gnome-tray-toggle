# Publishing Guide

This guide explains how to publish the GNOME Tray Toggle extension to GitHub and extensions.gnome.org.

## Prerequisites

- [x] Extension tested and working on GNOME Shell 47+
- [ ] Screenshots added to `screenshots/` directory
- [ ] GitHub account created
- [ ] extensions.gnome.org account created

## Part 1: Publishing to GitHub

### 1. Create a New Repository

1. Go to https://github.com/new
2. Repository name: `gnome-tray-toggle`
3. Description: "Toggle visibility of system tray icons in GNOME Shell with smooth animations"
4. Public repository
5. **Don't** initialize with README (we already have one)

### 2. Initialize Git and Push

```bash
cd ~/Work/gnome-tray-toggle

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: GNOME Tray Toggle extension v1.0"

# Add your GitHub remote (replace 'yourusername' with your GitHub username)
git remote add origin https://github.com/yourusername/gnome-tray-toggle.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Create a Release

1. Go to your repository on GitHub
2. Click "Releases" → "Create a new release"
3. Tag version: `v1.0.0`
4. Release title: `v1.0.0 - Initial Release`
5. Description:
   ```markdown
   ## Features
   - Toggle button to hide/show application tray icons
   - Smooth slide animations
   - Smart filtering (hides only app icons, not system icons)
   - Support for GNOME Shell 47-49

   ## Installation
   See [README.md](README.md) for installation instructions.
   ```
6. Attach the `.zip` file (create it with `make zip`)
7. Click "Publish release"

## Part 2: Publishing to extensions.gnome.org

### 1. Create the Distribution Package

```bash
cd ~/Work/gnome-tray-toggle
make zip
```

This creates `tray-toggle@maciek.shell-extension.zip`

### 2. Register/Login to extensions.gnome.org

1. Go to https://extensions.gnome.org/
2. Login with your GNOME account (or create one)
3. Verify your email if needed

### 3. Upload Extension

1. Go to https://extensions.gnome.org/upload/
2. Click "Choose File" and select `tray-toggle@maciek.shell-extension.zip`
3. Fill in the form:
   - **Description**: Copy from README.md (Features section)
   - **Homepage**: Your GitHub repo URL
   - **Screenshots**: Upload screenshots from `screenshots/` directory
     - Upload at least 2 screenshots (visible/hidden states)
     - Maximum size: 5MB per image
4. Review the extension details
5. Click "Upload"

### 4. Wait for Review

- Extensions are reviewed by GNOME maintainers
- Review typically takes 1-2 weeks
- You'll receive email notifications about the review status
- Address any feedback from reviewers

### 5. After Approval

Once approved:
- Your extension will be live on extensions.gnome.org
- Users can install it with one click via the website
- Update the README.md with the live extension URL

## Part 3: Maintenance

### Releasing Updates

1. Make your changes
2. Update version in `metadata.json`
3. Update `README.md` changelog
4. Test thoroughly
5. Create git tag and GitHub release
6. Create new zip: `make zip`
7. Upload to extensions.gnome.org

### Version Numbering

Use [Semantic Versioning](https://semver.org/):
- **MAJOR.MINOR.PATCH** (e.g., 1.0.0)
- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes

## Checklist Before Publishing

- [ ] All features working correctly
- [ ] No console errors in logs (`make logs`)
- [ ] Screenshots added to repository
- [ ] README.md is complete and accurate
- [ ] LICENSE file included
- [ ] GitHub URL updated in metadata.json
- [ ] Extension tested on all supported GNOME versions
- [ ] Clean code, no debugging console.log() statements

## Tips

- **Good screenshots** are crucial for attracting users
- **Clear README** helps users install and use your extension
- **Responsive to issues** builds trust with users
- **Regular updates** keep the extension relevant

## Resources

- [GNOME Shell Extensions Documentation](https://gjs.guide/extensions/)
- [extensions.gnome.org Review Guidelines](https://extensions.gnome.org/review-guidelines/)
- [GJS Documentation](https://gjs-docs.gnome.org/)
