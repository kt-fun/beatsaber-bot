#!/usr/bin/env bash
set -eu

echo "Loading configuration from environment variables..."

# --- Destination paths ---
KOISHI_CONFIG_DEST="/koishi/koishi.yml"
NAPCAT_CONFIG_DEST="/app/napcat/config/napcat_${QQ_ACCOUNT}.json"
ONEBOT_CONFIG_DEST="/app/napcat/config/onebot11_${QQ_ACCOUNT}.json"
NAPCAT_WEBUI_CONFIG_DEST="/app/napcat/config/webui.json"

# --- Source/Template paths ---
KOISHI_CONFIG_TEMPLATE="/setup/config/template/koishi.yml"
NAPCAT_CONFIG_SRC="/setup/config/template/napcat.json"
ONEBOT_CONFIG_SRC="/setup/config/template/onebot11.json"
NAPCAT_WEBUI_CONFIG_TEMPLATE="/setup/config/template/webui.json"

# 1. Handle koishi.yml
if [ ! -f "${KOISHI_CONFIG_DEST}" ]; then
    echo "Koishi config not found at ${KOISHI_CONFIG_DEST}. Creating from template..."
    # Check for mandatory environment variables for Koishi
    if [ -z "${QQ_ACCOUNT}" ]; then
        echo "Error: QQ_ACCOUNT environment variable is not set. Cannot create koishi.yml."
        exit 1
    fi

    # Copy template to destination
    cp "${KOISHI_CONFIG_TEMPLATE}" "${KOISHI_CONFIG_DEST}"

    # Use sed to replace placeholders. The | separator is used to avoid conflicts with slashes in values.
    sed -i "s|{{QQ_ACCOUNT}}|${QQ_ACCOUNT}|g" "${KOISHI_CONFIG_DEST}"
    sed -i "s|{{RENDER_MODE}}|${RENDER_MODE:-puppeteer}|g" "${KOISHI_CONFIG_DEST}" # Defaults to 'local' if not set
    sed -i "s|{{CF_ACCOUNT_ID}}|${CF_ACCOUNT_ID:-}|g" "${KOISHI_CONFIG_DEST}"
    sed -i "s|{{CF_API_KEY}}|${CF_API_KEY:-}|g" "${KOISHI_CONFIG_DEST}"

    echo "koishi.yml created and configured successfully."
#    echo "Current koishi.yml content:"
#    cat "${KOISHI_CONFIG_DEST}"
else
    echo "Koishi config already exists at ${KOISHI_CONFIG_DEST}. Skipping creation."
fi

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

# 2. Handle webui.json
if [ ! -f "${NAPCAT_WEBUI_CONFIG_DEST}" ]; then
    echo "napcat webui config not found at ${NAPCAT_WEBUI_CONFIG_DEST}. Creating from template..."
    # Check for mandatory environment variables for Koishi
    if [ -z "${QQ_ACCOUNT}" ]; then
        echo "Error: QQ_ACCOUNT environment variable is not set. Cannot create webui.json."
        exit 1
    fi
    if [ -z "${NAPCAT_TOKEN}" ]; then
        echo "Error: NAPCAT_TOKEN environment variable is not set. Cannot create webui.json."
        exit 1
    fi
    # Copy template to destination
    cp "${NAPCAT_WEBUI_CONFIG_TEMPLATE}" "${NAPCAT_WEBUI_CONFIG_DEST}"

    # Use sed to replace placeholders. The | separator is used to avoid conflicts with slashes in values.
    sed -i "s|{{QQ_ACCOUNT}}|${QQ_ACCOUNT}|g" "${NAPCAT_WEBUI_CONFIG_DEST}"
    sed -i "s|{{NAPCAT_TOKEN}}|${NAPCAT_TOKEN:-napcat}|g" "${NAPCAT_WEBUI_CONFIG_DEST}" # Defaults to 'local' if not set

    echo "webui.json created and configured successfully."

else
    echo "napcat webui.json already exists at ${NAPCAT_WEBUI_CONFIG_DEST}. Skipping creation."
fi

echo "Configuration setup complete."
