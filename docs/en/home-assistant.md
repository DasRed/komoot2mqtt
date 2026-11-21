---
title: Home Assistant
description: Sensors via MQTT discovery, several sports side by side and the one-off history import into the Home Assistant database.
order: 40
slug: home-assistant
section: Reference
---

## Sensors via discovery

With `K2M_HOMEASSISTANT_DISCOVERY=true` (default) Home Assistant creates two devices as soon as the MQTT integration is
set up. Nothing needs to go into `configuration.yaml`.

**Komoot2MQTT Stats** – one sensor per statistic for `Min`, `Avg`, `Max` and (except for speed) `Total`:

| Sensor              | Unit |
|---------------------|------|
| `Speed …`           | km/h |
| `Distance …`        | km   |
| `Duration …`        | h    |
| `Elevation Up …`    | m    |
| `Elevation Down …`  | m    |
| `Elevation Delta …` | m    |

**Komoot2MQTT Last Tour** – the values of your latest tour:

| Sensor                | Unit      |
|-----------------------|-----------|
| `Date`                | timestamp |
| `Distance`            | km        |
| `Duration in Motion`  | h         |
| `Duration with Stops` | h         |
| `Speed in Motion`     | km/h      |
| `Speed with Stops`    | km/h      |
| `Elevation Up`        | m         |
| `Elevation Down`      | m         |
| `Elevation Delta`     | m         |

All sensors are unavailable while `komoot2mqtt/bridge/state` is `offline`.

Home Assistant builds the entities from device and sensor, e.g. `sensor.komoot2mqtt_stats_distance_total` or
`sensor.komoot2mqtt_last_tour_speed_in_motion`.

## Several sports

To see cycling and hiking separately, run two containers with different filters and `{sport}` in the device IDs, plus
their own base topic:

```yaml
services:
  komoot2mqtt-bike:
    image: ghcr.io/dasred/komoot2mqtt:1
    environment:
      K2M_FILTER_SPORT: touringbicycle
      K2M_MQTT_BASE_TOPIC: komoot2mqtt-bike
      K2M_HOMEASSISTANT_STATISTIC_ID: komoot-statistic-{sport}
      K2M_HOMEASSISTANT_LAST_TOUR_ID: komoot-last-tour-{sport}
      # credentials as under Installation

  komoot2mqtt-hike:
    image: ghcr.io/dasred/komoot2mqtt:1
    environment:
      K2M_FILTER_SPORT: hike
      K2M_MQTT_BASE_TOPIC: komoot2mqtt-hike
      K2M_HOMEASSISTANT_STATISTIC_ID: komoot-statistic-{sport}
      K2M_HOMEASSISTANT_LAST_TOUR_ID: komoot-last-tour-{sport}
```

> [!IMPORTANT]
> Every container needs its own `K2M_MQTT_BASE_TOPIC`. `{sport}` is not replaced there, so write the name directly.
> With the same base topic the containers overwrite each other.

In Home Assistant both devices are still called "Komoot2MQTT Stats" and "Komoot2MQTT Last Tour". Rename them in Home
Assistant after the first start so you can tell them apart.

## Import history

Home Assistant records sensors only from the moment it knows them. With the import, komoot2mqtt writes one entry per
past tour into the long-term statistics (table `statistics`) once, so your charts show the past as well.

> [!CAUTION]
> The import writes straight into the Home Assistant database. Make a backup first. Only MySQL and MariaDB are
> supported, not the default SQLite database.

How to proceed:

1. Run komoot2mqtt normally once until the sensors show up in Home Assistant. The import looks up the entities by their
   ID and stops if one is missing.
2. Check that your entity IDs match the pattern `K2M_HOMEASSISTANT_ENTITY_TEMPLATE` (default
   `sensor.komoot2mqtt_{device}_{type}_{key}`). If you renamed devices or entities, adjust the pattern.
3. Start the import once in a separate container. It still connects to the broker, but sends no statistics and exits
   afterwards:

```bash
docker run --rm \
    --env-file .env \
    -e K2M_HOMEASSISTANT_DATABASE_IMPORT_HISTORICAL_DATA=true \
    -e K2M_HOMEASSISTANT_DATABASE_HOST=192.168.1.10 \
    -e K2M_HOMEASSISTANT_DATABASE_USER=homeassistant \
    -e K2M_HOMEASSISTANT_DATABASE_PASSWORD=secret \
    -e K2M_INTERVAL_DISABLED=true \
    -e K2M_PUBLISH_DISABLED=true \
    ghcr.io/dasred/komoot2mqtt:1
```

In the pattern the service replaces `{device}` with `stats` or `last_tour`, `{type}` with the statistic (e.g. `speed`,
`elevation_up`) and `{key}` with the value (e.g. `min`, `total`, `speed_in_motion`). Double underscores become one.

> [!WARNING]
> Run the import only once. Home Assistant stores only one entry per sensor and hour. A second run or two tours within
> the same hour can therefore fail on the database key, and the import stops.
