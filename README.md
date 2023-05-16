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

Userfriendlier is docker desktop: https://docs.docker.com/desktop/install/ubuntu/

## Testing
30 Seconds with 200 virtual Users
`k6 run -u 400 -d 30s --summary-export=export.json --out json=my_test_result.json script.js`

## Mongo DB structure
Connection String for Compass App: mongodb://digKuUsr:123456@localhost:27017/digKu?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false

## GraphQL
Sandbox für Apollo Server kann mit Link auf https://karte.localhost:5001/ gestartet werden

## Certificates
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




# TODO
* 404 page, forbidden page (i think not possible with the current router)
* couldnt find a way to stop executing default redirections on fetch and just do the custom one.


## Notes
WICHTIG: Letzter Stempfel muss transferiert sein, damit Karte eingelöst werden kann. Das heisst erst beim 9ten Besuch im Lokal. Mitarbeiter Konto muss Internet haben, um QR zu erzeugen, was er auch vorgängig machen könnte. Aber vor allem um Karten einzulösen. die Überprüfung, ob noch Karte offen sind muss auf dem Server passieren.

## Dependencies
Dependency on client:
* rollup-plugin-workbox version 7 has still unsolved bugs: expl https://github.com/modernweb-dev/web/issues/2261