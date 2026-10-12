#!/usr/bin/env sh
# Transcodes the original 1080p60 hero video (assets-src/hero-video-1080p.mp4, 78.7 MB)
# into a 720p30 H.264 MP4 (<12 MB) and a VP9 WebM for the click-to-play hero player.
# Usage: FFMPEG=/path/to/ffmpeg sh scripts/transcode-video.sh
set -e
FFMPEG="${FFMPEG:-ffmpeg}"
SRC="assets-src/hero-video-1080p.mp4"
OUT="public/video"
mkdir -p "$OUT"
VF="scale=-2:720:flags=lanczos,fps=30"

# H.264, two-pass at ~760 kbps so the 110 s clip lands under 12 MB
"$FFMPEG" -y -i "$SRC" -vf "$VF" -c:v libx264 -preset slow -b:v 760k -maxrate 1200k -bufsize 2400k -pass 1 -passlogfile "$OUT/x264" -an -f mp4 NUL
"$FFMPEG" -y -i "$SRC" -vf "$VF" -c:v libx264 -preset slow -b:v 760k -maxrate 1200k -bufsize 2400k -pass 2 -passlogfile "$OUT/x264" \
  -profile:v high -pix_fmt yuv420p -c:a aac -b:a 64k -ac 2 -movflags +faststart "$OUT/villa-tanah-shanti-720.mp4"

# VP9 + Opus WebM alternative
"$FFMPEG" -y -i "$SRC" -vf "$VF" -c:v libvpx-vp9 -b:v 650k -row-mt 1 -deadline good -cpu-used 2 -pass 1 -passlogfile "$OUT/vp9" -an -f webm NUL
"$FFMPEG" -y -i "$SRC" -vf "$VF" -c:v libvpx-vp9 -b:v 650k -row-mt 1 -deadline good -cpu-used 2 -pass 2 -passlogfile "$OUT/vp9" \
  -c:a libopus -b:a 64k "$OUT/villa-tanah-shanti-720.webm"

rm -f "$OUT"/*.log "$OUT"/*.log.mbtree "$OUT"/*-0.log*
ls -la "$OUT"
