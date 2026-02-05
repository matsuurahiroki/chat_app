#!/bin/bash
set -euo pipefail

rm -f tmp/pids/server.pid

# 必要なときだけマイグレーション（ローカルはtrue、本番はfalseが基本）
if [ "${RUN_DB_MIGRATE:-false}" = 'true' ]; then
  bundle exec rails db:migrate
fi

exec bundle exec rails s -b 0.0.0.0 -p "${PORT:-8000}" -e "${RAILS_ENV:-production}"