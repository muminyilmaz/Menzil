import { createContext, useContext, useState } from 'react';

export const DILLER = {
  tr: {
    kod: 'tr', isim: 'Türkçe', bayrak: '🇹🇷',
    vakitler: 'Namaz Vakitleri', dualar: 'Günlük Dualar', kibla: 'Kıble', takvim: 'Takvim',
    imsak: 'İmsak', gunes: 'Güneş', ogle: 'Öğle', ikindi: 'İkindi', aksam: 'Akşam', yatsi: 'Yatsı',
    siradaki: 'Sıradaki', yukleniyor: 'Vakitler yükleniyor...', hata: 'Vakitler alınamadı',
    bugun: 'Bugün', yaklaşanGunler: 'Yaklaşan Özel Günler', kiblaAcisi: 'Kıble Açısı',
    enlem: 'Enlem', boylam: 'Boylam',
    ayarlar: 'Ayarlar', geri: 'Geri', dilBolum: 'DİL', temaBolum: 'TEMA', uygulamaBolum: 'UYGULAMA',
    versiyon: 'Versiyon', hesaplama: 'Namaz Hesaplama',
    temaYesil: 'Yeşil', temaMavi: 'Mavi', temaTuruncu: 'Turuncu', temaKirmizi: 'Kırmızı', temaAcik: 'Açık',
    ezanSesi: 'Ezan Sesi', ezanSesiAcik: 'Açık', ezanSesiKapali: 'Kapalı', bildirimler: 'Bildirimler',
  },
  en: {
    kod: 'en', isim: 'English', bayrak: '🇬🇧',
    vakitler: 'Prayer Times', dualar: 'Daily Prayers', kibla: 'Qibla', takvim: 'Calendar',
    imsak: 'Fajr', gunes: 'Sunrise', ogle: 'Dhuhr', ikindi: 'Asr', aksam: 'Maghrib', yatsi: 'Isha',
    siradaki: 'Next', yukleniyor: 'Loading...', hata: 'Could not load',
    bugun: 'Today', yaklaşanGunler: 'Upcoming Special Days', kiblaAcisi: 'Qibla Angle',
    enlem: 'Latitude', boylam: 'Longitude',
    ayarlar: 'Settings', geri: 'Back', dilBolum: 'LANGUAGE', temaBolum: 'THEME', uygulamaBolum: 'APP',
    versiyon: 'Version', hesaplama: 'Prayer Calculation',
    temaYesil: 'Green', temaMavi: 'Blue', temaTuruncu: 'Orange', temaKirmizi: 'Red', temaAcik: 'Light',
    ezanSesi: 'Adhan Sound', ezanSesiAcik: 'On', ezanSesiKapali: 'Off', bildirimler: 'Notifications',
  },
  ar: {
    kod: 'ar', isim: 'العربية', bayrak: '🇸🇦',
    vakitler: 'أوقات الصلاة', dualar: 'الأدعية', kibla: 'القبلة', takvim: 'التقويم',
    imsak: 'الفجر', gunes: 'الشروق', ogle: 'الظهر', ikindi: 'العصر', aksam: 'المغرب', yatsi: 'العشاء',
    siradaki: 'التالي', yukleniyor: 'جارٍ التحميل...', hata: 'تعذر التحميل',
    bugun: 'اليوم', yaklaşanGunler: 'الأيام الخاصة', kiblaAcisi: 'زاوية القبلة',
    enlem: 'خط العرض', boylam: 'خط الطول',
    ayarlar: 'الإعدادات', geri: 'رجوع', dilBolum: 'اللغة', temaBolum: 'السمة', uygulamaBolum: 'التطبيق',
    versiyon: 'الإصدار', hesaplama: 'حساب الصلاة',
    temaYesil: 'أخضر', temaMavi: 'أزرق', temaTuruncu: 'برتقالي', temaKirmizi: 'أحمر', temaAcik: 'فاتح',
    ezanSesi: 'صوت الأذان', ezanSesiAcik: 'مفعل', ezanSesiKapali: 'معطل', bildirimler: 'الإشعارات',
  },
};

type DilKodu = keyof typeof DILLER;

const LangContext = createContext({
  dil: 'tr' as DilKodu,
  setDil: (d: DilKodu) => {},
  d: DILLER.tr,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [dil, setDil] = useState<DilKodu>('tr');
  return (
    <LangContext.Provider value={{ dil, setDil, d: DILLER[dil] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useDil() {
  return useContext(LangContext);
}
