#!/usr/bin/env bash

# 1.

echo "load config from env"
/setup/boot/load-config.sh

# 3. start
echo "starting koishi"
nohup /setup/boot/koishi-entrypoint.sh > /dev/stdout 2> /dev/stderr &

echo "starting napcat"
nohup /setup/boot/napcat-entrypoint.sh > /dev/stdout 2> /dev/stderr &

while [ True ]; do
    sleep ${PROBE_INTERVAL:-300}
    /setup/boot/check-alive.sh
done
