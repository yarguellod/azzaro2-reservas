// src/services/reservationService.js
import { db } from '../firebaseConfig';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';

const RESERVATIONS_COLLECTION = 'reservations';

// Crear una nueva reserva
export const createReservation = async (reservationData) => {
  try {
    const docRef = await addDoc(collection(db, RESERVATIONS_COLLECTION), {
      ...reservationData,
      createdAt: Timestamp.now(),
      status: 'active'
    });
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creando reserva:', error);
    return { success: false, error: error.message };
  }
};

// Obtener todas las reservas activas
export const getAllReservations = async () => {
  try {
    const q = query(
      collection(db, RESERVATIONS_COLLECTION),
      where('status', '==', 'active'),
      orderBy('startTime', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const reservations = [];
    
    querySnapshot.forEach((doc) => {
      reservations.push({
        id: doc.id,
        ...doc.data(),
        startTime: doc.data().startTime.toDate(),
        endTime: doc.data().endTime.toDate()
      });
    });
    
    return reservations;
  } catch (error) {
    console.error('Error obteniendo reservas:', error);
    return [];
  }
};

// Obtener reservas de un departamento específico
export const getReservationsByDepartment = async (department) => {
  try {
    const q = query(
      collection(db, RESERVATIONS_COLLECTION),
      where('department', '==', department),
      where('status', '==', 'active'),
      orderBy('startTime', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const reservations = [];
    
    querySnapshot.forEach((doc) => {
      reservations.push({
        id: doc.id,
        ...doc.data(),
        startTime: doc.data().startTime.toDate(),
        endTime: doc.data().endTime.toDate()
      });
    });
    
    return reservations;
  } catch (error) {
    console.error('Error obteniendo reservas del departamento:', error);
    return [];
  }
};

// Cancelar una reserva (soft delete)
export const cancelReservation = async (reservationId) => {
  try {
    const reservationRef = doc(db, RESERVATIONS_COLLECTION, reservationId);
    await updateDoc(reservationRef, {
      status: 'cancelled',
      cancelledAt: Timestamp.now()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error cancelando reserva:', error);
    return { success: false, error: error.message };
  }
};

// Bloquear horario (admin)
export const createBlock = async (blockData) => {
  try {
    const docRef = await addDoc(collection(db, RESERVATIONS_COLLECTION), {
      ...blockData,
      department: 'ADMIN',
      isBlock: true,
      createdAt: Timestamp.now(),
      status: 'active'
    });
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creando bloqueo:', error);
    return { success: false, error: error.message };
  }
};

// Eliminar permanentemente una reserva (solo admin)
export const deleteReservation = async (reservationId) => {
  try {
    await deleteDoc(doc(db, RESERVATIONS_COLLECTION, reservationId));
    return { success: true };
  } catch (error) {
    console.error('Error eliminando reserva:', error);
    return { success: false, error: error.message };
  }
};
