#!/bin/zsh
cd "$(dirname "$0")" || exit 1

PORT=8787
URL="http://127.0.0.1:${PORT}"

python3 -m http.server "$PORT" &
SERVER_PID=$!

sleep 1
open "$URL"

wait "$SERVER_PID"
