import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Checkbox } from 'react-native-paper';
import { API_BASE_URL } from "../Config";
import { format, isAfter } from 'date-fns';
import { es } from 'date-fns/locale';

export default function ConfirmInvitations() {
  const [userId, setUserId] = useState(null);
  const [invitations, setInvitations] = useState([]);
  const [eventData, setEventData] = useState([]);

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
        const validInvitations = response.data.filter(invitation =>
          isAfter(new Date(invitation.limiteacept), new Date())
        );
        setInvitations(validInvitations);
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
      for (const invitation of invitations) {
        if (invitation.idusuario === userId) {
          try {
            const response = await axios.get(`${API_BASE_URL}/eventos/${invitation.idevento}`);
            const event = response.data;

            const userResponse = await axios.get(`${API_BASE_URL}/usuarios/${event.idusuario}`);
            const user = userResponse.data.apodo;

            const typeResponse = await axios.get(`${API_BASE_URL}/tipo/${event.idtipo}`);
            const type = typeResponse.data.nombre;

            event.userName = user;
            event.eventType = type;
            event.peticion = invitation.peticion;
            event.limiteacept = invitation.limiteacept;
            event.invitationId = invitation.id;
            event.acepta = invitation.acepta;

            events.push(event);
          } catch (error) {
            console.error(error);
          }
        }
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

  const handleAcceptInvitation = async (invitationId, isChecked) => {
    try {
      const invita = invitations.find((inv) => inv.id === invitationId);
      const acepta = isChecked ? '1' : null;
      const updatedInvitation = {
        idevento: invita.idevento,
        peticion: invita.peticion,
        idusuario: invita.idusuario,
        limiteacept: invita.limiteacept,
        acepta: acepta,
      };

      await axios.put(`${API_BASE_URL}/invitacion/${invitationId}`, updatedInvitation);
      const updatedEvents = eventData.map(event =>
        event.invitationId === invitationId ? { ...event, acepta } : event
      );
      setEventData(updatedEvents);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al actualizar la invitación');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.invitationBox}>
      {item.foto && (
        <Image
          source={{ uri: `data:image/jpeg;base64,${item.foto}` }}
          style={styles.banner}
        />
      )}
      <Text style={styles.eventText}>Nombre del Evento: {item.nombreEvento}</Text>
      {item.descripcion && <Text style={styles.eventText}>Descripción: {item.descripcion}</Text>}
      <Text style={styles.eventText}>Anfitrión: {item.userName}</Text>
      <Text style={styles.eventText}>Tipo: {item.eventType}</Text>
      <Text style={styles.eventText}>Fecha del evento: {formatFecha(item.dia)}</Text>
      {item.localizacion && <Text style={styles.eventText}>Localización: {item.localizacion}</Text>}
      <Text style={styles.eventText}>Petición especial: {item.peticion}</Text>
      <Text style={styles.eventText}>Fecha límite para aceptar: {formatFecha(item.limiteacept)}</Text>
      <View style={styles.checkboxContainer}>
        <Checkbox
          status={item.acepta === '1' ? 'checked' : 'unchecked'}
          onPress={() => handleAcceptInvitation(item.invitationId, item.acepta !== '1')}
        />
        <Text style={styles.label}>Aceptar invitación</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={eventData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
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
  label: {
    fontSize: 14,
    marginBottom: 5,
    fontFamily: "Glacial",
  },
  text: {
    fontSize: 14,
    marginBottom: 10,
  },
  banner: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
});
