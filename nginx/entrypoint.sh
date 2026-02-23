#!/bin/sh
set -eu

PROFILE="${NGINX_PROFILE:-}"

if [ -z "$PROFILE" ]; then
  if [ -n "${ECS_CONTAINER_METADATA_URI_V4:-}" ] || [ -n "${ECS_CONTAINER_METADATA_URI:-}" ]; then
    PROFILE='ecs'
  else
    PROFILE='local'
  fi
fi

case "$PROFILE" in
  ecs)   cp /etc/nginx/ecs.conf   /etc/nginx/nginx.conf ;;
  local) cp /etc/nginx/local.conf /etc/nginx/nginx.conf ;;
  *) echo "Invalid NGINX_PROFILE=$PROFILE" >&2; exit 1 ;;
esac

exec nginx -g 'daemon off;'