# Mreme / Meme Mirror

A real-time pose detection application built with Python, OpenCV, and MediaPipe that displays specific monkey memes based on your body poses. The app uses computer vision to instantly detect and match four distinct states: Staring (neutral), Thinking (hand on mouth), Pointing (finger up), and Shocked (open mouth), displaying the corresponding monkey meme template in real-time.

<p align="center">
  <img src="memes/staring.jpg" width="180" />
  <img src="memes/thinking.jpg" width="180" />
  <img src="memes/pointing.jpg" width="180" />
  <img src="memes/shocked.jpg" width="180" />
</p>

## Features

- Real-time pose detection using MediaPipe Holistic
- Automatic monkey meme matching based on detected poses
- Multiple display modes (split view, side-by-side, picture-in-picture)
- Screenshot and video recording capabilities
- Face overlay onto monkey meme templates
- Vertical mode for social media export

## URL Share Version (Best For Sending To Someone)

This repo now includes a browser version so someone can click a URL, allow camera access, and use Meme Mirror instantly.

Files used by web deploy:
- `index.html`
- `app.js`
- `styles.css`
- `vercel.json`

Run locally (quick test):
```bash
python -m http.server 8080
```
Then open `http://localhost:8080`.

Deploy free on Vercel:
1) Push this repo to GitHub.
2) Go to Vercel and import the repository.
3) Framework preset: `Other`.
4) Root Directory: `./`.
5) Build command: leave empty.
6) Output directory: leave empty.
7) Redeploy.

If Vercel still tries Python, make sure `.vercelignore` is present in the repo root (it excludes `main.py` and `requirements.txt` from the deployment upload).

After deploy, share URL like this (custom intro name):
```text
https://your-app.vercel.app/?name=OYO
```

## Supported Poses

| Pose | How to Trigger |
|------|----------------|
| Staring | Default state - just look at the camera |
| Thinking | Touch your finger to your chin |
| Pointing | Point your finger above your head |
| Shocked | Open your mouth wide |

## Requirements

- Python 3.11+
- Computer with a webcam
- Libraries in requirements.txt

## Setup and running program

First, clone the repo
```bash
git clone https://github.com/yourusername/mreme.git
cd mreme
```

Install necessary dependencies
```bash
pip install -r requirements.txt
```

Run program
```bash
python main.py
```

## Deployment (Linux + Docker)

This app uses your local webcam and desktop window, so deploy it on a Linux machine with camera and GUI access.

1) Build and run with one command:
```bash
./deploy_linux.sh
```

2) Optional: set your intro name before starting:
```bash
MEME_MIRROR_NAME="OYO" ./deploy_linux.sh
```

If your webcam is not on the default device/index:
```bash
VIDEO_DEVICE=/dev/video1 CAMERA_INDEX=1 ./deploy_linux.sh
```

3) Stop the deployment:
```bash
docker compose down
```

Manual Docker run:
```bash
docker compose up --build
```

Notes:
- The container maps `/dev/video0` for webcam access.
- You can override webcam mapping with `VIDEO_DEVICE` and app camera selection with `CAMERA_INDEX`.
- The script enables X11 access with `xhost +local:docker`.
- Screenshots and recordings are saved to local `screenshots/` and `recordings/` folders.

## Controls

| Key | Function |
|-----|----------|
| Q | Quit |
| H | Show/hide help overlay |
| S | Take screenshot |
| R | Start/stop video recording |
| G | Export GIF frames |
| F | Toggle fullscreen |
| P | Pause |
| M | Meme-only view |
| B | Side-by-side view |
| I | Picture-in-picture mode |
| V | Vertical mode (9:16 aspect ratio) |
| W | Toggle watermark |
| A | Toggle face overlay on meme |
| Z | Toggle face zoom |
| N | Toggle smooth transitions |
| C | Switch camera |
| ←/→ | Manually cycle through memes |
| ↑ | Return to auto-detection |
