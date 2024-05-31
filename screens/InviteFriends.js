import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, FlatList, StyleSheet, Alert } from 'react-native';
import { Checkbox } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from "../Config";

export default function InviteFriends({ navigation }) {
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState({});
  const [idevento, setIdevento] = useState(null);

  useEffect(() => {
    const fetchLastEventId = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/eventos/last`);
        setIdevento(response.data.id);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchFriends = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        const { id: idusuario } = JSON.parse(userData);

        const response = await axios.get(`${API_BASE_URL}/listaamigos/${idusuario}`);
        setFriends(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLastEventId();
    fetchFriends();
  }, []);

  const handleToggleFriend = (id) => {
    setSelectedFriends((prev) => ({
      ...prev,
      [id]: !prev[id] ? { peticion: '', dia: '', mes: '', ano: '' } : undefined,
    }));
  };

  const handleInputChange = (id, field, value) => {
    setSelectedFriends((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSaveInvitations = async () => {
    try {
      const invitations = Object.keys(selectedFriends)
        .filter((id) => selectedFriends[id])
        .map((id) => ({
          idevento,
          peticion: selectedFriends[id].peticion,
          idusuario: id,
          limiteacept: `${selectedFriends[id].ano}-${selectedFriends[id].mes}-${selectedFriends[id].dia}`,
        }));

      for (const invitation of invitations) {
        await axios.post(`${API_BASE_URL}/invitacion`, invitation);
      }

      Alert.alert('Invitaciones enviadas', 'Las invitaciones han sido enviadas con éxito');
      navigation.navigate("Home");
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al enviar las invitaciones');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.friendItem}>
            <Checkbox
              status={selectedFriends[item.id] ? 'checked' : 'unchecked'}
              onPress={() => handleToggleFriend(item.id)}
            />
            <Text style={styles.friendName}>{item.apodo}</Text>
            {selectedFriends[item.id] && (
              <View style={styles.additionalInputs}>
                <TextInput
                  style={styles.input}
                  placeholder="Petición especial"
                  value={selectedFriends[item.id].peticion}
                  onChangeText={(text) => handleInputChange(item.id, 'peticion', text)}
                />
                <View style={styles.dateInputs}>
                  <TextInput
                    style={styles.input}
                    placeholder="Día"
                    value={selectedFriends[item.id].dia}
                    onChangeText={(text) => handleInputChange(item.id, 'dia', text)}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Mes"
                    value={selectedFriends[item.id].mes}
                    onChangeText={(text) => handleInputChange(item.id, 'mes', text)}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Año"
                    value={selectedFriends[item.id].ano}
                    onChangeText={(text) => handleInputChange(item.id, 'ano', text)}
                    keyboardType="numeric"
                  />
                </View>
                <Text style={styles.dateHint}>Fecha límite para aceptar la invitación</Text>
              </View>
            )}
          </View>
        )}
      />
      <Button title="Guardar" onPress={handleSaveInvitations} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  friendName: {
    marginLeft: 10,
    fontSize: 16,
  },
  additionalInputs: {
    flex: 1,
    marginLeft: 20,
  },
  dateInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    flex: 1,
  },
  dateHint: {
    fontSize: 12,
    color: '#666',
    marginTop: -10,
    marginBottom: 10,
  },
});
