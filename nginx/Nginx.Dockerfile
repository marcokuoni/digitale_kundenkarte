FROM nginx:latest

COPY nginx.conf.template /nginx.conf.template
COPY example.localhost.crt /example.localhost.crt
COPY example.localhost.key /example.localhost.key
CMD ["/bin/sh" , "-c" , "envsubst < /nginx.conf.template > /etc/nginx/nginx.conf && exec nginx -g 'daemon off;'"]