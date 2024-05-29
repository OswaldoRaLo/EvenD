import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';

export default function CreateEvent({ navigation }) {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventImage, setEventImage] = useState(null);
  const [eventGuests, setEventGuests] = useState("");
  const [eventInvitations, setEventInvitations] = useState("");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setEventImage(result.uri);
    }
  };

  const saveEvent = async () => {
    try {
      const newEvent = {
        id: Date.now(),
        name: eventName,
        date: eventDate,
        location: eventLocation,
        description: eventDescription,
        type: eventType,
        image: eventImage,
        guests: eventGuests.split(",").map(email => email.trim()),
        invitations: eventInvitations.split(",").map(email => email.trim()),
        attendees: [],
      };

      const existingEventsJson = await AsyncStorage.getItem("events");
      const existingEvents = existingEventsJson ? JSON.parse(existingEventsJson) : [];

      existingEvents.push(newEvent);

      await AsyncStorage.setItem("events", JSON.stringify(existingEvents));
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error guardando el evento:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear Evento</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del Evento"
        value={eventName}
        onChangeText={setEventName}
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha del Evento"
        value={eventDate}
        onChangeText={setEventDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Ubicación del Evento"
        value={eventLocation}
        onChangeText={setEventLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción del Evento"
        value={eventDescription}
        onChangeText={setEventDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Tipo de Evento"
        value={eventType}
        onChangeText={setEventType}
      />
      <Button title="Seleccionar Imagen" onPress={pickImage} />
      {eventImage && <Text>Imagen seleccionada</Text>}
      <TextInput
        style={styles.input}
        placeholder="Correos Electrónicos de Invitados (separados por comas)"
        value={eventGuests}
        onChangeText={setEventGuests}
      />
      <Button title="Guardar Evento" onPress={saveEvent} />
    </ScrollView>
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
});
