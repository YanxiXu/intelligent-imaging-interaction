#!/bin/zsh
cd "$(dirname "$0")" || exit 1

PORT=8787
URL="http://127.0.0.1:${PORT}"

if [ ! -d "node_modules" ]; then
  npm install || exit 1
fi

npm run dev -- --host 127.0.0.1 --port "$PORT" &
SERVER_PID=$!

sleep 1
open "$URL"

wait "$SERVER_PID"
