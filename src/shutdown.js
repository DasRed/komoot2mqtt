import logger from './logger.js';

export default async function shutdown(code, client, interval) {
    logger.info(`Exit with ${code} dectected. Shutting down...`);

    if (interval) {
        clearInterval(interval);
    }

    if (client && client.connected) {
        await client.endAsync();
    }
}