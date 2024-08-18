import mysql from 'mysql2/promise';
import config from './config.js';
import logger from './logger.js';

async function mysqlConnection() {
    try {
        const connection = await mysql.createConnection({
            host:     config.homeAssistantDatabaseHost,
            port:     config.homeAssistantDatabasePort,
            user:     config.homeAssistantDatabaseUser,
            password: config.homeAssistantDatabasePassword,
            database: config.homeAssistantDatabaseName,
            charset:  config.homeAssistantDatabaseCharset,
        });

        await connection.connect();

        return connection;
    }
    catch (error) {
        logger.error(error);
        process.exit(1);
    }
}

export default async function mysqlImport({statsHistory, tours}) {
    const connection = await mysqlConnection();
    try {

        await Promise.all(statsHistory.map(async (stats) => {
            let createdDate = new Date(stats.date.toJSON());
            let startDate   = new Date(createdDate.toJSON());
            delete stats.date;

            startDate.setMinutes(0);
            startDate.setSeconds(0);
            startDate.setMilliseconds(0);

            createdDate = createdDate.getTime() / 1000;
            startDate   = Math.floor(startDate.getTime() / 1000);

            await store(connection, stats.speed, 'stats', `speed`, createdDate, startDate);
            await store(connection, stats.distance, 'stats', `distance`, createdDate, startDate);
            await store(connection, stats.duration, 'stats', `duration`, createdDate, startDate);
            await store(connection, stats.elevation.up, 'stats', `elevation_up`, createdDate, startDate);
            await store(connection, stats.elevation.down, 'stats', `elevation_down`, createdDate, startDate);
            await store(connection, stats.elevation.delta, 'stats', `elevation_delta`, createdDate, startDate);
        }));

        await Promise.all(tours.map(async (tour) => {
            let createdDate = new Date(tour.date);
            let startDate   = new Date(tour.date);

            startDate.setMinutes(0);
            startDate.setSeconds(0);
            startDate.setMilliseconds(0);

            createdDate = createdDate.getTime() / 1000;
            startDate   = Math.floor(startDate.getTime() / 1000);

            await store(connection, {
                distance:            tour.distance,
                duration_in_motion:  tour.duration.inMotion,
                duration_with_stops: tour.duration.total,
                speed_in_motion:     tour.speed.inMotion,
                speed_with_stops:    tour.speed.total,
                elevation_delta:     tour.elevation.total,
                elevation_up:        tour.elevation.up,
                elevation_down:      tour.elevation.down,
            }, 'last_tour', '', createdDate, startDate);
        }));
    }
    catch (error) {
        logger.error(error);
        process.exit(1);
    }
}

/**
 *
 * @param {Connection} connection
 * @param {Object} object
 * @param {string} device
 * @param {string} type
 * @param createdDate
 * @param startDate
 * @returns {Promise<void>}
 */
async function store(connection, object, device, type, createdDate, startDate) {
    await Promise.all(Object.entries(object).map(async ([key, value]) => {
        // find the entity database id
        const entityId  = config.homeAssistantEntityTemplate.replaceAll('{device}', device).replaceAll('{type}', type).replaceAll('{key}', key).replaceAll('__', '_');
        const [results] = await connection.query('SELECT id FROM statistics_meta WHERE statistic_id = ? LIMIT 1', [entityId]);

        if (results.length === 0) {
            throw new Error(`Can't find the database id for entity id ${entityId}`);
        }

        await connection.query(`
            INSERT INTO statistics 
            SET created_ts = ?,
                metadata_id = ?,
                start_ts = ?,
                mean = ?,
                min = ?,
                max = ?
        `, [
            createdDate,
            results.shift().id,
            startDate,
            value,
            value,
            value
        ]);
        logger.info(`Imported ${createdDate} ${entityId} with ${value}`);
    }));
}

