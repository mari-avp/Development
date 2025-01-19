import React from 'react'
import Background from '../amparito/Background'
import Header from '../amparito/Header'
import Button from '../amparito/Button'
import Logo from '../amparito/Logo'
import { FlatList, Text, StyleSheet, View } from 'react-native'

export default function OrderComplete({ navigation }) {
  const data = [] // Lista vac ía de órdenes completadas

  return (
    <Background>
      <Logo />
      <Header>Órdenes Completadas</Header>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay órdenes completadas.</Text>
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

export { OrderComplete }
