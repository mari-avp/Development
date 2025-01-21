import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Background from '../ui/Background'
import Header from '../ui/Header'
import Button from '../ui/Button'
import { Checkbox } from 'react-native-paper'
import { theme } from '../core/theme'

export default function ServiceOrder({ navigation }) {
  const [confirmOrder, setConfirmOrder] = useState(false)
  const [confirmArrival, setConfirmArrival] = useState(false)

  return (
    <Background>
      <Header>Órdenes de Servicio</Header>
      <View style={styles.container}>
        <View
          style={[
            styles.toggleButton,
            confirmOrder && styles.toggleButtonActive,
          ]}
          onTouchEnd={() => setConfirmOrder(!confirmOrder)}
        >
          <Text
            style={[
              styles.toggleButtonText,
              confirmOrder && styles.toggleButtonTextActive,
            ]}
          >
            {confirmOrder ? 'Orden Confirmada' : 'Confirmar Orden'}
          </Text>
        </View>

        <View
          style={[
            styles.toggleButton,
            confirmArrival && styles.toggleButtonActive,
          ]}
          onTouchEnd={() => setConfirmArrival(!confirmArrival)}
        >
          <Text
            style={[
              styles.toggleButtonText,
              confirmArrival && styles.toggleButtonTextActive,
            ]}
          >
            {confirmArrival ? 'Llegada Confirmada' : 'Confirmar Llegada'}
          </Text>
        </View>

        {/* Botón Costos Adicionales */}
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('AddCost')}
          style={styles.outlinedButton}
          labelStyle={styles.outlinedButtonText}
        >
          Costos Adicionales
        </Button>

        {/* Botón Volver */}
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.outlinedButton}
          labelStyle={styles.outlinedButtonText}
        >
          Volver
        </Button>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  toggleButton: {
    width: '90%',
    paddingVertical: 20, // Espaciado interno vertical más amplio
    marginVertical: 15, // Más espacio entre botones
    backgroundColor: '#e0e0e0', // Fondo gris claro
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 3,
  },
  toggleButtonActive: {
    backgroundColor: theme.colors.primary, // Azul cuando está activo
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f8c8d', // Texto gris claro
    marginBottom: 5, // Espacio adicional entre el texto y el botón
  },
  toggleButtonTextActive: {
    color: '#ffffff', // Texto blanco cuando está activo
  },
  backButton: {
    marginTop: 30,
    width: '60%',
    paddingVertical: 12,
    backgroundColor: '#e74c3c', // Rojo para el botón de volver
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  outlinedButton: {
    marginTop: 20,
    width: '80%',
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outlinedButtonText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})

export { ServiceOrder }
