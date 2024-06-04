import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from "../Config";

export default function Amigos() {
  const [friends, setFriends] = useState([]);
  const [search, setSearch] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        const { id: idusuario } = JSON.parse(userData);
        setUser(idusuario);

        const response = await axios.get(`${API_BASE_URL}/listaamigos/${idusuario}`);
        setFriends(response.data);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Hubo un problema al obtener la lista de amigos');
      }
    };

    fetchFriends();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/usuarios/correo/${search}`);
      const friend = response.data;
      await addFriend(friend.id);
      Alert.alert('Amigo añadido', `${friend.apodo} ha sido añadido a tu lista de amigos`);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al buscar el usuario');
    }
  };

  const addFriend = async (friendId) => {
    try {
      await axios.post(`${API_BASE_URL}/listaamigos`, { idusuario: user, idamigo: friendId });
      const updatedFriends = await axios.get(`${API_BASE_URL}/listaamigos/${user}`);
      setFriends(updatedFriends.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al añadir al amigo');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar por correo"
        value={search}
        onChangeText={setSearch}
      />
      <Button title="Añadir Amigo" onPress={handleSearch} />
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.friendItem}>
            <Text style={styles.friendText}>{item.apodo}</Text>
            <Text style={styles.friendText}>{item.correo}</Text>
          </View>
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
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  friendItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  friendText: {
    fontSize: 16,
  },
});
