import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
    return (
        <SafeAreaView className="flex-1 bg-black items-center justify-center">
            <View className="w-20 h-20 bg-neutral-800 rounded-full mb-4 items-center justify-center">
                <Text className="text-white text-2xl font-bold">JD</Text>
            </View>
            <Text className="text-white text-xl font-bold">John Doe</Text>
            <Text className="text-gray-500">Verified Resident</Text>
            <Text className="text-blue-500 mt-2">500m Radius Active</Text>
        </SafeAreaView>
    );
}
