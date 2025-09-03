#!/usr/bin/sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"
# Download and install Node.js:
nvm install 22
# Verify the Node.js version:
node -v # Should print "v22.19.0".
nvm current # Should print "v22.19.0".
# Download and install Yarn:
corepack enable yarn
# Verify Yarn version:
yarn -v
