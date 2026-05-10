import { Tabs } from 'expo-router';
import { useTema } from '@/context/ThemeContext';
import { useDil } from '@/context/LangContext';
import { Text, View } from 'react-native';

function TabIkon({ emoji, focused, color }: any) {
  return (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center',
      width: 36,
      height: 30,
      borderRadius: 15,
      backgroundColor: focused ? color + '22' : 'transparent',
    }}>
      <Text style={{ fontSize: focused ? 21 : 17 }}>{emoji}</Text>
    </View>
  );
}

export default function TabLayout() {
  const { t } = useTema();
  const { d } = useDil();
  const zikirBaslik = d.kod === 'ar' ? 'تسبيح' : d.kod === 'en' ? 'Dhikr' : 'Zikir';
  const vakitlerBaslik = d.kod === 'ar' ? 'الصلاة' : d.kod === 'en' ? 'Prayers' : 'Vakitler';
  const dualarBaslik = d.kod === 'ar' ? 'أدعية' : d.kod === 'en' ? 'Prayers' : 'Dualar';
  const kiblaBaslik = d.kod === 'ar' ? 'قبلة' : d.kod === 'en' ? 'Qibla' : 'Kıble';
  const takvimBaslik = d.kod === 'ar' ? 'تقويم' : d.kod === 'en' ? 'Calendar' : 'Takvim';
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: t.kart, borderTopColor: t.aktifBorder, paddingTop: 6, paddingBottom: 16, height: 76 },
      tabBarActiveTintColor: t.baslik,
      tabBarInactiveTintColor: t.altBaslik,
      tabBarLabelStyle: { fontSize: 10, marginTop: 2, marginBottom: 2 },
      tabBarItemStyle: { paddingHorizontal: 2 },
    }}>
      <Tabs.Screen name="explore" options={{ title: dualarBaslik, tabBarIcon: (p) => <TabIkon emoji="🤲" {...p} /> }} />
      <Tabs.Screen name="takvim" options={{ title: takvimBaslik, tabBarIcon: (p) => <TabIkon emoji="📅" {...p} /> }} />
      <Tabs.Screen name="index" options={{ title: vakitlerBaslik, tabBarIcon: (p) => <TabIkon emoji="🕌" {...p} /> }} />
      <Tabs.Screen name="kibla" options={{ title: kiblaBaslik, tabBarIcon: (p) => <TabIkon emoji="🧭" {...p} /> }} />
      <Tabs.Screen name="zikir" options={{ title: zikirBaslik, tabBarIcon: (p) => <TabIkon emoji="📿" {...p} /> }} />
      <Tabs.Screen name="ayarlar" options={{ href: null }} />
    </Tabs>
  );
}