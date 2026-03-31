import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { styles } from "./styles";

export default function Header() {
  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../../../assets/3551739.jpg")}
      />
      <Text style={styles.title}>Header</Text>
      <Image
        style={styles.bell}
        source={{
          uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS39BRZJRM6hjSNYykQdrXd5tUPcogWEiV7pQ&s",
        }}
      />
    </View>
  );
}

