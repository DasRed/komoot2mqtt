---
title: MQTT
description: All MQTT topics komoot2mqtt publishes, with message structure, units and examples, plus availability and when values are sent again to your broker.
order: 30
slug: mqtt
section: Reference
---

All topics live under `K2M_MQTT_BASE_TOPIC` (default `komoot2mqtt`). Messages are JSON and are sent as retained by
default, so a new subscriber gets the latest state right away.

## Topics

| Topic                               | Contents                                                  |
|-------------------------------------|-----------------------------------------------------------|
| `komoot2mqtt/bridge/state`          | `{"state": "online"}` or `{"state": "offline"}`           |
| `komoot2mqtt/stats/speed`           | Speed in motion in km/h: `min`, `avg`, `max`              |
| `komoot2mqtt/stats/distance`        | Distance in km: `min`, `avg`, `max`, `total`              |
| `komoot2mqtt/stats/duration`        | Duration in motion in hours: `min`, `avg`, `max`, `total` |
| `komoot2mqtt/stats/elevation/up`    | Elevation gain: `min`, `avg`, `max`, `total`              |
| `komoot2mqtt/stats/elevation/down`  | Elevation loss: `min`, `avg`, `max`, `total`              |
| `komoot2mqtt/stats/elevation/delta` | Gain minus loss: `min`, `avg`, `max`, `total`             |
| `komoot2mqtt/lastTour`              | The latest tour                                           |
| `komoot2mqtt/tours`                 | All tours as a list, oldest first                         |

The statistics cover all tours that remain after the filters.

## Examples

`komoot2mqtt/stats/distance`:

```json
{"min": 3.2, "avg": 28.4, "max": 112.7, "total": 2843.9}
```

`komoot2mqtt/lastTour` (shortened):

```json
{
    "id": "1234567890",
    "name": "After-work loop",
    "date": "2026-11-20T15:12:04.000Z",
    "sport": "touringbicycle",
    "distance": 32.6,
    "duration": {"total": 1.9, "inMotion": 1.55},
    "speed": {"total": 17.2, "inMotion": 21.0},
    "elevation": {"up": 210, "down": 205, "total": 5}
}
```

`lastTour` and every entry in `tours` have the same structure as `Tour.toJSON()` in komoot-client. All fields with units
are listed in its [reference](https://www.marco-starker.de/en/projects/komoot-client/docs/options).

## Behaviour

- **Availability:** When connecting, the service sets a last will on `bridge/state` with `offline`. Once connected it
  sends `online`.
- **Changes only:** The service remembers the last message per topic and only sends when something changed. After a
  restart everything is sent once again.
- **Size of `tours`:** The topic holds all tours in one message. With many tours it gets large and stays in the broker
  permanently as a retained message.
