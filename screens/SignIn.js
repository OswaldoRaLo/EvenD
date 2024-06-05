import React, { useState } from "react";
import { View, TextInput, Text, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "../components/Button";
import axios from "axios";
import { API_BASE_URL } from "../Config";

//datos que se pediran
export default function SignIn({ navigation }) {
  const [userForm, setUserForm] = useState({
    apodo: "",
    correo: "",
    contra: "",
    password_check: "",
  });
  //comprobar el correo
  const checkExistingEmail = async (email) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/usuarios`);
      const existingEmails = response.data.map((user) => user.correo);
      return existingEmails.includes(email);
    } catch (error) {
      console.error(error);
      return true;
    }
  };
  const signin = async () => {
    const { correo } = userForm;

    if (await checkExistingEmail(correo)) {
      Alert.alert("Error", "El correo ya ha sido registrado");
      return;
    }
    //guardar la informacion
    try {
      const response = await axios.post(
        `${API_BASE_URL}/usuarios`,
        userForm
      );
      if (response.status === 200) {
        const user = JSON.stringify(userForm);
        await AsyncStorage.setItem("user", user);
        Alert.alert("Bienvenido", "Registro exitoso");
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Ocurrió un error");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Registro</Text>
      <TextInput
        onChangeText={(text) => setUserForm({ ...userForm, apodo: text })}
        style={styles.input}
        placeholder="Usuario..."
      />
      <TextInput
        onChangeText={(text) => setUserForm({ ...userForm, correo: text })}
        autoCapitalize="none"
        style={styles.input}
        placeholder="Correo..."
      />
      <TextInput
        onChangeText={(text) => setUserForm({ ...userForm, contra: text })}
        style={styles.input}
        placeholder="Contraseña..."
        secureTextEntry={true}
      />
      <TextInput
        onChangeText={(text) =>
          setUserForm({ ...userForm, password_check: text })
        }
        style={styles.input}
        placeholder="Confirmar contraseña..."
        secureTextEntry={true}
      />
      <Button text="Registrarme" style={styles.button} action={signin} />
      <Text onPress={() => navigation.navigate("Login")} style={styles.link}>
        Ya tengo cuenta
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "90%",
    height: 60,
    margin: 12,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#CDCDCD",
    fontFamily: "Glacial",
  },
  header: {
    color: "black",
    fontSize: 80,
    fontFamily: "Glacial",
  },
  link: {
    color: "skyblue",
    fontSize: 18,
    fontFamily: "Glacial",
    marginTop: 50, // Agregar margen superior para separación
  },
  upper_container: {
    flex: 3,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  bottom_container: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 25,
  },
  button: {
    backgroundColor: "skyblue", 
    fontFamily: "Glacial"
  },
});
