# komoot2mqtt
This little app extract your made tours from komoot based on your filters and publish major information into mqtt.

## Synopsis
`$ npm start -- <options>`

## Options
| Switch                                    | Data Type | Env Variable                                      |          | Default                                  | Example                             | Description                                                                                                                                                            |
|:------------------------------------------|-----------|---------------------------------------------------|----------|------------------------------------------|-------------------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| help (-h)                                 | boolean   |                                                   | optional |                                          |                                     | Shows this help                                                                                                                                                        | 
| komootEmail                               | string    | K2M_KOMOOT_EMAIL                                  | required |                                          | nuff@narf.lol                       | defines the email for komoot login.                                                                                                                                    |                                
| komootPassword                            | string    | K2M_KOMOOT_PASSWORD                               | required |                                          | nuffNuffNarf                        | defines the password for komoot login.                                                                                                                                 |                           
| mqttHost                                  | string    | K2M_MQTT_HOST                                     | required |                                          | mqtt://test.mosquitto.org           | defines the host to the mqtt server.                                                                                                                                   |                           
| mqttUser                                  | string    | K2M_MQTT_USER                                     | required |                                          | roflcopter                          | defines the user for the mqtt server.                                                                                                                                  |                           
| mqttPassword                              | string    | K2M_MQTT_PASSWORD                                 | required |                                          | lolololololol                       | defines the password for the mqtt server.                                                                                                                              |                           
| mqttKeepAlive                             | number    | K2M_MQTT_KEEPALIVE                                | optional | 60                                       | 42                                  | defines the keep alive time for the mqtt server.                                                                                                                       |                           
| mqttVersion                               | number    | K2M_MQTT_VERSION                                  | optional | 4                                        | 3                                   | defines the version for the mqtt server.                                                                                                                               |                           
| mqttBaseTopic                             | string    | K2M_MQTT_BASE_TOPIC                               | optional | komoot2mqtt                              | komoot2mqtt                         | defines the base topic for the mqtt server.                                                                                                                            |                           
| mqttRetain                                | boolean   | K2M_MQTT_RETAIN                                   | optional | true                                     | false                               | defines the published topics as retain.                                                                                                                                |                           
| filterSport                               | string    | K2M_FILTER_SPORT                                  | optional |                                          | touringbicycle                      | Filter by type sport.                                                                                                                                                  | 
| filterAfterDate                           | string    | K2M_FILTER_AFTER_DATE                             | optional |                                          | 2021-08-13T15:20:20.000Z            | Filter by date and ignore all before given date.                                                                                                                       |                              
| interval                                  | number    | K2M_INTERVAL                                      | optional | 600000                                   | 150                                 | Interval for checking komoot in milliseconds.                                                                                                                          |                              
| publishAndStop                            | boolean   | K2M_PUBLISH_AND_STOP                              | optional | false                                    | true                                | Publish to mqtt and stop the app.                                                                                                                                      |                              
| homeAssistantDiscovery                    | boolean   | K2M_HOMEASSISTANT_DISCOVERY                       | optional | true                                     | false                               | Enable HomeAssistant discovery.                                                                                                                                        |                              
| homeAssistantBaseTopic                    | string    | K2M_HOMEASSISTANT_BASE_TOPIC                      | optional | homeassistant                            | home                                | HomeAssistant base topic in mqtt server.                                                                                                                               |                              
| homeAssistantStatisticId                  | string    | K2M_HOMEASSISTANT_STATISTIC_ID                    | optional | komoot-statistic                         | komoot-statistic-{sport}            | Unique sensor id for home assistant for the statistics. variables are possible like {sport}                                                                            |                              
| homeAssistantLastTourId                   | string    | K2M_HOMEASSISTANT_LAST_TOUR_ID                    | optional | komoot-last-tour                         | komoot-last-tour-{sport}            | Unique sensor id for home assistant for the last tour. variables are possible like {sport}                                                                             |                              
| homeAssistantDatabaseImportHistoricalData | string    | K2M_HOMEASSISTANT_DATABASE_IMPORT_HISTORICAL_DATA | optional | false                                    | true                                | If you want to import historical data into your homeassistant, enable this option. I suggest, that the publishAndStop is enabled too. Only mysql/mariadb is supported. |                              
| homeAssistantDatabaseHost                 | string    | K2M_HOMEASSISTANT_DATABASE_HOST                   | optional | localhost                                | mariadb.test.local                  | The host of the homeassistant database.                                                                                                                                |                              
| homeAssistantDatabasePort                 | number    | K2M_HOMEASSISTANT_DATABASE_PORT                   | optional | 3306                                     | 6603                                | The port for the homeassistant database.                                                                                                                               |                              
| homeAssistantDatabaseUser                 | string    | K2M_HOMEASSISTANT_DATABASE_USER                   | optional |                                          | nuff                                | The user for the homeassistant database.                                                                                                                               |                              
| homeAssistantDatabasePassword             | string    | K2M_HOMEASSISTANT_DATABASE_PASSWORD               | optional |                                          | nuffNuffNarf                        | The password for the homeassistant database.                                                                                                                           |                              
| homeAssistantDatabaseName                 | string    | K2M_HOMEASSISTANT_DATABASE_NAME                   | optional | homeassistant                            | homeassistant-test                  | The name of the schema for the homeassistant database.                                                                                                                 |                              
| homeAssistantDatabaseCharset              | string    | K2M_HOMEASSISTANT_DATABASE_CHARSET                | optional | utf8mb4                                  | utf8_general_ci                     | The charset for the homeassistant database.                                                                                                                            |                              
| homeAssistantEntityTemplate               | string    | K2M_HOMEASSISTANT_ENTITY_TEMPLATE                 | optional | sensor.komoot2mqtt_{device}_{type}_{key} | sensor.komoot_{device}_{type}_{key} | Defines the template for the entity name to search for.                                                                                                                |                              

## .env file is supported
Here is an example
```dotenv
K2M_KOMOOT_EMAIL=nuff@narf.lol
K2M_KOMOOT_PASSWORD=nufNuffNarf
K2M_MQTT_HOST=mqtt://test.mosquitto.org
K2M_MQTT_USER=roflcopter
K2M_MQTT_PASSWORD=lolololololol
K2M_MQTT_BASE_TOPIC=komoot2mqtt
```

