import Client from '@dasred/komoot-client';
import config from './config.js';

const client = new Client({
    email:    config.komootEmail,
    password: config.komootPassword,
});

export default async function komoot() {
    const tours = await client.toursMade({sportTypes: config.filterSport, startDate: config.filterAfterDate});

    let speedTotal = 0;
    return tours.reduce((acc, tour, index) => {
        speedTotal += tour.speed.inMotion;

        acc.stats.speed.min = Math.min(acc.stats.speed.min ?? tour.speed.inMotion, tour.speed.inMotion);
        acc.stats.speed.avg = speedTotal / (index + 1);
        acc.stats.speed.max = Math.max(acc.stats.speed.max ?? tour.speed.inMotion, tour.speed.inMotion);

        acc.stats.distance.total += tour.distance;
        acc.stats.distance.min = Math.min(acc.stats.distance.min ?? tour.distance, tour.distance);
        acc.stats.distance.avg = acc.stats.distance.total / (index + 1);
        acc.stats.distance.max = Math.max(acc.stats.distance.max ?? tour.distance, tour.distance);

        acc.stats.duration.total += tour.duration.inMotion;
        acc.stats.duration.min = Math.min(acc.stats.duration.min ?? tour.duration.inMotion, tour.duration.inMotion);
        acc.stats.duration.avg = acc.stats.duration.total / (index + 1);
        acc.stats.duration.max = Math.max(acc.stats.duration.max ?? tour.duration.inMotion, tour.duration.inMotion);

        acc.stats.elevation.up.total += tour.elevation.up;
        acc.stats.elevation.up.min = Math.min(acc.stats.elevation.up.min ?? tour.elevation.up, tour.elevation.up);
        acc.stats.elevation.up.avg = acc.stats.elevation.up.total / (index + 1);
        acc.stats.elevation.up.max = Math.max(acc.stats.elevation.up.max ?? tour.elevation.up, tour.elevation.up);

        acc.stats.elevation.down.total += tour.elevation.down;
        acc.stats.elevation.down.min = Math.min(acc.stats.elevation.down.min ?? tour.elevation.down, tour.elevation.down);
        acc.stats.elevation.down.avg = acc.stats.elevation.down.total / (index + 1);
        acc.stats.elevation.down.max = Math.max(acc.stats.elevation.down.max ?? tour.elevation.down, tour.elevation.down);

        acc.stats.elevation.delta.total += tour.elevation.total;
        acc.stats.elevation.delta.min = Math.min(acc.stats.elevation.delta.min ?? tour.elevation.total, tour.elevation.total);
        acc.stats.elevation.delta.avg = acc.stats.elevation.delta.total / (index + 1);
        acc.stats.elevation.delta.max = Math.max(acc.stats.elevation.delta.max ?? tour.elevation.total, tour.elevation.total);

        acc.lastTour = tour.toJSON();
        acc.tours.push(tour.toJSON());

        acc.statsHistory.push(structuredClone(acc.stats));
        acc.statsHistory[acc.statsHistory.length - 1].date = new Date(tour.date.toJSON());

        return acc;
    }, {
        stats:        {
            speed:     {min: undefined, avg: undefined, max: undefined},
            distance:  {min: undefined, avg: undefined, max: undefined, total: 0},
            duration:  {min: undefined, avg: undefined, max: undefined, total: 0},
            elevation: {
                up:    {min: undefined, avg: undefined, max: undefined, total: 0},
                down:  {min: undefined, avg: undefined, max: undefined, total: 0},
                delta: {min: undefined, avg: undefined, max: undefined, total: 0},
            },
        },
        lastTour:     undefined,
        tours:        [],
        statsHistory: []
    });
}