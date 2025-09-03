#!/usr/bin/env bash
echo "$KOISHI_BOILERPLATE_URL"
# 1. download koishi boilerplate

curl  -s -X GET -o /setup/koishi-boilerplate.zip -L $KOISHI_BOILERPLATE_URL

chown -R root:root /app/koishi
if [ ! -e "/app/koishi/package.json" ]; then
  unzip -d /app/koishi /setup/koishi-boilerplate.zip
  #  sed -Ei 's/(([[:space:]]*)maxPort.*)/\1\n\2host: 0.0.0.0/' /koishi/koishi.yml
  rm /app/koishi/koishi.yml
  rm /setup/koishi-boilerplate.zip
fi

