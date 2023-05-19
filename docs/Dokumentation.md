# Karte

## Idee

Treuekarte.jpg

Treuekarte online umzusetzen mit konkretem Anwendungsfall von Crownbar in Rapperswil. Dabei liegt es in der Philosophie der Bar, dass man auf Internet für die Kunden im Lokal verzichtet.

## Auftrag

### Must

- Kunde kann selbständig seine Karte erstellen ohne zusätzliche Daten zu hinterlegen
- Kunde kann per QR-Code scannen stempeln
- Kunde kann QR-Code erstellen um Karte einzulösen
- Mitarbeiter kann Karten einlösen. Sofern der Kunde volle noch nicht eingelöste Karten hat.
- Mitarbeiter können QR-Code erstellen um Karte zu stempeln. Welche nicht mehrfach verwendet werden können.

### Should

- Administrator kann Benutzergruppen verwalten
- Benutzer können ihre Profile verwalten
- Benutzer können ihre Verbindungen verwalten
- Benutzer können validierte E-Mailadressen hinterlegen
- Benutzer können ein Passwort hinterlegen
- Benutzer können Passwort zurück setzen oder sich den Transfercode zusenden lassen
- Kunde kann sich in der App über die Crownbar informieren
- Kunde kann sich für Newsletter anmelden
- Kunde kann stempeln ohne Internetverbindung.

### Could

- IP-Blockierung bei zu vielen Fehlversuchen
- Administrator kann geblockte IPs verwalten

## Analysierte Rollen und deren Funktionalitäten

### Kunde

- Konto erstellen (ohne jegliche Pflichtfelder)
- Anmelden mit Transfercode. Die Idee ist, dass man nach der Erstellung eine lange Session hat und immer angemeldet bleibt. Wenn man aber ein neues Gerät hat oder abgemeldet wird kann man mit einem individuell erstellten Transfercode sich wieder anmelden.
- Abmelden, Transfercode vergessen (sofern eine validierte Mailadresse hinterlegt)
- Marketing Infos (Website, Insta)
- Übersicht über die Stempelkarten
  - Laufende Karte (Anzahl Stempel, wann letzter erstellt, wie viele ausstehend)
  - Komplete Karten (davon eingelöst)
  - Wenn uneingelöste Karten möglichkeit um QR-Code für das Einlösen zu generieren
- Profilbearbeiten (Transfercode, Name, E-Mail (wann validiert), E-Mailadresse, Newsletter erwünscht)
- Aktuell verbundene Geräte mit Möglichkeit diese Abzumelden

### Mitarbeiter

- Keine Möglichkeit auf die Karten zuzugreifen
- E-Mailadresse und Passwort sind Pflichtfelder. E-Mailadresse muss validiert werden
- zusätzlich die Möglichkeit auf Passwort vergessen. Passwort auch im Profil ersichtlich inklusive Änderungsdatum
- Karten einlösen (mit Transfercode, auch direkt über QR-Code vom Kunden)
- QR-Code erstellen mit ablaufdatum und Blockierzeitraum (wie lange nicht mehr gestempelt werden kann). Normalerweise kurze Lebensdauer und automatische Erneuerung.

### Administrator

Hat alle Funktionalitäten vom Mitarbeiter und zusätzlich:

- Übersicht und manipulation der blockierten IPs
- Benutzergruppen verwalten nur von Konten mit Passwort möglich.
- Direktlinks um Benuzer mit Passwort zu erstellen

## System

Beruhend auf Docker-Composer wurde folgendes System umgesetzt. Wobei dieses per Scale skaliert werden kann: `docker compose up --scale server=1 --scale client=1 --build -d`

Komponenten:

- Reverse Proxy (traefik:latest, startet nach Frontend, API)
  - Port 80 und 443 (TCP/UDP), http3 - karte.locahost Applikation Entrypoint
  - Port 8080 (TCP), http - traefik Dashboard
  - Port 5001 (TCP/UDP), http3 - API Entrypoint
- Frontend (node:latest, startet nach API)
  - Port 3001 (TCP), https, Loadbalancing (Healthcheck auf Startseite) - Svelte Applikation
- API (node:latest, startet nach Datenbank)
  - Port 3003 (TCP), https, Loadbalancing (Healthcheck auf GraphQL Server Answer) - Express Applikation
- Datenbank (mongo:latest)
  - Port 27017 (TCP), mongodb - MongoDB Datenbank

## Stacks

### Frontend

`npm install` -> added 754 packages, and audited 755 packages in 8s
From 3rd Parties:

- npm WARN deprecated rollup-plugin-terser@7.0.2: This package has been deprecated and is no longer maintained. Please use @rollup/plugin-terser
- npm WARN deprecated rollup-plugin-terser@7.0.2: This package has been deprecated and is no longer maintained. Please use @rollup/plugin-terser
- npm WARN deprecated sourcemap-codec@1.4.8: Please use @jridgewell/sourcemap-codec instead
  `npm audit` -> found 0 vulnerabilities
  `npm outdated` ->
  | Package | Current | Wanted | Latest | Location | Depended by |
  | --------------------- | --------| ------ | ------ | ---------------------------------- | ----------- |
  | rollup-plugin-workbox | 6.2.2 | 6.2.2 | 7.0.1 | node_modules/rollup-plugin-workbox | client |
- rollup-plugin-workbox version 7 has still unsolved bugs: expl https://github.com/modernweb-dev/web/issues/2261

Komponenten:

