# Digitale Kundenkarte

Let's go

## Prepare
do the hosts entry `sudo vi /etc/hosts`

```
127.0.0.1 client.localhost
127.0.0.1 server.localhost
```

## Running
mit drei Servern
`docker compose up --scale server=1 --scale client=1 --build -d`
`docker compose up --scale server=2 --scale client=2 -d`
`docker compose up --scale server=2 --scale client=2 --build`

Docker state
`docker compose ps`

Docker log
`docker compose logs`

Docker rebuild
`docker compose build`
`docker compose up --build`

Docker goodbye
`docker compose down`

## Testing
30 Sekunden mit 200 virtuellen Benutzer
`k6 run -u 200 -d 30s --summary-export=export.json --out json=my_test_result.json script.js`

## Learnings
Falls mongodb lokal installiert
`sudo systemctl stop mongod`

Benutzerfreundlicher gehts so: https://docs.docker.com/desktop/install/ubuntu/
Proxy API: http://localhost:5101



## Nice links
Folgende Infos wurden passend zum Stack gefunden

### Load Balancer
https://levelup.gitconnected.com/nginx-load-balancing-and-using-with-docker-7e16c49f5d9
https://docs.nginx.com/nginx/admin-guide/load-balancer/http-health-check/

### Client
https://github.com/ticruz38/graphql-codegen-svelte-apollo
https://blog.logrocket.com/building-a-pwa-with-svelte/
https://rubygarage.org/blog/pwa-with-react-apollo

### API
https://blog.richardev.com/custom-api-server-with-basic-crud-js-apollo-graphql-mongodb
https://www.apollographql.com/docs/apollo-server/monitoring/health-checks/


# TLS
`cd traefik`


# Generate an example Root CA:
`openssl genrsa -aes256 -out ca.key 2048`
`openssl req -new -x509 -days 7 -key ca.key -sha256 -extensions v3_ca -out ca.crt`
Common Name (e.g. server FQDN or YOUR name) []:RootCA

# Generate the domain key:
`openssl genrsa -out example.localhost.key 2048`

# Generate the certificate signing request
`openssl req -sha256 -new -key example.localhost.key -out example.localhost.csr`
Common Name (e.g. server FQDN or YOUR name) []:example.localhost

# Sign the request and generate a certificate
`openssl x509 -sha256 -req -in example.localhost.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out example.localhost.crt -days 7`

# Verify the certificate
`openssl verify -CAfile ca.crt example.localhost.crt`
example.localhost.crt: OK


`docker run --net=host --rm ymuski/curl-http3 curl https://example.localhost:600 --http3`
`docker run --net=host --rm ymuski/curl-http3 curl -IL https://example.localhost:600 --http3`

https://github.com/nodejs/node/issues/38478 no http3 on nodejs?
https://github.com/macbre/docker-nginx-http3 nginx mit http3
nwtgck/nginx-http3 docker image



* autoreload läuft nicht
* graphql api browser kommt nicht

### Mongo DB structure
Connection String for Compass App: mongodb://digKuUsr:123456@localhost:27017/digKu?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false

user
- id: number
- creationDate: Date
- name: string?
- email: string?
- newsletter: boolean
- card: Card
  - cardCreationDate: Date
  - stamps: [Date?]


Sandbox für Apollo Server kann mit Link auf https://karte.localhost:5001/ gestartet werden

/usr/bin/google-chrome --allow-insecure-localhost

/usr/bin/google-chrome --user-data-dir=/tmp/foo --unsafely-treat-insecure-origin-as-secure=https://karte.localhost

trusted localhost certificates
https://github.com/FiloSottile/mkcert

1. Install 
`sudo yum install nss-tools`
```
curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64"
chmod +x mkcert-v*-linux-amd64
sudo cp mkcert-v*-linux-amd64 /usr/local/bin/mkcert
```
2. register CA in the system
`mkcert -install`
3. create certificate
`mkcert karte.localhost localhost 127.0.0.1 ::1`