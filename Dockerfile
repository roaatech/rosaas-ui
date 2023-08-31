FROM nginxinc/nginx-unprivileged:alpine
WORKDIR /app
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY build/ /app