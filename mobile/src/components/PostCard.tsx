import { View, Text, Image, TouchableOpacity } from "react-native";
import { Heart, MessageCircle, Share2, MoreHorizontal, CheckCircle2 } from "lucide-react-native";

interface PostCardProps {
    item: {
        id: string;
        user: string;
        userAvatar?: string;
        time: string;
        distance: string;
        verified?: boolean;
        title?: string;
        content: string;
        image?: string;
        likes: number;
        comments: number;
        type?: "HELP" | "ALERT" | "GENERAL";
    };
}

export default function PostCard({ item }: PostCardProps) {
    return (
        <View className="bg-neutral-900 mb-4 rounded-xl overflow-hidden border border-neutral-800">
            {/* Header */}
            <View className="flex-row items-center justify-between p-4 pb-3">
                <View className="flex-row items-center gap-3">
                    {/* Avatar Placeholder */}
                    <View className="h-10 w-10 bg-red-900/40 border border-red-900 rounded-full items-center justify-center">
                        <Text className="text-red-300 font-bold text-lg">{item.user.charAt(0)}</Text>
                    </View>

                    <View>
                        <View className="flex-row items-center gap-1">
                            <Text className="font-bold text-gray-100 text-base">{item.user}</Text>
                            {item.verified && <CheckCircle2 size={14} color="#60A5FA" fill="#1E3A8A" />}
                        </View>
                        <Text className="text-gray-500 text-xs">Local publisher • {item.distance} • {item.time}</Text>
                    </View>
                </View>
                <TouchableOpacity>
                    <MoreHorizontal size={20} color="#6B7280" />
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View className="px-4 pb-2">
                {item.title && (
                    <Text className="text-lg font-bold text-gray-100 mb-1 leading-6">
                        {item.title}
                    </Text>
                )}
                <Text className="text-gray-300 leading-5 mb-2" numberOfLines={3}>
                    {item.content}
                </Text>
            </View>

            {/* Image */}
            {item.image && (
                <Image
                    source={{ uri: item.image }}
                    className="w-full h-64 bg-neutral-800"
                    resizeMode="cover"
                />
            )}

            {/* Stats/Comments Preview */}
            <View className="px-4 py-3 flex-row items-center gap-2">
                {/* Small avatar for comment preview */}
                <View className="h-5 w-5 bg-neutral-700 rounded-full" />
                <Text className="text-gray-500 text-sm flex-1" numberOfLines={1}>
                    <Text className="font-semibold text-gray-300">Sarah Morris</Text> Love to see Olivetta getting the recognition...
                </Text>
            </View>

            {/* Footer Actions */}
            <View className="flex-row items-center justify-between px-4 py-3 border-t border-neutral-800">
                <View className="flex-row items-center gap-4">
                    <TouchableOpacity className="flex-row items-center gap-1 bg-neutral-800 px-3 py-1.5 rounded-full">
                        <Heart size={18} color="#9CA3AF" />
                        <Text className="text-gray-400 font-medium text-sm">{item.likes}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center gap-1 bg-neutral-800 px-3 py-1.5 rounded-full">
                        <MessageCircle size={18} color="#9CA3AF" />
                        <Text className="text-gray-400 font-medium text-sm">{item.comments}</Text>
                    </TouchableOpacity>
                </View>

                <View className="flex-row gap-2">
                    <TouchableOpacity className="p-2 bg-neutral-800 rounded-full">
                        <Share2 size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2 bg-neutral-800 rounded-full">
                        <MoreHorizontal size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
