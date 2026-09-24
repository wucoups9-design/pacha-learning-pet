#!/bin/sh
# Non-destructive edit of user-supplied Kling footage. Original files are read-only inputs.
set -eu
cd "$(dirname "$0")/.."
mkdir -p assets/video
ffmpeg -hide_banner -loglevel error -n \
  -i '/Users/gao/Documents/宠物/2026-09-24 14:06:13.MP4' \
  -i '/Users/gao/Documents/宠物/2026-09-24 14:06:49.MP4' \
  -i '/Users/gao/Documents/宠物/2026-09-24 14:06:35.MP4' \
  -i '/Users/gao/Documents/宠物/2026-09-24 14:07:00.MP4' \
  -i '/Users/gao/Documents/宠物/2026-09-24 14:07:19.MP4' \
  -filter_complex '[0:v]trim=start_frame=0:end_frame=108,setpts=PTS-STARTPTS,setsar=1,fade=t=in:st=0:d=0.25[v0];[1:v]trim=start_frame=0:end_frame=48,setpts=PTS-STARTPTS,setsar=1[v1];[2:v]trim=start_frame=36:end_frame=108,setpts=PTS-STARTPTS,setsar=1[v2];[3:v]trim=start_frame=8:end_frame=120,setpts=PTS-STARTPTS,setsar=1[v3];[4:v]trim=start_frame=36:end_frame=120,setpts=PTS-STARTPTS,setsar=1,tpad=stop_mode=clone:stop_duration=5[v4];[v0][v1][v2][v3][v4]concat=n=5:v=1:a=0,format=yuv420p[v]' \
  -map '[v]' -an -map_metadata -1 -c:v libx264 -preset medium -crf 21 \
  -movflags +faststart assets/video/pacha-park-story-v1.mp4
ffmpeg -hide_banner -loglevel error -n -ss 2 -i assets/video/pacha-park-story-v1.mp4 \
  -frames:v 1 -q:v 3 assets/video/pacha-park-poster-v1.jpg
