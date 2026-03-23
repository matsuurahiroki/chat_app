FROM nginx:latest

COPY nginx/ecs.conf /etc/nginx/ecs.conf
COPY nginx/local.conf /etc/nginx/local.conf
COPY nginx/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]