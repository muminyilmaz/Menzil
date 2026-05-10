import * as Location from 'expo-location';
import { ezanCal } from '@/context/Bildirimler';
import { TEMALAR, useTema } from '@/context/ThemeContext';
import { useDil } from '@/context/LangContext';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

const VAKITLER_SIRASI = [
  { key: 'Imsak', dilKey: 'imsak', ikon: '🌙' },
  { key: 'Sunrise', dilKey: 'gunes', ikon: '🌅' },
  { key: 'Dhuhr', dilKey: 'ogle', ikon: '☀️' },
  { key: 'Asr', dilKey: 'ikindi', ikon: '🌤️' },
  { key: 'Maghrib', dilKey: 'aksam', ikon: '🌇' },
  { key: 'Isha', dilKey: 'yatsi', ikon: '⭐' },
];

function siradakiVaktiGetir(vakitler) {
  const simdi = new Date();
  const simdiBudget = simdi.getHours() * 60 + simdi.getMinutes();
  let suankiVakit = 'Isha';
  for (const v of VAKITLER_SIRASI) {
    const [saat, dakika] = vakitler[v.key].split(':').map(Number);
    if (saat * 60 + dakika <= simdiBudget) {
      suankiVakit = v.key;
    }
  }
  return suankiVakit;
}

function sonrakiVaktiGetir(vakitler) {
  const simdi = new Date();
  const simdiBudget = simdi.getHours() * 60 + simdi.getMinutes();
  for (const v of VAKITLER_SIRASI) {
    const [saat, dakika] = vakitler[v.key].split(':').map(Number);
    if (saat * 60 + dakika > simdiBudget) return v.key;
  }
  return 'Imsak';
}

