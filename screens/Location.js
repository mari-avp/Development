import React, { useState } from 'react'
import { View, TextInput, StyleSheet, Alert } from 'react-native'
import Background from '../amparito/Background'
import Header from '../amparito/Header'
import Button from '../amparito/Button'
import appFirebase from '../firebase'
import { getFirestore, doc, updateDoc } from 'firebase/firestore'

const db = getFirestore(appFirebase)

export default function Location({ navigation }) {
  const [ubicacion, setUbicacion] = useState({
    direccion: '',
    ciudad: '',
    codigoPostal: '',
  })

  const handleChangeText = (value, field) => {
    setUbicacion({ ...ubicacion, [field]: value })
  }

  const actualizarUbicacion = async () => {
    if (!ubicacion.direccion || !ubicacion.ciudad || !ubicacion.codigoPostal) {
      Alert.alert('Error', 'Por favor complete todos los campos')
      return
    }

    try {
      const docRef = doc(db, 'ubicaciones', 'ubicacionId') // Cambia 'ubicacionId' por el ID de tu documento
      await updateDoc(docRef, {
        direccion: ubicacion.direccion,
        ciudad: ubicacion.ciudad,
        codigoPostal: ubicacion.codigoPostal,
      })
      Alert.alert('Exito', 'Ubicación actualizada correctamente')
      navigation.goBack()
    } catch (error) {
      console.error(error)
      Alert.alert('Error', 'No se pudo actualizar la ubicación')
    }
  }

  return (
    <Background>
      <Header>Actualizar Ubicación</Header>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Dirección"
          onChangeText={(value) => handleChangeText(value, 'direccion')}
          value={ubicacion.direccion}
        />
        <TextInput
          style={styles.input}
          placeholder="Ciudad"
          onChangeText={(value) => handleChangeText(value, 'ciudad')}
          value={ubicacion.ciudad}
        />
        <TextInput
          style={styles.input}
          placeholder="Código Postal"
          keyboardType="numeric"
          onChangeText={(value) => handleChangeText(value, 'codigoPostal')}
          value={ubicacion.codigoPostal}
        />
        <Button
          mode="contained"
          onPress={actualizarUbicacion}
          style={{ marginTop: 20, alignSelf: 'center', width: '50%' }}
        >
          Actualizar
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={{ marginTop: 20, alignSelf: 'center', width: '50%' }}
        >
          Volver
        </Button>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#fff',
  },
})

export { Location }
