import { usePathname, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useTema } from "./ThemeContext";

export function TabBar() {
  const { t } = useTema();
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { name: "Vakitler", ikon: "🕌", path: "/" },
    { name: "Dualar", ikon: "🤲", path: "/explore" },
  ];

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: t.kart,
        borderTopWidth: 0.5,
        borderTopColor: t.aktifBorder,
        paddingBottom: 28,
        paddingTop: 10,
      }}
    >
      {tabs.map((tab) => {
        const isFocused = pathname === tab.path;
        return (
          <TouchableOpacity
            key={tab.path}
            onPress={() => router.push(tab.path as any)}
            style={{ flex: 1, alignItems: "center", gap: 4 }}
          >
            <Text style={{ fontSize: 20 }}>{tab.ikon}</Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: isFocused ? "600" : "400",
                color: isFocused ? t.baslik : t.altBaslik,
              }}
            >
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
      <TabBar />
    </View>
  );
}
