import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { fallbackPersonImage, image185 } from "../api/moviedb";

const Cast = ({ cast, navigation }) => {
  let personName = "Keanu Reevs";
  let characterName = "John Wick";
  return (
    <View style={styles.container}>
      <Text style={styles.textContainer}>Top Cast</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
      >
        {cast &&
          cast.map((person, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={{ marginRight: 16, alignItems: "center" }}
                onPress={() => navigation.navigate("Person", person)}
              >
                <View style={styles.viewImage}>
                  <Image
                    style={styles.image}
                    // source={require("../assets/images/castImage1.png")}
                    source={{
                      uri:
                        image185(person?.profile_path) || fallbackPersonImage,
                    }}
                  />
                </View>
                <Text style={styles.textCharacter}>
                  {" "}
                  {person?.character.length > 10
                    ? person?.character.slice(0, 10) + "..."
                    : person?.character}{" "}
                </Text>
                <Text style={styles.textOriginal}>
                  {person?.original_name.length > 10
                    ? person?.original_name.slice(0, 10) + "..."
                    : person?.original_name}
                </Text>
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </View>
  );
};

export default Cast;

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
  },
  textContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
    color: "white",
    fontSize: 18,
  },
  viewImage: {
    overflow: "hidden",
    borderRadius: 10,
    height: 20,
    width: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#6B7280",
  },
  image: {
    borderRadius: 32,
    height: 24,
    width: 20,
  },
  textCharacter: {
    marginTop: 4,
    color: "white",
    fontSize: 12,
  },
  textOriginal: {
    color: "#9CA3AF",
    fontSize: 12,
  },
});
