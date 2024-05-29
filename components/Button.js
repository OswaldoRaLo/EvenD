//components/Button.js


import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

export const Button = (props) => {
  return (
    <TouchableOpacity onPress={props.action}>
      <View style={[styles.button_container, props.style]}>
        <Text style={styles.button_text}>{props.text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button_container: {
    backgroundColor: "white",
    width: 150,
    height: 50,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  button_text: {
    color: "rgba(255, 255, 255, 255)",
  },
});
