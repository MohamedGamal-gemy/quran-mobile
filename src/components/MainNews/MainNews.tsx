import { View, Text, ImageBackground } from "react-native";
import React from "react";
import { styles } from "./styles";

export default function MainNews() {
  return (
    <ImageBackground
      source={{
        uri: "https://i0.wp.com/picjumbo.com/wp-content/uploads/green-natural-background-with-wooden-surface-free-image.jpeg?w=2210&quality=70",
      }}
    >
      <View style={styles.card}>
        <Text>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Accusantium,
          explicabo.
        </Text>
      </View>
    </ImageBackground>
  );
}
