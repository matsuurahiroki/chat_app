#!/usr/bin/env bash
set -e  # 途中で失敗したら終了
set -a  # .envファイル内の変数を自動でexport
. /app/.env.production
set +a

# マイグレーション
echo "🔄 Running migrations..."
bundle exec rails db:migrate

# Rails（Puma）起動
echo "Starting Rails server..."
exec bundle exec rails server -b 0.0.0.0 -p 8000
