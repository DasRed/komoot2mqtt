---
title: MQTT
description: Alle MQTT-Topics, die komoot2mqtt veröffentlicht, mit Aufbau der Nachrichten, Einheiten und Beispielen, dazu Verfügbarkeit und wann Werte neu gesendet werden.
order: 30
slug: mqtt
section: Referenz
---

Alle Topics liegen unter `K2M_MQTT_BASE_TOPIC` (Standard `komoot2mqtt`). Die Nachrichten sind JSON und werden
standardmäßig als „retained“ gesendet, damit ein neuer Abonnent sofort den letzten Stand bekommt.

## Topics

| Topic                                | Inhalt                                                      |
|--------------------------------------|-------------------------------------------------------------|
| `komoot2mqtt/bridge/state`           | `{"state": "online"}` oder `{"state": "offline"}`           |
| `komoot2mqtt/stats/speed`            | Tempo in Bewegung in km/h: `min`, `avg`, `max`              |
| `komoot2mqtt/stats/distance`         | Strecke in km: `min`, `avg`, `max`, `total`                 |
| `komoot2mqtt/stats/duration`         | Dauer in Bewegung in Stunden: `min`, `avg`, `max`, `total`  |
| `komoot2mqtt/stats/elevation/up`     | Höhenmeter bergauf: `min`, `avg`, `max`, `total`            |
| `komoot2mqtt/stats/elevation/down`   | Höhenmeter bergab: `min`, `avg`, `max`, `total`             |
| `komoot2mqtt/stats/elevation/delta`  | Bergauf minus bergab: `min`, `avg`, `max`, `total`          |
| `komoot2mqtt/lastTour`               | Die neueste Tour                                            |
| `komoot2mqtt/tours`                  | Alle Touren als Liste, älteste zuerst                       |

Die Statistiken beziehen sich auf alle Touren, die nach den Filtern übrig bleiben.

## Beispiele

`komoot2mqtt/stats/distance`:

```json
{"min": 3.2, "avg": 28.4, "max": 112.7, "total": 2843.9}
```

`komoot2mqtt/lastTour` (gekürzt):

```json
{
    "id": "1234567890",
    "name": "Feierabendrunde",
    "date": "2026-11-20T15:12:04.000Z",
    "sport": "touringbicycle",
    "distance": 32.6,
    "duration": {"total": 1.9, "inMotion": 1.55},
    "speed": {"total": 17.2, "inMotion": 21.0},
    "elevation": {"up": 210, "down": 205, "total": 5}
}
```

`lastTour` und jeder Eintrag in `tours` haben denselben Aufbau wie `Tour.toJSON()` im komoot-client. Alle Felder mit
Einheiten stehen in dessen [Referenz](https://www.marco-starker.de/de/projekte/komoot-client/doku/optionen).

## Verhalten

- **Verfügbarkeit:** Beim Verbinden setzt der Dienst einen Last Will auf `bridge/state` mit `offline`. Nach dem
  Verbinden sendet er `online`.
- **Nur Änderungen:** Der Dienst merkt sich je Topic die zuletzt gesendete Nachricht und sendet nur, wenn sich etwas
  geändert hat. Nach einem Neustart wird alles einmal neu gesendet.
- **Größe von `tours`:** Das Topic enthält alle Touren in einer Nachricht. Bei vielen Touren wird sie entsprechend
  groß und liegt als retained Nachricht dauerhaft im Broker.
