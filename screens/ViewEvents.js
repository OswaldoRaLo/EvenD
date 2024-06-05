import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Image, TouchableOpacity, Modal, Button } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from "../Config";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigation } from '@react-navigation/native';

export default function ViewEvent() {
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null);
  const [invitations, setInvitations] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

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

    const fetchInvitations = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/invitacion`);
        setInvitations(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserId();
    fetchInvitations();
  }, []);

  useEffect(() => {
    const fetchEventData = async () => {
      const events = [];

      const fetchEventDetails = async (eventId) => {
        try {
          const response = await axios.get(`${API_BASE_URL}/eventos/${eventId}`);
          const event = response.data;

          const userResponse = await axios.get(`${API_BASE_URL}/usuarios/${event.idusuario}`);
          const user = userResponse.data.apodo;

          const typeResponse = await axios.get(`${API_BASE_URL}/tipo/${event.idtipo}`);
          const type = typeResponse.data.nombre;

          event.userName = user;
          event.eventType = type;

          return event;
        } catch (error) {
          console.error(error);
          return null;
        }
      };

      for (const invitation of invitations) {
        if (invitation.idusuario === userId) {
          const event = await fetchEventDetails(invitation.idevento);
          if (event) events.push(event);
        }
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/eventos`);
        const userEvents = response.data.filter(event => event.idusuario === userId);

        for (const userEvent of userEvents) {
          const event = await fetchEventDetails(userEvent.id);
          if (event) events.push(event);
        }
      } catch (error) {
        console.error(error);
      }

      setEventData(events);
    };

    if (userId && invitations.length > 0) {
      fetchEventData();
    }
  }, [userId, invitations]);

  const formatFecha = (fecha) => {
    return format(new Date(fecha), 'MMMM dd, yyyy', { locale: es });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.invitationBox}
      onPress={() => {
        setSelectedEvent(item);
        setModalVisible(true);
      }}
    >
      {item.foto && (
        <Image
          source={{ uri: `data:image/jpeg;base64,${item.foto}` }}
          style={styles.banner}
        />
      )}
      <Text style={styles.eventText}>Nombre del Evento: {item.nombreEvento}</Text>
      {item.descripcion && <Text style={styles.eventText}>Descripción: {item.descripcion}</Text>}
      <Text style={styles.eventText}>Anfitrión: {item.userName}</Text>
      <Text style={styles.eventText}>Tipo de evento: {item.eventType}</Text>
      <Text style={styles.eventText}>Fecha del evento: {formatFecha(item.dia)}</Text>
      {item.localizacion && <Text style={styles.eventText}>Localización: {item.localizacion}</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={eventData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />

      {selectedEvent && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Opciones del Evento</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => {
                  setModalVisible(false);
                  navigation.navigate("EventDetails", { eventId: selectedEvent.id });
                }} style={styles.button}>
                  <Text style={styles.buttonText}>Detalles del Evento</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => {
                  setModalVisible(false);
                  navigation.navigate("Album", { eventId: selectedEvent.id });
                }} style={styles.button}>
                  <Text style={styles.buttonText}>Álbum</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => setModalVisible(!modalVisible)} style={styles.button}>
                  <Text style={styles.buttonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  invitationBox: {
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  eventText: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: "Glacial"
  },
  banner: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 18,
    
    marginBottom: 20,
    fontFamily: "Glacial"
  },
  buttonContainer: {
    marginVertical: 10,
    width: '100%',
  },
  button: {
    backgroundColor: "#2196F3",
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Glacial"
  }
});
