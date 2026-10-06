function normalizeGame(game, achievements = []) {
  const list = Array.isArray(achievements) ? achievements : [];
  return {
    appid: Number(game.appid),
    name: String(game.name || 'Unknown'),
    hours: Math.round((Number(game.playtime_forever || 0) / 60) * 10) / 10,
    achievements: {
      earned: list.filter(item => Number(item.achieved) === 1).length,
      total: list.length
    }
  };
}
function summarizeGames(games) {
  const sorted = (Array.isArray(games) ? games : []).slice().sort((a, b) => Number(b.playtime_forever || 0) - Number(a.playtime_forever || 0));
  return { totalGames: sorted.length, totalHours: Math.round(sorted.reduce((sum, game) => sum + Number(game.playtime_forever || 0) / 60, 0) * 10) / 10 };
}
module.exports = { normalizeGame, summarizeGames };
