import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from "../Config";

export default function EventDetails({ route }) {
  const { eventId } = route.params;
  const [userId, setUserId] = useState(null);
  const [eventCreator, setEventCreator] = useState(null);
  const [acceptedUsers, setAcceptedUsers] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [concepto, setConcepto] = useState('');
  const [hora, setHora] = useState('');
  const [minuto, setMinuto] = useState('');
  const [peticion, setPeticion] = useState('');
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        const { id } = JSON.parse(userData);
        setUserId(id);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchEventCreator = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/eventos/${eventId}`);
        setEventCreator(response.data.idusuario);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchAcceptedUsers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/invitacion`);
        const filteredUsers = response.data.filter(invite => invite.idevento === eventId && invite.acepta === '1');

        const userDetailsPromises = filteredUsers.map(async (invite) => {
          try {
            const userResponse = await axios.get(`${API_BASE_URL}/usuarios/${invite.idusuario}`);
            return userResponse.data;
          } catch (error) {
            console.error(`Error fetching details for user ${invite.idusuario}`, error);
            return null;
          }
        });

        const userDetails = await Promise.all(userDetailsPromises);
        setAcceptedUsers(userDetails.filter(user => user !== null));
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Hubo un problema al obtener los detalles del evento');
      }
    };

    const fetchItineraries = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/itinerario`);
        const filteredItineraries = response.data.filter(item => item.idevento === eventId);
        setItineraries(filteredItineraries);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserId();
    fetchEventCreator();
    fetchAcceptedUsers();
    fetchItineraries();
  }, [eventId, reload]);

  const handleCreateItinerary = async () => {
    if (!concepto || !hora || !minuto) {
      Alert.alert('Campos obligatorios', 'Por favor completa todos los campos obligatorios.');
      return;
    }

    try {
      const fechaActual = new Date();
      fechaActual.setHours(hora);
      fechaActual.setMinutes(minuto);
      fechaActual.setSeconds(0);

      await axios.post(`${API_BASE_URL}/itinerario`, {
        idevento: eventId,
        hora: fechaActual.toISOString(),
        concepto,
        peticion
      });

      Alert.alert('Itinerario creado con éxito');
      setReload(!reload);
      setConcepto('');
      setHora('');
      setMinuto('');
      setPeticion('');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al crear el itinerario');
    }
  };

  const renderUser = ({ item }) => (
    <View style={styles.userItem}>
      <Text style={styles.userText}>Usuario: {item.apodo}</Text>
      <Text style={styles.userText}>Correo: {item.correo}</Text>
    </View>
  );

  const renderItinerary = ({ item }) => {
    const formattedTime = new Date(item.hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return (
      <View style={styles.itineraryItem}>
        <Text style={styles.itineraryText}>Concepto: {item.concepto}</Text>
        <Text style={styles.itineraryText}>Hora: {formattedTime}</Text>
        {item.peticion && <Text style={styles.itineraryText}>Petición: {item.peticion}</Text>}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {userId === eventCreator && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Concepto *"
            value={concepto}
            onChangeText={setConcepto}
            placeholderTextColor="#888"
          />
          <View style={styles.dateContainer}>
            <TextInput
              style={styles.dateInput}
              placeholder="Hora *"
              value={hora}
              onChangeText={setHora}
              keyboardType="numeric"
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.dateInput}
              placeholder="Minuto *"
              value={minuto}
              onChangeText={setMinuto}
              keyboardType="numeric"
              placeholderTextColor="#888"
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Petición"
            value={peticion}
            onChangeText={setPeticion}
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.button} onPress={handleCreateItinerary}>
            <Text style={styles.buttonText}>Añadir Itinerario</Text>
          </TouchableOpacity>
        </View>
      )}
      <Text style={styles.title}>Itinerario</Text>
      <FlatList
        data={itineraries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItinerary}
      />
      <Text style={styles.title}>Usuarios Confirmados</Text>
      <FlatList
        data={acceptedUsers}
        keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
        renderItem={renderUser}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f5",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: "Glacial",
    marginBottom: 20,
  },
  userItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  userText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Glacial"
  },
  form: {
    marginBottom: 20,
  },
  input: {
    width: "90%",
    height: 60,
    marginVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    fontSize: 18,
    color: "#333",
    fontFamily: "Glacial",
    alignSelf: "center",
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    alignSelf: "center",
  },
  dateInput: {
    width: "45%",
    height: 60,
    marginVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    fontSize: 18,
    color: "#333",
    fontFamily: "Glacial"
  },
  button: {
    width: "60%",
    height: 50,
    backgroundColor: "#FAA64D",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontFamily: "Glacial"
  },
  itineraryItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  itineraryText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Glacial"
  },
});
