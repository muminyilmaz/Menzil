import { useTema } from '@/context/ThemeContext';
import { useDil } from '@/context/LangContext';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Audio } from 'expo-av';

const DUALAR = {
  tr: [
    { baslik: 'Sabah Duası', arapca: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ', metin: 'Allahumme bike asbahnâ ve bike emseynâ, ve bike nahyâ ve bike nemûtu ve ileyken-nuşûr.', ses: require('../../assets/dua/sabah.mp3') },
    { baslik: 'Yemek Duası', arapca: 'بِسْمِ اللهِ وَعَلَى بَرَكَةِ اللهِ', metin: 'Bismillahi ve alâ bereketiilah.', ses: require('../../assets/dua/yemek.mp3') },
    { baslik: 'Uyumadan Önce', arapca: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', metin: 'Bismike Allahumme emûtu ve ahyâ.', ses: require('../../assets/dua/uyku.mp3') },
    { baslik: 'Eve Girerken', arapca: 'بِسْمِ اللهِ وَلَجْنَا وَبِسْمِ اللهِ خَرَجْنَا وَعَلَى اللهِ رَبِّنَا تَوَكَّلْنَا', metin: 'Bismillahi velechnâ ve bismillahi haracnâ ve alallahi rabbinâ tevekkelnâ.', ses: require('../../assets/dua/ev.mp3') },
    { baslik: 'Seyahate Cikarken', arapca: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ', metin: 'Sübhanellezi sehhara lenâ hâzâ, ve mâ künnâ lehu mukrinîn, ve innâ ilâ rabbinâ lemunkàlibûn.', ses: require('../../assets/dua/seyahat.mp3') },
    { baslik: 'Günaydın Duası', arapca: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ', metin: 'Asbahnâ ve asbahal mülkü lillâh, velhamdü lillâh, lâ ilâhe illallahu vahdehu lâ şerîke leh.', ses: require('../../assets/dua/gunaydin.mp3') },
    { baslik: 'Sıkıntı Anında', arapca: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ نِعْمَ الْمَوْلَى وَنِعْمَ النَّصِيرُ', metin: 'Hasbünallahü ve nimal vekîl, nimal mevlâ ve niman nasîr.', ses: require('../../assets/dua/sikinti.mp3') },
  ],
  en: [
    { baslik: 'Morning Prayer', arapca: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ', metin: 'O Allah, by You we enter the morning, by You we enter the evening, by You we live, by You we die, and to You is the resurrection.', ses: require('../../assets/dua/sabah.mp3') },
    { baslik: 'Meal Prayer', arapca: 'بِسْمِ اللهِ وَعَلَى بَرَكَةِ اللهِ', metin: 'In the name of Allah and with the blessings of Allah.', ses: require('../../assets/dua/yemek.mp3') },
    { baslik: 'Before Sleep', arapca: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', metin: 'In Your name O Allah, I live and I die.', ses: require('../../assets/dua/uyku.mp3') },
    { baslik: 'Entering Home', arapca: 'بِسْمِ اللهِ وَلَجْنَا وَبِسْمِ اللهِ خَرَجْنَا وَعَلَى اللهِ رَبِّنَا تَوَكَّلْنَا', metin: 'In the name of Allah we enter, in the name of Allah we leave, and upon Allah our Lord we place our trust.', ses: require('../../assets/dua/ev.mp3') },
    { baslik: 'Before Travel', arapca: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ', metin: 'Glory be to Him who has subjected this to us, and we could not have done it ourselves. And indeed, to our Lord we will surely return.', ses: require('../../assets/dua/seyahat.mp3') },
    { baslik: 'Good Morning Prayer', arapca: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ', metin: 'We have entered the morning and the whole kingdom belongs to Allah. Praise be to Allah. There is no god but Allah alone, without partner.', ses: require('../../assets/dua/gunaydin.mp3') },
    { baslik: 'In Hardship', arapca: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ نِعْمَ الْمَوْلَى وَنِعْمَ النَّصِيرُ', metin: 'Allah is sufficient for us, and He is the best disposer of affairs. What an excellent Master, and what an excellent Helper.', ses: require('../../assets/dua/sikinti.mp3') },
  ],
  ar: [
    { baslik: 'دعاء الصباح', arapca: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ', metin: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ', ses: require('../../assets/dua/sabah.mp3') },
    { baslik: 'دعاء الطعام', arapca: 'بِسْمِ اللهِ وَعَلَى بَرَكَةِ اللهِ', metin: 'بِسْمِ اللهِ وَعَلَى بَرَكَةِ اللهِ', ses: require('../../assets/dua/yemek.mp3') },
    { baslik: 'قبل النوم', arapca: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', metin: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', ses: require('../../assets/dua/uyku.mp3') },
    { baslik: 'دخول المنزل', arapca: 'بِسْمِ اللهِ وَلَجْنَا وَبِسْمِ اللهِ خَرَجْنَا وَعَلَى اللهِ رَبِّنَا تَوَكَّلْنَا', metin: 'بِسْمِ اللهِ وَلَجْنَا وَبِسْمِ اللهِ خَرَجْنَا وَعَلَى اللهِ رَبِّنَا تَوَكَّلْنَا', ses: require('../../assets/dua/ev.mp3') },
    { baslik: 'دعاء السفر', arapca: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ', metin: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ', ses: require('../../assets/dua/seyahat.mp3') },
    { baslik: 'دعاء الصباح', arapca: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ', metin: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ', ses: require('../../assets/dua/gunaydin.mp3') },
    { baslik: 'عند الشدة', arapca: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ نِعْمَ الْمَوْلَى وَنِعْمَ النَّصِيرُ', metin: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ نِعْمَ الْمَوْلَى وَنِعْمَ النَّصِيرُ', ses: require('../../assets/dua/sikinti.mp3') },
  ],
};

export default function DualarScreen() {
  const { t } = useTema();
  const { dil, d } = useDil();
  const [okunan, setOkunan] = useState(null);
  const [sound, setSound] = useState(null);
  const dualar = DUALAR[dil] || DUALAR.tr;

  async function oku(dua, index) {
    if (okunan === index) {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      }
      setOkunan(null);
      return;
    }
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
    setOkunan(index);
    const { sound: newSound } = await Audio.Sound.createAsync(dua.ses);
    setSound(newSound);
    await newSound.playAsync();
    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        setOkunan(null);
        setSound(null);
      }
    });
  }

  return (
    <View style={[styles.container, { backgroundColor: t.arka }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.liste}>
        <Text style={[styles.baslik, { color: t.baslik }]}>{d.dualar}</Text>
        {dualar.map((dua, index) => (
          <View key={index} style={[styles.kart, { backgroundColor: t.kart }]}>
            <View style={styles.kartUst}>
              <Text style={[styles.duaBaslik, { color: t.baslik }]}>{dua.baslik}</Text>
              <TouchableOpacity onPress={() => oku(dua, index)}
                style={[styles.playButon, { backgroundColor: okunan === index ? t.baslik : t.aktifKart, borderColor: t.baslik }]}>
                <Text style={[styles.playIkon, { color: okunan === index ? '#fff' : t.baslik }]}>
                  {okunan === index ? '⏸' : '▶'}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.arapca, { color: t.aktifSaat }]}>{dua.arapca}</Text>
            <View style={[styles.cizgi, { backgroundColor: t.aktifBorder }]} />
            <Text style={[styles.turkce, { color: t.vakitAd }]}>{dua.metin}</Text>
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  liste: { paddingHorizontal: 22 },
  baslik: { fontSize: 22, fontWeight: '600', textAlign: 'center', marginTop: 64, marginBottom: 24 },
  kart: { borderRadius: 16, padding: 20, marginBottom: 12 },
  kartUst: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  duaBaslik: { fontSize: 15, fontWeight: '600', flex: 1 },
  playButon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  playIkon: { fontSize: 14, fontWeight: '700' },
  arapca: { fontSize: 20, textAlign: 'right', lineHeight: 36, marginBottom: 12 },
  cizgi: { height: 0.5, marginBottom: 12 },
  turkce: { fontSize: 14, lineHeight: 22 },
});