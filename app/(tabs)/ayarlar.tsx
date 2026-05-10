import { TEMALAR, useTema } from '@/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Switch } from 'react-native';
import { DILLER, useDil } from '@/context/LangContext';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

export default function AyarlarScreen() {
  const { tema, setTema, t } = useTema();
  const { dil, setDil, d } = useDil();
  const router = useRouter();
  const [ezanAcik, setEzanAcik] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('ezanSesi').then(val => {
      if (val !== null) setEzanAcik(val === 'true');
    });
  }, []);

  async function ezanToggle(val) {
    setEzanAcik(val);
    await AsyncStorage.setItem('ezanSesi', val.toString());
  }

  return (
    <View style={[styles.container, { backgroundColor: t.arka }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.icerik}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.geriButon}>
            <Text style={[styles.geri, { color: t.baslik }]}>{d.geri}</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.baslik, { color: t.baslik }]}>{d.ayarlar}</Text>
        <Text style={[styles.bolum, { color: t.altBaslik }]}>{d.dilBolum}</Text>
        <View style={[styles.kart, { backgroundColor: t.kart }]}>
          {Object.keys(DILLER).map((dk, i) => {
            const dl = DILLER[dk];
            const aktif = dil === dk;
            return (
              <TouchableOpacity key={dk} onPress={() => setDil(dk)}
                style={[styles.satir, i < Object.keys(DILLER).length - 1 && { borderBottomWidth: 0.5, borderBottomColor: t.aktifBorder }]}>
                <Text style={{ fontSize: 24 }}>{dl.bayrak}</Text>
                <Text style={[styles.satirYazi, { color: aktif ? t.baslik : t.vakitAd }]}>{dl.isim}</Text>
                {aktif && <Text style={[styles.check, { color: t.baslik }]}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={[styles.bolum, { color: t.altBaslik }]}>{d.temaBolum}</Text>
        <View style={[styles.kart, { backgroundColor: t.kart }]}>
          {Object.keys(TEMALAR).map((tk, i) => {
            const aktif = tema === tk;
            const isimler = { yesil: d.temaYesil, mavi: d.temaMavi, turuncu: d.temaTuruncu, kirmizi: d.temaKirmizi, acik: d.temaAcik };
            return (
              <TouchableOpacity key={tk} onPress={() => setTema(tk)}
                style={[styles.satir, i < Object.keys(TEMALAR).length - 1 && { borderBottomWidth: 0.5, borderBottomColor: t.aktifBorder }]}>
                <View style={[styles.temaCircle, { backgroundColor: TEMALAR[tk].baslik }]} />
                <Text style={[styles.satirYazi, { color: aktif ? t.baslik : t.vakitAd }]}>{isimler[tk]}</Text>
                {aktif && <Text style={[styles.check, { color: t.baslik }]}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={[styles.bolum, { color: t.altBaslik }]}>{d.uygulamaBolum}</Text>
        <View style={[styles.kart, { backgroundColor: t.kart }]}>
          <View style={styles.satir}>
            <Text style={[styles.satirYazi, { color: t.vakitAd }]}>{d.versiyon}</Text>
            <Text style={[styles.satirSag, { color: t.altBaslik }]}>1.0.0</Text>
          </View>
          <View style={[styles.satir, { borderTopWidth: 0.5, borderTopColor: t.aktifBorder }]}>
            <Text style={[styles.satirYazi, { color: t.vakitAd }]}>{d.hesaplama}</Text>
            <Text style={[styles.satirSag, { color: t.altBaslik }]}>Diyanet</Text>
          </View>
          <View style={[styles.satir, { borderTopWidth: 0.5, borderTopColor: t.aktifBorder }]}>
            <Text style={[styles.satirYazi, { color: t.vakitAd }]}>{d.ezanSesi}</Text>
            <Switch value={ezanAcik} onValueChange={ezanToggle} trackColor={{ true: t.baslik }} />
          </View>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', marginBottom: 8 },
  geriButon: { padding: 4 },
  geri: { fontSize: 16, fontWeight: '600' },
  icerik: { paddingHorizontal: 22, paddingTop: 64 },
  baslik: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 28 },
  bolum: { fontSize: 11, fontWeight: '600', marginBottom: 8, marginLeft: 4, letterSpacing: 0.8 },
  kart: { borderRadius: 16, marginBottom: 24, overflow: 'hidden' },
  satir: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 18, gap: 14 },
  satirYazi: { flex: 1, fontSize: 16 },
  satirSag: { fontSize: 14 },
  check: { fontSize: 18, fontWeight: '700' },
  temaCircle: { width: 24, height: 24, borderRadius: 12 },
});