# komoot2mqtt

Service that polls your komoot tours regularly and publishes statistics and your latest tour via MQTT, with Home
Assistant discovery and an optional one-off history import.

Documentation: https://www.marco-starker.de/en/projects/komoot2mqtt/docs
(Deutsch: https://www.marco-starker.de/de/projekte/komoot2mqtt/doku)

## Quick start

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
```

```bash
docker compose up -d
```

All environment variables are listed in the documentation and in `.env.example`.

## License

[MIT](LICENSE)
