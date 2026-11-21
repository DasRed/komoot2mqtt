---
title: Installation
description: Run komoot2mqtt as a Docker container from the GitHub Container Registry or locally with Node.js.
order: 10
slug: installation
section: Getting started
---

The usual way is the Docker image. For tests or a one-off import you can also run it directly with Node.js.

## Requirements

- a komoot account with email address and password
- an MQTT broker, e.g. Mosquitto or the Home Assistant add-on
- for the history import: Home Assistant with MySQL or MariaDB as database

## Docker Compose

The image is in the GitHub Container Registry as `ghcr.io/dasred/komoot2mqtt` with the tags `latest`, the major version
(`1`), `1.2` and the full version.

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

Put the credentials into a `.env` next to the `compose.yaml`. Then:

```bash
docker compose up -d
docker compose logs -f komoot2mqtt
```

The log shows when the connection is up, when the first data is published and when the next run is due.

> [!TIP]
> The container needs no ports and no volume. It only talks outwards to komoot and the MQTT broker.

## Docker without Compose

```bash
docker run -d --name komoot2mqtt --restart unless-stopped \
    -e K2M_KOMOOT_EMAIL=you@example.com \
    -e K2M_KOMOOT_PASSWORD=secret \
    -e K2M_MQTT_HOST=mqtt://192.168.1.10:1883 \
    -e K2M_MQTT_USER=komoot \
    -e K2M_MQTT_PASSWORD=secret \
    ghcr.io/dasred/komoot2mqtt:1
```

## Locally with Node.js

You need Node.js 26.12 or later and Git.

```bash
git clone https://github.com/DasRed/komoot2mqtt.git
cd komoot2mqtt
npm install
cp .env.example .env
npm start
```

The help with all options:

```bash
npm start -- --help
```

All settings are listed under [Configuration](configuration.md).
