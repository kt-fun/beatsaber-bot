#!/usr/bin/env bash
# mv file



echo "starting koishi"
PATH="/root/.nvm/versions/node/v22.19.0/bin:$PATH"
NVM_BIN="/root/.nvm/versions/node/v22.19.0/bin"
cd /koishi
chmod +x $HOME/.nvm/nvm.sh
$HOME/.nvm/nvm.sh && yarn start


