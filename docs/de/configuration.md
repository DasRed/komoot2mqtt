---
title: Konfiguration
description: Alle Umgebungsvariablen von komoot2mqtt für komoot, MQTT, Ablauf, Home Assistant und den Datenbank-Import.
order: 20
slug: konfiguration
section: Einrichtung
---

Jede Einstellung geht als Umgebungsvariable, in einer `.env`-Datei oder als Option auf der Kommandozeile (gleicher
Name wie in der Spalte „Option“, z. B. `--mqttHost`). Die Kommandozeile gewinnt.

Schalter (Ja/Nein) verstehen `true` und `1` als ja, alles andere als nein.

## komoot

| Variable              | Option           | Standard | Beschreibung                       |
|-----------------------|------------------|----------|------------------------------------|
| `K2M_KOMOOT_EMAIL`    | `komootEmail`    | Pflicht  | E-Mail-Adresse des komoot-Kontos   |
| `K2M_KOMOOT_PASSWORD` | `komootPassword` | Pflicht  | Passwort des komoot-Kontos         |
| `K2M_FILTER_SPORT`    | `filterSport`    | alle     | Nur Touren dieser Sportart, z. B. `touringbicycle` |
| `K2M_FILTER_AFTER_DATE` | `filterAfterDate` | alle  | Nur Touren ab diesem Zeitpunkt, z. B. `2026-01-01T00:00:00.000Z` |

## MQTT

| Variable              | Option          | Standard      | Beschreibung                                         |
|-----------------------|-----------------|---------------|------------------------------------------------------|
| `K2M_MQTT_HOST`       | `mqttHost`      | Pflicht       | Adresse des Brokers, z. B. `mqtt://192.168.1.10:1883` |
| `K2M_MQTT_USER`       | `mqttUser`      | Pflicht       | Benutzer am Broker                                   |
| `K2M_MQTT_PASSWORD`   | `mqttPassword`  | Pflicht       | Passwort am Broker                                   |
| `K2M_MQTT_KEEPALIVE`  | `mqttKeepAlive` | `60`          | Keep-Alive in Sekunden                               |
| `K2M_MQTT_VERSION`    | `mqttVersion`   | `4`           | MQTT-Protokollversion (`4` = 3.1.1, `5` = 5.0)       |
| `K2M_MQTT_BASE_TOPIC` | `mqttBaseTopic` | `komoot2mqtt` | Basis aller Topics, siehe [MQTT](mqtt.md)           |
| `K2M_MQTT_RETAIN`     | `mqttRetain`    | `true`        | Nachrichten als „retained“ senden                    |

## Ablauf

| Variable                | Option             | Standard | Beschreibung                                            |
|-------------------------|--------------------|----------|---------------------------------------------------------|
| `K2M_INTERVAL`          | `interval`         | `600000` | Abstand zwischen zwei Abfragen in Millisekunden (10 Minuten) |
| `K2M_INTERVAL_DISABLED` | `intervalDisabled` | `false`  | Nach dem ersten Durchlauf beenden statt weiterzulaufen  |
| `K2M_PUBLISH_DISABLED`  | `publishDisabled`  | `false`  | Beim ersten Durchlauf nichts per MQTT senden            |

> [!NOTE]
> `K2M_PUBLISH_DISABLED` wirkt nur auf den ersten Durchlauf. Läuft der Dienst danach im Intervall weiter, sendet er
> trotzdem. Zusammen mit `K2M_INTERVAL_DISABLED=true` sendet er gar nichts – das ist die Einstellung für einen reinen
> Import.

## Home Assistant

| Variable                         | Option                     | Standard            | Beschreibung                                      |
|----------------------------------|----------------------------|---------------------|---------------------------------------------------|
| `K2M_HOMEASSISTANT_DISCOVERY`    | `homeAssistantDiscovery`   | `true`              | Sensoren per MQTT Discovery anlegen              |
| `K2M_HOMEASSISTANT_BASE_TOPIC`   | `homeAssistantBaseTopic`   | `homeassistant`     | Discovery-Präfix von Home Assistant              |
| `K2M_HOMEASSISTANT_STATISTIC_ID` | `homeAssistantStatisticId` | `komoot-statistic`  | ID des Geräts für die Statistiken                |
| `K2M_HOMEASSISTANT_LAST_TOUR_ID` | `homeAssistantLastTourId`  | `komoot-last-tour`  | ID des Geräts für die letzte Tour                |

In beiden IDs ersetzt der Dienst `{sport}` durch den Wert von `K2M_FILTER_SPORT`. So kannst du mehrere Container für
verschiedene Sportarten laufen lassen, ohne dass sich die Geräte in die Quere kommen, siehe
[Home Assistant](home-assistant.md#mehrere-sportarten).

## Datenbank-Import

Nur nötig, wenn du den Verlauf in Home Assistant importieren willst, siehe
[Home Assistant](home-assistant.md#verlauf-importieren).

| Variable                                           | Option                                      | Standard        | Beschreibung                          |
|----------------------------------------------------|---------------------------------------------|-----------------|---------------------------------------|
| `K2M_HOMEASSISTANT_DATABASE_IMPORT_HISTORICAL_DATA` | `homeAssistantDatabaseImportHistoricalData` | `false`        | Verlauf beim Start importieren        |
| `K2M_HOMEASSISTANT_DATABASE_HOST`                  | `homeAssistantDatabaseHost`                 | `localhost`     | Host der Datenbank                    |
| `K2M_HOMEASSISTANT_DATABASE_PORT`                  | `homeAssistantDatabasePort`                 | `3306`          | Port der Datenbank                    |
| `K2M_HOMEASSISTANT_DATABASE_USER`                  | `homeAssistantDatabaseUser`                 | leer            | Benutzer                              |
| `K2M_HOMEASSISTANT_DATABASE_PASSWORD`              | `homeAssistantDatabasePassword`             | leer            | Passwort                              |
| `K2M_HOMEASSISTANT_DATABASE_NAME`                  | `homeAssistantDatabaseName`                 | `homeassistant` | Name der Datenbank                    |
| `K2M_HOMEASSISTANT_DATABASE_CHARSET`               | `homeAssistantDatabaseCharset`              | `utf8mb4`       | Zeichensatz der Verbindung            |
| `K2M_HOMEASSISTANT_ENTITY_TEMPLATE`                | `homeAssistantEntityTemplate`               | `sensor.komoot2mqtt_{device}_{type}_{key}` | Muster, nach dem die Entitäten gesucht werden |

## Beispiel `.env`

```dotenv
K2M_KOMOOT_EMAIL=du@example.com
K2M_KOMOOT_PASSWORD=geheim

K2M_MQTT_HOST=mqtt://192.168.1.10:1883
K2M_MQTT_USER=komoot
K2M_MQTT_PASSWORD=geheim

K2M_FILTER_SPORT=touringbicycle
K2M_INTERVAL=900000
```

> [!WARNING]
> Die `.env` enthält deine Zugangsdaten zu komoot und zum Broker. Sie steht in `.gitignore`, gib sie trotzdem nicht
> weiter.
