---
title: Überblick
description: Dienst, der deine komoot-Touren regelmäßig abfragt und Statistiken samt letzter Tour per MQTT an Home Assistant schickt.
order: 0
section: Einstieg
---

`komoot2mqtt` holt in festen Abständen deine aufgezeichneten Touren von komoot, rechnet Statistiken daraus und
veröffentlicht sie per MQTT. Mit eingeschalteter Discovery legt Home Assistant die passenden Sensoren von selbst an:
Tempo, Strecke, Dauer und Höhenmeter (Minimum, Durchschnitt, Maximum, Summe) sowie die Werte deiner letzten Tour.

## Ablauf

1. Beim Start verbindet sich der Dienst mit dem MQTT-Broker und meldet sich als `online`.
2. Er lädt alle aufgezeichneten Touren (optional gefiltert nach Sportart und Datum) und veröffentlicht die
   Statistiken, die letzte Tour und die Liste aller Touren.
3. Ist die Discovery an, schickt er Home Assistant die Konfiguration der Sensoren.
4. Danach wiederholt er Schritt 2 und 3 alle 10 Minuten. Unveränderte Werte werden nicht erneut gesendet.

Bricht die Verbindung ab, setzt der Broker den Status per Last Will auf `offline`, und Home Assistant zeigt die
Sensoren als nicht verfügbar.

Zusätzlich kann der Dienst einmalig deine bisherigen Touren als Verlauf in die Datenbank von Home Assistant schreiben,
siehe [Home Assistant](home-assistant.md#verlauf-importieren).

> [!WARNING]
> Der Dienst nutzt über [komoot-client](https://www.marco-starker.de/de/projekte/komoot-client) die interne API der
> komoot-App. Ändert komoot sie, kommen keine neuen Werte mehr an.

## Status

Version 1.2.2, wird aktiv genutzt und gepflegt. Läuft als Docker-Container.

## Verwandte Projekte

- [komoot-client](https://www.marco-starker.de/de/projekte/komoot-client): der Client, auf dem der Dienst aufbaut.
- [komoot2csv](https://www.marco-starker.de/de/projekte/komoot2csv): schreibt deine Touren in eine CSV-Datei.
