#!/usr/bin/env bash

echo "starting koishi"
PATH="/root/.nvm/versions/node/v22.19.0/bin:$PATH"
NVM_BIN="/root/.nvm/versions/node/v22.19.0/bin"
cd /app/koishi

chmod +x -R /root/.nvm

/root/.nvm/nvm.sh && yarn start


