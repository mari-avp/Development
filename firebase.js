import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAx7b0SaGQQezRwk-EmOY4deITdD7_b120',
  authDomain: 'gruas-ucab-fbaca.firebaseapp.com',
  projectId: 'gruas-ucab-fbaca',
  storageBucket: 'gruas-ucab-fbaca.firebasestorage.app',
  messagingSenderId: '353167037324',
  appId: '1:353167037324:web:98f90e1f9dc563b0237ca9',
  measurementId: 'G-MZ5BGFCRBG',
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

const db = firebase.firestore()

export { db }
