import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
} from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { XMarkIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import { debounce } from "lodash";

import { fallbackMoviePoster, image185, searchMovies } from "../api/moviedb";
import Loading from "../components/loading";

const { width, height } = Dimensions.get("window");
export default function SearchScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = (search) => {
    if (search && search.length > 2) {
      setLoading(true);
      searchMovies({
        query: search,
        include_adult: false,
        language: "en-US",
        page: "1",
      }).then((data) => {
        console.log("got search results");
        setLoading(false);
        if (data && data.results) setResults(data.results);
      });
    } else {
      setLoading(false);
      setResults([]);
    }
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

  return (
    <SafeAreaView style={styles.container}>
      {/* search input */}
      <View style={styles.viewContainer}>
        <TextInput
          onChangeText={handleTextDebounce}
          placeholder="Search Movie"
          placeholderTextColor={"lightgray"}
          style={styles.textInput}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.button}
        >
          <XMarkIcon size="25" color="white" />
        </TouchableOpacity>
      </View>
      {/* search results */}
      {loading ? (
        <Loading />
      ) : results.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15 }}
          style={{ marginTop: 3, marginBottom: 3 }}
        >
          <Text style={styles.textResults}>Results ({results.length})</Text>
          <View style={styles.viewResults}>
            {results.map((item, index) => {
              return (
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() => navigation.push("Movie", item)}
                >
                  <View style={{ marginTop: 2, marginBottom: 4 }}>
                    <Image
                      source={{
                        uri: image185(item.poster_path) || fallbackMoviePoster,
                      }}
                      // source={require("../assets/images/moviePoster2.png")}
                      style={{
                        width: width * 0.44,
                        height: height * 0.3,
                        borderRadius: 48,
                      }}
                    />
                    <Text
                      style={{
                        color: "#D1D5DB",
                        marginLeft: 1,
                      }}
                    >
                      {item.title.length > 22
                        ? item.title.slice(0, 22) + "..."
                        : item.title}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
          </View>
        </ScrollView>
      ) : (
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Image
            source={require("../assets/images/movieTime.png")}
            style={{ height: 96, width: 96 }}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1C1C1E",
    flex: 1,
  },
  viewContainer: {
    marginLeft: 4,
    marginRight: 4,
    marginBottom: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#7D7D87",
    borderRadius: 9999,
  },
  textInput: {
    paddingBottom: 1,
    paddingLeft: 6,
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 1,
  },
  button: {
    borderRadius: 9999,
    padding: 3,
    margin: 1,
    backgroundColor: "#7D7D87",
  },
  textResults: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 1,
  },
  viewResults: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
});
