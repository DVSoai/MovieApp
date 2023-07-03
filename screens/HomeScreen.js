import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Bars3BottomRightIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";

import MovieList from "../components/movieList";
import TrendingMovies from "../components/trendingMovies";
import { useNavigation } from "@react-navigation/native";
import Loading from "../components/loading";
import {
  fetchTrendingMovies,
  fetchUpcomingMovies,
  fetchTopRatedMovies,
} from "../api/moviedb";

const ios = Platform.OS == "ios";
export default function HomeScreen() {
  const [trending, setTrending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    getTrendingMovies();
    getUpcomingMovies();
    getTopRatedMovies();
  }, []);

  const getTrendingMovies = async () => {
    const data = await fetchTrendingMovies();
    console.log("got trending movies", data);
    if (data && data.results) setTrending(data.results);
    setLoading(false);
  };
  const getUpcomingMovies = async () => {
    const data = await fetchUpcomingMovies();
    console.log("got upcoming", data.results.length);
    if (data && data.results) setUpcoming(data.results);
  };
  const getTopRatedMovies = async () => {
    const data = await fetchTopRatedMovies();
    console.log("got top rated", data.results.length);
    if (data && data.results) setTopRated(data.results);
  };

  return (
    <View style={styles.container}>
      {/* */}
      <SafeAreaView>
        <StatusBar style="light" />
        <View style={styles.header}>
          <Bars3BottomRightIcon size="30" strokeWidth={2} color="white" />
          <Text style={styles.textHeader}>
            <Text style={styles.text}>M</Text>ovies
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Search")}>
            <MagnifyingGlassIcon size="30" strokeWidth={2} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {loading ? (
        <Loading />
      ) : (
        <ScrollView
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ padding: 10 }}
        >
          {/* {Trending movie carousel} */}
          {trending.length > 0 && <TrendingMovies data={trending} />}
          {/* upcoming video */}
          <MovieList title="Upcoming" data={upcoming} />
          {/* topRated video */}
          <MovieList title="TopRated" data={topRated} />
        </ScrollView>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#374151",
  },
  textHeader: {
    color: "white",
    fontWeight: "bold",
    fontSize: 48,
  },
  text: {
    color: "#EF4444",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: ios ? 2 : 3,
  },
});
