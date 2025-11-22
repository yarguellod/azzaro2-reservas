// src/services/authService.js
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

// Simula autenticación con códigos de departamento
export const authenticateUser = async (department, code) => {
  try {
    // Buscar el departamento en la colección 'departments'
    const q = query(
      collection(db, 'departments'),
      where('id', '==', department),
      where('code', '==', code)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { success: false, error: 'Departamento o código incorrecto' };
    }
    
    const userData = querySnapshot.docs[0].data();
    
    return {
      success: true,
      user: {
        department: userData.id,
        isAdmin: userData.isAdmin || false
      }
    };
  } catch (error) {
    console.error('Error en autenticación:', error);
    return { success: false, error: 'Error al autenticar' };
  }
};

// Guardar sesión en localStorage
export const saveSession = (user) => {
  localStorage.setItem('azzaro2_user', JSON.stringify(user));
};

// Obtener sesión actual
export const getSession = () => {
  const userStr = localStorage.getItem('azzaro2_user');
  return userStr ? JSON.parse(userStr) : null;
};

// Cerrar sesión
export const logout = () => {
  localStorage.removeItem('azzaro2_user');
};

// Verificar si es admin
export const isAdmin = () => {
  const user = getSession();
  return user?.isAdmin || false;
};
