#!/bin/bash
set -e

echo "🔄 Creating database..."
bundle exec rails db:create

echo "📦 Running migrations..."
bundle exec rails db:migrate

bundle exec rails s -b 0.0.0.0 -p 8000
