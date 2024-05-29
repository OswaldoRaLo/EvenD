import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ViewEvents({ navigation }) {
  const [events, setEvents] = useState([]);

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

  const deleteEvent = async (eventId) => {
    try {
      const updatedEvents = events.filter((event) => event.id !== eventId);
      await AsyncStorage.setItem("events", JSON.stringify(updatedEvents));
      setEvents(updatedEvents);
    } catch (error) {
      console.error("Error eliminando evento:", error);
    }
  };

  const confirmDeleteEvent = (eventId) => {
    Alert.alert(
      "Eliminar evento",
      "¿Estás seguro de que deseas eliminar este evento?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: () => deleteEvent(eventId),
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Eventos</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.eventItem}
            onPress={() => navigation.navigate("EventDetails", { event: item })}
          >
            {item.image && <Image source={{ uri: item.image }} style={styles.eventImage} />}
            <Text style={styles.eventName}>{item.name}</Text>
            <Text style={styles.eventDetail}>Fecha: {item.date}</Text>
            <Text style={styles.eventDetail}>Ubicación: {item.location}</Text>
            <Text style={styles.eventDetail}>Descripción: {item.description}</Text>
            <Text style={styles.eventDetail}>Tipo: {item.type}</Text>
            <Button
              title="Eliminar"
              onPress={() => confirmDeleteEvent(item.id)}
              color="red"
            />
          </TouchableOpacity>
        )}
      />
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
  eventItem: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  eventImage: {
    width: "100%",
    height: 200,
    marginBottom: 15,
    borderRadius: 10,
  },
  eventName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  eventDetail: {
    fontSize: 16,
    color: "#555",
  },
});
