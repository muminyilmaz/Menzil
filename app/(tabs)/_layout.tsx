import { useTema } from "@/context/ThemeContext";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const { t } = useTema();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: t.kart, borderTopColor: t.aktifBorder },
        tabBarActiveTintColor: t.baslik,
        tabBarInactiveTintColor: t.altBaslik,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Vakitler" }} />
      <Tabs.Screen name="explore" options={{ title: "Dualar" }} />
      <Tabs.Screen name="kibla" options={{ title: "Kıble" }} />
    </Tabs>
  );
}
