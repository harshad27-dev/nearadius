import { View, Text, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bell, MapPin, Search } from "lucide-react-native";
import PostCard from "../../src/components/PostCard";

type PostType = "HELP" | "ALERT" | "GENERAL";

const DUMMY_POSTS = [
    {
        id: "1",
        type: "HELP" as PostType,
        user: "Dulwich Chronicle",
        userAvatar: "https://via.placeholder.com/150",
        distance: "Local publisher",
        time: "6h",
        verified: true,
        title: "Introducing the 2025 Dulwich Village Restaurant Award Winners",
        content: "We are thrilled to announce this year's winners! From the best family-friendly spots to the finest dining experiences, see who made the cut this year...",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        likes: 124,
        comments: 24,
    },
    {
        id: "2",
        type: "ALERT" as PostType,
        user: "Sarah Morris",
        distance: "120m",
        time: "10m",
        verified: true,
        content: "My cat got out! Has anyone seen a ginger tabby near 4th Cross? She answers to 'Luna' and is very friendly but scared of loud noises.",
        image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        likes: 15,
        comments: 8,
    },
    {
        id: "3",
        type: "GENERAL" as PostType,
        user: "Ravi K.",
        distance: "300m",
        time: "2h",
        verified: true,
        title: "Power scheduled maintenance",
        content: "Just a heads up, there is a power cut scheduled for tomorrow 10 AM - 2 PM in Block A due to transformer maintenance.",
        likes: 42,
        comments: 12,
    },
    {
        id: "4",
        type: "GENERAL" as PostType,
        user: "Community Admin",
        distance: "450m",
        time: "4h",
        verified: true,
        title: "Sunday Market is Live!",
        content: "The Sunday market is live at the main park. Fresh veggies, homemade jams, and crafts available! Come support local vendors.",
        image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        likes: 89,
        comments: 5,
    },
];

export default function FeedScreen() {
    return (
        <SafeAreaView className="flex-1 bg-black pb-0" edges={['top']}>
            {/* Header */}
            <View className="px-4 py-3 bg-black border-b border-neutral-800 flex-row justify-between items-center mb-2">
                <View>
                    <Text className="text-xl font-bold text-white">Dulwich Village</Text>
                    <View className="flex-row items-center gap-1">
                        <MapPin size={12} color="#9CA3AF" />
                        <Text className="text-gray-400 text-xs">London, UK • 12 Online</Text>
                    </View>
                </View>
                <View className="flex-row items-center gap-3">
                    <TouchableOpacity className="p-2 bg-neutral-900 rounded-full border border-neutral-800">
                        <Search size={20} color="#E5E7EB" />
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2 bg-neutral-900 rounded-full border border-neutral-800">
                        <Bell size={20} color="#E5E7EB" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Feed */}
            <FlatList
                data={DUMMY_POSTS}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <PostCard item={item} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                className="px-0"
            />
        </SafeAreaView>
    );
}

