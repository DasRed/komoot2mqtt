import config from './config.js';

String.prototype.ucfirst = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

/**
 *
 * @param {MqttClient} client
 * @param {(string, Object) => Promise} client.publishK2M
 * @param {(string, Object) => Promise} client.publishHA
 * @param data
 * @returns {Promise<void>}
 */
export default async function publish(client, data) {
    await client.publishK2M(`stats/speed`, data.stats.speed);
    await client.publishK2M(`stats/distance`, data.stats.distance);
    await client.publishK2M(`stats/duration`, data.stats.duration);
    await client.publishK2M(`stats/elevation/up`, data.stats.elevation.up);
    await client.publishK2M(`stats/elevation/down`, data.stats.elevation.down);
    await client.publishK2M(`stats/elevation/delta`, data.stats.elevation.delta);
    await client.publishK2M(`lastTour`, data.lastTour);
    await client.publishK2M(`tours`, data.tours);

    if (config.homeAssistantDiscovery === false) {
        return;
    }

    await publishHomeAssistant(client, data.stats.speed, {
        id:                `speed`,
        name:              `Speed`,
        deviceId:          config.homeAssistantStatisticId,
        deviceClass:       'speed',
        deviceName:        'Komoot2MQTT Stats',
        stateTopic:        `stats/speed`,
        unitOfMeasurement: 'km/h',
        precision:         2,
    });

    await publishHomeAssistant(client, data.stats.distance, {
        id:                `distance`,
        name:              `Distance`,
        deviceId:          config.homeAssistantStatisticId,
        deviceClass:       'distance',
        deviceName:        'Komoot2MQTT Stats',
        stateTopic:        `stats/distance`,
        unitOfMeasurement: 'km',
        precision:         2,
    });

    await publishHomeAssistant(client, data.stats.duration, {
        id:                `duration`,
        name:              `Duration`,
        deviceId:          config.homeAssistantStatisticId,
        deviceClass:       'duration',
        deviceName:        'Komoot2MQTT Stats',
        stateTopic:        `stats/duration`,
        unitOfMeasurement: 'h',
    });

    await publishHomeAssistant(client, data.stats.elevation.up, {
        id:                `elevation-up`,
        name:              `Elevation Up`,
        deviceId:          config.homeAssistantStatisticId,
        deviceClass:       'distance',
        deviceName:        'Komoot2MQTT Stats',
        stateTopic:        `stats/elevation/up`,
        unitOfMeasurement: 'm',
        precision:         2,
    });

    await publishHomeAssistant(client, data.stats.elevation.down, {
        id:                `elevation-down`,
        name:              `Elevation Down`,
        deviceId:          config.homeAssistantStatisticId,
        deviceClass:       'distance',
        deviceName:        'Komoot2MQTT Stats',
        stateTopic:        `stats/elevation/down`,
        unitOfMeasurement: 'm',
        precision:         2,
    });

    await publishHomeAssistant(client, data.stats.elevation.delta, {
        id:                `elevation-delta`,
        name:              `Elevation Delta`,
        deviceId:          config.homeAssistantStatisticId,
        deviceClass:       'distance',
        deviceName:        'Komoot2MQTT Stats',
        stateTopic:        `stats/elevation/delta`,
        unitOfMeasurement: 'm',
        precision:         2,
    });

    await client.publishHA(`sensor/${config.homeAssistantLastTourId}/date/config`, {
        name:                        `Date`,
        device:                      {identifiers: [config.homeAssistantLastTourId], name: 'Komoot2MQTT Last Tour'},
        device_class:                'timestamp',
        state_topic:                 `${config.mqttBaseTopic}/lastTour`,
        unique_id:                   `${config.homeAssistantLastTourId}-last-tour-date`,
        value_template:              `{{ value_json.date }}`
    });

    await client.publishHA(`sensor/${config.homeAssistantLastTourId}/distance/config`, {
        name:                        `Distance`,
        device:                      {identifiers: [config.homeAssistantLastTourId], name: 'Komoot2MQTT Last Tour'},
        device_class:                'distance',
        state_topic:                 `${config.mqttBaseTopic}/lastTour`,
        unique_id:                   `${config.homeAssistantLastTourId}-last-tour-distance`,
        unit_of_measurement:         'km',
        suggested_display_precision: 2,
        value_template:              `{{ value_json.distance }}`
    });

    await client.publishHA(`sensor/${config.homeAssistantLastTourId}/duration-in-motion/config`, {
        name:                        `Duration in Motion`,
        device:                      {identifiers: [config.homeAssistantLastTourId], name: 'Komoot2MQTT Last Tour'},
        device_class:                'Duration',
        state_topic:                 `${config.mqttBaseTopic}/lastTour`,
        unique_id:                   `${config.homeAssistantLastTourId}-last-tour-duration-in-motion`,
        unit_of_measurement:         'h',
        value_template:              `{{ value_json.duration.inMotion }}`
    });

    await client.publishHA(`sensor/${config.homeAssistantLastTourId}/duration-with-stops/config`, {
        name:                        `Duration with Stops`,
        device:                      {identifiers: [config.homeAssistantLastTourId], name: 'Komoot2MQTT Last Tour'},
        device_class:                'Duration',
        state_topic:                 `${config.mqttBaseTopic}/lastTour`,
        unique_id:                   `${config.homeAssistantLastTourId}-last-tour-duration-with-stops`,
        unit_of_measurement:         'h',
        value_template:              `{{ value_json.duration.total }}`
    });

    await client.publishHA(`sensor/${config.homeAssistantLastTourId}/speed-in-motion/config`, {
        name:                        `Speed in Motion`,
        device:                      {identifiers: [config.homeAssistantLastTourId], name: 'Komoot2MQTT Last Tour'},
        device_class:                'speed',
        state_topic:                 `${config.mqttBaseTopic}/lastTour`,
        unique_id:                   `${config.homeAssistantLastTourId}-last-tour-speed-in-motion`,
        unit_of_measurement:         'km/h',
        suggested_display_precision: 2,
        value_template:              `{{ value_json.speed.inMotion }}`
    });

    await client.publishHA(`sensor/${config.homeAssistantLastTourId}/speed-with-stops/config`, {
        name:                        `Speed with Stops`,
        device:                      {identifiers: [config.homeAssistantLastTourId], name: 'Komoot2MQTT Last Tour'},
        device_class:                'speed',
        state_topic:                 `${config.mqttBaseTopic}/lastTour`,
        unique_id:                   `${config.homeAssistantLastTourId}-last-tour-speed-with-stops`,
        unit_of_measurement:         'km/h',
        suggested_display_precision: 2,
        value_template:              `{{ value_json.speed.total }}`
    });

    await client.publishHA(`sensor/${config.homeAssistantLastTourId}/elevation-up/config`, {
        name:                        `Elevation Up`,
        device:                      {identifiers: [config.homeAssistantLastTourId], name: 'Komoot2MQTT Last Tour'},
        device_class:                'distance',
        state_topic:                 `${config.mqttBaseTopic}/lastTour`,
        unique_id:                   `${config.homeAssistantLastTourId}-last-tour-elevation-up`,
        unit_of_measurement:         'm',
        suggested_display_precision: 2,
        value_template:              `{{ value_json.elevation.up }}`
    });

    await client.publishHA(`sensor/${config.homeAssistantLastTourId}/elevation-down/config`, {
        name:                        `Elevation Down`,
        device:                      {identifiers: [config.homeAssistantLastTourId], name: 'Komoot2MQTT Last Tour'},
        device_class:                'distance',
        state_topic:                 `${config.mqttBaseTopic}/lastTour`,
        unique_id:                   `${config.homeAssistantLastTourId}-last-tour-elevation-down`,
        unit_of_measurement:         'm',
        suggested_display_precision: 2,
        value_template:              `{{ value_json.elevation.down }}`
    });

    await client.publishHA(`sensor/${config.homeAssistantLastTourId}/elevation-delta/config`, {
        name:                        `Elevation Delta`,
        device:                      {identifiers: [config.homeAssistantLastTourId], name: 'Komoot2MQTT Last Tour'},
        device_class:                'distance',
        state_topic:                 `${config.mqttBaseTopic}/lastTour`,
        unique_id:                   `${config.homeAssistantLastTourId}-last-tour-elevation-delta`,
        unit_of_measurement:         'm',
        suggested_display_precision: 2,
        value_template:              `{{ value_json.elevation.total }}`
    });
}

/**
 *
 * @param {MqttClient} client
 * @param {(string, Object) => Promise} client.publishHA
 * @param {Object} object
 * @param id
 * @param {string} name
 * @param {string} deviceId
 * @param {string} deviceClass
 * @param {string} deviceName
 * @param {string} stateTopic
 * @param {string} unitOfMeasurement
 * @param precision
 * @returns {Promise<void>}
 */
async function publishHomeAssistant(client, object, {id, name, deviceId, deviceClass, deviceName, stateTopic, unitOfMeasurement, precision}) {
    await Promise.all(Object.keys(object).map(async (key) => {
        await client.publishHA(`sensor/${deviceId}/${id}-${key}/config`, {
            name:                        `${name} ${key.ucfirst()}`,
            device:                      {identifiers: [deviceId], name: deviceName},
            device_class:                deviceClass,
            state_topic:                 `${config.mqttBaseTopic}/${stateTopic}`,
            unique_id:                   `${deviceId}-${id}-${key}`,
            unit_of_measurement:         unitOfMeasurement,
            suggested_display_precision: precision,
            value_template:              `{{ value_json.${key} }}`
        });
    }));
}