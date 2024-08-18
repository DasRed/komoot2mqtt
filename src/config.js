import 'dotenv/config';
import commandLineArgs from 'command-line-args';

function bool(val) {
    if (typeof val === 'boolean') {
        return val;
    }
    return val?.toLowerCase() === 'true' || val === '1';
}

/**
 * @typedef {Object} ConfigObject
 * @property {string} komootEmail
 * @property {string} komootPassword
 * @property {string} mqttHost
 * @property {string} mqttUser
 * @property {string} mqttPassword
 * @property {Number} mqttKeepAlive
 * @property {Number} mqttVersion
 * @property {string} mqttBaseTopic
 * @property {Boolean} mqttRetain
 * @property {string} filterSport
 * @property {string} filterAfterDate
 * @property {number} interval
 * @property {boolean} publishAndStop
 * @property {boolean} homeAssistantDiscovery
 * @property {string} homeAssistantBaseTopic
 * @property {string} homeAssistantStatisticId
 * @property {string} homeAssistantLastTourId
 * @property {boolean} homeAssistantDatabaseImportHistoricalData
 * @property {string} homeAssistantDatabaseHost
 * @property {number} homeAssistantDatabasePort
 * @property {string} homeAssistantDatabaseUser
 * @property {string} homeAssistantDatabasePassword
 * @property {string} homeAssistantDatabaseName
 * @property {string} homeAssistantDatabaseCharset
 * @property {string} homeAssistantEntityTemplate
 * @property {boolean} [help]
 */


