import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Alert, Text, TouchableOpacity, FlatList, Image, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { API_BASE_URL } from "../Config";

const TipoSelector = ({ onSelect }) => {
  const [tipos, setTipos] = useState([]);
  const [selectedTipo, setSelectedTipo] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/tipo`);
        setTipos(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTipos();
  }, []);

  const handleSelectTipo = (tipo) => {
    setSelectedTipo(tipo);
    onSelect(tipo);
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <View style={styles.tipoSelectorContainer}>
      <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownButton}>
        <Text style={styles.dropdownButtonText}>{selectedTipo ? selectedTipo.nombre : "Selecciona un tipo"}</Text>
      </TouchableOpacity>
      {showDropdown && (
        <FlatList
          data={tipos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.tipoItem}
              onPress={() => handleSelectTipo(item)}
            >
              <Text style={styles.tipoText}>{item.nombre}</Text>
            </TouchableOpacity>
          )}
          ListFooterComponent={<View style={{ height: 10 }} />} // Espacio al final para evitar que el último elemento se corte
        />
      )}
    </View>
  );
};

export default function CreateEvent({ navigation }) {
  const [nombreEvento, setNombreEvento] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [idtipo, setIdTipo] = useState('');
  const [dia, setDia] = useState('');
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState('');
  const [localizacion, setLocalizacion] = useState('');
  const [image, setImage] = useState(null);

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

  const handleCreateEvent = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const { id: idusuario } = JSON.parse(userData);
      console.log(`ID Usuario: ${idusuario}`);

      const fecha = `${ano}-${mes}-${dia}`;

      let imageBase64 = null;
      if (image) {
        const base64Image = await FileSystem.readAsStringAsync(image, { encoding: 'base64' });
        imageBase64 = `data:image/jpeg;base64,${base64Image}`;
      }

      const response = await axios.post(`${API_BASE_URL}/eventos`, {
        idusuario,
        nombreEvento,
        descripcion,
        idtipo: idtipo.id,
        dia: fecha,
        localizacion,
        foto: imageBase64,
      });

      Alert.alert('Evento creado', 'El evento ha sido creado con éxito');
      navigation.navigate("InviteFriends");
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al crear el evento');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Nombre del Evento"
          value={nombreEvento}
          onChangeText={setNombreEvento}
        />
        <TextInput
          style={styles.input}
          placeholder="Descripción"
          value={descripcion}
          onChangeText={setDescripcion}
        />
        <TipoSelector onSelect={setIdTipo} />
        <TextInput
          style={styles.input}
          placeholder="Día"
          value={dia}
          onChangeText={setDia}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Mes"
          value={mes}
          onChangeText={setMes}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Año"
          value={ano}
          onChangeText={setAno}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Localización"
          value={localizacion}
          onChangeText={setLocalizacion}
        />
        <Button title="Elegir Imagen" onPress={handlePickImage} />
        {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
        <Button title="Crear Evento" onPress={handleCreateEvent} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

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
  dropdownButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
  dropdownButtonText: {
    fontSize: 16,
  },
  tipoItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tipoText: {
    fontSize: 16,
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
  tipoSelectorContainer: {
    zIndex: 1,
    marginBottom: 15,
  },
});
