import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'area_asignada';

const EQUIPAMIENTO = [
  'Pantalla 4K de 85"',
  'Sistema de Micrófonos Omnidireccionales',
  'Cámara PTZ para videollamadas',
  'Red Wi-Fi dedicada',
  'Tomas Eléctricas',
];

export default function App() {
  const [areaGuardada, setAreaGuardada] = useState('');
  const [areaInput, setAreaInput] = useState('');
  const [disponible, setDisponible] = useState(true);

  // Recuperación automática al abrir la app
  useEffect(() => {
    const cargarArea = async () => {
      try {
        const valor = await AsyncStorage.getItem(STORAGE_KEY);
        if (valor !== null) setAreaGuardada(valor);
      } catch (e) {
        console.error('Error al leer el área', e);
      }
    };
    cargarArea();
  }, []);

  // Guardado persistente
  const guardarArea = async () => {
    if (areaInput.trim() === '') {
      Alert.alert('Atención', 'Escribe el nombre del área.');
      return;
    }
    try {
      await AsyncStorage.setItem(STORAGE_KEY, areaInput.trim());
      setAreaGuardada(areaInput.trim());
      setAreaInput('');
      Alert.alert('Listo', 'Área guardada correctamente.');
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar el área.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Encabezado con el área guardada */}
      <Text style={styles.header}>
        Área encargada: {areaGuardada || 'Sin asignar'}
      </Text>

      {/* Ficha visual */}
      <View style={styles.card}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800' }}
          style={styles.image}
        />
        <Text style={styles.title}>Sala de Conferencias Ejecutiva A-1</Text>
        <Text style={styles.subtitle}>Aforo máximo: 25 personas</Text>
      </View>

      {/* Inventario */}
      <Text style={styles.sectionTitle}>Equipamiento disponible</Text>
      {EQUIPAMIENTO.map((item) => (
        <Text key={item} style={styles.item}>• {item}</Text>
      ))}

      {/* Entrada y guardado */}
      <Text style={styles.sectionTitle}>Asignar área</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. Gerencia de Tecnología"
        value={areaInput}
        onChangeText={setAreaInput}
      />
      <TouchableOpacity style={styles.saveButton} onPress={guardarArea}>
        <Text style={styles.buttonText}>Guardar área</Text>
      </TouchableOpacity>

      {/* Disponibilidad */}
      <TouchableOpacity
        style={[styles.statusButton, { backgroundColor: disponible ? '#2e9e4f' : '#d32f2f' }]}
        onPress={() => setDisponible(!disponible)}
      >
        <Text style={styles.buttonText}>
          {disponible ? 'SALA DISPONIBLE' : 'SALA EN USO'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 60, backgroundColor: '#f4f6f8' },
  header: { fontSize: 18, fontWeight: 'bold', color: '#1a237e', marginBottom: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', elevation: 3, marginBottom: 20 },
  image: { width: '100%', height: 180 },
  title: { fontSize: 20, fontWeight: 'bold', padding: 12, paddingBottom: 2 },
  subtitle: { fontSize: 15, color: '#555', paddingHorizontal: 12, paddingBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '600', marginTop: 10, marginBottom: 8 },
  item: { fontSize: 15, marginBottom: 4, color: '#333' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 10 },
  saveButton: { backgroundColor: '#1a237e', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  statusButton: { padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 30 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});