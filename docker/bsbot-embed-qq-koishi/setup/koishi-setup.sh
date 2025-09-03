#!/usr/bin/env bash

# 1. download koishi boilerplate
curl  -s -X GET -o /setup/koishi-boilerplate.zip -L $KOISHI_BOILERPLATE_URL

# 2. install boilerplate
set -eu
chown -R root:root /koishi
if [ ! -e "/koishi/package.json" ]; then
  unzip -d /koishi /setup/koishi-boilerplate.zip
  #  sed -Ei 's/(([[:space:]]*)maxPort.*)/\1\n\2host: 0.0.0.0/' /koishi/koishi.yml
  rm /koishi/koishi.yml
  rm /setup/koishi-boilerplate.zip
fi

