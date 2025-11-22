# Torre Azzaro II - Sistema de Reservas

Sistema web para gestionar reservas de áreas comunes (Quincho y Piscina) del edificio Torre Azzaro II.

## 🎯 Características

- **Autenticación por departamento** con códigos únicos
- **Panel de usuario** para crear y gestionar reservas propias
- **Panel de administrador** para ver todas las reservas, bloquear horarios y eliminar reservas
- **Validación automática de reglas**:
  - Máximo 2 reservas futuras por departamento
  - Máximo 3 reservas por semana (lunes-domingo)
  - Duración máxima de 4 horas por reserva
  - Anticipación máxima de 1 mes
- **Vista de calendario** semanal con codificación por colores
- **Generación de PDF** para impresión de reservas semanales
- **100% gratuito** usando Firebase y GitHub Pages

## 📋 Requisitos Previos

- Node.js (versión 16 o superior)
- Cuenta de GitHub
- Cuenta de Google (para Firebase)

## 🚀 Instalación y Configuración

### Paso 1: Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto llamado "azzaro2-reservas" (o el nombre que prefieras)
3. En el menú lateral, ve a "Build" → "Firestore Database"
4. Haz clic en "Crear base de datos"
5. Selecciona "Iniciar en modo de prueba" (cambiaremos esto después)
6. Elige la ubicación más cercana (recomendado: `southamerica-east1`)
7. Ve a "Project Settings" (ícono de engranaje) → "General"
8. En "Tus apps", haz clic en el ícono de web `</>`
9. Registra tu app con el nombre "azzaro2-reservas-web"
10. Copia las credenciales de configuración (las necesitarás en el Paso 3)

### Paso 2: Clonar y Configurar el Proyecto

```bash
# Clona este repositorio
git clone https://github.com/TU_USUARIO/azzaro2-reservas.git
cd azzaro2-reservas

# Instala las dependencias
npm install
```

### Paso 3: Configurar Firebase en el Proyecto

Abre el archivo `src/firebaseConfig.js` y reemplaza las credenciales con las tuyas:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROJECT_ID.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROJECT_ID.appspot.com",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};
```

### Paso 4: Configurar la Base de Datos

1. En Firebase Console, ve a Firestore Database
2. Crea la colección `departments` haciendo clic en "Iniciar colección"
3. Nombre de colección: `departments`
4. Agrega documentos para cada departamento:

**Ejemplo para el Departamento 1A:**
```
ID del documento: 1A
Campos:
- id (string): "1A"
- code (string): "codigo_1A"
- isAdmin (boolean): false
```

**Repite para todos los departamentos** (1A-1F, 2A-2F, 3A-3F, 4A-4F)

**Para el administrador, crea un documento especial:**
```
ID del documento: ADMIN
Campos:
- id (string): "ADMIN"
- code (string): "admin123"
- isAdmin (boolean): true
```

### Paso 5: Configurar Reglas de Seguridad de Firestore

1. En Firestore Database, ve a la pestaña "Reglas"
2. Reemplaza el contenido con esto:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura de departamentos solo para autenticación
    match /departments/{document=**} {
      allow read: if true;
      allow write: if false;
    }
    
    // Permitir lectura y escritura de reservas
    match /reservations/{document=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

3. Haz clic en "Publicar"

### Paso 6: Configurar GitHub Pages

1. Abre `package.json` y actualiza la línea `homepage`:
```json
"homepage": "https://TU_USUARIO_GITHUB.github.io/azzaro2-reservas"
```

2. Sube el proyecto a GitHub:
```bash
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TU_USUARIO/azzaro2-reservas.git
git push -u origin main
```

3. Instala gh-pages (si no lo hiciste antes):
```bash
npm install --save-dev gh-pages
```

4. Despliega a GitHub Pages:
```bash
npm run deploy
```

5. En tu repositorio de GitHub:
   - Ve a Settings → Pages
   - En "Source", selecciona la rama `gh-pages`
   - Guarda los cambios

¡Tu aplicación estará disponible en `https://TU_USUARIO.github.io/azzaro2-reservas` en unos minutos!

## 🧪 Desarrollo Local

Para ejecutar la aplicación localmente:

```bash
npm start
```

