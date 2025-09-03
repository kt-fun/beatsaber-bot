#!/bin/bash

# State files directory
STATE_DIR="/app/status"
# File to store the timestamp of when the bot first went offline
OFFLINE_SINCE_FILE="$STATE_DIR/offline_since"
# File to store the timestamp of the last notification
LAST_NOTIFICATION_FILE="$STATE_DIR/last_notification"
# File to store the count of notifications sent
NOTIFICATION_COUNT_FILE="$STATE_DIR/notification_count"

# Notification settings
MAX_NOTIFICATIONS=3
# 3 hours in seconds (3 * 60 * 60)
NOTIFICATION_INTERVAL_SECONDS=10800

# Ensure the state directory exists
mkdir -p "$STATE_DIR"

# --- Functions ---

# Function to get the bot's online status
get_bot_status() {
  # Returns "true" or "false"
  curl -s 'http://localhost:3000/get_status' -H 'Content-Type: application/json' --data-raw '{}' | jq '.data.online'
}

# Function to send a notification via ServerChan
# SERVERCHAN_KEY must be set as an environment variable for this to work.
notify_serverchan() {
  if [ -z "$SERVERCHAN_KEY" ]; then
    echo "[notify $(date +'%Y-%m-%d %H:%M:%S')] SERVERCHAN_KEY not set. Skipping notification."
    return
  fi

  OFFLINE_SINCE_TIME=$(cat "$OFFLINE_SINCE_FILE")
  TITLE="服务离线警告"
  CONTENT="检测到 bsbot 服务的QQ账号已于 ${OFFLINE_SINCE_TIME} 离线。"

  # URL encode title and content
  ENCODED_TITLE=$(echo -n "$TITLE" | jq -sRr @uri)
  ENCODED_CONTENT=$(echo -n "$CONTENT" | jq -sRr @uri)

  # Send notification
  curl -s "https://sctapi.ftqq.com/${SERVERCHAN_KEY}.send?title=${ENCODED_TITLE}&desp=${ENCODED_CONTENT}" > /dev/null
  echo "[notify $(date +'%Y-%m-%d %H:%M:%S')] Notification sent."
}

# Function to reset the state when the bot comes back online
reset_state() {
  rm -f "$OFFLINE_SINCE_FILE" "$LAST_NOTIFICATION_FILE" "$NOTIFICATION_COUNT_FILE"
  echo "[alive $(date +'%Y-%m-%d %H:%M:%S')] Bot is back online. Resetting state."
}

# --- Main Logic ---

BOT_ONLINE=$(get_bot_status)

# Check if the bot is online
if [ "$BOT_ONLINE" == "true" ]; then
  # If the offline marker file exists, it means the bot was offline and just came back online
  if [ -f "$OFFLINE_SINCE_FILE" ]; then
    reset_state
  else
    # Bot is online and was online before, normal operation
    echo "[alive $(date +'%Y-%m-%d %H:%M:%S')] bot still alive"
  fi
  exit 0
fi

# --- Bot is Offline ---

echo "[alive $(date +'%Y-%m-%d %H:%M:%S')] bot is offline"

# If the offline marker file does not exist, this is the first time we've detected the bot is offline
if [ ! -f "$OFFLINE_SINCE_FILE" ]; then
  echo "[alive $(date +'%Y-%m-%d %H:%M:%S')] First offline detection. Re-checking in 10 seconds..."
  sleep 10
  BOT_ONLINE=$(get_bot_status)

  # Check again after 10 seconds
  if [ "$BOT_ONLINE" == "true" ]; then
    echo "[alive $(date +'%Y-%m-%d %H:%M:%S')] Bot came back online after 10s. It was a temporary glitch."
    exit 0
  fi

  # If still offline, confirm the offline state and record the time
  echo "[alive $(date +'%Y-%m-%d %H:%M:%S')] Still offline after 10s. Confirming offline state."
  date +'%Y-%m-%d %H:%M:%S' > "$OFFLINE_SINCE_FILE"
  echo "0" > "$NOTIFICATION_COUNT_FILE"
fi

# --- Notification Logic ---

NOTIFICATION_COUNT=$(cat "$NOTIFICATION_COUNT_FILE" 2>/dev/null || echo 0)

# Check if the maximum number of notifications has been reached
if [ "$NOTIFICATION_COUNT" -ge "$MAX_NOTIFICATIONS" ]; then
  echo "[notify $(date +'%Y-%m-%d %H:%M:%S')] Max notifications reached. Suppressing further notifications for this offline period."
  exit 0
fi

NOW_TS=$(date +%s)
LAST_NOTIFICATION_TS=0
if [ -f "$LAST_NOTIFICATION_FILE" ]; then
  LAST_NOTIFICATION_TS=$(cat "$LAST_NOTIFICATION_FILE")
fi

TIME_SINCE_LAST_NOTIFICATION=$((NOW_TS - LAST_NOTIFICATION_TS))

# Send a notification if it's the first one, or if the 3-hour interval has passed
if [ "$LAST_NOTIFICATION_TS" -eq 0 ] || [ "$TIME_SINCE_LAST_NOTIFICATION" -gt "$NOTIFICATION_INTERVAL_SECONDS" ]; then
  notify_serverchan
  # Record the time of this notification
  date +%s > "$LAST_NOTIFICATION_FILE"
  # Increment and record the notification count
  NOTIFICATION_COUNT=$((NOTIFICATION_COUNT + 1))
  echo "$NOTIFICATION_COUNT" > "$NOTIFICATION_COUNT_FILE"
else
  echo "[notify $(date +'%Y-%m-%d %H:%M:%S')] Still offline, but within the 3-hour notification cooldown period."
fi
