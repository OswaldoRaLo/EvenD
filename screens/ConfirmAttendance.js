import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ConfirmAttendance({ navigation }) {
  const [email, setEmail] = useState("");
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const eventsJson = await AsyncStorage.getItem("events");
        if (eventsJson) {
          setEvents(JSON.parse(eventsJson));
        }
      } catch (error) {
        console.error("Error cargando eventos:", error);
      }
    };

    loadEvents();
  }, []);

  const confirmAttendance = async () => {
    try {
      const updatedEvents = events.map((event) => {
        if (event.id === selectedEvent.id && event.invitations.includes(email) && !event.attendees.includes(email)) {
          event.attendees.push(email);
        }
        return event;
      });

      setEvents(updatedEvents);
      await AsyncStorage.setItem("events", JSON.stringify(updatedEvents));
      alert("Asistencia confirmada");

      navigation.navigate("Home");
    } catch (error) {
      console.error("Error confirmando asistencia:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirmar Asistencia</Text>
      <TextInput
        style={styles.input}
        placeholder="Tu Correo"
        value={email}
        onChangeText={setEmail}
      />
      {events.length > 0 && (
        <View style={styles.eventList}>
          <Text style={styles.subTitle}>Selecciona un Evento:</Text>
          {events.map((event) => (
            <Button
              key={event.id}
              title={event.name}
              onPress={() => setSelectedEvent(event)}
              color={selectedEvent && selectedEvent.id === event.id ? "#6200ea" : "#ccc"}
            />
          ))}
        </View>
      )}
      {selectedEvent && (
        <Button title="Confirmar Asistencia" onPress={confirmAttendance} color="#6200ea" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  eventList: {
    marginVertical: 20,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
