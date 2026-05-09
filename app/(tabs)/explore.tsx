import { useTema } from "@/context/ThemeContext";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const DUALAR = [
  {
    baslik: "Sabah Duası",
    arapca: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا",
    turkce: "Allah'ım! Senin adınla sabahladık, senin adınla akşamladık.",
  },
  {
    baslik: "Yemek Duası",
    arapca: "بِسْمِ اللهِ وَعَلَى بَرَكَةِ اللهِ",
    turkce: "Allah'ın adıyla ve Allah'ın bereketi ile başlıyorum.",
  },
  {
    baslik: "Uyumadan Önce",
    arapca: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    turkce: "Allah'ım! Senin adınla ölür ve yine Senin adınla dirilirim.",
  },
  {
    baslik: "Eve Girerken",
    arapca: "بِسْمِ اللهِ وَلَجْنَا وَبِسْمِ اللهِ خَرَجْنَا",
    turkce: "Allah'ın adıyla girdik, Allah'ın adıyla çıktık.",
  },
  {
    baslik: "Seyahate Çıkarken",
    arapca: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا",
    turkce: "Bunu bizim hizmetimize vereni tesbih ederim.",
  },
  {
    baslik: "Günaydın Duası",
    arapca: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ",
    turkce: "Sabahladık, mülk de Allah'a ait olarak sabahladı.",
  },
  {
    baslik: "Sıkıntı Anında",
    arapca: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    turkce: "Allah bize yeter, O ne güzel vekildir.",
  },
];

export default function DualarScreen() {
  const { t } = useTema();
  return (
    <View style={[styles.container, { backgroundColor: t.arka }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.liste}
      >
        <Text style={[styles.baslik, { color: t.baslik }]}>
          🤲 Günlük Dualar
        </Text>
        {DUALAR.map((dua, index) => (
          <View key={index} style={[styles.kart, { backgroundColor: t.kart }]}>
            <Text style={[styles.duaBaslik, { color: t.baslik }]}>
              {dua.baslik}
            </Text>
            <Text style={[styles.arapca, { color: t.aktifSaat }]}>
              {dua.arapca}
            </Text>
            <View style={[styles.cizgi, { backgroundColor: t.aktifBorder }]} />
            <Text style={[styles.turkce, { color: t.vakitAd }]}>
              {dua.turkce}
            </Text>
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
  baslik: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 64,
    marginBottom: 24,
  },
  kart: { borderRadius: 16, padding: 20, marginBottom: 12 },
  duaBaslik: { fontSize: 15, fontWeight: "600", marginBottom: 12 },
  arapca: {
    fontSize: 20,
    textAlign: "right",
    lineHeight: 36,
    marginBottom: 12,
  },
  cizgi: { height: 0.5, marginBottom: 12 },
  turkce: { fontSize: 14, lineHeight: 22 },
});
