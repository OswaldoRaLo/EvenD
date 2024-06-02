import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
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
    const errors = [];

    for (const friendId of Object.keys(selectedFriends)) {
      if (selectedFriends[friendId]) {
        const { dia, mes, ano } = selectedFriends[friendId];
        if (!dia || !mes || !ano) {
          const friend = friends.find(f => f.id === parseInt(friendId));
          errors.push(`Por favor, completa la fecha límite para ${friend.apodo}`);
        }
      }
    }

    if (errors.length > 0) {
      Alert.alert('Error', errors.join('\n'));
      return;
    }

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
        ListHeaderComponent={<Text style={styles.title}>Invitar Amigos</Text>}
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
                    style={styles.dateInput}
                    placeholder="Día"
                    value={selectedFriends[item.id].dia}
                    onChangeText={(text) => handleInputChange(item.id, 'dia', text)}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={styles.dateInput}
                    placeholder="Mes"
                    value={selectedFriends[item.id].mes}
                    onChangeText={(text) => handleInputChange(item.id, 'mes', text)}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={styles.dateInput}
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
        ListFooterComponent={
          <TouchableOpacity style={styles.button} onPress={handleSaveInvitations}>
            <Text style={styles.buttonText}>Guardar</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 40,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    alignSelf: 'center',
    fontFamily: 'Glacial'
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  friendName: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'Glacial'
  },
  additionalInputs: {
    flex: 1,
    marginLeft: 20,
  },
  dateInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    flex: 1,
    fontFamily: 'Glacial'
  },
  dateInput: {
    width: "30%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontFamily:'Glacial'
  },
  dateHint: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Glacial'
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
    fontFamily: 'Glacial'
  },
});
