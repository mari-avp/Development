import React from 'react'
import Background from '../ui/Background'
import Header from '../ui/Header'
import Button from '../ui/Button'
import Logo from '../ui/Logo'
import { FlatList, Text, StyleSheet, View } from 'react-native'

export default function OrderRejected({ navigation }) {
  const data = [] // Lista vacía de órdenes completadas

  return (
    <Background>
      <Logo />
      <Header>Órdenes Rechazadas</Header>

      {/* Lista de órdenes */}
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay órdenes rechazadas.</Text>
        }
      />

      {/* Botón para regresar */}
      <Button mode="contained" onPress={() => navigation.goBack()}>
        Volver
      </Button>
    </Background>
  )
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
  },
})

export { OrderRejected }
