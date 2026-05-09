import { createContext, useContext, useState } from 'react';

export const TEMALAR = {
  yesil: { arka: '#0A2E1A', kart: '#0F3D22', aktifKart: '#145C30', aktifBorder: '#34C75988', baslik: '#34C759', altBaslik: '#ffffff66', vakitAd: '#ffffffbb', saat: '#34C759', aktifSaat: '#30D158', badge: '#30D158', badgeArka: '#34C75922' },
  mavi: { arka: '#001A3D', kart: '#002252', aktifKart: '#003080', aktifBorder: '#007AFF88', baslik: '#0A84FF', altBaslik: '#ffffff66', vakitAd: '#ffffffbb', saat: '#0A84FF', aktifSaat: '#409CFF', badge: '#409CFF', badgeArka: '#007AFF22' },
  turuncu: { arka: '#2E1500', kart: '#3D1C00', aktifKart: '#5C2A00', aktifBorder: '#FF950088', baslik: '#FF9F0A', altBaslik: '#ffffff66', vakitAd: '#ffffffbb', saat: '#FF9F0A', aktifSaat: '#FFB340', badge: '#FFB340', badgeArka: '#FF950022' },
  kirmizi: { arka: '#2E0010', kart: '#3D0015', aktifKart: '#5C001F', aktifBorder: '#FF2D5588', baslik: '#FF375F', altBaslik: '#ffffff66', vakitAd: '#ffffffbb', saat: '#FF375F', aktifSaat: '#FF6482', badge: '#FF6482', badgeArka: '#FF2D5522' },
  acik: { arka: '#F2F2F7', kart: '#FFFFFF', aktifKart: '#E8F8ED', aktifBorder: '#34C75966', baslik: '#248A3D', altBaslik: '#3C3C4399', vakitAd: '#3C3C43CC', saat: '#248A3D', aktifSaat: '#34C759', badge: '#248A3D', badgeArka: '#34C75918' },
};

const ThemeContext = createContext({ tema: 'yesil', setTema: (t) => {}, t: TEMALAR.yesil });

export function ThemeProvider({ children }) {
  const [tema, setTema] = useState('yesil');
  return (
    <ThemeContext.Provider value={{ tema, setTema, t: TEMALAR[tema] }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTema() {
  return useContext(ThemeContext);
}