Esto abrirá la aplicación en [http://localhost:3000](http://localhost:3000)

## 📱 Uso de la Aplicación

### Para Inquilinos:

1. Ingresa con tu número de departamento y código
2. Ve tus reservas activas en la sección "Mis Reservas"
3. Haz clic en "+ Nueva Reserva" para crear una nueva
4. Selecciona área, fecha y horario
5. El sistema validará automáticamente las reglas
6. Puedes cancelar tus reservas en cualquier momento

### Para el Administrador:

1. Ingresa con usuario "ADMIN" y el código de administrador
2. Haz clic en "Panel Admin" para acceder a las funciones avanzadas
3. Puedes:
   - Ver todas las reservas en formato calendario
   - Bloquear horarios para mantenimiento
   - Eliminar reservas si es necesario
   - Imprimir la planilla semanal en PDF

## 🔐 Seguridad y Códigos

### Generar Códigos de Departamentos

Puedes usar códigos simples o generar códigos aleatorios. Ejemplo:

**Códigos simples:**
- 1A: `azzaro_1A`
- 2B: `azzaro_2B`

**Códigos aleatorios (más seguros):**
Usa este script de Node.js para generar códigos:

```javascript
const crypto = require('crypto');

function generateCode(dept) {
  return dept + '-' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

// Ejemplo
console.log(generateCode('1A')); // Output: 1A-A3F5B7C9
```

### Cambiar Códigos

Para cambiar el código de un departamento:
1. Ve a Firebase Console → Firestore Database
2. Encuentra el documento del departamento
3. Edita el campo `code`
4. Guarda los cambios

## 📊 Estructura del Proyecto

```
azzaro2-reservas/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── AdminPanel.js
│   │   ├── Login.js
│   │   ├── NewReservation.js
│   │   └── ReservationApp.js
│   ├── services/
│   │   ├── authService.js
│   │   └── reservationService.js
│   ├── styles/
│   │   ├── AdminPanel.css
│   │   ├── App.css
│   │   ├── Login.css
│   │   ├── Modal.css
│   │   ├── ReservationApp.css
│   │   └── index.css
│   ├── utils/
│   │   ├── pdfGenerator.js
│   │   └── validations.js
│   ├── App.js
│   ├── firebaseConfig.js
│   └── index.js
├── package.json
└── README.md
```

## 🎨 Personalización

### Cambiar Colores

Los colores principales están en los archivos CSS. Para cambiar el tema:

1. **Color principal (negro):** Busca `#000000` en los archivos CSS
2. **Acentos:** Busca `#4caf50` (verde) y `#f44336` (rojo)

### Modificar Reglas

Las reglas de negocio están en `src/utils/validations.js`:

```javascript
export const MAX_FUTURE_RESERVATIONS = 2;  // Cambiar aquí
export const MAX_WEEKLY_RESERVATIONS = 3;  // Cambiar aquí
export const MAX_RESERVATION_HOURS = 4;    // Cambiar aquí
export const MAX_ADVANCE_DAYS = 30;        // Cambiar aquí
```

Después de cambiar, ejecuta:
```bash
npm run deploy
```

## 🐛 Solución de Problemas

### Error: "Firebase: Error (auth/operation-not-allowed)"
- Ve a Firebase Console → Authentication
- Habilita "Email/Password" como método de inicio de sesión

### La página no carga en GitHub Pages
- Verifica que el campo `homepage` en `package.json` sea correcto
- Asegúrate de que la rama `gh-pages` existe
- Espera 5-10 minutos después del deploy

### Las reservas no se guardan
- Verifica las reglas de Firestore
- Revisa la consola del navegador (F12) para errores
- Confirma que las credenciales de Firebase sean correctas

### Códigos de departamento no funcionan
- Verifica que el documento existe en Firestore
- Confirma que los campos `id` y `code` coincidan exactamente
- Los códigos son case-sensitive (distinguen mayúsculas/minúsculas)

## 📈 Próximas Mejoras Sugeridas

- [ ] Notificaciones por email de confirmación
- [ ] Sistema de recordatorios 24hs antes
- [ ] Historial de reservas pasadas
- [ ] Reportes mensuales de uso
- [ ] Integración con WhatsApp
- [ ] Modo oscuro

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👤 Autor

Desarrollado para Torre Azzaro II

## 🤝 Contribuciones

Si encontrás un bug o tenés una sugerencia, por favor:
1. Abrí un Issue en GitHub
2. O contactá al administrador del edificio

---

**¿Necesitás ayuda?** Contactá al administrador del edificio o revisá la documentación de [Firebase](https://firebase.google.com/docs) y [React](https://reactjs.org/docs).
