---
title: Home Assistant
description: Sensoren per MQTT Discovery, mehrere Sportarten parallel und der einmalige Import des Verlaufs in die Datenbank von Home Assistant.
order: 40
slug: home-assistant
section: Referenz
---

## Sensoren per Discovery

Mit `K2M_HOMEASSISTANT_DISCOVERY=true` (Standard) legt Home Assistant zwei Geräte an, sobald die MQTT-Integration
eingerichtet ist. Du musst nichts in der `configuration.yaml` eintragen.

**Komoot2MQTT Stats** – je Statistik ein Sensor für `Min`, `Avg`, `Max` und (außer beim Tempo) `Total`:

| Sensor            | Einheit |
|-------------------|---------|
| `Speed …`         | km/h    |
| `Distance …`      | km      |
| `Duration …`      | h       |
| `Elevation Up …`  | m       |
| `Elevation Down …`| m       |
| `Elevation Delta …` | m     |

**Komoot2MQTT Last Tour** – die Werte deiner neuesten Tour:

| Sensor                | Einheit |
|-----------------------|---------|
| `Date`                | Zeitstempel |
| `Distance`            | km      |
| `Duration in Motion`  | h       |
| `Duration with Stops` | h       |
| `Speed in Motion`     | km/h    |
| `Speed with Stops`    | km/h    |
| `Elevation Up`        | m       |
| `Elevation Down`      | m       |
| `Elevation Delta`     | m       |

Alle Sensoren sind nicht verfügbar, solange `komoot2mqtt/bridge/state` auf `offline` steht.

Home Assistant bildet die Entitäten aus Gerät und Sensor, also etwa `sensor.komoot2mqtt_stats_distance_total` oder
`sensor.komoot2mqtt_last_tour_speed_in_motion`.

## Mehrere Sportarten

Willst du Rad und Wandern getrennt sehen, starte zwei Container mit unterschiedlichem Filter und `{sport}` in den
Geräte-IDs und im Basis-Topic:

```yaml
services:
  komoot2mqtt-bike:
    image: ghcr.io/dasred/komoot2mqtt:1
    environment:
      K2M_FILTER_SPORT: touringbicycle
      K2M_MQTT_BASE_TOPIC: komoot2mqtt-bike
      K2M_HOMEASSISTANT_STATISTIC_ID: komoot-statistic-{sport}
      K2M_HOMEASSISTANT_LAST_TOUR_ID: komoot-last-tour-{sport}
      # Zugangsdaten wie unter Installation

  komoot2mqtt-hike:
    image: ghcr.io/dasred/komoot2mqtt:1
    environment:
      K2M_FILTER_SPORT: hike
      K2M_MQTT_BASE_TOPIC: komoot2mqtt-hike
      K2M_HOMEASSISTANT_STATISTIC_ID: komoot-statistic-{sport}
      K2M_HOMEASSISTANT_LAST_TOUR_ID: komoot-last-tour-{sport}
```

> [!IMPORTANT]
> Jeder Container braucht sein eigenes `K2M_MQTT_BASE_TOPIC`. `{sport}` wird dort nicht ersetzt, also trag den Namen
> direkt ein. Bei gleichem Basis-Topic überschreiben sich die Container gegenseitig.

Die Geräte heißen in Home Assistant trotzdem beide „Komoot2MQTT Stats“ bzw. „Komoot2MQTT Last Tour“. Benenne sie nach
dem ersten Start in Home Assistant um, damit du sie auseinanderhältst.

## Verlauf importieren

Home Assistant zeichnet die Sensoren erst ab dem Zeitpunkt auf, an dem es sie kennt. Mit dem Import schreibt
komoot2mqtt einmalig für jede bisherige Tour einen Eintrag in die Langzeit-Statistik (Tabelle `statistics`), sodass
deine Diagramme auch die Vergangenheit zeigen.

> [!CAUTION]
> Der Import schreibt direkt in die Datenbank von Home Assistant. Mach vorher ein Backup. Unterstützt werden nur MySQL
> und MariaDB, nicht die Standard-Datenbank SQLite.

So gehst du vor:

1. komoot2mqtt einmal normal laufen lassen, bis die Sensoren in Home Assistant auftauchen. Der Import sucht die
   Entitäten über ihre ID und bricht ab, wenn eine fehlt.
2. Prüfen, ob die IDs deiner Entitäten zum Muster `K2M_HOMEASSISTANT_ENTITY_TEMPLATE` passen (Standard
   `sensor.komoot2mqtt_{device}_{type}_{key}`). Hast du Geräte oder Entitäten umbenannt, pass das Muster an.
3. Den Import einmalig in einem eigenen Container starten. Er verbindet sich dabei zwar mit dem Broker, sendet aber
   keine Statistiken und beendet sich danach:

```bash
docker run --rm \
    --env-file .env \
    -e K2M_HOMEASSISTANT_DATABASE_IMPORT_HISTORICAL_DATA=true \
    -e K2M_HOMEASSISTANT_DATABASE_HOST=192.168.1.10 \
    -e K2M_HOMEASSISTANT_DATABASE_USER=homeassistant \
    -e K2M_HOMEASSISTANT_DATABASE_PASSWORD=geheim \
    -e K2M_INTERVAL_DISABLED=true \
    -e K2M_PUBLISH_DISABLED=true \
    ghcr.io/dasred/komoot2mqtt:1
```

Im Muster ersetzt der Dienst `{device}` durch `stats` oder `last_tour`, `{type}` durch die Statistik (z. B. `speed`,
`elevation_up`) und `{key}` durch den Wert (z. B. `min`, `total`, `speed_in_motion`). Doppelte Unterstriche werden zu
einem.

> [!WARNING]
> Führe den Import nur einmal aus. Home Assistant speichert je Sensor und Stunde nur einen Eintrag. Ein zweiter Lauf
> oder zwei Touren in derselben Stunde können deshalb am Datenbankschlüssel scheitern, und der Import bricht ab.
