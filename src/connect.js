import mqtt from 'mqtt';
import config from './config.js';

const publishCache = {};

async function publishK2M(client, topic, payload) {
    topic   = `${config.mqttBaseTopic}/${topic}`;
    payload = JSON.stringify(payload);

    if (publishCache[topic] !== payload) {
        client.publishAsync(topic, payload, {retain: config.mqttRetain});
        publishCache[topic] = payload;
    }
}

async function publishHA(client, topic, payload) {
    topic   = `${config.homeAssistantBaseTopic}/${topic}`;
    payload = JSON.stringify({
        availability:      [{topic: `${config.mqttBaseTopic}/bridge/state`, value_template: '{{ value_json.state }}'}],
        availability_mode: 'all',
        state_class:       'measurement',
        ...payload,
        device: {
            manufacturer: 'Komoot2MQTT',
            model:        'Komoot2MQTT',
            ...payload.device
        }
    });

    if (publishCache[topic] !== payload) {
        client.publishAsync(topic, payload, {retain: config.mqttRetain});
        publishCache[topic] = payload;
    }
}

/**
 *
 * @returns {Promise<MqttClient>}
 */
export default async function connect() {
    const client      = await mqtt.connectAsync(config.mqttHost, {
        username:        config.mqttUser,
        password:        config.mqttPassword,
        keepalive:       config.mqttKeepAlive,
        protocolVersion: config.mqttVersion,
        will:            {
            topic:   `${config.mqttBaseTopic}/bridge/state`,
            payload: JSON.stringify({state: 'offline'}),
            retain:  true,
        }
    });
    client.publishK2M = (topic, payload) => publishK2M(client, topic, payload);
    client.publishHA  = (topic, payload) => publishHA(client, topic, payload);
    await client.publishK2M(`bridge/state`, {state: 'online'});

    return client;
}