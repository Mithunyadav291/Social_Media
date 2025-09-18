// import {
//   View,
//   Text,
//   TextInput,
//   ScrollView,
//   TouchableOpacity,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Feather } from "@expo/vector-icons";

// const SearchScreen = () => {
//   const TRENDING_TOPICS = [
//     { topic: "#ReactNative", tweets: "125K" },
//     { topic: "#TypeScript", tweets: "89K" },
//     { topic: "#WebDevelopment", tweets: "234K" },
//     { topic: "#AI", tweets: "567K" },
//     { topic: "#TechNews", tweets: "98K" },
//     { topic: "#ReactNative", tweets: "125K" },
//     { topic: "#TypeScript", tweets: "89K" },
//     { topic: "#WebDevelopment", tweets: "234K" },
//     { topic: "#AI", tweets: "567K" },
//     { topic: "#TechNews", tweets: "98K" },
//     { topic: "#ReactNative", tweets: "125K" },
//     { topic: "#TypeScript", tweets: "89K" },
//     { topic: "#WebDevelopment", tweets: "234K" },
//     { topic: "#AI", tweets: "567K" },
//     { topic: "#TechNews", tweets: "98K" },
//   ];

//   const [input, setInput] = useState("");

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       {/* Header */}
//       <View className="px-4 py-3 border-b border-gray-100">
//         <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-3">
//           <Feather name="search" size={20} color="#657786" />
//           <TextInput
//             placeholder="Search Twitter"
//             className="flex-1 ml-3 outline-none text-xl text-black"
//             placeholderTextColor="#657786"
//             value={input}
//             // onChangeText={(text) => setInput(text)}
//           />
//         </View>
//       </View>

//       <ScrollView className="flex-1">
//         <View className="p-4">
//           <Text className="text-xl font-bold text-gray-900 mb-4">
//             Trending for you
//           </Text>
//           {TRENDING_TOPICS.map((item, index) => (
//             <TouchableOpacity
//               key={index}
//               className="py-3 border-b border-gray-200"
//               onPress={() => setInput(item.topic)}
//             >
//               <Text className="text-gray-500 text-sm">
//                 Trending in Technology
//               </Text>
//               <Text className="font-bold text-gray-900 text-lg">
//                 {item.topic}
//               </Text>
//               <Text className="text-gray-500 text-sm">
//                 {item.tweets} Tweets
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default SearchScreen;

import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import { useUser } from "@clerk/clerk-expo";
import { getBaseUrl } from "@/utils/apiBaseUrl";

const SearchScreen = () => {
  const TRENDING_TOPICS = [
    { topic: "#ReactNative", tweets: "125K" },
    { topic: "#TypeScript", tweets: "89K" },
    { topic: "#WebDevelopment", tweets: "234K" },
    { topic: "#AI", tweets: "567K" },
    { topic: "#TechNews", tweets: "98K" },
  ];

  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);

  const API_BASE_URL = getBaseUrl();
  console.log(API_BASE_URL);

  const fetchUsers = async (query) => {
    // setResults([]);
    if (!query) {
      setResults([]);
      return;
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/user/search?q=${query}`);
      // const res = await axios.get(
      //   `https://social-media-zeta-sandy.vercel.app/api/user/search?q=${query}`
      // );
      // const res = await axios.get(
      //   `http://localhost:3001/api/user/search?q=${query}`
      // );
      setResults(res.data.users);
    } catch (err) {
      console.log("Search error:", err);
      // console.log("Search error:", JSON.stringify(err, null, 2));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header with search bar */}
      <View className="px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-1">
          <Feather name="search" size={20} color="#657786" />
          <TextInput
            placeholder="Search users"
            className="flex-1 ml-3 outline-none text-xl text-black"
            placeholderTextColor="#657786"
            value={input}
            onChangeText={(text) => {
              setInput(text);
              fetchUsers(text);
            }}
          />
          <TouchableOpacity
            onPress={() => setInput("")}
            className="mr-2 p-1 rounded-full"
          >
            <Feather name="x" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Body */}
      <ScrollView className="flex-1">
        <View className="p-4">
          {input.length > 0 ? (
            <>
              <Text className="text-xl font-bold text-gray-900 mb-4">
                Search Results
              </Text>
              {results.length > 0 ? (
                results.map((user) => (
                  <TouchableOpacity
                    key={user?._id}
                    className="flex flex-row gap-4 items-center py-3 px-4 border-b border-gray-200 "
                  >
                    <Image
                      source={{
                        uri: user?.profilePicture
                          ? user.profilePicture
                          : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSYbP-248zDkKcJG_swsx0pK2Hhe8hwE0fHQ&s",
                      }}
                      resizeMode="contain"
                      className="size-10 rounded-full"
                    />
                    <View>
                      <Text className="font-bold text-gray-900 text-lg">
                        {user?.firstname} {user?.lastname}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        @{user?.username} {user?._id}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text className="text-gray-500">No users found</Text>
              )}
            </>
          ) : (
            <>
              <Text className="text-xl font-bold text-gray-900 mb-4">
                Trending for you
              </Text>
              {TRENDING_TOPICS.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className="py-3 border-b border-gray-200"
                  onPress={() => {
                    setResults([]);
                    setInput(item.topic);
                    fetchUsers(item.topic); // to do later
                  }}
                >
                  <Text className="text-gray-500 text-sm">
                    Trending in Technology
                  </Text>
                  <Text className="font-bold text-gray-900 text-lg">
                    {item.topic}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {item.tweets} Tweets
                  </Text>
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;
