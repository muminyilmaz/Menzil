import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const VAKIT_ADLARI = {
  Imsak: 'Imsak',
  Sunrise: 'Gunes',
  Dhuhr: 'Ogle',
  Asr: 'Ikindi',
  Maghrib: 'Aksam',
  Isha: 'Yatsi',
};

export async function bildirimIzniAl() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function namazBildirimleriniKur(vakitler) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  const simdi = new Date();
  for (const [key, ad] of Object.entries(VAKIT_ADLARI)) {
    const vakit = vakitler[key];
    if (!vakit) continue;
    const [saat, dakika] = vakit.split(':').map(Number);
    const vakitZamani = new Date();
    vakitZamani.setHours(saat, dakika, 0, 0);
    if (vakitZamani <= simdi) continue;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🕌 ' + ad + ' Vakti',
        body: ad + ' vakti girdi. Hayirli namazlar.',
        sound: true,
      },
      trigger: {
        hour: saat,
        minute: dakika,
        repeats: true,
      },
    });
  }
}
