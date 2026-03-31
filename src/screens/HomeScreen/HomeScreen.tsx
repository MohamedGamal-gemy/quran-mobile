import { View, Text } from "react-native";
import React from "react";
import Header from "../../components/Header/Header";
import MainNews from "../../components/MainNews/MainNews";

export default function HomeScreen() {
  return (
    <View>
      <Header />
      <MainNews />
    </View>
  );
}
