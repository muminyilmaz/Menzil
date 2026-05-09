import { useTema } from '@/context/ThemeContext';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Polygon, Text as SvgText, TextPath, Path, Defs, G } from 'react-native-svg';

function kiblaAcisiniHesapla(lat, lon) {
  const kiblaLat = 21.4225 * Math.PI / 180;
  const kiblaLon = 39.8262 * Math.PI / 180;
  const userLat = lat * Math.PI / 180;
  const userLon = lon * Math.PI / 180;
  const dLon = kiblaLon - userLon;
  const x = Math.sin(dLon) * Math.cos(kiblaLat);
  const y = Math.cos(userLat) * Math.sin(kiblaLat) - Math.sin(userLat) * Math.cos(kiblaLat) * Math.cos(dLon);
  const bearing = Math.atan2(x, y) * 180 / Math.PI;
  return (bearing + 360) % 360;
}

export default function KiblaScreen() {
  const { t } = useTema();
  const [kiblaAcisi, setKiblaAcisi] = useState(0);
  const [pusulaAcisi, setPusulaAcisi] = useState(0);
  const [konum, setKonum] = useState({ lat: 0, lon: 0 });
  const [yukleniyor, setYukleniyor] = useState(true);
  const kadranAnim = useRef(new Animated.Value(0)).current;
  const insanAnim = useRef(new Animated.Value(0)).current;
  const kadranAngle = useRef(0);
  const insanAngle = useRef(0);
  const size = 340;
  const cx = size / 2;
  const cy = size / 2;
  const r = 118;
  const yaziR = r + 22;

  useEffect(() => {
    let sub;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const pos = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = pos.coords;
        setKonum({ lat: latitude, lon: longitude });
        setKiblaAcisi(kiblaAcisiniHesapla(latitude, longitude));
        setYukleniyor(false);
      }
    })();
    sub = Magnetometer.addListener((data) => {
      let angle = Math.atan2(data.y, data.x) * 180 / Math.PI;
      setPusulaAcisi((angle + 360) % 360);
    });
    Magnetometer.setUpdateInterval(100);
    return () => sub && sub.remove();
  }, []);

  useEffect(() => {
    const hedefKadran = -pusulaAcisi;
    let diffK = hedefKadran - kadranAngle.current;
    if (diffK > 180) diffK -= 360;
    if (diffK < -180) diffK += 360;
    kadranAngle.current += diffK;
    Animated.spring(kadranAnim, { toValue: kadranAngle.current, useNativeDriver: true, damping: 20, stiffness: 100 }).start();

    const hedefInsan = kiblaAcisi - pusulaAcisi;
    let diffI = hedefInsan - insanAngle.current;
    if (diffI > 180) diffI -= 360;
    if (diffI < -180) diffI += 360;
    insanAngle.current += diffI;
    Animated.spring(insanAnim, { toValue: insanAngle.current, useNativeDriver: true, damping: 20, stiffness: 100 }).start();
  }, [pusulaAcisi, kiblaAcisi]);

  const kadranRotate = kadranAnim.interpolate({ inputRange: [-720, 720], outputRange: ['-720deg', '720deg'] });
  const insanRotate = insanAnim.interpolate({ inputRange: [-720, 720], outputRange: ['-720deg', '720deg'] });

  const tiklar = Array.from({ length: 120 }, (_, i) => i * 3);
  const yonler = [
    { derece: 0, label: 'K' },
    { derece: 45, label: 'KD' },
    { derece: 90, label: 'D' },
    { derece: 135, label: 'GD' },
    { derece: 180, label: 'G' },
    { derece: 225, label: 'GB' },
    { derece: 270, label: 'B' },
    { derece: 315, label: 'KB' },
  ];

  const kabeY = cy - r - 34;
  const okBasY = cy - 30;
  const okUcY = cy - r + 8;

  // Dairesel yazı için path
  const daireselYaziPath = `M ${cx - yaziR} ${cy} A ${yaziR} ${yaziR} 0 1 1 ${cx + yaziR} ${cy}`;
  const daireselYaziPath2 = `M ${cx + yaziR} ${cy} A ${yaziR} ${yaziR} 0 1 1 ${cx - yaziR} ${cy}`;
  const tekrar = 'الله ✦ ';
  const metin = tekrar.repeat(8);

  if (yukleniyor) return (
    <View style={[styles.container, { backgroundColor: t.arka }]}>
      <Text style={[styles.yukleniyorText, { color: t.altBaslik }]}>📍 Konum alınıyor...</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: t.arka }]}>
      <Text style={[styles.baslik, { color: t.baslik }]}>Kıble Yönü</Text>

      <View style={{ width: size, height: size }}>

        {/* Sabit dairesel Allah yazısı */}
        <Svg width={size} height={size} style={{ position: 'absolute' }}>
          <Defs>
            <Path id="ustYazi" d={daireselYaziPath} />
            <Path id="altYazi" d={daireselYaziPath2} />
          </Defs>
          {/* Dış dekoratif çember çizgisi */}
          <Circle cx={cx} cy={cy} r={yaziR + 8} stroke={t.baslik} strokeWidth={0.3} strokeOpacity={0.15} fill="none" />
          <Circle cx={cx} cy={cy} r={yaziR - 8} stroke={t.baslik} strokeWidth={0.3} strokeOpacity={0.15} fill="none" />
          {/* Dairesel yazı */}
          <SvgText fontSize={11} fill={t.baslik} fillOpacity={0.18} fontWeight="bold">
            <TextPath href="#ustYazi">{metin}</TextPath>
          </SvgText>
          <SvgText fontSize={11} fill={t.baslik} fillOpacity={0.18} fontWeight="bold">
            <TextPath href="#altYazi">{metin}</TextPath>
          </SvgText>
          {/* Köşe süsleme noktaları */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => {
            const rad = (d - 90) * Math.PI / 180;
            const px = cx + (yaziR + 8) * Math.cos(rad);
            const py = cy + (yaziR + 8) * Math.sin(rad);
            return <Circle key={d} cx={px} cy={py} r={1.5} fill={t.baslik} fillOpacity={0.25} />;
          })}
        </Svg>

        {/* Dönen kadran */}
        <Animated.View style={[{ position: 'absolute', width: size, height: size }, { transform: [{ rotate: kadranRotate }] }]}>
          <Svg width={size} height={size}>
            <Circle cx={cx} cy={cy} r={r} stroke={t.baslik} strokeWidth={1.5} fill={t.kart} />
            <Circle cx={cx} cy={cy} r={r - 16} stroke={t.aktifBorder} strokeWidth={0.5} fill="none" />

            {tiklar.map((d) => {
              const rad = (d - 90) * Math.PI / 180;
              const buyuk = d % 90 === 0;
              const orta = d % 45 === 0;
              const kucukOrta = d % 15 === 0;
              const uzunluk = buyuk ? 16 : orta ? 11 : kucukOrta ? 7 : 4;
              const x1 = cx + (r - uzunluk) * Math.cos(rad);
              const y1 = cy + (r - uzunluk) * Math.sin(rad);
              const x2 = cx + r * Math.cos(rad);
              const y2 = cy + r * Math.sin(rad);
              return (
                <Line key={d} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={buyuk ? t.baslik : orta ? t.vakitAd : t.altBaslik}
                  strokeWidth={buyuk ? 2.5 : orta ? 1.5 : 0.8} />
              );
            })}

            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((d) => {
              if (d % 45 === 0) return null;
              const rad = (d - 90) * Math.PI / 180;
              const tx = cx + (r - 28) * Math.cos(rad);
              const ty = cy + (r - 28) * Math.sin(rad) + 4;
              return (
                <SvgText key={'deg' + d} x={tx} y={ty} textAnchor="middle" fill={t.altBaslik} fontSize={9}>
                  {d}
                </SvgText>
              );
            })}

            {yonler.map(({ derece, label }) => {
              const rad = (derece - 90) * Math.PI / 180;
              const buyukYon = derece % 90 === 0;
              const tx = cx + (r - (buyukYon ? 24 : 28)) * Math.cos(rad);
              const ty = cy + (r - (buyukYon ? 24 : 28)) * Math.sin(rad) + 5;
              return (
                <SvgText key={derece} x={tx} y={ty} textAnchor="middle"
                  fill={derece === 0 ? '#FF375F' : t.baslik}
                  fontSize={buyukYon ? 13 : 9} fontWeight="bold">
                  {label}
                </SvgText>
              );
            })}
          </Svg>
        </Animated.View>

        {/* Dönen insan + ok + kabe */}
        <Animated.View style={[{ position: 'absolute', width: size, height: size }, { transform: [{ rotate: insanRotate }] }]}>
          <Svg width={size} height={size}>
            <SvgText x={cx} y={kabeY + 28} textAnchor="middle" fontSize={40}>🕋</SvgText>
            <Line x1={cx} y1={okBasY} x2={cx} y2={okUcY}
              stroke={t.baslik} strokeWidth={2.5} strokeLinecap="round" />
            <Polygon
              points={`${cx},${okUcY} ${cx - 6},${okUcY + 12} ${cx + 6},${okUcY + 12}`}
              fill={t.baslik} />
            <SvgText x={cx} y={cy + 24} textAnchor="middle" fontSize={52}>🧎</SvgText>
          </Svg>
        </Animated.View>

      </View>

      <View style={[styles.bilgiKart, { backgroundColor: t.kart }]}>
        <View style={styles.bilgiRow}>
          <View style={styles.bilgiItem}>
            <Text style={[styles.bilgiDeger, { color: t.baslik }]}>{Math.round(kiblaAcisi)}°</Text>
            <Text style={[styles.bilgiLabel, { color: t.altBaslik }]}>Kıble Açısı</Text>
          </View>
          <View style={[styles.bilgiAyrac, { backgroundColor: t.aktifBorder }]} />
          <View style={styles.bilgiItem}>
            <Text style={[styles.bilgiDeger, { color: t.baslik }]}>{konum.lat.toFixed(3)}</Text>
            <Text style={[styles.bilgiLabel, { color: t.altBaslik }]}>Enlem</Text>
          </View>
          <View style={[styles.bilgiAyrac, { backgroundColor: t.aktifBorder }]} />
          <View style={styles.bilgiItem}>
            <Text style={[styles.bilgiDeger, { color: t.baslik }]}>{konum.lon.toFixed(3)}</Text>
            <Text style={[styles.bilgiLabel, { color: t.altBaslik }]}>Boylam</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  baslik: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  bilgiKart: { width: '100%', borderRadius: 16, padding: 20, marginTop: 20 },
  bilgiRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  bilgiItem: { alignItems: 'center', flex: 1 },
  bilgiDeger: { fontSize: 15, fontWeight: '700' },
  bilgiLabel: { fontSize: 11, marginTop: 4 },
  bilgiAyrac: { width: 0.5, height: 40 },
  yukleniyorText: { fontSize: 16 },
});
