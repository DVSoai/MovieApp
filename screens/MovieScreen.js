import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { LinearGradient } from "expo-linear-gradient";
import { HeartIcon } from "react-native-heroicons/solid";
import Cast from "../components/cast";
import MovieList from "../components/movieList";
import Loading from "../components/loading";
import {
  fallbackMoviePoster,
  fetchMovieDetails,
  image500,
  fetchMovieCredits,
  fetchSimilarMovies,
} from "../api/moviedb";

var { width, height } = Dimensions.get("window");

export default function MovieScreen() {
  const { params: item } = useRoute();
  const navigation = useNavigation();
  const [isFavourite, toggleFavourite] = useState(false);
  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState({});

  let movieName = "Ant-Man and the Wasp: Quantumania";

  useEffect(() => {
    //call the movie details api
    // console.log("itemid:", item.id);
    setLoading(true);
    getMoviDetails(item.id);
    getMovieCredits(item.id);
    getSimilarMovies(item.id);
  }, [item]);

  const getMoviDetails = async (id) => {
    const data = await fetchMovieDetails(id);
    // console.log("got movie details:", data);
    if (data) setMovie(data);
    setLoading(false);
  };

  const getMovieCredits = async (id) => {
    const data = await fetchMovieCredits(id);
    console.log("got movie credits");
    if (data && data.cast) {
      setCast(data.cast);
    }
  };

  const getSimilarMovies = async (id) => {
    const data = await fetchSimilarMovies(id);
    console.log("got similar movies");
    if (data && data.results) {
      setSimilarMovies(data.results);
    }
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
    >
      <View style={{ width: "100%" }}>
        <SafeAreaView style={styles.backButton}>
          <TouchableOpacity
            style={styles.backButtonIcon}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeftIcon size={28} strokeWidth={2.5} color="#1F2937" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleFavourite(!isFavourite)}>
            <HeartIcon size="35" color={isFavourite ? "red" : "white"} />
          </TouchableOpacity>
        </SafeAreaView>
        {loading ? (
          <Loading />
        ) : (
          <View>
            <Image
              // source={require("../assets/images/moviePoster2.png")}
              source={{
                uri: image500(movie?.poster_path) || fallbackMoviePoster,
              }}
              style={{ width, height: height * 0.55 }}
            />
            <LinearGradient
              colors={[
                "transparent",
                "rgba(23, 23, 23, 0.8)",
                "rgba(23, 23, 23, 1)",
              ]}
              style={[
                styles.gradient,
                { width: width },
                { height: height * 0.4 },
              ]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
          </View>
        )}
      </View>
      {/* movie details */}
      <View style={styles.viewDetails}>
        <Text style={styles.textDetails}>{movie?.title}</Text>
        {/* status, relese, runtime */}
        {movie?.id ? (
          <Text style={styles.textStatus}>
            {movie?.status} • {movie?.release_date?.split("-")[0] || "N/A"} • •
            {movie?.runtime} min
          </Text>
        ) : null}
        {/* genres */}

        <View style={styles.viewGenres}>
          {movie?.genres?.map((genre, index) => {
            let showDot = index + 1 != movie.genres.length;
            return (
              <Text key={index} style={styles.textGenres}>
                {genre?.name} {showDot ? "•" : null}
              </Text>
            );
          })}
          {/* <Text style={styles.textGenres}> Action •</Text>
          <Text style={styles.textGenres}>Thrill •</Text>
          <Text style={styles.textGenres}>Comedy•</Text> */}
        </View>
        {/* description */}
        <Text style={styles.textDes}>{movie?.overview}</Text>
      </View>
      {/* {cast} */}
      {cast.length > 0 && <Cast navigation={navigation} cast={cast} />}
      {/* { similar movies section } */}
      {similarMovies.length > 0 && (
        <MovieList
          title="Similar Movies"
          hideSeeAll={true}
          data={similarMovies}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#1F2937",
  },
  container: {
    paddingBottom: 20,
  },
  backButton: {
    // position: "absolute",
    // zIndex: 20,
    // top: 30,
    // left: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  backButtonIcon: {
    borderRadius: 9999,
    padding: 1,
    backgroundColor: "#eab308",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
  },
  viewDetails: {
    marginVertical: 3,
  },
  textDetails: {
    margin: 4,
    color: "white",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  textStatus: {
    margin: 4,
    color: "#9CA3AF",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
  viewGenres: {
    flexDirection: "row",
    justifyContent: "center",

    marginHorizontal: 16,
  },
  textGenres: {
    color: "#9CA3AF",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
  textDes: {
    color: "#9CA3AF",
    marginHorizontal: 16,
    letterSpacing: 1,
  },
});
