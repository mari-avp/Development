import React, { useState, useContext } from 'react'
import { TextInput, StyleSheet, View, Alert } from 'react-native'
import Background from '../ui/Background'
import Header from '../ui/Header'
import Button from '../ui/Button'

// Import Firebase
import appFirebase from '../firebase'
import { getFirestore, collection, addDoc } from 'firebase/firestore'

// Importar AuthContext
import { AuthContext } from '../context/AuthContext'

const db = getFirestore(appFirebase)

export default function AddCost({ navigation }) {
  const initialState = {
    nombre: '',
    monto: '',
    descripcion: '',
  }

  const [state, setState] = useState(initialState)

  // Obtener conductorId desde el contexto de autenticación
  const { state: authState } = useContext(AuthContext)
  const idConductor = authState.conductorId

  const handleChangeText = (value, field) => {
    setState({ ...state, [field]: value })
  }

  const fetchId = async (idConductor) => {
    try {
      const response = await fetch(
        `https://gruasgateway-41350bb76e1e.herokuapp.com/ordenes/api/OrdenDeServicio/${idConductor}/ordenes`
      )
      const data = await response.json()
      console.log('Respuesta del endpoint:', data) // Verificar la respuesta completa

      // Buscar el id de la orden con estado=1
      const activeOrder = data.find((order) => order.estado === 1)

      if (activeOrder && activeOrder.id) {
        console.log('idOrden obtenido con estado=1:', activeOrder.id)
        return activeOrder.id
      } else {
        console.error('No se encontró ninguna orden con estado=1.')
        throw new Error('No se encontró ningún id válido con estado=1.')
      }
    } catch (error) {
      console.error('Error al obtener el id:', error)
      throw error
    }
  }

  const saveCost = async () => {
    if (!idConductor) {
      Alert.alert(
        'Error',
        'No se encontró el ID del conductor. Por favor, intenta iniciar sesión nuevamente.'
      )
      return
    }

    try {
      // Fetch id de la orden usando el id del conductor
      const idOrden = await fetchId(idConductor)

      if (!idOrden) {
        Alert.alert(
          'Error',
          'No se pudo obtener un id de orden válido. Por favor, revisa los datos e intenta nuevamente.'
        )
        return
      }

      // Guardar en Firestore
      await addDoc(collection(db, 'extracost'), {
        ...state,
        idConductor, // Guardar el id del conductor
        idOrden, // Guardar el id de la orden
      })
      Alert.alert('Alerta', 'Guardado con éxito')
      navigation.navigate('OrderProcess')
    } catch (error) {
      console.error('Error al guardar el costo extra:', error)
      Alert.alert('Error', 'Hubo un problema al guardar el costo extra')
    }
  }

  return (
    <Background>
      <Header>Costos Adicionales</Header>
      <View style={styles.centeredButtonContainer}>
        {/* Campo para nombre */}
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={state.nombre}
          onChangeText={(value) => handleChangeText(value, 'nombre')}
        />
        {/* Campo para monto */}
        <TextInput
          style={styles.input}
          placeholder="Monto"
          keyboardType="numeric"
          value={state.monto}
          onChangeText={(value) => handleChangeText(value, 'monto')}
        />
        {/* Campo para descripción */}
        <TextInput
          style={styles.input}
          placeholder="Descripción"
          multiline={true}
          numberOfLines={4}
          value={state.descripcion}
          onChangeText={(value) => handleChangeText(value, 'descripcion')}
        />
      </View>
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
  centeredButtonContainer: {
    flex: 1,
    alignItems: 'center',
    marginVertical: 20,
  },
})

export { AddCost }
