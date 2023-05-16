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
`npm install` -> added 756 packages, and audited 757 packages in 8s
From 3rd Parties:
* npm WARN deprecated rollup-plugin-terser@7.0.2: This package has been deprecated and is no longer maintained. Please use @rollup/plugin-terser
* npm WARN deprecated rollup-plugin-terser@7.0.2: This package has been deprecated and is no longer maintained. Please use @rollup/plugin-terser
* npm WARN deprecated sourcemap-codec@1.4.8: Please use @jridgewell/sourcemap-codec instead
`npm audit` -> found 0 vulnerabilities
`npm outdated` -> 
| Package               | Current | Wanted | Latest | Location                           | Depended by |
| --------------------- | --------| ------ | ------ | ---------------------------------- | ----------- |
| rollup-plugin-workbox | 6.2.2   | 6.2.2  | 7.0.1  | node_modules/rollup-plugin-workbox | client      |
* rollup-plugin-workbox version 7 has still unsolved bugs: expl https://github.com/modernweb-dev/web/issues/2261

Komponenten:
* Abhängingkeiten
    * @apollo/client, API Connector Client
    * graphql, API Definitionen
    * workbox-window, Workbox von Google, Service Worker Bibliothek für Offline Funktionalität
    * apollo3-cache-persist, Cache Persist für offline Funktionalität
    * jwt-decode, JWT Token Decoder um signierte Token zu lesen
    * svelte, Frontend Framework
    * svelte-routing, Frontend Routing Framework (leider noch nicht ganz ausgereift aber leicht [Parameter, 404, forbidden]. Wechsel zu svelte-router-spa gäb mehr Funktionalität aber auch mehr Code und geringere Verbreitung)
    --> Abklären ob noch notwending
    * svelte-icons-pack
    * svelte-loading-spinners
* Abhängigkeiten zur Entwicklung
    * GraphQL Codegen, erzeugt aus Schnittstellendefintion auf der API und dem Frontend automatisch Typisierung und Requests
    * Rollup und Plugins: Typescript, CommonJs, Node Resolve, Terser, Svelte, Replace (ENV Variablen), CSS, Livereload, Workbox, Serve
    * ESLint
    * Svelte Helpers: Check, Preprocess
    * Typendefinitionen: Workbox window

### API
`npm install` -> added 381 packages, and audited 382 packages in 3s
`npm audit` -> found 0 vulnerabilities
`npm outdated` -> no response

Komponenten:
* Abhängingkeiten
    * @apollo/server, API Connector Server
    * @graphql-tools/graphql-file-loader, API Definitionen
    * @graphql-tools/load, API Definitionen
    * graphql, API Definitionen
    * bcrypt, Passwort hashing
    * cookie-parser, Express Middleware für Cookies
    * cors, Express Middleware für CORS
    * express, Web Applikation Framework für NodeJs
    * jsonwebtoken, JSON Web Token für signierte Tokens
    * mongoose, MongoDB Connector
    * nodemailer, E-Mail Connector
* Abhängigkeiten zur Entwicklung
    * GraphQL Codegen, erzeugt aus Schnittstellendefintion auf der API und dem Frontend automatisch Typisierung und Requests
    * Rollup und Plugins: Typescript, CommonJs, Node Resolve, Terser, Svelte, Replace (ENV Variablen), CSS, Livereload, Workbox, Serve
    * ESLint
    * Svelte Helpers: Check, Preprocess
    * Typendefinitionen: Workbox window





