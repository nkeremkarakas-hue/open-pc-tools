const assert = require('assert');
const { normalizeGame, summarizeGames } = require('../src/steam-stats');
const fixture = [{ appid: 10, name: 'Counter-Example', playtime_forever: 125 }, { appid: 20, name: 'Builder', playtime_forever: 60 }];
const game = normalizeGame(fixture[0], [{ achieved: 1 }, { achieved: 0 }, { achieved: 1 }]);
assert.deepStrictEqual(game.achievements, { earned: 2, total: 3 });
assert.strictEqual(game.hours, 2.1);
assert.deepStrictEqual(summarizeGames(fixture), { totalGames: 2, totalHours: 3.1 });
console.log('steam stats tests passed');
