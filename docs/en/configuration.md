---
title: Configuration
description: All environment variables of komoot2mqtt for komoot, MQTT, scheduling, Home Assistant and the database import.
order: 20
slug: configuration
section: Setup
---

Every setting works as an environment variable, in a `.env` file or as a command line option (same name as in the
"Option" column, e.g. `--mqttHost`). The command line wins.

Switches (yes/no) treat `true` and `1` as yes, anything else as no.

## komoot

| Variable                | Option            | Default  | Description                                                 |
|-------------------------|-------------------|----------|-------------------------------------------------------------|
| `K2M_KOMOOT_EMAIL`      | `komootEmail`     | required | Email address of the komoot account                         |
| `K2M_KOMOOT_PASSWORD`   | `komootPassword`  | required | Password of the komoot account                              |
| `K2M_FILTER_SPORT`      | `filterSport`     | all      | Only tours of this sport, e.g. `touringbicycle`             |
| `K2M_FILTER_AFTER_DATE` | `filterAfterDate` | all      | Only tours from this point in time, e.g. `2026-01-01T00:00:00.000Z` |

## MQTT

| Variable              | Option          | Default       | Description                                           |
|-----------------------|-----------------|---------------|-------------------------------------------------------|
| `K2M_MQTT_HOST`       | `mqttHost`      | required      | Broker address, e.g. `mqtt://192.168.1.10:1883`       |
| `K2M_MQTT_USER`       | `mqttUser`      | required      | User at the broker                                    |
| `K2M_MQTT_PASSWORD`   | `mqttPassword`  | required      | Password at the broker                                |
| `K2M_MQTT_KEEPALIVE`  | `mqttKeepAlive` | `60`          | Keep-alive in seconds                                 |
| `K2M_MQTT_VERSION`    | `mqttVersion`   | `4`           | MQTT protocol version (`4` = 3.1.1, `5` = 5.0)        |
| `K2M_MQTT_BASE_TOPIC` | `mqttBaseTopic` | `komoot2mqtt` | Base of all topics, see [MQTT](mqtt.md)               |
| `K2M_MQTT_RETAIN`     | `mqttRetain`    | `true`        | Send messages as retained                             |

## Scheduling

| Variable                | Option             | Default  | Description                                               |
|-------------------------|--------------------|----------|-----------------------------------------------------------|
| `K2M_INTERVAL`          | `interval`         | `600000` | Time between two polls in milliseconds (10 minutes)       |
| `K2M_INTERVAL_DISABLED` | `intervalDisabled` | `false`  | Exit after the first run instead of continuing            |
| `K2M_PUBLISH_DISABLED`  | `publishDisabled`  | `false`  | Send nothing via MQTT in the first run                    |

> [!NOTE]
> `K2M_PUBLISH_DISABLED` only affects the first run. If the service keeps running on the interval afterwards, it still
> publishes. Combined with `K2M_INTERVAL_DISABLED=true` it publishes nothing – that is the setting for a pure import.

## Home Assistant

| Variable                         | Option                     | Default            | Description                              |
|----------------------------------|----------------------------|--------------------|------------------------------------------|
| `K2M_HOMEASSISTANT_DISCOVERY`    | `homeAssistantDiscovery`   | `true`             | Create sensors via MQTT discovery        |
| `K2M_HOMEASSISTANT_BASE_TOPIC`   | `homeAssistantBaseTopic`   | `homeassistant`    | Discovery prefix of Home Assistant       |
| `K2M_HOMEASSISTANT_STATISTIC_ID` | `homeAssistantStatisticId` | `komoot-statistic` | Device ID for the statistics             |
| `K2M_HOMEASSISTANT_LAST_TOUR_ID` | `homeAssistantLastTourId`  | `komoot-last-tour` | Device ID for the latest tour            |

In both IDs the service replaces `{sport}` with the value of `K2M_FILTER_SPORT`. That lets you run several containers
for different sports without the devices getting in each other's way, see
[Home Assistant](home-assistant.md#several-sports).

## Database import

Only needed if you want to import the history into Home Assistant, see
[Home Assistant](home-assistant.md#import-history).

| Variable                                            | Option                                      | Default         | Description                        |
|-----------------------------------------------------|---------------------------------------------|-----------------|------------------------------------|
| `K2M_HOMEASSISTANT_DATABASE_IMPORT_HISTORICAL_DATA` | `homeAssistantDatabaseImportHistoricalData` | `false`         | Import the history on start        |
| `K2M_HOMEASSISTANT_DATABASE_HOST`                   | `homeAssistantDatabaseHost`                 | `localhost`     | Database host                      |
| `K2M_HOMEASSISTANT_DATABASE_PORT`                   | `homeAssistantDatabasePort`                 | `3306`          | Database port                      |
| `K2M_HOMEASSISTANT_DATABASE_USER`                   | `homeAssistantDatabaseUser`                 | empty           | User                               |
| `K2M_HOMEASSISTANT_DATABASE_PASSWORD`               | `homeAssistantDatabasePassword`             | empty           | Password                           |
| `K2M_HOMEASSISTANT_DATABASE_NAME`                   | `homeAssistantDatabaseName`                 | `homeassistant` | Database name                      |
| `K2M_HOMEASSISTANT_DATABASE_CHARSET`                | `homeAssistantDatabaseCharset`              | `utf8mb4`       | Connection charset                 |
| `K2M_HOMEASSISTANT_ENTITY_TEMPLATE`                 | `homeAssistantEntityTemplate`               | `sensor.komoot2mqtt_{device}_{type}_{key}` | Pattern used to look up the entities |

## Example `.env`

```dotenv
K2M_KOMOOT_EMAIL=you@example.com
K2M_KOMOOT_PASSWORD=secret

K2M_MQTT_HOST=mqtt://192.168.1.10:1883
K2M_MQTT_USER=komoot
K2M_MQTT_PASSWORD=secret

K2M_FILTER_SPORT=touringbicycle
K2M_INTERVAL=900000
```

> [!WARNING]
> The `.env` contains your credentials for komoot and the broker. It is listed in `.gitignore`, but do not share it
> anyway.
