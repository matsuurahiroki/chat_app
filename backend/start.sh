#!/usr/bin/env bash
# 環境変数を読み込む（コメント行と空行を無視して読み込み）
export $(grep -v '^#' /app/.env.production | xargs)

# uWSGI 起動
exec /venv/bin/uwsgi \
    --chdir /app \
    --http :8000 \
    --module config.wsgi:application \
    --env DJANGO_SETTINGS_MODULE=config.settings \
    --master \
    --processes 4 \
    --threads 2 \
    --static-map /static=/app/static \
    --static-map /media=/app/media \
    --uid 1010 \
    --gid 1010
