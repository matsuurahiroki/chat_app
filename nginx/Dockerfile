FROM nginx:1.26.1-alpine

# カスタムecs.confをコピー
COPY nginx/ecs.conf /etc/nginx/nginx.conf
COPY nginx/local.conf /etc/nginx/local.conf
COPY nginx/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh


ENTRYPOINT ["/entrypoint.sh"]