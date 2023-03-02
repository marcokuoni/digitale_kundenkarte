# Digitale Kundenkarte

Let's go

## Running
mit drei Servern
`docker compose up --scale api=3 -d`
`docker compose up --scale api=3 --build`

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