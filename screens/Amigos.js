import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Amigos() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pantalla de Amigos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6200ea",
  },
});
