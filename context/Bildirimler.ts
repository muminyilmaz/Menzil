import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function bildirimIzniAl() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function namazBildirimleriniKur(vakitler) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  const simdi = new Date();

  const VAKITLER = {
    Imsak: 'İmsak',
    Dhuhr: 'Öğle',
    Asr: 'İkindi',
    Maghrib: 'Akşam',
    Isha: 'Yatsı',
  };

  for (const [key, ad] of Object.entries(VAKITLER)) {
    const vakit = vakitler[key];
    if (!vakit) continue;
    const [saat, dakika] = vakit.split(':').map(Number);
    const vakitZamani = new Date();
    vakitZamani.setHours(saat, dakika, 0, 0);
    if (vakitZamani <= simdi) continue;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🕌 ' + ad + ' Vakti',
        body: ad + ' vakti girdi. Hayırlı namazlar.',
        sound: false,
      },
      trigger: {
        hour: saat,
        minute: dakika,
        repeats: true,
      },
    });
  }
}

export async function ezanCal() {
  try {
    const ezanAcik = await AsyncStorage.getItem('ezanSesi');
    if (ezanAcik === 'false') return;
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/ezan.mp3')
    );
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) sound.unloadAsync();
    });
  } catch (e) {
    console.log('Ezan sesi hatasi:', e);
  }
}