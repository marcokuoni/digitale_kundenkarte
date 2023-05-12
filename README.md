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


https://medium.com/@jono/cache-graphql-post-requests-with-service-worker-100a822a388a


TODO: https://jasonwatmore.com/post/2020/06/17/nodejs-mongodb-api-jwt-authentication-with-refresh-tokens <---- refresh token
TODO: use token for normal token payload
TODO: check issuer and add it
https://www.sohamkamani.com/nodejs/jwt-authentication/

https://www.bezkoder.com/jwt-refresh-token-node-js/

/***
----> kann man ignorieren, jwt ist nicht session based und sollte auch nicht dazu verwendet werden.
Irgendwo habe ich einmal gelesen, dass ein fingerprint (nicht ip) für die Benutzer-Session besser ist. Aber ich habe es nicht gefunden. Ich habe es auch nicht selbst ausprobiert, aber ich denke, es ist eine gute Idee, da die IP-Adresse des Benutzers sich ändern kann, wenn er sich an einem anderen Ort anmeldet. Aber der Fingerabdruck des Benutzers bleibt gleich.
https://stackoverflow.com/questions/51492752/how-to-keep-the-user-logged-in-even-after-closing-the-browser-or-reloading-the-pag

https://www.bezkoder.com/jwt-refresh-token-node-js/

=======

Irgendwo habe ich einmal gelesen, dass ein fingerprint (nicht ip) besser ist, um eine session zu tracken. Sicher ist sicher.

https://www.npmjs.com/package/express-session

=======
https://www.npmjs.com/package/fingerprintjs2
https://stackoverflow.com/questions/6470378/hashing-a-session-fingerprint-really-necessary

***/



    A typical JWT contains the following information:
        iss (issuer): site name (20 bytes is a good upper limit)
        sub (subject): 36 bytes UUID
        aud (audience): site name (20 bytes is a good upper limit)
        exp (expiry): timestamp: 13 bytes
        nbf (not before time): timestamp: 13 bytes
        iat (issued at time): timestamp: 13 bytes
        custom roles and information: 200 bytes more

    This is a total of 315 bytes. The JWT header is normally between 36 and 50 bytes and finally the signature is between 43 and 64 bytes. So this gives us a maximum of 429 bytes which would take about 10% of cookie space. ^


# TODO
* E-Mailadresse verlangen wenn passwort gesetzt wird. Beim Erstellen und Updaten
* Passwort vergessen
* Add Stamp token valid until durch expired at ersetzen
* Hinweis per Mails über eventuelle falsche Refresh Tokens (doppelt (schon revoked), Neuer Standort, mehr als 3 [Mail und ältester revoken])
* Fehlermeldung bei falschem Passwort/Transfercode
* Redirect to login when loggedout and delete all client datas
* Fehlermeldung wenn IP geblockt ist
* Zeige alle Karten inklusive ob eingelöst oder nicht
* 404 page, forbidden page (i think not possible with the current router)

https://svelte.dev/tutorial/derived-stores

//PRoblem ist, brauchen einen reload und nicht im background
https://github.com/aerogear/offix/tree/14a83414b4fcaa3e8f0facad3a15455fa18c6050
https://codeburst.io/highly-functional-offline-applications-using-apollo-client-12885bd5f335





WICHTIG: Letzter Stempfel muss transferiert sein, damit Karte eingelöst werden kann. Das heisst erst beim 9ten Besuch im Lokal. Mitarbeiter Konto muss Internet haben, um QR zu erzeugen, was er auch vorgängig machen könnte. Aber vor allem um Karten einzulösen. die Überprüfung, ob noch Karte offen sind muss auf dem Server passieren.