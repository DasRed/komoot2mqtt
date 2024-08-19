import config from './config.js';
import connect from './connect.js';
import help from './help.js';
import komoot from './komoot.js';
import logger from './logger.js';
import mysqlImport from './mysqlImport.js';
import publish from './publish.js';
import shutdown from './shutdown.js';

if (config.help) {
    help();
    process.exit(0);
}

logger.info('Starting komoot2mqtt');

const client = await connect();
logger.info('connection to mqtt server established');

// publish on init
const komootData = await komoot();
if (config.publishDisabled === false) {
    await publish(client, komootData);
    logger.info('first publish done');
}

// import historical data
if (config.homeAssistantDatabaseImportHistoricalData === true) {
    await mysqlImport(komootData);
    logger.info('historical data imported');
}

// don't to it continuously
if (config.intervalDisabled === true) {
    await client.endAsync();
    logger.info('Interval is disabled. Exiting');
    process.exit(0);
}

logger.info(`Running continuously with interval ${config.interval} ms. Next run at ${(new Date(Date.now() + config.interval)).toJSON()}.`);
// check every interval
const interval = setInterval(async () => {
    const data = await komoot();
    await publish(client, data);
    logger.info(`Data published. Next run at ${(new Date(Date.now() + config.interval)).toJSON()}.`);
}, config.interval);

process.on('SIGINT', (code) => shutdown(code, client, interval));
process.on('SIGTERM', (code) => shutdown(code, client, interval));