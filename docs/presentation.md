# Karte

## Idee
Treuekarte.jpg

Treuekarte online umzusetzen mit konkretem Anwendungsfall von Crownbar in Rapperswil. Dabei liegt es in der Philosophie der Bar, dass man auf Internet für die Kunden im Lokal verzichtet. 

## Auftrag
### Must
 * Kunde kann selbständig seine Karte erstellen ohne zusätzliche Daten zu hinterlegen
 * Kunde kann per QR-Code scannen stempeln
 * Kunde kann QR-Code erstellen um Karte einzulösen
 * Mitarbeiter kann Karten einlösen. Sofern der Kunde volle noch nicht eingelöste Karten hat.
 * Mitarbeiter können QR-Code erstellen um Karte zu stempeln. Welche nicht mehrfach verwendet werden können.

### Should
 * Administrator kann Benutzergruppen verwalten
 * Benutzer können ihre Profile verwalten
 * Benutzer können ihre Verbindungen verwalten
 * Benutzer können validierte E-Mailadressen hinterlegen
 * Benutzer können ein Passwort hinterlegen
 * Benutzer können Passwort zurück setzen oder sich den Transfercode zusenden lassen
 * Kunde kann sich in der App über die Crownbar informieren
 * Kunde kann sich für Newsletter anmelden
 * Kunde kann stempeln ohne Internetverbindung.

### Could
 * IP-Blockierung bei zu vielen Fehlversuchen
 * Administrator kann geblockte IPs verwalten

## Analysierte Rollen und deren Funktionalitäten
### Kunde
* Konto erstellen (ohne jegliche Pflichtfelder)
* Anmelden mit Transfercode. Die Idee ist, dass man nach der Erstellung eine lange Session hat und immer angemeldet bleibt. Wenn man aber ein neues Gerät hat oder abgemeldet wird kann man mit einem individuell erstellten Transfercode sich wieder anmelden.
* Abmelden, Transfercode vergessen (sofern eine validierte Mailadresse hinterlegt)
* Marketing Infos (Website, Insta)
* Übersicht über die Stempelkarten 
    * Laufende Karte (Anzahl Stempel, wann letzter erstellt, wie viele ausstehend)
    * Komplete Karten (davon eingelöst)
    * Wenn uneingelöste Karten möglichkeit um QR-Code für das Einlösen zu generieren
* Profilbearbeiten (Transfercode, Name, E-Mail (wann validiert), E-Mailadresse, Newsletter erwünscht)
* Aktuell verbundene Geräte mit Möglichkeit diese Abzumelden

### Mitarbeiter
* Keine Möglichkeit auf die Karten zuzugreifen
* E-Mailadresse und Passwort sind Pflichtfelder. E-Mailadresse muss validiert werden
* zusätzlich die Möglichkeit auf Passwort vergessen. Passwort auch im Profil ersichtlich inklusive Änderungsdatum
* Karten einlösen (mit Transfercode, auch direkt über QR-Code vom Kunden)
* QR-Code erstellen mit ablaufdatum und Blockierzeitraum (wie lange nicht mehr gestempelt werden kann). Normalerweise kurze Lebensdauer und automatische Erneuerung.
    
### Administrator
Hat alle Funktionalitäten vom Mitarbeiter und zusätzlich:
* Übersicht und manipulation der blockierten IPs
* Benutzergruppen verwalten nur von Konten mit Passwort möglich.
* Direktlinks um Benuzer mit Passwort zu erstellen

## System
Beruhend auf Docker-Composer wurde folgendes System umgesetzt. Wobei dieses per Scale skaliert werden kann: `docker compose up --scale server=1 --scale client=1 --build -d`

Komponenten:
* Reverse Proxy (traefik:latest, startet nach Frontend, API)
    * Port 80 und 443 (TCP/UDP), http3 - karte.locahost Applikation Entrypoint
    * Port 8080 (TCP), http - traefik Dashboard
    * Port 5001 (TCP/UDP), http3 - API Entrypoint
* Frontend (node:latest, startet nach API)
    * Port 3001 (TCP), https, Loadbalancing (Healthcheck auf Startseite) - Svelte Applikation
* API (node:latest, startet nach Datenbank)
    * Port 3003 (TCP), https, Loadbalancing (Healthcheck auf GraphQL Server Answer) - Express Applikation
* Datenbank (mongo:latest)
    * Port 27017 (TCP), mongodb - MongoDB Datenbank

## Stacks
### Frontend
`npm install` -> added 757 packages, and audited 758 packages in 9s
`npm audit` -> found 0 vulnerabilities

Komponenten:
* Abhängingkeiten
    * "@apollo/client": "^3.7.10", API Connector Client
    * "graphql": "^16.6.0", API Definitionen
    * "workbox-window": "^6.5.4", Workbox von Google, Service Worker Bibliothek für Offline Funktionalität
    * "apollo3-cache-persist": "^0.14.1", Cache Persist für offline Funktionalität
    * "jwt-decode": "^3.1.2", JWT Token Decoder um signierte Token zu lesen
    * "svelte": "^3.55.0", Frontend Framework
    * "svelte-routing": "^1.6.0", Frontend Routing Framework (leider noch nicht ganz ausgereift aber leicht [Parameter, 404, forbidden]. Wechsel zu svelte-router-spa gäb mehr Funktionalität aber auch mehr Code und geringere Verbreitung)
    --> Abklären ob noch notwending
    * "svelte-icons-pack": "^2.1.0",
    * "svelte-loading-spinners": "^0.3.4"
* Abhängigkeiten zur Entwicklung
    * GraphQL Codegen, erzeugt aus Schnittstellendefintion auf der API und dem Frontend automatisch Typisierung und Requests
    * Rollup und Plugins: Typescript, CommonJs, Node Resolve, Terser, Svelte, Replace (ENV Variablen), CSS, Livereload, Workbox, Serve
    * ESLint
    * Svelte Helpers: Check, Preprocess
    * Typendefinitionen: Workbox window

### API
`npm install` -> added 392 packages, and audited 393 packages in 3s
`npm audit` -> found 0 vulnerabilities

Komponenten:
* Abhängingkeiten
    * "@apollo/server": "^4.4.1", API Connector Server
    * "@graphql-tools/graphql-file-loader": "^7.5.16", API Definitionen
    * "@graphql-tools/load": "^7.8.13", API Definitionen
    * "graphql": "^16.6.0", API Definitionen
    * "bcrypt": "^5.1.0", Passwort hashing
    * "cookie-parser": "^1.4.6", Express Middleware für Cookies
    * "cors": "^2.8.5", Express Middleware für CORS
    * "crypto": "^1.0.1", Crypto libary zur Erzeugung zufälliger Zeichenketten
    * "express": "^4.18.2", Web Applikation Framework für NodeJs
    * "jsonwebtoken": "^9.0.0", JSON Web Token für signierte Tokens
    * "mongoose": "^5.4.10", MongoDB Connector
    * "nodemailer": "^6.9.2", E-Mail Connector
* Abhängigkeiten zur Entwicklung
    * GraphQL Codegen, erzeugt aus Schnittstellendefintion auf der API und dem Frontend automatisch Typisierung und Requests
    * Rollup und Plugins: Typescript, CommonJs, Node Resolve, Terser, Svelte, Replace (ENV Variablen), CSS, Livereload, Workbox, Serve
    * ESLint
    * Svelte Helpers: Check, Preprocess
    * Typendefinitionen: Workbox window





