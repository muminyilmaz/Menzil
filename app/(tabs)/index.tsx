import * as Location from 'expo-location';
import { bildirimIzniAl, namazBildirimleriniKur } from '@/context/Bildirimler';
import { TEMALAR, useTema } from '@/context/ThemeContext';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const VAKITLER_SIRASI = [
  { key: 'Imsak', ad: 'Imsak', ikon: '🌙' },
  { key: 'Sunrise', ad: 'Gunes', ikon: '🌅' },
  { key: 'Dhuhr', ad: 'Ogle', ikon: '☀️' },
  { key: 'Asr', ad: 'Ikindi', ikon: '🌤️' },
  { key: 'Maghrib', ad: 'Aksam', ikon: '🌇' },
  { key: 'Isha', ad: 'Yatsi', ikon: '⭐' },
];

function siradakiVaktiGetir(vakitler) {
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

function tarihiFormatla(tarih) {
  return tarih.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' });
}

export default function HomeScreen() {
  const { tema, setTema, t } = useTema();
  const [vakitler, setVakitler] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState('');
  const [siradaki, setSiradaki] = useState('');
  const [suankiSaat, setSuankiSaat] = useState(new Date());
  const [bildirimAktif, setBildirimAktif] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    vakitleriGetir();
    const interval = setInterval(() => setSuankiSaat(new Date()), 1000);
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
      setSiradaki(siradakiVaktiGetir(data.data.timings));
      const izin = await bildirimIzniAl();
      if (izin) {
        await namazBildirimleriniKur(data.data.timings);
        setBildirimAktif(true);
      }
      Animated.timing(fadeAnim, { toValue: 1, duration: 900, useNativeDriver: true }).start();
    } catch {
      setHata('Vakitler alinamadi');
    } finally {
      setYukleniyor(false);
    }
  }

  if (yukleniyor) return (
    <View style={[styles.container, { backgroundColor: t.arka }]}>
      <ActivityIndicator size="large" color={t.baslik} />
      <Text style={[styles.yukleniyorText, { color: t.altBaslik }]}>Vakitler yukleniyor...</Text>
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
        <View style={styles.saatKutusu}>
          <Text style={[styles.buyukSaat, { color: t.baslik }]}>{saatiFormatla(suankiSaat)}</Text>
          <Text style={[styles.tarih, { color: t.altBaslik }]}>{tarihiFormatla(suankiSaat)}</Text>
          {bildirimAktif && <Text style={[styles.bildirimBadge, { color: t.badge, backgroundColor: t.badgeArka }]}>🔔 Bildirimler aktif</Text>}
        </View>
        <Text style={[styles.baslik, { color: t.baslik }]}>🕌 Namaz Vakitleri</Text>
        <View style={styles.temaRow}>
          {Object.keys(TEMALAR).map((tk) => (
            <TouchableOpacity key={tk} onPress={() => setTema(tk)} style={[styles.temaButon, { backgroundColor: TEMALAR[tk].baslik }, tema === tk && { borderColor: '#ffffff', borderWidth: 2.5 }]} />
          ))}
        </View>
        <ScrollView style={styles.liste} showsVerticalScrollIndicator={false}>
          {VAKITLER_SIRASI.map((v) => {
            const aktif = v.key === siradaki;
            return (
              <View key={v.key} style={[styles.satir, { backgroundColor: t.kart }, aktif && { backgroundColor: t.aktifKart, borderWidth: 1, borderColor: t.aktifBorder }]}>
                <View style={styles.solKisim}>
                  <Text style={styles.ikon}>{v.ikon}</Text>
                  <Text style={[styles.vakitAd, { color: aktif ? '#FFFFFF' : t.vakitAd }, aktif && { fontWeight: '600' }]}>{v.ad}</Text>
                </View>
                <View style={styles.sagKisim}>
                  {aktif && <Text style={[styles.siradakiBadge, { color: t.badge, backgroundColor: t.badgeArka }]}>Siradaki</Text>}
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
  icerik: { flex: 1, paddingTop: 64, paddingHorizontal: 22 },
  saatKutusu: { alignItems: 'center', marginBottom: 24 },
  buyukSaat: { fontSize: 44, fontWeight: '200', letterSpacing: 3 },
  tarih: { fontSize: 13, marginTop: 6, letterSpacing: 0.3 },
  bildirimBadge: { fontSize: 11, marginTop: 8, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, overflow: 'hidden' },
  baslik: { fontSize: 20, fontWeight: '600', textAlign: 'center', marginBottom: 18 },
  temaRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 22 },
  temaButon: { width: 44, height: 44, borderRadius: 22 },
  liste: { flex: 1 },
  satir: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 18, marginBottom: 8, borderRadius: 16 },
  solKisim: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  sagKisim: { alignItems: 'flex-end', gap: 4 },
  ikon: { fontSize: 20 },
  vakitAd: { fontSize: 16 },
  vakitSaat: { fontSize: 16, fontWeight: '600' },
  siradakiBadge: { fontSize: 11, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20, overflow: 'hidden' },
  yukleniyorText: { marginTop: 12, fontSize: 14 },
  hataText: { fontSize: 16 },
});
