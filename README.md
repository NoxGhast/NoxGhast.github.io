# Nexus Ghoul — Static Website (Ready for GitHub Pages)

This folder contains a ready-to-deploy static website for the Nexus Ghoul character.
Files:
- `index.html` — the homepage
- `styles.css` — styles & animations
- `main.js` — background particle/flame effect and small interactions
- `OC.jpg` — character artwork (placed in root)

## How to deploy on GitHub Pages

1. Create a new GitHub repository (public or private).
2. Upload *all* files from this folder to the repository root.
3. Go to **Settings → Pages** (or **Settings → Code and automation → Pages**).
4. For **Source**, choose the branch (usually `main`) and folder `/ (root)`. Save.
5. GitHub will give you a site URL like `https://username.github.io/repo-name/` — it may take a minute to publish.

## Notes & customization
- Replace the embedded YouTube iframe src in `index.html` with a direct video ID if you want a featured video.
- The QR code image uses Google Charts to generate a scannable QR. You can replace it with your own image.
- If you want a custom domain, configure DNS and add it under GitHub Pages settings.

If you want, I can:
- Customize the copy, add more pages (About, Videos, Contact).
- Optimize images for web (smaller versions).
- Prepare the repo for immediate upload (I can also create the zip for you).
