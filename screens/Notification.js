import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import Background from '../amparito/Background'
import Header from '../amparito/Header'
import Button from '../amparito/Button'
import { db } from '../firebase'
import { collection, query, onSnapshot } from 'firebase/firestore'

export default function Notification({ navigation }) {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const q = query(collection(db, 'notificationes'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notificationsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setNotifications(notificationsData)
    })
    return () => unsubscribe()
  }, [])

  const markAsRead = (id) => {
    alert(`Notificación ${id} marcada como leída`)
  }

  const renderNotification = ({ item }) => (
    <View style={[styles.card, item.read && styles.cardRead]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.title, item.read && styles.textRead]}>
          {item.title}
        </Text>
      </View>
      <Text style={styles.description}>{item.driverType}</Text>
      <Text style={styles.message}>{item.message}</Text>
      {!item.read && (
        <Button
          mode="contained"
          onPress={() => markAsRead(item.id)}
          style={styles.smallButton}
        >
          Marcar como leído
        </Button>
      )}
    </View>
  )

  return (
    <Background>
      <Header>Notificaciones</Header>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        contentContainerStyle={styles.list}
      />

      {/* Botón Volver */}
      <Button
        mode="contained"
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        Volver
      </Button>
    </Background>
  )
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardRead: {
    backgroundColor: '#f9f9f9',
    borderColor: '#ddd',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  textRead: {
    color: '#aaa',
    textDecorationLine: 'line-through',
  },
  smallButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 12,
  },
  backButton: {
    marginTop: 20,
    alignSelf: 'center',
    width: '50%',
  },
})

export { Notification }
