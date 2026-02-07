import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
    const router = useRouter();
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1); // 1: Phone, 2: OTP

    const handleSendOtp = () => {
        if (phone.length < 10) return;
        setStep(2);
    };

    const handleLogin = () => {
        // Dummy Auth Logic
        router.replace("/(tabs)");
    };

    return (
        <SafeAreaView className="flex-1 bg-black p-6 justify-center">
            <View className="mb-10">
                <Text className="text-4xl font-bold text-white mb-2">Nearadius</Text>
                <Text className="text-gray-400 text-lg">Connect with your 500m neighborhood.</Text>
            </View>

            <View className="space-y-4">
                {step === 1 ? (
                    <>
                        <View>
                            <Text className="text-gray-400 mb-2 ml-1">Phone Number</Text>
                            <TextInput
                                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-white text-lg"
                                placeholder="+91 999 999 9999"
                                placeholderTextColor="#666"
                                keyboardType="phone-pad"
                                value={phone}
                                onChangeText={setPhone}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={handleSendOtp}
                            className="w-full bg-blue-600 p-4 rounded-xl items-center"
                        >
                            <Text className="text-white font-bold text-lg">Get OTP</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <View>
                            <Text className="text-gray-400 mb-2 ml-1">Enter OTP</Text>
                            <TextInput
                                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-white text-lg"
                                placeholder="1234"
                                placeholderTextColor="#666"
                                keyboardType="number-pad"
                                value={otp}
                                onChangeText={setOtp}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={handleLogin}
                            className="w-full bg-green-600 p-4 rounded-xl items-center"
                        >
                            <Text className="text-white font-bold text-lg">Verify & Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setStep(1)} className="items-center mt-4">
                            <Text className="text-gray-500">Change Phone Number</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </SafeAreaView>
    );
}
