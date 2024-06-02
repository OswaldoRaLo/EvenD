import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Alert, Text, TouchableOpacity, FlatList, Image, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Modal } from 'react-native';
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
        <Text style={styles.dropdownButtonText}>{selectedTipo ? selectedTipo.nombre : "Selecciona un tipo *"}</Text>
      </TouchableOpacity>
      <Modal
        visible={showDropdown}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDropdown(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
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
            />
            <TouchableOpacity onPress={() => setShowDropdown(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default function CreateEvent({ navigation }) {
  const [nombreEvento, setNombreEvento] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [idtipo, setIdTipo] = useState(null);
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
    if (!nombreEvento || !idtipo || !dia || !mes || !ano) {
      Alert.alert('Campos obligatorios', 'Por favor completa todos los campos obligatorios.');
      return;
    }

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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
          <TextInput
            style={styles.input}
            placeholder="Nombre del Evento *"
            value={nombreEvento}
            onChangeText={setNombreEvento}
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            placeholder="Descripción"
            value={descripcion}
            onChangeText={setDescripcion}
            placeholderTextColor="#888"
          />
          <TipoSelector onSelect={setIdTipo} />
          <View style={styles.dateContainer}>
            <TextInput
              style={styles.dateInput}
              placeholder="Día *"
              value={dia}
              onChangeText={setDia}
              keyboardType="numeric"
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.dateInput}
              placeholder="Mes *"
              value={mes}
              onChangeText={setMes}
              keyboardType="numeric"
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.dateInput}
              placeholder="Año *"
              value={ano}
              onChangeText={setAno}
              keyboardType="numeric"
              placeholderTextColor="#888"
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Localización"
            value={localizacion}
            onChangeText={setLocalizacion}
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.button} onPress={handlePickImage}>
            <Text style={styles.buttonText}>Elegir Imagen</Text>
          </TouchableOpacity>
          {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
          <TouchableOpacity style={styles.button} onPress={handleCreateEvent}>
            <Text style={styles.buttonText}>Crear Evento</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f5",
    padding: 20,
  },
  scrollContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  keyboardAvoidingView: {
    width: "100%",
    alignItems: "center",
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
    alignSelf: "center",
    fontFamily: 'Glacial'
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    alignSelf: "center",
  },
  dateInput: {
    width: "30%",
    height: 60,
    marginVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    fontSize: 18,
    color: "#333",
    fontFamily: 'Glacial'
  },
  dropdownButton: {
    width: "90%",
    height: 60,
    marginVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    justifyContent: "center",
    alignSelf: "center",
  },
  dropdownButtonText: {
    fontSize: 18,
    color: "#888",
    fontFamily: 'Glacial'
  },
  dropdownContainer: {
    maxHeight: 200,
    width: "90%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginTop: 10,
    alignSelf: "center",
  },
  tipoItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tipoText: {
    fontSize: 18,
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#FAA64D",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 18,
    color: "white",
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
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