export const options = [
    {name: 'help', alias: 'h', type: Boolean, description: 'Shows this help'},
    {name: 'komootEmail', type: String, description: 'defines the email for komoot login. Env variable is K2M_KOMOOT_EMAIL.', defaultValue: process.env.K2M_KOMOOT_EMAIL},
    {name: 'komootPassword', type: String, description: 'defines the password for komoot login. Env variable is K2M_KOMOOT_PASSWORD.', defaultValue: process.env.K2M_KOMOOT_PASSWORD},
    {name: 'mqttHost', type: String, description: 'defines the host to the mqtt server. Env variable is K2M_MQTT_HOST.', defaultValue: process.env.K2M_MQTT_HOST},
    {name: 'mqttUser', type: String, description: 'defines the user for the mqtt server. Env variable is K2M_MQTT_USER.', defaultValue: process.env.K2M_MQTT_USER},
    {name: 'mqttPassword', type: String, description: 'defines the password for the mqtt server. Env variable is K2M_MQTT_PASSWORD.', defaultValue: process.env.K2M_MQTT_PASSWORD},
    {name: 'mqttKeepAlive', type: Number, description: 'defines the keep alive time for the mqtt server. Default is 60. Env variable is K2M_MQTT_KEEPALIVE.', defaultValue: process.env.K2M_MQTT_KEEPALIVE ?? 60},
    {name: 'mqttVersion', type: Number, description: 'defines the version for the mqtt server. Default is 4. Env variable is K2M_MQTT_VERSION.', defaultValue: process.env.K2M_MQTT_VERSION ?? 4},
    {name: 'mqttBaseTopic', type: String, description: 'defines the base topic for the mqtt server. Default is komoot2mqtt. Env variable is K2M_MQTT_BASE_TOPIC.', defaultValue: process.env.K2M_MQTT_BASE_TOPIC ?? 'komoot2mqtt'},
    {name: 'mqttRetain', type: Boolean, description: 'defines the published topics as retain. Default is true. Env variable is K2M_MQTT_RETAIN.', defaultValue: process.env.K2M_MQTT_RETAIN ?? true},
    {name: 'filterSport', type: String, description: 'Filter by type sport. E.g. touringbicycle. Env variable is K2M_FILTER_SPORT.', defaultValue: process.env.K2M_FILTER_SPORT ?? undefined},
    {name: 'filterAfterDate', type: String, description: 'Filter by date and ignore all before given date. E.g. 2021-08-13T15:20:20.000Z. Env variable is K2M_FILTER_AFTER_DATE.', defaultValue: process.env.K2M_FILTER_AFTER_DATE ?? undefined},
    {name: 'interval', type: Number, description: 'Interval for checking komoot. Env variable is K2M_INTERVAL.', defaultValue: process.env.K2M_INTERVAL ?? 10 * 60 * 1000},
    {name: 'publishAndStop', type: Boolean, description: 'Publish to mqtt and stop the app. Env variable is K2M_PUBLISH_AND_STOP.', defaultValue: process.env.K2M_PUBLISH_AND_STOP ?? false},
    {name: 'homeAssistantDiscovery', type: Boolean, description: 'Enable HomeAssistant discovery. Env variable is K2M_HOMEASSISTANT_DISCOVERY.', defaultValue: process.env.K2M_HOMEASSISTANT_DISCOVERY ?? true},
    {name: 'homeAssistantBaseTopic', type: String, description: 'HomeAssistant base topic in mqtt server. Env variable is K2M_HOMEASSISTANT_BASE_TOPIC.', defaultValue: process.env.K2M_HOMEASSISTANT_BASE_TOPIC ?? 'homeassistant'},
    {name: 'homeAssistantStatisticId', type: String, description: 'Unique sensor id for home assistant for the statistics. Env variable is K2M_HOMEASSISTANT_STATISTIC_ID.', defaultValue: process.env.K2M_HOMEASSISTANT_STATISTIC_ID ?? 'komoot-statistic'},
    {name: 'homeAssistantLastTourId', type: String, description: 'Unique sensor id for home assistant for the last tour. Env variable is K2M_HOMEASSISTANT_LAST_TOUR_ID.', defaultValue: process.env.K2M_HOMEASSISTANT_LAST_TOUR_ID ?? 'komoot-last-tour'},
    {name: 'homeAssistantDatabaseImportHistoricalData', type: Boolean, description: 'If you want to import historical data into your homeassistant, enable this option. I suggest, that the publishAndStop is enabled too. Only mysql/mariadb is supported. Env variable is K2M_HOMEASSISTANT_DATABASE_IMPORT_HISTORICAL_DATA.', defaultValue: process.env.K2M_HOMEASSISTANT_DATABASE_IMPORT_HISTORICAL_DATA ?? false},
    {name: 'homeAssistantDatabaseHost', type: String, description: 'The host of the homeassistant database. Env variable is K2M_HOMEASSISTANT_DATABASE_HOST.', defaultValue: process.env.K2M_HOMEASSISTANT_DATABASE_HOST ?? 'localhost'},
    {name: 'homeAssistantDatabasePort', type: Number, description: 'The port for the homeassistant database. Env variable is K2M_HOMEASSISTANT_DATABASE_PORT.', defaultValue: process.env.K2M_HOMEASSISTANT_DATABASE_PORT ?? 3306},
    {name: 'homeAssistantDatabaseUser', type: String, description: 'The user for the homeassistant database. Env variable is K2M_HOMEASSISTANT_DATABASE_USER.', defaultValue: process.env.K2M_HOMEASSISTANT_DATABASE_USER},
    {name: 'homeAssistantDatabasePassword', type: String, description: 'The password for the homeassistant database. Env variable is K2M_HOMEASSISTANT_DATABASE_PASSWORD.', defaultValue: process.env.K2M_HOMEASSISTANT_DATABASE_PASSWORD},
    {name: 'homeAssistantDatabaseName', type: String, description: 'The name of the schema for the homeassistant database. Env variable is K2M_HOMEASSISTANT_DATABASE_NAME.', defaultValue: process.env.K2M_HOMEASSISTANT_DATABASE_NAME ?? 'homeassistant'},
    {name: 'homeAssistantDatabaseCharset', type: String, description: 'The charset for the homeassistant database. Env variable is K2M_HOMEASSISTANT_DATABASE_CHARSET.', defaultValue: process.env.K2M_HOMEASSISTANT_DATABASE_CHARSET ?? 'utf8mb4'},
    {name: 'homeAssistantEntityTemplate', type: String, description: 'Defines the template for the entity name to search for. Env variable is K2M_HOMEASSISTANT_ENTITY_TEMPLATE.', defaultValue: process.env.K2M_HOMEASSISTANT_ENTITY_TEMPLATE ?? 'sensor.komoot2mqtt_{device}_{type}_{key}'},
];

/** @type {ConfigObject} */
const config = commandLineArgs(options);

config.mqttKeepAlive                             = Number(config.mqttKeepAlive);
config.mqttVersion                               = Number(config.mqttVersion);
config.mqttRetain                                = bool(config.mqttRetain);
config.interval                                  = Number(config.interval);
config.publishAndStop                            = bool(config.publishAndStop);
config.homeAssistantStatisticId                  = config.homeAssistantStatisticId.replaceAll('{sport}', config.filterSport ?? '');
config.homeAssistantLastTourId                   = config.homeAssistantLastTourId.replaceAll('{sport}', config.filterSport ?? '');
config.homeAssistantDiscovery                    = bool(config.homeAssistantDiscovery);
config.homeAssistantDatabaseImportHistoricalData = bool(config.homeAssistantDatabaseImportHistoricalData);
config.homeAssistantDatabasePort                 = Number(config.homeAssistantDatabasePort);

export default config;
