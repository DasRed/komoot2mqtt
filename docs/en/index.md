---
title: Overview
description: Service that polls your komoot tours regularly and sends statistics and your latest tour to Home Assistant via MQTT. How it works, status and related projects.
order: 0
section: Getting started
---

`komoot2mqtt` fetches your recorded tours from komoot at fixed intervals, computes statistics and publishes them via
MQTT. With discovery enabled, Home Assistant creates the matching sensors by itself: speed, distance, duration and
elevation (minimum, average, maximum, total) plus the values of your latest tour.

## How it runs

1. On start the service connects to the MQTT broker and reports itself as `online`.
2. It loads all recorded tours (optionally filtered by sport and date) and publishes the statistics, the latest tour
   and the list of all tours.
3. With discovery enabled it sends Home Assistant the sensor configuration.
4. After that it repeats steps 2 and 3 every 10 minutes. Unchanged values are not sent again.

If the connection drops, the broker sets the state to `offline` via the last will, and Home Assistant shows the sensors
as unavailable.

The service can also write your past tours once as history into the Home Assistant database, see
[Home Assistant](home-assistant.md#import-history).

> [!WARNING]
> Through [komoot-client](https://www.marco-starker.de/en/projects/komoot-client) the service uses the internal API of
> the komoot app. If komoot changes it, no new values arrive.

## Status

Version 1.2.2, actively used and maintained. Runs as a Docker container.

## Related projects

- [komoot-client](https://www.marco-starker.de/en/projects/komoot-client): the client the service is built on.
- [komoot2csv](https://www.marco-starker.de/en/projects/komoot2csv): writes your tours into a CSV file.
