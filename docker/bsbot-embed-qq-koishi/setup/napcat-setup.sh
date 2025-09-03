#!/usr/bin/env bash
set -eu
usermod -o -u 0 napcat
groupmod -o -g 0 napcat
usermod -g 0 napcat

echo "NAPCAT_VERSION=${NAPCAT_VERSION}"
: ${NAPCAT_GID:=1000}
: ${NAPCAT_UID:=1000}
echo "NAPCAT_GID=$NAPCAT_GID"
echo "NAPCAT_UID=$NAPCAT_UID"
echo "LINUX_QQ_DOWNLOAD_URL=${LINUX_QQ_DOWNLOAD_URL}"
# install Linux QQ
arch=$(arch | sed s/aarch64/arm64/ | sed s/x86_64/amd64/) && \
    curl -o linuxqq.deb $LINUX_QQ_DOWNLOAD_URL && \
    dpkg -i --force-depends linuxqq.deb && rm linuxqq.deb && \
    echo "(async () => {await import('file:///app/napcat/napcat.mjs');})();" > /opt/QQ/resources/app/loadNapCat.js && \
    sed -i 's|"main": "[^"]*"|"main": "./loadNapCat.js"|' /opt/QQ/resources/app/package.json

# download napcat
curl  -s -X GET \
        -L "https://github.com/NapNeko/NapCatQQ/releases/download/$NAPCAT_VERSION/NapCat.Shell.zip" \
        -o "/setup/NapCat.Shell.zip"

# 安装 napcat
mkdir -p /app/napcat/
if [ ! -f "/app/napcat/napcat.mjs" ]; then
    unzip -q /setup/NapCat.Shell.zip -d /setup/NapCat.Shell
    cp -rf /setup/NapCat.Shell/* /app/napcat/
    rm -rf /setup/NapCat.Shell
    rm -rf /setup/NapCat.Shell.zip
fi

if [ ! -f "/app/napcat/config/napcat.json" ]; then
    unzip -q /setup/NapCat.Shell.zip -d /setup/NapCat.Shell
    cp -rf /setup/NapCat.Shell/config/* /setup/napcat/config/
    rm -rf /setup/NapCat.Shell
    rm -rf /setup/NapCat.Shell.zip
fi



# 配置 WebUI Token
#CONFIG_PATH=/app/napcat/config/webui.json
#
#if [ ! -f "${CONFIG_PATH}" ] && [ -n "${WEBUI_TOKEN}" ]; then
#    echo "正在配置 WebUI Token..."
#    cat > "${CONFIG_PATH}" << EOF
#{
#    "host": "0.0.0.0",
#    "prefix": "${WEBUI_PREFIX}",
#    "port": 6099,
#    "token": "${WEBUI_TOKEN}",
#    "loginRate": 3
#}
#EOF
#fi

# 删除字符串两端的引号
remove_quotes() {
    local str="$1"
    local first_char="${str:0:1}"
    local last_char="${str: -1}"

    if [[ ($first_char == '"' && $last_char == '"') || ($first_char == "'" && $last_char == "'") ]]; then
        # 两端都是双引号
        if [[ $first_char == '"' ]]; then
            str="${str:1:-1}"
        # 两端都是单引号
        else
            str="${str:1:-1}"
        fi
    fi
    echo "$str"
}

#if [ -n "${MODE}" ]; then
#    cp /app/templates/$MODE.json /app/napcat/config/onebot11.json
#fi

rm -rf "/tmp/.X1-lock"
