---
title: Installation
description: komoot2mqtt als Docker-Container aus der GitHub Container Registry starten oder lokal mit Node.js ausführen.
order: 10
slug: installation
section: Einstieg
---

Der übliche Weg ist das Docker-Image. Für Tests oder einen einmaligen Import geht es auch direkt mit Node.js.

## Voraussetzungen

- ein komoot-Konto mit E-Mail-Adresse und Passwort
- ein MQTT-Broker, z. B. Mosquitto oder das Add-on in Home Assistant
- für den Import des Verlaufs: Home Assistant mit MySQL oder MariaDB als Datenbank

## Docker Compose

Das Image liegt in der GitHub Container Registry als `ghcr.io/dasred/komoot2mqtt` mit den Tags `latest`, der
Hauptversion (`1`), `1.2` und der vollen Version.

```yaml
services:
  komoot2mqtt:
    image: ghcr.io/dasred/komoot2mqtt:1
    restart: unless-stopped
    environment:
      K2M_KOMOOT_EMAIL: ${K2M_KOMOOT_EMAIL}
      K2M_KOMOOT_PASSWORD: ${K2M_KOMOOT_PASSWORD}
      K2M_MQTT_HOST: mqtt://mosquitto:1883
      K2M_MQTT_USER: ${K2M_MQTT_USER}
      K2M_MQTT_PASSWORD: ${K2M_MQTT_PASSWORD}
      K2M_FILTER_SPORT: touringbicycle
```

Die Zugangsdaten legst du in eine `.env` neben der `compose.yaml`. Dann:

```bash
docker compose up -d
docker compose logs -f komoot2mqtt
```

Im Log siehst du, wann die Verbindung steht, die ersten Daten veröffentlicht sind und wann der nächste Lauf kommt.

> [!TIP]
> Der Container braucht keine Ports und kein Volume. Er spricht nur nach außen mit komoot und dem MQTT-Broker.

## Docker ohne Compose

```bash
docker run -d --name komoot2mqtt --restart unless-stopped \
    -e K2M_KOMOOT_EMAIL=du@example.com \
    -e K2M_KOMOOT_PASSWORD=geheim \
    -e K2M_MQTT_HOST=mqtt://192.168.1.10:1883 \
    -e K2M_MQTT_USER=komoot \
    -e K2M_MQTT_PASSWORD=geheim \
    ghcr.io/dasred/komoot2mqtt:1
```

## Lokal mit Node.js

Dafür brauchst du Node.js ab 26.12 und Git.

```bash
git clone https://github.com/DasRed/komoot2mqtt.git
cd komoot2mqtt
npm install
cp .env.example .env
npm start
```

Die Hilfe mit allen Optionen zeigt:

```bash
npm start -- --help
```

Alle Einstellungen stehen unter [Konfiguration](configuration.md).
