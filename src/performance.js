const profiles = {
  competitive: { id: 'competitive', label: 'Rekabetçi', description: 'Düşük gecikme ve yüksek FPS önceliği.', fps: 144, quality: 'low', launchArgs: ['-novid'] },
  balanced: { id: 'balanced', label: 'Dengeli', description: 'Görüntü kalitesi ve akıcılık arasında denge.', fps: 60, quality: 'medium', launchArgs: [] },
  quality: { id: 'quality', label: 'Yüksek kalite', description: 'Görüntü kalitesini ve efektleri önceliklendirir.', fps: 60, quality: 'high', launchArgs: [] }
};
function getPerformanceProfiles() { return Object.values(profiles); }
function recommendPerformance({ platform = process.platform, memoryGb = 0 } = {}) {
  const lowMemory = memoryGb > 0 && memoryGb < 8;
  return {
    platform,
    profile: lowMemory ? 'competitive' : 'balanced',
    tips: [
      'Oyuna başlamadan önce gereksiz arka plan uygulamalarını kapatın.',
      platform === 'win32' ? 'Windows Güç Modu’nu performans olarak seçin.' : 'Masaüstü güç profilini performans ihtiyacına göre seçin.',
      'FPS sınırını monitör yenileme hızına göre ayarlayın.',
      'Sıcaklık ve fan değerlerini izleyin; aşırı ısınmada kaliteyi düşürün.'
    ]
  };
}
module.exports = { getPerformanceProfiles, recommendPerformance };
