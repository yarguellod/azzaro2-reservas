# 🚀 Próximos Pasos - Torre Azzaro II Reservas

¡El código está listo! Ahora seguí estos pasos en orden:

## 1️⃣ Preparar tu Computadora

Asegurate de tener instalado:
- **Node.js** (versión 16+): Descargá desde https://nodejs.org/
- **Git**: Descargá desde https://git-scm.com/
- **Editor de código** (recomendado): VS Code desde https://code.visualstudio.com/

## 2️⃣ Crear Cuenta en Firebase

1. Andá a https://console.firebase.google.com/
2. Iniciá sesión con tu cuenta de Google
3. Click en "Agregar proyecto"
4. Nombre: `azzaro2-reservas`
5. Deshabilitá Google Analytics (no es necesario)
6. Click en "Crear proyecto"

## 3️⃣ Configurar Firestore

1. En el menú lateral → "Build" → "Firestore Database"
2. Click en "Crear base de datos"
3. Seleccioná "Iniciar en modo de prueba"
4. Ubicación: `southamerica-east1` (Brasil - más cerca de Paraguay)
5. Click en "Habilitar"

## 4️⃣ Obtener Credenciales de Firebase

1. Click en el ícono de engranaje ⚙️ → "Configuración del proyecto"
2. Bajá hasta "Tus apps"
3. Click en el ícono web `</>`
4. Nombre de la app: `azzaro2-reservas-web`
5. **NO marques** "Firebase Hosting"
6. Click en "Registrar app"
7. **COPIÁ** todo el objeto `firebaseConfig` que aparece
8. Guardalo en un archivo de texto temporal

## 5️⃣ Crear Repositorio en GitHub

1. Andá a https://github.com/
2. Click en el botón "+" → "New repository"
3. Nombre: `azzaro2-reservas`
4. Dejalo **Público** (o Privado si preferís, ambos funcionan)
5. **NO agregues** README, .gitignore ni licencia
6. Click en "Create repository"
7. **COPIÁ** la URL del repositorio (algo como `https://github.com/TU_USUARIO/azzaro2-reservas.git`)

## 6️⃣ Configurar el Proyecto en tu Computadora

Abrí una terminal (Command Prompt, PowerShell, o Terminal) y ejecutá:

```bash
# Ir a donde querés guardar el proyecto (ej: Documentos)
cd Documentos

# Crear la carpeta del proyecto
mkdir azzaro2-reservas
cd azzaro2-reservas

# Inicializar Git
git init

# Descargá todos los archivos del proyecto desde donde los guardaste
# (Los archivos están en esta carpeta que te estoy generando)
```

## 7️⃣ Configurar Firebase en el Código

1. Abrí el archivo `src/firebaseConfig.js`
2. Reemplazá las credenciales con las que copiaste en el Paso 4:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "tu-app-id"
};
```

## 8️⃣ Actualizar package.json

1. Abrí el archivo `package.json`
2. Cambiá la línea de `homepage` con tu usuario de GitHub:

```json
"homepage": "https://TU_USUARIO_GITHUB.github.io/azzaro2-reservas",
```

## 9️⃣ Instalar y Probar Localmente

```bash
# Instalar dependencias
npm install

# Probar localmente
npm start
```

Se abrirá el navegador en http://localhost:3000

**TODAVÍA NO vas a poder loguearte** porque falta configurar la base de datos.

## 🔟 Crear Datos Iniciales en Firestore

### Opción A: Manual (Recomendado para empezar)

1. Andá a Firebase Console → Firestore Database
2. Click en "Iniciar colección"
3. ID de la colección: `departments`
4. Click en "Siguiente"

**Crear documento de ADMIN:**
- ID del documento: `ADMIN`
- Campos:
  - `id` (string): `ADMIN`
  - `code` (string): `admin2024` (o el que quieras)
  - `isAdmin` (boolean): `true`
- Click en "Guardar"

**Crear documento de prueba (ej: 1A):**
- ID del documento: `1A`
- Campos:
  - `id` (string): `1A`
  - `code` (string): `azzaro2-1a`
  - `isAdmin` (boolean): `false`
- Click en "Guardar"

### Opción B: Usar el Script (Más rápido para todos los deptos)

```bash
# Generar códigos
node scripts/generateCodes.js
```

Copiá el JSON generado y pegalo en Firebase usando la herramienta de importación.

## 1️⃣1️⃣ Configurar Reglas de Firestore

1. En Firestore Database → Pestaña "Reglas"
2. Reemplazá todo con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /departments/{document=**} {
      allow read: if true;
      allow write: if false;
    }
    match /reservations/{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Click en "Publicar"

## 1️⃣2️⃣ Probar Nuevamente

```bash
npm start
```

Ahora SÍ deberías poder loguearte con:
- Usuario: `ADMIN`
- Código: el que configuraste

## 1️⃣3️⃣ Subir a GitHub

```bash
# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit - Sistema de reservas Azzaro II"

# Conectar con GitHub (usá la URL que copiaste en el Paso 5)
git remote add origin https://github.com/TU_USUARIO/azzaro2-reservas.git

# Subir los archivos
git branch -M main
git push -u origin main
```

## 1️⃣4️⃣ Desplegar en GitHub Pages

```bash
npm run deploy
```

Esperá 5-10 minutos y tu sitio estará en:
```
https://TU_USUARIO.github.io/azzaro2-reservas
```

## 1️⃣5️⃣ Configurar GitHub Pages

1. Andá a tu repositorio en GitHub
2. Settings → Pages
3. En "Source" → seleccioná la rama `gh-pages`
4. Click en "Save"

## 🎉 ¡Listo!

Tu sistema está funcionando. Ahora:

1. **Probalo bien** con el usuario admin
2. **Creá los códigos** para todos los departamentos
3. **Distribuí los códigos** a los inquilinos
4. **Guardá respaldo** de los códigos
5. **Lee la documentación** en los archivos MD

## 📚 Documentación Incluida

- `README.md` - Documentación técnica completa
- `GUIA_ADMIN.md` - Guía para el administrador
- `SEGURIDAD.md` - Mejores prácticas de seguridad
- `scripts/generateCodes.js` - Script para generar códigos

## 🆘 ¿Problemas?

**Si algo no funciona:**

1. Verificá que todas las credenciales sean correctas
2. Revisá la consola del navegador (F12) para ver errores
3. Asegurate de que Firebase esté configurado correctamente
4. Consultá el README.md para solución de problemas comunes

## 📞 Contacto

Cualquier duda técnica, contactame. También podés abrir un Issue en GitHub si encontrás bugs.

---

**¡Éxito con el proyecto!** 🚀
