# Karte

## Idee
Treuekarte.jpg

Treuekarte online umzusetzen mit konkretem Anwendungsfall von Crownbar in Rapperswil. Dabei liegt es in der Philosophie der Bar, dass man auf Internet für die Kunden im Lokal verzichtet. 

## Zielimplementierung
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





