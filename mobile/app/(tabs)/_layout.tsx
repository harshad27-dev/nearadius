import { Tabs } from "expo-router";
import { Home, Map, Bell, User } from "lucide-react-native";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#121212",
                    borderTopColor: "#333",
                    height: 60,
                    paddingBottom: 5,
                },
                tabBarActiveTintColor: "#fff",
                tabBarInactiveTintColor: "#666",
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => <Home color={color} size={24} />,
                }}
            />

            <Tabs.Screen
                name="map"
                options={{
                    title: "Map",
                    tabBarIcon: ({ color }) => <Map color={color} size={24} />,
                }}
            />

            <Tabs.Screen
                name="alerts"
                options={{
                    title: "Alerts",
                    tabBarIcon: ({ color }) => <Bell color={color} size={24} />,
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color }) => <User color={color} size={24} />,
                }}
            />
        </Tabs>
    );
}
