import { useDil } from "@/context/LangContext";
import { useTema } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { Magnetometer } from "expo-sensors";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  Line,
  Path,
  Text as SvgText,
  TextPath,
} from "react-native-svg";

function kiblaAcisiniHesapla(lat, lon) {
  const kiblaLat = (21.4225 * Math.PI) / 180;
  const kiblaLon = (39.8262 * Math.PI) / 180;
  const userLat = (lat * Math.PI) / 180;
  const userLon = (lon * Math.PI) / 180;
  const dLon = kiblaLon - userLon;
  const x = Math.sin(dLon) * Math.cos(kiblaLat);
  const y =
    Math.cos(userLat) * Math.sin(kiblaLat) -
    Math.sin(userLat) * Math.cos(kiblaLat) * Math.cos(dLon);
  const bearing = (Math.atan2(x, y) * 180) / Math.PI;
  return (bearing + 360) % 360;
}

export default function KiblaScreen() {
  const { t } = useTema();
  const { d } = useDil();
  const [kiblaAcisi, setKiblaAcisi] = useState(0);
  const [pusulaAcisi, setPusulaAcisi] = useState(0);
  const [konum, setKonum] = useState({ lat: 0, lon: 0 });
  const [yukleniyor, setYukleniyor] = useState(true);
  const kadranAnim = useRef(new Animated.Value(0)).current;
  const insanAnim = useRef(new Animated.Value(0)).current;
  const kadranAngle = useRef(0);
  const insanAngle = useRef(0);
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const r = 110;
  const yaziR = r + 22;

  useEffect(() => {
    let sub;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const pos = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = pos.coords;
        setKonum({ lat: latitude, lon: longitude });
        setKiblaAcisi(kiblaAcisiniHesapla(latitude, longitude));
        setYukleniyor(false);
      }
    })();
    sub = Magnetometer.addListener((data) => {
      let angle = (Math.atan2(data.y, data.x) * 180) / Math.PI;
      setPusulaAcisi((angle + 360 + 270) % 360);
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
    Animated.spring(kadranAnim, {
      toValue: kadranAngle.current,
      useNativeDriver: true,
      damping: 20,
      stiffness: 100,
    }).start();

    const hedefInsan = kiblaAcisi - pusulaAcisi;
    let diffI = hedefInsan - insanAngle.current;
    if (diffI > 180) diffI -= 360;
    if (diffI < -180) diffI += 360;
    insanAngle.current += diffI;
    Animated.spring(insanAnim, {
      toValue: insanAngle.current,
      useNativeDriver: true,
      damping: 20,
      stiffness: 100,
    }).start();
  }, [pusulaAcisi, kiblaAcisi]);

  const kadranRotate = kadranAnim.interpolate({
    inputRange: [-720, 720],
    outputRange: ["-720deg", "720deg"],
  });
  const insanRotate = insanAnim.interpolate({
    inputRange: [-720, 720],
    outputRange: ["-720deg", "720deg"],
  });

  const tiklar = Array.from({ length: 120 }, (_, i) => i * 3);
  const yonler = [
    { derece: 0, label: "K" },
    { derece: 45, label: "KD" },
    { derece: 90, label: "D" },
    { derece: 135, label: "GD" },
    { derece: 180, label: "G" },
    { derece: 225, label: "GB" },
    { derece: 270, label: "B" },
    { derece: 315, label: "KB" },
  ];

  const daireselYaziPath = `M ${cx - yaziR} ${cy} A ${yaziR} ${yaziR} 0 1 1 ${cx + yaziR} ${cy}`;
  const daireselYaziPath2 = `M ${cx + yaziR} ${cy} A ${yaziR} ${yaziR} 0 1 1 ${cx - yaziR} ${cy}`;
  const metin = "الله ✦ ".repeat(8);

  const kabeY = cy - r - 36;
  const okBasY = cy - 30;
  const okUcY = cy - r + 8;

  if (yukleniyor)
    return (
      <LinearGradient
        colors={[t.arka, t.aktifKart, t.arka]}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={[styles.yukleniyorText, { color: t.altBaslik }]}>
          📍 {d.yukleniyor}
        </Text>
      </LinearGradient>
    );

  return (
    <LinearGradient
      colors={[t.arka, t.aktifKart, t.arka]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text
        style={[
          styles.baslik,
          { color: t.baslik, position: "absolute", top: 60 },
        ]}
      >
        {d.kibla}
      </Text>

      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size} style={{ position: "absolute" }}>
          <Defs>
            <Path id="ustYazi" d={daireselYaziPath} />
            <Path id="altYazi" d={daireselYaziPath2} />
          </Defs>
          <Circle
            cx={cx}
            cy={cy}
            r={yaziR + 8}
            stroke={t.baslik}
            strokeWidth={0.3}
            strokeOpacity={0.15}
            fill="none"
          />
          <Circle
            cx={cx}
            cy={cy}
            r={yaziR - 8}
            stroke={t.baslik}
            strokeWidth={0.3}
            strokeOpacity={0.15}
            fill="none"
          />
          <SvgText
            fontSize={11}
            fill={t.baslik}
            fillOpacity={0.18}
            fontWeight="bold"
          >
            <TextPath href="#ustYazi">{metin}</TextPath>
          </SvgText>
          <SvgText
            fontSize={11}
            fill={t.baslik}
            fillOpacity={0.18}
            fontWeight="bold"
          >
            <TextPath href="#altYazi">{metin}</TextPath>
          </SvgText>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const rad = ((deg - 90) * Math.PI) / 180;
            const px = cx + (yaziR + 8) * Math.cos(rad);
            const py = cy + (yaziR + 8) * Math.sin(rad);
            return (
              <Circle
                key={deg}
                cx={px}
                cy={py}
                r={1.5}
                fill={t.baslik}
                fillOpacity={0.25}
              />
            );
          })}
        </Svg>

        <Animated.View
          style={[
            { position: "absolute", width: size, height: size },
            { transform: [{ rotate: kadranRotate }] },
          ]}
        >
          <Svg width={size} height={size}>
            <Circle
              cx={cx}
              cy={cy}
              r={r}
              stroke={t.baslik}
              strokeWidth={1.5}
              fill={t.kart}
            />
            <Circle
              cx={cx}
              cy={cy}
              r={r - 16}
              stroke={t.aktifBorder}
              strokeWidth={0.5}
              fill="none"
            />
            {tiklar.map((deg) => {
              const rad = ((deg - 90) * Math.PI) / 180;
              const buyuk = deg % 90 === 0;
              const orta = deg % 45 === 0;
              const kucukOrta = deg % 15 === 0;
              const uzunluk = buyuk ? 14 : orta ? 9 : kucukOrta ? 6 : 3;
              const x1 = cx + (r - uzunluk) * Math.cos(rad);
              const y1 = cy + (r - uzunluk) * Math.sin(rad);
              const x2 = cx + r * Math.cos(rad);
              const y2 = cy + r * Math.sin(rad);
              return (
                <Line
                  key={deg}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={buyuk ? t.baslik : orta ? t.vakitAd : t.altBaslik}
                  strokeWidth={buyuk ? 2 : 1}
                />
              );
            })}
            {yonler.map(({ derece, label }) => {
              const rad = ((derece - 90) * Math.PI) / 180;
              const buyukYon = derece % 90 === 0;
              const tx = cx + (r - (buyukYon ? 24 : 28)) * Math.cos(rad);
              const ty = cy + (r - (buyukYon ? 24 : 28)) * Math.sin(rad) + 5;
              return (
                <SvgText
                  key={derece}
                  x={tx}
                  y={ty}
                  textAnchor="middle"
                  fill={derece === 0 ? "#FF375F" : t.baslik}
                  fontSize={buyukYon ? 13 : 9}
                  fontWeight="bold"
                >
                  {label}
                </SvgText>
              );
            })}
          </Svg>
        </Animated.View>

        <Animated.View
          style={[
            { position: "absolute", width: size, height: size },
            { transform: [{ rotate: insanRotate }] },
          ]}
        >
          <Svg width={size} height={size}>
            <SvgText x={cx} y={kabeY + 36} textAnchor="middle" fontSize={56}>
              🕋
            </SvgText>
          </Svg>
          <Image
            source={require("../../assets/namazicon.png")}
            style={{
              position: "absolute",
              width: 100,
              height: 140,
              top: cy - 70,
              left: cx - 50,
              transform: [{ rotate: "180deg" }],
            }}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      <View style={[styles.bilgiKart, { backgroundColor: t.kart }]}>
        <View style={styles.bilgiRow}>
          <View style={styles.bilgiItem}>
            <Text style={[styles.bilgiDeger, { color: t.baslik }]}>
              {Math.round(kiblaAcisi)}°
            </Text>
            <Text style={[styles.bilgiLabel, { color: t.altBaslik }]}>
              {d.kiblaAcisi}
            </Text>
          </View>
          <View
            style={[styles.bilgiAyrac, { backgroundColor: t.aktifBorder }]}
          />
          <View style={styles.bilgiItem}>
            <Text style={[styles.bilgiDeger, { color: t.baslik }]}>
              {konum.lat.toFixed(3)}
            </Text>
            <Text style={[styles.bilgiLabel, { color: t.altBaslik }]}>
              {d.enlem}
            </Text>
          </View>
          <View
            style={[styles.bilgiAyrac, { backgroundColor: t.aktifBorder }]}
          />
          <View style={styles.bilgiItem}>
            <Text style={[styles.bilgiDeger, { color: t.baslik }]}>
              {konum.lon.toFixed(3)}
            </Text>
            <Text style={[styles.bilgiLabel, { color: t.altBaslik }]}>
              {d.boylam}
            </Text>
          </View>
        </View>
      </View>
      <Text
        style={{
          color: t.altBaslik,
          fontSize: 11,
          textAlign: "center",
          marginTop: 10,
          paddingHorizontal: 20,
        }}
      >
        {d.kod === "ar"
          ? "* يتطلب الموقع"
          : d.kod === "en"
            ? "* Qibla requires location access"
            : "* Kıble yönü için konum izni gereklidir"}
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  baslik: { fontSize: 24, fontWeight: "700", marginBottom: 16 },
  bilgiKart: { width: "100%", borderRadius: 16, padding: 20, marginTop: 20 },
  bilgiRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  bilgiItem: { alignItems: "center", flex: 1 },
  bilgiDeger: { fontSize: 15, fontWeight: "700" },
  bilgiLabel: { fontSize: 11, marginTop: 4 },
  bilgiAyrac: { width: 0.5, height: 40 },
  yukleniyorText: { fontSize: 16 },
});
