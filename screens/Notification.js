import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import Background from '../ui/Background'
import Header from '../ui/Header'
import Button from '../ui/Button'
import { db } from '../firebase'
import {
  collection,
  query,
  onSnapshot,
  updateDoc,
  doc,
} from 'firebase/firestore'

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

  const markAsRead = async (id) => {
    try {
      // Actualizar en Firebase
      const notificationRef = doc(db, 'notificationes', id)
      await updateDoc(notificationRef, { read: true })

      // Actualizar el estado local
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      )
      alert(`Notificación ${id} marcada como leída`)
    } catch (error) {
      console.error('Error al marcar como leída:', error)
      alert('Hubo un problema al marcar la notificación como leída.')
    }
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
          labelStyle={styles.smallButtonText}
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
        labelStyle={styles.backButtonText}
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
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardRead: {
    backgroundColor: '#f0f0f0',
    borderColor: '#d4d4d4',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20, // Título más grande
    fontWeight: '700',
    color: '#2c3e50',
  },
  textRead: {
    color: '#95a5a6',
    textDecorationLine: 'line-through',
  },
  description: {
    fontSize: 14,
    color: '#7f8c8d',
    marginVertical: 4,
  },
  message: {
    fontSize: 16,
    color: '#34495e',
    marginVertical: 8,
  },
  smallButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingVertical: 4, // Botón más pequeño
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  smallButtonText: {
    fontSize: 12, // Texto del botón más pequeño
    color: '#fff',
    fontWeight: '500',
  },
  backButton: {
    marginTop: 20,
    alignSelf: 'center',
    width: '50%',
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
})
export { Notification }
