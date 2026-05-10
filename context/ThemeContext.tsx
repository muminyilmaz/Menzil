import { createContext, useContext, useState } from "react";

export const TEMALAR = {
  yesil: {
    arka: "#0f4326",
    kart: "#0F3D22",
    aktifKart: "#145C30",
    aktifBorder: "#34C75988",
    baslik: "#34C759",
    altBaslik: "#ffffff66",
    vakitAd: "#ffffffbb",
    saat: "#34C759",
    aktifSaat: "#30D158",
    badge: "#30D158",
    badgeArka: "#34C75922",
  },
  mavi: {
    arka: "#011f47",
    kart: "#0740ab",
    aktifKart: "#003080",
    aktifBorder: "#007AFF88",
    baslik: "#0A84FF",
    altBaslik: "#ffffff66",
    vakitAd: "#ffffffbb",
    saat: "#0A84FF",
    aktifSaat: "#409CFF",
    badge: "#409CFF",
    badgeArka: "#007AFF22",
  },
  turuncu: {
    arka: "#f9964592",
    kart: "#f18526",
    aktifKart: "#974608d7",
    aktifBorder: "#eb780d",
    baslik: "#FF9F0A",
    altBaslik: "#ffffff66",
    vakitAd: "#ffffffbb",
    saat: "#FF9F0A",
    aktifSaat: "#FFB340",
    badge: "#FFB340",
    badgeArka: "#FF950022",
  },
  kirmizi: {
    arka: "#2E0010",
    kart: "#3D0015",
    aktifKart: "#5C001F",
    aktifBorder: "#FF2D5588",
    baslik: "#FF375F",
    altBaslik: "#ffffff66",
    vakitAd: "#ffffffbb",
    saat: "#FF375F",
    aktifSaat: "#FF6482",
    badge: "#FF6482",
    badgeArka: "#FF2D5522",
  },
  acik: {
    arka: "#fffffff7",
    kart: "#efefefd3",
    aktifKart: "#bbbbbdc0",
    aktifBorder: "#a1a1a166",
    baslik: "#9b9b9b",
    altBaslik: "#4a4a4b99",
    vakitAd: "#74737366",
    saat: "#92939566",
    aktifSaat: "#b4b6b4",
    badge: "#2324235c",
    badgeArka: "#e7e7ecde",
  },
};

const ThemeContext = createContext({
  tema: "yesil",
  setTema: (t) => {},
  t: TEMALAR.yesil,
});

export function ThemeProvider({ children }) {
  const [tema, setTema] = useState("yesil");
  return (
    <ThemeContext.Provider value={{ tema, setTema, t: TEMALAR[tema] }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTema() {
  return useContext(ThemeContext);
}
