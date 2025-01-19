import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Background from '../amparito/Background'
import Header from '../amparito/Header'
import Button from '../amparito/Button'
import { Checkbox } from 'react-native-paper'

export default function ServiceOrder({ navigation }) {
  const [confirmOrder, setConfirmOrder] = useState(false)
  const [confirmArrival, setConfirmArrival] = useState(false)

  return (
    <Background>
      <Header>Órdenes de Servicio</Header>
      <View style={styles.container}>
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={confirmOrder ? 'checked' : 'unchecked'}
            onPress={() => setConfirmOrder(!confirmOrder)}
          />
          <Text style={styles.label}>Confirmar Orden</Text>
        </View>

        <View style={styles.checkboxContainer}>
          <Checkbox
            status={confirmArrival ? 'checked' : 'unchecked'}
            onPress={() => setConfirmArrival(!confirmArrival)}
          />
          <Text style={styles.label}>Confirmar Llegada</Text>
        </View>
        {/* Botón Costos Adicionales */}
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('AddCost')}
          style={{ marginTop: 20, width: '90%', alignSelf: 'center' }}
        >
          Costos Adicionales
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          Enviar
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  backButton: {
    marginTop: 20,
    alignSelf: 'center',
    width: '50%',
  },
})

export { ServiceOrder }