function saatiFormatla(tarih) {
  return tarih.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function tarihiFormatla(tarih, dil) {
  const locale = dil === 'ar' ? 'ar-SA' : dil === 'en' ? 'en-US' : 'tr-TR';
  return tarih.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' });
}

export default function HomeScreen() {
  const { tema, setTema, t } = useTema();
  const { dil, d } = useDil();
  const router = useRouter();
  const [vakitler, setVakitler] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState('');
  const [siradaki, setSiradaki] = useState('');
  const [sonraki, setSonraki] = useState('');
  const [suankiSaat, setSuankiSaat] = useState(new Date());
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    vakitleriGetir();
    const interval = setInterval(() => {
      setSuankiSaat(new Date());
      const simdi = new Date();
      const dakika = simdi.getMinutes();
      const saniye = simdi.getSeconds();
      if (saniye === 0 && vakitler) {
        const simdiBudget = simdi.getHours() * 60 + dakika;
        const VAKITLER_KONTROL = ['Imsak','Dhuhr','Asr','Maghrib','Isha'];
        for (const key of VAKITLER_KONTROL) {
          if (vakitler[key]) {
            const [s, d] = vakitler[key].split(':').map(Number);
            if (s * 60 + d === simdiBudget) {
              ezanCal();
              break;
            }
          }
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  async function vakitleriGetir() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') { setHata('Konum izni gerekli'); setYukleniyor(false); return; }
      const konum = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = konum.coords;
      const response = await fetch('https://api.aladhan.com/v1/timings?latitude=' + latitude + '&longitude=' + longitude + '&method=13');
      const data = await response.json();
      setVakitler(data.data.timings);
      const yeniSiradaki = siradakiVaktiGetir(data.data.timings);
      setSiradaki(yeniSiradaki);
      setSonraki(sonrakiVaktiGetir(data.data.timings));
      Animated.timing(fadeAnim, { toValue: 1, duration: 900, useNativeDriver: true }).start();
    } catch (e) {
      setHata(d.hata);
    } finally {
      setYukleniyor(false);
    }
  }

  if (yukleniyor) return (
    <View style={[styles.container, { backgroundColor: t.arka }]}>
      <ActivityIndicator size="large" color={t.baslik} />
      <Text style={[styles.yukleniyorText, { color: t.altBaslik }]}>{d.yukleniyor}</Text>
    </View>
  );

  if (hata) return (
    <View style={[styles.container, { backgroundColor: t.arka }]}>
      <Text style={[styles.hataText, { color: t.vakitAd }]}>{hata}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: t.arka }]}>
      <Animated.View style={[styles.icerik, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity onPress={() => router.push('/(tabs)/ayarlar')} style={styles.ayarlarButon}>
            <Text style={{ fontSize: 22 }}>⚙️</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.saatKutusu}>
          <Text style={[styles.buyukSaat, { color: t.baslik }]}>{saatiFormatla(suankiSaat)}</Text>
          <Text style={[styles.tarih, { color: t.altBaslik }]}>{tarihiFormatla(suankiSaat, dil)}</Text>
        </View>
        <Text style={[styles.baslik, { color: t.baslik }]}>🕌 {d.vakitler}</Text>
        <View style={styles.temaRow}>
          {Object.keys(TEMALAR).map((tk) => (
            <TouchableOpacity key={tk} onPress={() => setTema(tk as any)}
              style={[styles.temaButon, { backgroundColor: TEMALAR[tk].baslik }, tema === tk && { borderColor: '#ffffff', borderWidth: 2.5 }]} />
          ))}
        </View>
        <ScrollView style={styles.liste} showsVerticalScrollIndicator={false}>
          {VAKITLER_SIRASI.map((v) => {
            const aktif = v.key === siradaki;
            return (
              <View key={v.key} style={[styles.satir, { backgroundColor: t.kart }, aktif && { backgroundColor: t.aktifKart, borderWidth: 1, borderColor: t.aktifBorder }, v.key === sonraki && { borderWidth: 0 }]}>
                <View style={styles.solKisim}>
                  <Text style={styles.ikon}>{v.ikon}</Text>
                  <Text style={[styles.vakitAd, { color: aktif ? '#FFFFFF' : t.vakitAd }, aktif && { fontWeight: '600' }]}>{d[v.dilKey]}</Text>
                </View>
                <View style={styles.sagKisim}>
                  {v.key === sonraki && <Text style={[styles.siradakiBadge, { color: t.badge, backgroundColor: t.badgeArka }]}>{d.siradaki}</Text>}
                  <Text style={[styles.vakitSaat, { color: aktif ? t.aktifSaat : t.saat }, aktif && { fontSize: 20 }]}>{vakitler[v.key]}</Text>
                </View>
              </View>
            );
          })}
          <View style={{ height: 40 }} />
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', paddingBottom: 4 },
  ayarlarButon: { padding: 4 },
  icerik: { flex: 1, paddingTop: 56, paddingHorizontal: 22 },
  saatKutusu: { alignItems: 'center', marginBottom: 24 },
  buyukSaat: { fontSize: 44, fontWeight: '200', letterSpacing: 3 },
  tarih: { fontSize: 13, marginTop: 6, letterSpacing: 0.3 },
  baslik: { fontSize: 20, fontWeight: '600', textAlign: 'center', marginBottom: 18 },
  temaRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 22 },
  temaButon: { width: 44, height: 44, borderRadius: 22 },
  liste: { flex: 1 },
  satir: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 18, marginBottom: 8, borderRadius: 16, minHeight: 56 },
  solKisim: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  sagKisim: { alignItems: 'flex-end', gap: 2, minHeight: 44, justifyContent: 'center' },
  ikon: { fontSize: 20 },
  vakitAd: { fontSize: 16 },
  vakitSaat: { fontSize: 16, fontWeight: '600' },
  siradakiBadge: { fontSize: 10, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 20, overflow: 'hidden' },
  yukleniyorText: { marginTop: 12, fontSize: 14 },
  hataText: { fontSize: 16 },
});
