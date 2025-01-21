import React, { useState } from 'react'
import { TextInput, StyleSheet, View, Alert } from 'react-native'
import Background from '../ui/Background'
import Header from '../ui/Header'
import Button from '../ui/Button'
//importar firebase
import appFirebase from '../firebase'
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  setDoc,
} from 'firebase/firestore'

const db = getFirestore(appFirebase)

export default function AddCost({ navigation }) {
  const initialState = {
    precio: '',
    descripcion: '',
  }

  const [state, setState] = useState(initialState)
  const handleChangeText = (value, precio) => {
    setState({ ...state, [precio]: value })
  }
  const saveCost = async () => {
    // Aquí puedes manejar el guardado de datos
    try {
      await addDoc(collection(db, 'extracost'), {
        ...state,
      })
      Alert.alert('Alerta', 'guardado con exito')
      navigation.navigation('ServiceOrder')
    } catch {
      console.error(error)
    }
  }

  return (
    <Background>
      <Header>Costos Adicionales</Header>

      {/* Campo para Precio */}
      <TextInput
        style={styles.input}
        placeholder="Precio"
        keyboardType="numeric"
        onChangeText={(value) => handleChangeText(value, 'precio')}
        value={state.precio}
      />

      {/* Campo para Descripción */}
      <TextInput
        style={styles.textArea}
        placeholder="Descripción"
        multiline={true}
        numberOfLines={4}
        onChangeText={(value) => handleChangeText(value, 'descripcion')}
        value={state.descripcion}
      />

      {/* Botón para guardar */}
      <Button
        mode="contained"
        onPress={saveCost}
        style={{ marginTop: 20, alignSelf: 'center', width: '50%' }}
      >
        Enviar
      </Button>

      {/* Botón para volver */}
      <Button
        mode="outlined"
        onPress={() => navigation.goBack()}
        style={{ marginTop: 20, alignSelf: 'center', width: '50%' }}
      >
        Volver
      </Button>
    </Background>
  )
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    borderColor: '#aaa', // Cambia el color del borde si es necesario
    borderWidth: 1, // Ajusta el grosor del borde
    padding: 10, // Agrega un poco más de espacio dentro del campo
    borderRadius: 5, // Bordes redondeados
    backgroundColor: '#fff',
  },
})

export { AddCost }
