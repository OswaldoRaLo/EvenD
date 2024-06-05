import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../AuthContext";

export default function Home({ navigation }) {
  const { signOut } = useAuth();
  const [apodo, setApodo] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const { apodo } = JSON.parse(userData);
          setApodo(apodo);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Error removing user data: ", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Text style={styles.saludo}>Hola, {apodo}</Text>
        <View style={styles.content}>
          <Text style={styles.title}>Bienvenido a la App de Eventos</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={() => navigation.navigate("CreateEvent")} style={styles.button}>
              <View style={styles.buttonContent}>
                <Image source={require('../assets/anadir-evento.png')} style={styles.buttonImage} />
                <Text style={styles.buttonText}>Crear Evento</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("ViewEvents")} style={styles.button}>
              <View style={styles.buttonContent}>
                <Image source={require('../assets/ver.png')} style={styles.buttonImage} />
                <Text style={styles.buttonText}>Ver Eventos</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={() => navigation.navigate("ConfirmAttendance")} style={styles.button}>
              <View style={styles.buttonContent}>
                <Image source={require('../assets/ausencia.png')} style={styles.buttonImage} />
                <Text style={styles.buttonText}>Confirmar Asistencia</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Amigos")} style={styles.button}>
              <View style={styles.buttonContent}>
                <Image source={require('../assets/amigos.png')} style={styles.buttonImage} />
                <Text style={styles.buttonText}>Amigos</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={handleLogout} style={styles.button}>
              <View style={styles.buttonContent}>
                <Image source={require('../assets/cerrar-sesion.png')} style={styles.buttonImage} />
                <Text style={styles.buttonText}>Cerrar Sesión</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  saludo: {
    fontSize: 24,
    color: "#CB4910",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Glacial",
  },
  title: {
    fontSize: 24,
    color: "#CB4910",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Glacial",
  },
  content: {
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  button: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 10,
  },
  buttonContent: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#6200ea",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  buttonText: {
    marginTop: 10,
    fontSize: 14,
    textAlign: "center",
    color: "#6200ea",
    fontWeight: "600",
    fontFamily: "Glacial"
  },
});
