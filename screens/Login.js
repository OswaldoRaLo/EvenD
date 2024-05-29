import React, { useState } from "react";
import { View, TextInput, Text, Alert, StyleSheet, KeyboardAvoidingView, Platform, Image } from "react-native";
import { Button } from "../components/Button";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../AuthContext";
import { API_BASE_URL } from "../Config";

export default function Login({ navigation }) {
  const { signIn } = useAuth();
  const [userForm, setUserForm] = useState({
    mail: "",
    password: "",
  });

  const login = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/usuarios`);
      const userData = response.data.find(
        (user) =>
          user.correo === userForm.mail && user.contra === userForm.password
      );

      if (userData) {
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        signIn();
      } else {
        Alert.alert("Error", "Correo o contraseña incorrectos");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Ocurrió un error");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100}
    >
      <Image source={require("../assets/waves.png")} style={styles.bottomImage} />
      <Image source={require("../assets/EvenD.png")} style={styles.headerImage} />
      <View style={styles.contentContainer}>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          onChangeText={(text) => setUserForm({ ...userForm, mail: text })}
          placeholder="Correo..."
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          onChangeText={(text) => setUserForm({ ...userForm, password: text })}
          placeholder="Contraseña..."
          placeholderTextColor="#888"
          secureTextEntry={true}
        />
        <Button text="Iniciar sesión" style={styles.button} action={login} />

        <Text onPress={() => navigation.navigate("SignIn")} style={styles.link}>
          ¿No tienes cuenta? ¡Regístrate!
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  headerImage: {
    width: "100%",
    height: 365,
    resizeMode: "contain",
    position: "absolute",
    top: 0,
    zIndex: -1,
  },
  bottomImage: {
    width: "100%",
    height: "40%",
    resizeMode: "cover",
    position: "absolute",
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 200,
  },
  input: {
    width: "90%",
    height: 60,
    margin: 12,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#CDCDCD",
    fontFamily: "Helvetica",
    color: "white",
  },
  button: {
    backgroundColor: "#FAA64D",
    color: "black",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
  },
  link: {
    color: "#EE8354",
    fontSize: 18,
    marginTop: 30,
  },
});

