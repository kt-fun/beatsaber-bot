#!/usr/bin/env bash

echo "starting napcat"

gosu napcat Xvfb :1 -screen 0 1080x760x16 +extension GLX +render > /dev/null 2>&1 &
sleep 2

export FFMPEG_PATH=/usr/bin/ffmpeg
export DISPLAY=:1

if [ -n "${QQ_ACCOUNT}" ]; then
    gosu napcat /opt/QQ/qq --no-sandbox -q $QQ_ACCOUNT
else
    gosu napcat /opt/QQ/qq --no-sandbox
fi
