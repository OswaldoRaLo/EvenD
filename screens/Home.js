import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useAuth } from "../AuthContext";

export default function Home({ navigation }) {
  const { signOut } = useAuth();

  const handleLogout = () => {
    signOut();
    navigation.navigate("Login"); 
  };

  return (
    <View style={styles.container}>
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
          <TouchableOpacity onPress={handleLogout} style={styles.button}>
            <View style={styles.buttonContent}>
              <Image source={require('../assets/cerrar-sesion.png')} style={styles.buttonImage} />
              <Text style={styles.buttonText}>Cerrar Sesión</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center" 
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6200ea",
    textAlign: "center",
    marginBottom: 20, 
    fontFamily: "Glacial" 
  },
  content: {
    alignItems: "center", 
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  button: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 10,
  },
  buttonContent: {
    alignItems: "center",
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
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  buttonText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
    color: "#6200ea",
    fontWeight: "600",
  },
});
