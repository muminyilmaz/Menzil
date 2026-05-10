import { useTema } from '@/context/ThemeContext';
import { useDil } from '@/context/LangContext';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

const OZEL_GUNLER = [
  { ay: 1, gun: 1, tr: 'Muharrem - Hicri Yilbasi', en: 'Muharram - Islamic New Year', ar: 'المحرم - رأس السنة الهجرية' },
  { ay: 1, gun: 10, tr: 'Asure Gunu', en: 'Day of Ashura', ar: 'يوم عاشوراء' },
  { ay: 3, gun: 12, tr: 'Mevlid Kandili', en: 'Mawlid al-Nabi', ar: 'المولد النبوي' },
  { ay: 7, gun: 27, tr: 'Regaip Kandili', en: 'Laylat al-Raghaib', ar: 'ليلة الرغائب' },
  { ay: 8, gun: 15, tr: 'Berat Kandili', en: 'Laylat al-Baraat', ar: 'ليلة البراءة' },
  { ay: 9, gun: 1, tr: 'Ramazan Başlangıcı', en: 'Start of Ramadan', ar: 'بداية رمضان' },
  { ay: 9, gun: 27, tr: 'Kadir Gecesi', en: 'Laylat al-Qadr', ar: 'ليلة القدر' },
  { ay: 10, gun: 1, tr: 'Ramazan Bayramı', en: 'Eid al-Fitr', ar: 'عيد الفطر' },
  { ay: 12, gun: 9, tr: 'Arefe Günü', en: 'Day of Arafah', ar: 'يوم عرفة' },
  { ay: 12, gun: 10, tr: 'Kurban Bayramı', en: 'Eid al-Adha', ar: 'عيد الأضحى' },
];

const HICRI_AYLAR = {
  tr: ['Muharrem','Safer','Rebiulevvel','Rebiulahir','Cemaziyelevvel','Cemaziyelahir','Recep','Saban','Ramazan','Sevval','Zilkade','Zilhicce'],
  en: ['Muharram','Safar','Rabi al-Awwal','Rabi al-Thani','Jumada al-Awwal','Jumada al-Thani','Rajab','Shaban','Ramadan','Shawwal','Dhul Qadah','Dhul Hijjah'],
  ar: ['محرم','صفر','ربيع الأول','ربيع الآخر','جمادى الأولى','جمادى الآخرة','رجب','شعبان','رمضان','شوال','ذو القعدة','ذو الحجة'],
};

export default function TakvimScreen() {
  const { t } = useTema();
  const { dil, d } = useDil();
  const [hicriTarih, setHicriTarih] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [yaklasanGunler, setYaklasanGunler] = useState([]);

  useEffect(() => {
    takvimGetir();
  }, []);

  async function takvimGetir() {
    try {
      const response = await fetch('https://api.aladhan.com/v1/timings?latitude=40.18&longitude=29.06&method=13');
      const data = await response.json();
      const hijri = data.data.date.hijri;
      setHicriTarih(hijri);
      const bugunAy = hijri.month.number;
      const bugunGun = parseInt(hijri.day);
      const yaklasan = OZEL_GUNLER.filter(g => {
        if (g.ay > bugunAy) return true;
        if (g.ay === bugunAy && g.gun >= bugunGun) return true;
        return false;
      }).slice(0, 5);
      setYaklasanGunler(yaklasan);
    } catch (e) {
      console.log(e);
    } finally {
      setYukleniyor(false);
    }
  }

  const aylar = HICRI_AYLAR[dil] || HICRI_AYLAR.tr;

  if (yukleniyor) return (
    <View style={[styles.container, { backgroundColor: t.arka }]}>
      <ActivityIndicator size="large" color={t.baslik} />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: t.arka }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.icerik}>
        <Text style={[styles.baslik, { color: t.baslik }]}>🌙 {d.takvim}</Text>

        {hicriTarih && (
          <View style={[styles.bugunKart, { backgroundColor: t.kart, borderColor: t.aktifBorder }]}>
            <Text style={[styles.bugunLabel, { color: t.altBaslik }]}>{d.bugun}</Text>
            <Text style={[styles.bugunTarih, { color: t.baslik }]}>{hicriTarih.day} {hicriTarih.month.ar}</Text>
            <Text style={[styles.bugunAy, { color: t.vakitAd }]}>{hicriTarih.day} {aylar[hicriTarih.month.number - 1]} {hicriTarih.year}</Text>
            <Text style={[styles.bugunYon, { color: t.altBaslik }]}>{hicriTarih.weekday.ar}</Text>
          </View>
        )}

        <Text style={[styles.bolumBaslik, { color: t.baslik }]}>📅 {d.yaklaşanGunler}</Text>

        {yaklasanGunler.map((gun, i) => (
          <View key={i} style={[styles.gunKart, { backgroundColor: t.kart }]}>
            <View style={[styles.gunSol, { backgroundColor: t.aktifKart }]}>
              <Text style={[styles.gunAy, { color: t.baslik }]}>{aylar[gun.ay - 1]}</Text>
              <Text style={[styles.gunNo, { color: t.baslik }]}>{gun.gun}</Text>
            </View>
            <Text style={[styles.gunIsim, { color: t.vakitAd }]}>{gun[dil] || gun.tr}</Text>
          </View>
        ))}

        <Text style={[styles.bolumBaslik, { color: t.baslik }]}>📖 {dil === 'ar' ? 'الأشهر الهجرية' : dil === 'en' ? 'Hijri Months' : 'Hicri Aylar'}</Text>

        {aylar.map((ay, i) => (
          <View key={i} style={[styles.ayKart, { backgroundColor: t.kart },
            hicriTarih && hicriTarih.month.number === i + 1 && { borderWidth: 1, borderColor: t.aktifBorder, backgroundColor: t.aktifKart }
          ]}>
            <Text style={[styles.ayNo, { color: t.altBaslik }]}>{i + 1}</Text>
            <Text style={[styles.ayIsim, { color: t.vakitAd },
              hicriTarih && hicriTarih.month.number === i + 1 && { color: '#FFFFFF', fontWeight: '600' }
            ]}>{ay}</Text>
            {hicriTarih && hicriTarih.month.number === i + 1 && (
              <Text style={[styles.bugunBadge, { color: t.badge, backgroundColor: t.badgeArka }]}>{d.bugun}</Text>
            )}
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  icerik: { paddingHorizontal: 22, paddingTop: 64 },
  baslik: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 24 },
  bugunKart: { borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 24, borderWidth: 1 },
  bugunLabel: { fontSize: 12, marginBottom: 8 },
  bugunTarih: { fontSize: 36, fontWeight: '700', marginBottom: 4 },
  bugunAy: { fontSize: 16, marginBottom: 4 },
  bugunYon: { fontSize: 13 },
  bolumBaslik: { fontSize: 16, fontWeight: '600', marginBottom: 12, marginTop: 8 },
  gunKart: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, marginBottom: 8, overflow: 'hidden' },
  gunSol: { padding: 12, alignItems: 'center', width: 80 },
  gunAy: { fontSize: 10, marginBottom: 2 },
  gunNo: { fontSize: 20, fontWeight: '700' },
  gunIsim: { flex: 1, fontSize: 14, paddingHorizontal: 16 },
  ayKart: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 14, marginBottom: 6 },
  ayNo: { fontSize: 12, width: 24 },
  ayIsim: { flex: 1, fontSize: 15 },
  bugunBadge: { fontSize: 11, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20, overflow: 'hidden' },
});