import { useTema } from '@/context/ThemeContext';
import { useDil } from '@/context/LangContext';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Vibration } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';

const ZIKIR_LISTESI = {
  tr: [
    { isim: 'Sübhanallah', arapca: 'سُبْحَانَ اللهِ', hedef: 33, ses: require('../../assets/zikir/subhanallah.mp3') },
    { isim: 'Elhamdülillah', arapca: 'الحَمْدُ للهِ', hedef: 33, ses: require('../../assets/zikir/elhamdulillah.mp3') },
    { isim: 'Allahü Ekber', arapca: 'اللهُ أَكْبَرُ', hedef: 33, ses: require('../../assets/zikir/allahuekber.mp3') },
    { isim: 'La ilahe illallah', arapca: 'لَا إِلَهَ إِلَّا اللهُ', hedef: 33, ses: require('../../assets/zikir/lailahe.mp3') },
    { isim: 'Estağfirullah', arapca: 'أَسْتَغْفِرُ اللهَ', hedef: 33, ses: require('../../assets/zikir/estagfirullah.mp3') },
    { isim: 'Salavat', arapca: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّد', hedef: 33, ses: require('../../assets/zikir/salavat.mp3') },
  ],
  en: [
    { isim: 'Subhanallah', arapca: 'سُبْحَانَ اللهِ', hedef: 33, ses: require('../../assets/zikir/subhanallah.mp3') },
    { isim: 'Alhamdulillah', arapca: 'الحَمْدُ للهِ', hedef: 33, ses: require('../../assets/zikir/elhamdulillah.mp3') },
    { isim: 'Allahu Akbar', arapca: 'اللهُ أَكْبَرُ', hedef: 33, ses: require('../../assets/zikir/allahuekber.mp3') },
    { isim: 'La ilaha illallah', arapca: 'لَا إِلَهَ إِلَّا اللهُ', hedef: 33, ses: require('../../assets/zikir/lailahe.mp3') },
    { isim: 'Astaghfirullah', arapca: 'أَسْتَغْفِرُ اللهَ', hedef: 33, ses: require('../../assets/zikir/estagfirullah.mp3') },
    { isim: 'Salawat', arapca: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّد', hedef: 33, ses: require('../../assets/zikir/salavat.mp3') },
  ],
  ar: [
    { isim: 'سبحان الله', arapca: 'سُبْحَانَ اللهِ', hedef: 33, ses: require('../../assets/zikir/subhanallah.mp3') },
    { isim: 'الحمد لله', arapca: 'الحَمْدُ للهِ', hedef: 33, ses: require('../../assets/zikir/elhamdulillah.mp3') },
    { isim: 'الله أكبر', arapca: 'اللهُ أَكْبَرُ', hedef: 33, ses: require('../../assets/zikir/allahuekber.mp3') },
    { isim: 'لا إله إلا الله', arapca: 'لَا إِلَهَ إِلَّا اللهُ', hedef: 33, ses: require('../../assets/zikir/lailahe.mp3') },
    { isim: 'أستغفر الله', arapca: 'أَسْتَغْفِرُ اللهَ', hedef: 33, ses: require('../../assets/zikir/estagfirullah.mp3') },
    { isim: 'الصلاة على النبي', arapca: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّد', hedef: 33, ses: require('../../assets/zikir/salavat.mp3') },
  ],
};

export default function ZikirScreen() {
  const { t } = useTema();
  const { dil } = useDil();
  const [secilen, setSecilen] = useState(0);
  const [sayac, setSayac] = useState(0);
  const [sound, setSound] = useState(null);
  const [sesAcik, setSesAcik] = useState(true);
  const liste = ZIKIR_LISTESI[dil] || ZIKIR_LISTESI.tr;
  const zikir = liste[secilen];
  const tamamlandi = sayac >= zikir.hedef;
  const yuzde = Math.min((sayac / zikir.hedef) * 100, 100);

  async function sesCal(ses) {
    if (!sesAcik) return;
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
    const { sound: newSound } = await Audio.Sound.createAsync(ses);
    setSound(newSound);
    await newSound.playAsync();
    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        newSound.unloadAsync();
        setSound(null);
      }
    });
  }

  async function zikirSec(index) {
    setSecilen(index);
    setSayac(0);
    await sesCal(liste[index].ses);
  }

  function say() {
    if (tamamlandi) return;
    Vibration.vibrate(30);
    setSayac(s => s + 1);
  }

  function sifirla() {
    setSayac(0);
  }

  return (
    <LinearGradient
      colors={[t.arka, t.aktifKart, t.arka]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={[styles.baslik, { color: t.baslik }]}>📿 {dil === 'ar' ? 'التسبيح' : dil === 'en' ? 'Dhikr Counter' : 'Zikir Sayar'}</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.seciciRow} contentContainerStyle={{ gap: 8, paddingHorizontal: 22 }}>
        {liste.map((z, i) => (
          <TouchableOpacity key={i} onPress={() => zikirSec(i)}
            style={[styles.seciciButon, { backgroundColor: secilen === i ? t.baslik : t.kart }]}>
            <Text style={[styles.seciciYazi, { color: secilen === i ? '#fff' : t.vakitAd }]}>{z.isim}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={[styles.zikirKart, { backgroundColor: t.kart }]}>
        <Text style={[styles.arapca, { color: t.baslik }]}>{zikir.arapca}</Text>
        <Text style={[styles.zikirIsim, { color: t.vakitAd }]}>{zikir.isim}</Text>
      </View>

      <View style={styles.sayacAlani}>
        <View style={[styles.halka, { borderColor: t.aktifBorder }]}>
          <TouchableOpacity onPress={say} style={[styles.sayacButon, { backgroundColor: tamamlandi ? t.baslik : t.kart }]}>
            <Text style={[styles.sayacNo, { color: tamamlandi ? '#fff' : t.baslik }]}>{sayac}</Text>
            <Text style={[styles.hedefYazi, { color: tamamlandi ? '#ffffff99' : t.altBaslik }]}>/ {zikir.hedef}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {tamamlandi && (
        <Text style={[styles.tebrik, { color: t.baslik }]}>
          {dil === 'ar' ? 'تبارك الله' : dil === 'en' ? 'Mashallah! Completed!' : 'Tamamlandı! MaşaAllah!'}
        </Text>
      )}

      <TouchableOpacity onPress={sifirla} style={[styles.sifirlaButon, { backgroundColor: t.kart }]}>
        <Text style={[styles.sifirlaYazi, { color: t.altBaslik }]}>
          {dil === 'ar' ? 'إعادة' : dil === 'en' ? 'Reset' : 'Sıfırla'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setSesAcik(s => !s)} style={[styles.sifirlaButon, { backgroundColor: t.kart, marginTop: 0 }]}>
        <Text style={[styles.sifirlaYazi, { color: sesAcik ? t.baslik : t.altBaslik }]}>
          {sesAcik ? (dil === 'ar' ? 'الصوت: مفعل' : dil === 'en' ? 'Sound: On' : '🔊 Ses: Açık') : (dil === 'ar' ? 'الصوت: مغلق' : dil === 'en' ? 'Sound: Off' : '🔇 Ses: Kapalı')}
        </Text>
      </TouchableOpacity>
      <Text style={[styles.ipucu, { color: t.altBaslik }]}>
        {dil === 'ar' ? 'اضغط الدائرة للعد' : dil === 'en' ? 'Tap the circle to count' : 'Saymak için daireye dokun'}
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },
  baslik: { fontSize: 22, fontWeight: '700', marginTop: 64, marginBottom: 16 },
  seciciRow: { maxHeight: 50, marginBottom: 16 },
  seciciButon: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  seciciYazi: { fontSize: 13, fontWeight: '500' },
  zikirKart: { borderRadius: 16, padding: 20, alignItems: 'center', marginHorizontal: 22, marginBottom: 24, width: '90%' },
  arapca: { fontSize: 26, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  zikirIsim: { fontSize: 14, textAlign: 'center' },
  sayacAlani: { alignItems: 'center', justifyContent: 'center', marginBottom: 16, marginTop: 10 },
  halka: { width: 200, height: 200, borderRadius: 100, borderWidth: 6, alignItems: 'center', justifyContent: 'center' },
  sayacButon: { width: 160, height: 160, borderRadius: 80, alignItems: 'center', justifyContent: 'center' },
  sayacNo: { fontSize: 56, fontWeight: '200' },
  hedefYazi: { fontSize: 14 },
  tebrik: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  sifirlaButon: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20, marginBottom: 12 },
  sifirlaYazi: { fontSize: 14 },
  ipucu: { fontSize: 12 },
});