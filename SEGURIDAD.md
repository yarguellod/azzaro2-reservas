# Seguridad y Mejores Prácticas - Torre Azzaro II

## 🔒 Configuración de Seguridad

### 1. Reglas de Firestore Mejoradas (Producción)

Una vez que el sistema esté funcionando bien, actualizá las reglas de Firestore para mayor seguridad:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Función helper para validar que el usuario está autenticado
    function isSignedIn() {
      return request.auth != null;
    }
    
    // Colección de departamentos - solo lectura
    match /departments/{document=**} {
      allow read: if true;
      allow write: if false; // Nadie puede modificar códigos desde la app
    }
    
    // Colección de reservas
    match /reservations/{reservation} {
      // Cualquiera puede leer reservas (necesario para el calendario)
      allow read: if true;
      
      // Crear reserva: solo si está autenticado (implementar auth más adelante)
      allow create: if true; // Por ahora permitir
      
      // Actualizar/eliminar: implementar validación más adelante
      allow update, delete: if true;
    }
  }
}
```

### 2. Variables de Entorno (Opcional para Mayor Seguridad)

Si querés ocultar las credenciales de Firebase del código público:

1. Creá un archivo `.env` en la raíz (ya está en .gitignore):
```
REACT_APP_FIREBASE_API_KEY=tu_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=tu_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=tu_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
REACT_APP_FIREBASE_APP_ID=tu_app_id
```

2. Actualizá `src/firebaseConfig.js`:
```javascript
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};
```

**NOTA:** Las credenciales de Firebase del lado del cliente NO son secretas por diseño. Firebase usa las reglas de seguridad para proteger los datos, no el ocultamiento de credenciales.

### 3. Política de Códigos

**Características de códigos seguros:**
- Mínimo 8 caracteres
- Combinación de letras y números
- Evitar palabras comunes
- No usar información personal (fechas de nacimiento, etc.)

**Ejemplos MALOS:**
- ❌ `1234`
- ❌ `password`
- ❌ `depto1A`

**Ejemplos BUENOS:**
- ✅ `1A-X9K2P7M3`
- ✅ `azzaro2-df8h2k9p`
- ✅ `T2-1A-2024-K8H3`

### 4. Rotación de Códigos

**Frecuencia recomendada:**
- Código de admin: Cada 3-6 meses
- Códigos de departamentos: Cada 6-12 meses o cuando cambie de inquilino

**Proceso de rotación:**
1. Generá nuevos códigos
2. Actualizá en Firebase
3. Notificá a los inquilinos
4. Dales 1 semana para actualizar
5. Verificá que todos puedan acceder

## 🛡️ Prevención de Abuso

### Límites Implementados

El sistema ya tiene estos límites incorporados:
- ✅ Máximo 2 reservas futuras por departamento
- ✅ Máximo 3 reservas por semana
- ✅ Duración máxima de 4 horas
- ✅ Anticipación máxima de 1 mes

### Monitoreo de Uso

Como administrador, deberías revisar periódicamente:

1. **Departamentos que más reservan:**
   - ¿Alguno está acaparando?
   - ¿Necesitamos ajustar las reglas?

2. **Horarios más solicitados:**
   - ¿Hay conflictos frecuentes?
   - ¿Necesitamos más recursos?

3. **Cancelaciones frecuentes:**
   - ¿Alguien reserva y no usa?
   - ¿Necesitamos penalidades?

### Sanciones (Recomendado)

Si un inquilino incumple las normas:

**Opción 1: Suspensión temporal**
1. Andá a Firebase → departments
2. Encontrá el documento del departamento
3. Agregá un campo: `suspended: true`
4. Modificá el código de autenticación para verificar este campo

**Opción 2: Cambiar código**
- Cambiá el código del departamento
- No le des el nuevo hasta que se regularice

## 📊 Respaldo y Recuperación

### Respaldo Automático de Firebase

Firebase hace respaldos automáticos, pero es buena práctica hacer respaldos manuales mensuales.

**Proceso:**
1. Firebase Console → Firestore Database
2. Click en "⋮" → "Export data"
3. Seleccioná todas las colecciones
4. Click en "Export"
5. Guardá el archivo en un lugar seguro

### Recuperación ante Desastres

Si algo sale mal:

**Escenario 1: Código de admin perdido**
- Entrá a Firebase Console directamente
- Andá a Firestore Database
- Encontrá el documento "ADMIN" en "departments"
- Restablecé o cambiá el código

**Escenario 2: Base de datos corrupta**
- Restaurá desde el último respaldo
- Firebase Console → Firestore Database
- Import data → Seleccioná el archivo de respaldo

**Escenario 3: Aplicación caída**
- Verificá el status de GitHub Pages
- Re-desplegá: `npm run deploy`
- Si persiste, contactá a la desarrolladora

## 🚫 Lo que NO hacer

1. **NO compartas el código de admin con inquilinos**
   - Podría causar problemas serios
   - Solo vos deberías tenerlo

2. **NO elimines la colección "departments" en Firebase**
   - Perderías todos los accesos
   - Siempre hace respaldo antes de modificar

3. **NO cambies las reglas de Firestore sin consultar**
   - Podría romper la funcionalidad
   - Si no estás seguro, consultá primero

4. **NO uses la misma contraseña de admin que usás en otros lugares**
   - Seguridad básica
   - Código único para este sistema

## 📱 Seguridad en Dispositivos

**Recomendaciones:**

1. **Usar HTTPS siempre**
   - GitHub Pages usa HTTPS automáticamente
   - Verificá que la URL empiece con `https://`

2. **No guardar códigos en notas del celular**
   - Usar un gestor de contraseñas
   - O papel en lugar seguro

3. **Cerrar sesión en dispositivos compartidos**
   - El sistema guarda la sesión
   - Siempre usar "Salir" cuando termines

## 🔄 Actualizaciones de Seguridad

**Mantener el sistema actualizado:**

```bash
# Actualizar dependencias cada 3-6 meses
npm update

# Verificar vulnerabilidades
npm audit

# Arreglar vulnerabilidades automáticamente
npm audit fix

# Redesplegar
npm run deploy
```

## 📞 Reporte de Problemas de Seguridad

Si descubrís un problema de seguridad:

1. **NO lo publiques públicamente**
2. Contactá directamente a la desarrolladora
3. Describí el problema en detalle
4. Esperá instrucciones antes de actuar

## ✅ Checklist de Seguridad Mensual

- [ ] Verificar que no hayan códigos filtrados
- [ ] Revisar logs de acceso en Firebase (si disponible)
- [ ] Hacer respaldo manual de Firestore
- [ ] Actualizar dependencias (cada 3 meses)
- [ ] Verificar que el sitio HTTPS funcione correctamente
- [ ] Revisar si hay actualizaciones del sistema

## 📚 Recursos Adicionales

- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [React Security Best Practices](https://reactjs.org/docs/security.html)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

**Recordá:** La seguridad es un proceso continuo, no un evento único. Revisá y actualizá estas prácticas regularmente.

**Última actualización:** Noviembre 2024
