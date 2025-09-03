#!/usr/bin/env bash
set -eu

# 每次启动时，重新从环境变量/配置文件中读取配置
echo "Loading configuration from environment variables and config file..."

# setup config
CONFIG_FILE="/app/config.json"

if [ ! -f "${CONFIG_FILE}" ]; then
  echo "{}" > $CONFIG_FILE
fi

get_config() {
    local json_key="$1"
    local env_key="$2"
    local default_value="$3"
    local value=""
    if [[ -n "${!env_key-}" ]]; then
        value="${!env_key}"
        echo "$value"
        return
    fi

    # 2. 如果环境变量不存在，则尝试从 JSON 文件中读取
    # - `command -v jq &> /dev/null` 检查 jq 命令是否存在
    # - `[[ -f "$CONFIG_FILE" ]]` 检查配置文件是否存在
    if command -v jq &> /dev/null && [[ -f "$CONFIG_FILE" ]]; then
        # - `jq -r` 表示输出原始字符串（不带引号）
        # - `".${json_key}"` 构建查询路径
        # - `// ""` 是 jq 的备用操作符，如果键不存在，则返回空字符串，避免了错误
        value=$(jq -r ".${json_key} // \"\"" "$CONFIG_FILE")
        if [[ -n "$value" ]]; then
            echo "$value"
            return
        fi
    fi

    # 3. 如果以上两者都无法获取到值，则使用默认值
    echo "$default_value"
}

#query json and env
# config
QQ_ACCOUNT=$(get_config "qq_account" "QQ_ACCOUNT" "")
SERVERCHAN_KEY=$(get_config "serverchan_key" "SERVERCHAN_KEY" "")
echo "QQ_ACCOUNT=$QQ_ACCOUNT"
export SERVERCHAN_KEY=$SERVERCHAN_KEY
#NAPCAT_TOKEN=$(get_config "napcat-token" "NAPCAT_TOKEN" "napcat")
#RENDER_MODE=$(get_config "render.mode" "RENDER_MODE" "puppeteer")
#RENDER_PUPPETEER_URL=$(get_config "render.puppeteerURL" "RENDER_PUPPETEER_URL" "")
#RENDER_CF_ACCOUNT_ID=$(get_config "render.cfAccountId" "RENDER_CF_ACCOUNT_ID" "")
#RENDER_CF_API_KEY=$(get_config "render.cfAPIKey" "RENDER_CF_API_KEY" "")
#DB_TYPE=$(get_config "storage.db.type" "DB_TYPE" "sqlite")
#DB_HOSTNAME=$(get_config "storage.db.host" "DB_HOSTNAME" "")
#DB_PORT=$(get_config "storage.db.port" "DB_PORT" "")
#DB_USERNAME=$(get_config "storage.db.username" "DB_USERNAME" "")
#DB_PASSWORD=$(get_config "storage.db.password" "DB_PASSWORD" "")
#DB_DATABASE_NAME=$(get_config "storage.db.database" "DB_DATABASE_NAME" "koishi")

# --- Destination paths ---
KOISHI_CONFIG_DEST="/app/koishi/koishi.yml"
NAPCAT_CONFIG_DEST="/app/napcat/config/napcat_${QQ_ACCOUNT}.json"
ONEBOT_CONFIG_DEST="/app/napcat/config/onebot11_${QQ_ACCOUNT}.json"
NAPCAT_WEBUI_CONFIG_DEST="/app/napcat/config/webui.json"

# --- Source/Template paths ---
KOISHI_CONFIG_TEMPLATE="/setup/config/template/koishi.yml.tmpl"
NAPCAT_CONFIG_SRC="/setup/config/template/napcat.json"
ONEBOT_CONFIG_SRC="/setup/config/template/onebot11.json"
NAPCAT_WEBUI_CONFIG_TEMPLATE="/setup/config/template/webui.json.tmpl"

KOISHI_CONFIG=$(cat $KOISHI_CONFIG_TEMPLATE | gomplate --missing-key=default -d config=file://$CONFIG_FILE)
echo "$KOISHI_CONFIG"
echo "$KOISHI_CONFIG" > $KOISHI_CONFIG_DEST


# 2. Handle napcat.json
if [ ! -f "${NAPCAT_CONFIG_DEST}" ]; then
    echo "Napcat config not found at ${NAPCAT_CONFIG_DEST}. Copying default config..."
    cp "${NAPCAT_CONFIG_SRC}" "${NAPCAT_CONFIG_DEST}"
    echo "napcat.json copied successfully."
else
    echo "Napcat config already exists at ${NAPCAT_CONFIG_DEST}. Skipping."
fi

# 3. Handle onebot11.json
if [ ! -f "${ONEBOT_CONFIG_DEST}" ]; then
    echo "OneBot config not found at ${ONEBOT_CONFIG_DEST}. Copying default config..."
    cp "${ONEBOT_CONFIG_SRC}" "${ONEBOT_CONFIG_DEST}"
    echo "onebot11.json copied successfully."
else
    echo "OneBot config already exists at ${ONEBOT_CONFIG_DEST}. Skipping."
fi

cat $NAPCAT_WEBUI_CONFIG_TEMPLATE | gomplate --missing-key=default -d config=file://$CONFIG_FILE > $NAPCAT_WEBUI_CONFIG_DEST

echo "Configuration setup complete."