- Abhängingkeiten
  - @apollo/client, API Connector Client
  - graphql, API Definitionen
  - workbox-window, Workbox von Google, Service Worker Bibliothek für Offline Funktionalität
  - apollo3-cache-persist, Cache Persist für offline Funktionalität
  - jwt-decode, JWT Token Decoder um signierte Token zu lesen
  - svelte, Frontend Framework
  - svelte-routing, Frontend Routing Framework (leider noch nicht ganz ausgereift aber leicht [Parameter, 404, forbidden]. Wechsel zu svelte-router-spa gäb mehr Funktionalität aber auch mehr Code und geringere Verbreitung)
- Abhängigkeiten zur Entwicklung
  - GraphQL Codegen, erzeugt aus Schnittstellendefintion auf der API und dem Frontend automatisch Typisierung und Requests
  - Rollup und Plugins: Typescript, CommonJs, Node Resolve, Terser, Svelte, Replace (ENV Variablen), CSS, Livereload, Workbox, Serve
  - ESLint
  - Svelte Helpers: Check, Preprocess
  - Typendefinitionen: Workbox window

### API

`npm install` -> added 385 packages, and audited 386 packages in 4s
`npm audit` -> found 0 vulnerabilities
`npm outdated` -> no response

Komponenten:

- Abhängingkeiten
  - @apollo/server, API Connector Server
  - @graphql-tools/graphql-file-loader, API Definitionen
  - @graphql-tools/load, API Definitionen
  - graphql, API Definitionen
  - bcrypt, Passwort hashing
  - cookie-parser, Express Middleware für Cookies
  - cors, Express Middleware für CORS
  - express, Web Applikation Framework für NodeJs
  - jsonwebtoken, JSON Web Token für signierte Tokens
  - mongoose, MongoDB Connector
  - nodemailer, E-Mail Connector
- Abhängigkeiten zur Entwicklung
  - GraphQL Codegen, erzeugt aus Schnittstellendefintion auf der API und dem Frontend automatisch Typisierung und Requests
  - Rollup und Plugins: Typescript, CommonJs, Node Resolve, Terser, Svelte, Replace (ENV Variablen), CSS, Livereload, Workbox, Serve
  - ESLint
  - Svelte Helpers: Check, Preprocess
  - Typendefinitionen: Workbox window

## Demo

1. Karte erstellen als Kunde
2. Konto erstellen als Mitarbeiter
3. Admin Benutzergruppe setzen
4. Mitarbeiter QR Code generieren
5. Kunde Stempeln online / offline -> back online
6. Kunde Karte einlösen
7. Vebundene Geräte (Shorttime Token and refresh Token)

## Herausforderungen

- Cookie Handlings (Serversite)
- 302 Redirect after Login
- Offline Funktionalität (Apollo Client Links, Cache Persists, Service Worker)
- Browserverlauf beim Stempeln
- Preflight Requests. Traefik antwortet mit 404 wenn Route nicht erreichbar anstatt 503, was zu einem Problem führt bei dem Service Worker queueing
- Svelte Router, 404, Forbidden oder optionale Parameter sind nicht unterstütz mit unserer Library
- GraphQL Endpunkt Redirect so Umleiten, dass es ein Redirect auf dem Client bewirkt

## Sumup and Highlights

- Svelte ist ein sehr gutes Framework, aber noch nicht ganz ausgereift. Es fehlen noch einige Features und die Community ist noch nicht so gross wie bei React oder Vue. Es ist aber sehr einfach zu erlernen, fühlt sich intuitiv an und hat ein sehr gutes Konzept. Es ist sehr schnell und hat eine sehr gute Dokumentation. Es ist sehr gut für kleine Projekte geeignet, aber für grosse Projekte fehlen noch einige Features.
- GraphQL ist ein wirklich interessanter Ansatz für eine API. Vor allem im zusammen Spiel mit MongoDB bzw. Mongoos wird die API fast zur direkten Datenbank Anbindung und das Konzept der Dokumente zieht sich komplett durch. Im Zusammenspiel mit Codegen, holt man sich das maximum an einer automatisierten Typisierung und Codegenerierung heraus. Zudem bietet GraphQL eine sehr gute Dokumentation und liefert eine direkte online Anbindung für Sandboxing an seine eigene API an.
- MongoDB ist eine sehr gute Datenbank, die sehr einfach zu bedienen ist. Sie ist sehr schnell und hat eine sehr gute Dokumentation. Mit Compass, kann man einfach die Datenbank administrieren und Requests testen.
- Mongoose ist ein sehr gutes Framework um mit MongoDB zu arbeiten. Es ist sehr einfach zu bedienen und hat eine sehr gute Dokumentation. Die Typisierung ist hervoragend und die Schemadefinitionen ermöglicht viele Features, welche wir bei weitem nicht optimal ausgeschöpft haben.
- Traefik ist ein sehr guter Reverse Proxy, der sehr einfach zu bedienen ist. Er hat eine sehr gute Dokumentation und ist sehr schnell. In diesem Projekt war vorallem die enge Koplung zu Docker hilfreich, damit sehr einfach skaliert werden kann.
- Workbox von Google, eignet sich sehr gut um schnell und einfach seinen Service Worker zu konfigurieren. Es ist sehr einfach zu bedienen und hat eine sehr gute Dokumentation.
- JWT ist eine sehr gute und einfache Möglichkeit um Payload zu hashen und zu signieren. Dazu gibt es genügend stabile und gut dokumentierte Bibliotheken.
- Rollup funktioniert gut mit Svelte zusammen und dank der guten Dokumentation und der grossen Anzahl an Plugins ist es gut für verschiedene Anwendungsfälle geeignet. Leider hat es aber noch einige Plugins mit debrecated Referenzen, was zu Warnungen führt.
