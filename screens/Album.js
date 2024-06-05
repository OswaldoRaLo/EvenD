import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { API_BASE_URL } from "../Config";
import { format } from 'date-fns';

export default function Album({ route, navigation }) {
  const { eventId } = route.params;
  const [descripcion, setDescripcion] = useState('');
  const [hora, setHora] = useState('');
  const [minuto, setMinuto] = useState('');
  const [image, setImage] = useState(null);
  const [albumItems, setAlbumItems] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchAlbumItems = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/album`);
        const filteredItems = response.data.filter(item => item.idevento === eventId);
        setAlbumItems(filteredItems);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAlbumItems();
  }, [eventId, reload]);

  const handlePickImage = async () => {
    let result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (result.granted === false) {
      Alert.alert('Permiso requerido', 'Se requiere permiso para acceder a la galería.');
      return;
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!pickerResult.canceled) {
      setImage(pickerResult.assets[0].uri);
    }
  };

  const handleCreateAlbum = async () => {
    if (!image) {
      Alert.alert('Campos obligatorios', 'Por favor completa todos los campos obligatorios.');
      return;
    }

    try {
      let imageBase64 = null;
      if (image) {
        const base64Image = await FileSystem.readAsStringAsync(image, { encoding: 'base64' });
        imageBase64 = `data:image/jpeg;base64,${base64Image}`;
      }

      const fechaActual = new Date();
      const fechaHora = new Date(fechaActual);
      if (hora !== '' && minuto !== '') {
        fechaHora.setHours(hora);
        fechaHora.setMinutes(minuto);
      }

      const response = await axios.post(`${API_BASE_URL}/album`, {
        foto: imageBase64,
        descripcion,
        hora: fechaHora.toISOString(),
        idevento: eventId,
      });

      Alert.alert('Elemento añadido al álbum con éxito');
      setReload(!reload);
      setImage(null);
      setDescripcion('');
      setHora('');
      setMinuto('');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al crear el álbum');
    }
  };

  const renderAlbumItem = ({ item }) => (
    <View style={styles.albumItem}>
      {item.foto && (
        <Image
          source={{ uri: `data:image/jpeg;base64,${item.foto}` }}
          style={styles.albumImage}
        />
      )}
      <Text style={styles.albumText}>{item.descripcion}</Text>
      <Text style={styles.albumText}>{new Date(item.hora).toLocaleString()}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={albumItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderAlbumItem}
        ListHeaderComponent={
          <>
            <TextInput
              style={styles.input}
              placeholder="Descripción"
              value={descripcion}
              onChangeText={setDescripcion}
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
            <TouchableOpacity style={styles.button} onPress={handlePickImage}>
              <Text style={styles.buttonText}>Elegir Imagen</Text>
            </TouchableOpacity>
            {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
            <TouchableOpacity style={styles.button} onPress={handleCreateAlbum}>
              <Text style={styles.buttonText}>Añadir al Álbum</Text>
            </TouchableOpacity>
          </>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f5",
    padding: 20,
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
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
  },
  albumList: {
    width: "100%",
    marginTop: 20,
  },
  albumItem: {
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
  albumImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  albumText: {
    fontSize: 16,
    marginTop: 10,
  },
});
