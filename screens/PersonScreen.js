import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
  ScrollView,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import MovieList from "../components/movieList";
import Loading from "../components/loading";
import {
  fallbackPersonImage,
  fetchPersonDetails,
  fetchPersonMovies,
  image342,
} from "../api/moviedb";

const ios = Platform.OS == "ios";
var { width, height } = Dimensions.get("window");

export default function PersonScreen() {
  const { params: item } = useRoute();
  const [isFavourite, toggleFavourite] = useState(false);
  const [personMovies, setPersonMovies] = useState([]);
  const [person, setPerson] = useState([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getPersonDetails(item.id);
    getPersonMovies(item.id);
  }, [item]);

  const getPersonDetails = async (id) => {
    const data = await fetchPersonDetails(id);
    if (data) setPerson(data);
    setLoading(false);
  };
  const getPersonMovies = async (id) => {
    const data = await fetchPersonMovies(id);
    console.log("got person movies");
    if (data && data.cast) {
      setPersonMovies(data.cast);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#1F2937" }}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      {/* back button */}
      <SafeAreaView style={styles.containerButton}>
        <TouchableOpacity
          style={{ backgroundColor: "#eab308", borderRadius: 20, padding: 4 }}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => toggleFavourite(!isFavourite)}>
          <HeartIcon size="35" color={isFavourite ? "red" : "white"} />
        </TouchableOpacity>
      </SafeAreaView>

      {/* person details */}
      {loading ? (
        <Loading />
      ) : (
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              shadowColor: "gray",
              shadowRadius: 40,
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 1,
            }}
          >
            <View style={styles.viewImage}>
              <Image
                // source={require("../assets/images/castImage2.png")}
                source={{
                  uri: image342(person?.profile_path) || fallbackPersonImage,
                }}
                style={{ height: height * 0.43, width: width * 0.74 }}
              />
            </View>
          </View>

          <View style={{ marginTop: 24 }}>
            <Text
              style={{
                fontSize: 48,
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {/* Keanu Reeves */}
              {person?.name}
            </Text>
            <Text
              style={{
                color: "neutral-500",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              {person?.place_of_birth}
              {/* Beirut, Lebanon */}
              VietNam
            </Text>
          </View>

          <View style={styles.containerPerson}>
            <View style={styles.viewPerson}>
              <Text style={styles.textPerson}>Gender</Text>
              <Text style={styles.textPersonDown}>
                {/* Male */}
                {person?.gender == 1 ? "Female" : "Male"}
              </Text>
            </View>
            <View style={styles.viewPerson}>
              <Text style={styles.textPerson}>Birthday</Text>
              <Text style={styles.textPersonDown}>
                {/* 1964-09-02 */}
                {person?.birthday}
              </Text>
            </View>
            <View style={styles.viewPerson}>
              <Text style={styles.textPerson}>known for</Text>
              <Text style={styles.textPersonDown}>
                {/* Acting */}
                {person?.known_for_department}
              </Text>
            </View>
            <View style={{ paddingHorizontal: 8, alignItems: "center" }}>
              <Text style={styles.textPerson}>Popularity</Text>
              <Text style={styles.textPersonDown}>
                {/* 84.23 % */}
                {person?.popularity?.toFixed(2)} %
              </Text>
            </View>
          </View>
          <View
            style={{
              marginTop: 24,
              marginRight: 16,
              marginBottom: 24,
              marginLeft: 16,
              alignItems: "stretch",
              justifyContent: "flex-start",
              gap: 8,
            }}
          >
            <Text style={{ color: "white", fontSize: 18 }}>Biography</Text>
            <Text style={{ color: "#9CA3AF", letterSpacing: 0.5 }}>
              {person?.biography ? person.biography : "N/A"}
            </Text>
          </View>

          {/* person movies */}

          <MovieList title="Movies" hideSeeAll={true} data={personMovies} />
        </View>
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  containerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 4,
    marginRight: 4,
    zIndex: 10,
    marginVertical: ios ? 0 : 24,
  },
  containerPerson: {
    marginHorizontal: 12,
    padding: 16,
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#3C3C43",
    borderRadius: 9999,
  },
  viewImage: {
    alignItems: "center",
    borderRadius: 9999,
    overflow: "hidden",
    height: 72,
    width: 72,
    borderColor: "#7D7D87",
    borderWidth: 2,
  },
  viewPerson: {
    borderRightWidth: 2,
    borderRightColor: "#AEAEB2",
    paddingHorizontal: 8,
    alignItems: "center",
  },
  textPerson: {
    color: "white",
    fontWeight: "600",
    fontFamily: "System",
  },
  textPersonDown: {
    color: "#8E8E93",
    fontSize: 18,
  },
});
