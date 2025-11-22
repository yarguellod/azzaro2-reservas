# Guía Rápida para el Administrador - Torre Azzaro II

## 📖 Índice
1. [Acceso al Sistema](#acceso-al-sistema)
2. [Funciones del Administrador](#funciones-del-administrador)
3. [Gestión de Códigos](#gestión-de-códigos)
4. [Mantenimiento y Soporte](#mantenimiento-y-soporte)

## 🔐 Acceso al Sistema

### URL de Acceso
La aplicación estará disponible en:
```
https://TU_USUARIO.github.io/azzaro2-reservas
```

### Credenciales de Administrador
- **Usuario:** ADMIN
- **Código:** [el código que configuraste en Firebase]

**IMPORTANTE:** Guardá estas credenciales en un lugar seguro. Cambialas regularmente por seguridad.

## 🛠️ Funciones del Administrador

### 1. Ver Todas las Reservas

Al hacer clic en "Panel Admin", verás:
- Un calendario semanal con TODAS las reservas del edificio
- Cada reserva muestra: Área, Horario y Departamento
- Navegación entre semanas con las flechas ← →
- Botón "Hoy" para volver a la semana actual

### 2. Bloquear Horarios

**¿Cuándo usar esta función?**
- Mantenimiento del quincho o piscina
- Limpieza profunda
- Reparaciones
- Eventos del consorcio

**Cómo hacerlo:**
1. Hacé clic en "Bloquear Horario"
2. Seleccioná el área (Quincho o Piscina)
3. Elegí la fecha y horario
4. Escribí el motivo (ej: "Mantenimiento", "Limpieza", "Fumigación")
5. Hacé clic en "Bloquear"

**Resultado:** El horario aparecerá en rojo en el calendario y los inquilinos NO podrán reservar ese espacio.

### 3. Eliminar Reservas

**¿Cuándo usar esta función?**
- El inquilino no cumplió con las normas
- Reserva hecha por error
- Situación de emergencia

**Cómo hacerlo:**
1. Encontrá la reserva en el calendario
2. Hacé clic en el botón "×" (cruz roja) de la reserva
3. Confirmá la eliminación

**IMPORTANTE:** Avisale al inquilino ANTES de eliminar su reserva.

### 4. Imprimir Planilla Semanal

**¿Para qué sirve?**
- Imprimir y pegar en la cartelera del edificio
- Tener una copia física de respaldo
- Mostrar en reuniones de consorcio

**Cómo hacerlo:**
1. Navegá a la semana que querés imprimir
2. Hacé clic en el botón "🖨️ Imprimir Semana"
3. Se descargará un PDF con el formato similar al papel que usaban antes
4. Imprimí el PDF

**Formato del PDF:**
- Organizado por día de la semana
- Separado por área (Quincho y Piscina)
- Muestra horarios y departamentos
- Incluye fecha de generación

## 🔑 Gestión de Códigos

### Generar Códigos para los Departamentos

**Opción 1: Usar el script incluido**
```bash
cd azzaro2-reservas
node scripts/generateCodes.js
```

Esto generará:
- Códigos simples (ej: azzaro2-1a)
- Códigos seguros (ej: 1A-A3F5B7C9)
- Formato JSON para Firebase
- Formato CSV para imprimir

**Opción 2: Crear códigos manualmente**
Podés usar cualquier combinación de letras/números. Ejemplos:
- `torre2_1A`
- `azzaro_depto1A`
- `1A_2024`

### Distribuir Códigos a los Inquilinos

**Método Recomendado:**
1. Generá todos los códigos
2. Imprimí una lista en papel
3. Cortá en tiras individuales
4. Entregá cada código en un sobre cerrado
5. Pedí que firmen un comprobante de recibo

**Modelo de entrega:**
```
===============================
TORRE AZZARO II
Sistema de Reservas

Departamento: 1A
Código: azzaro2-1a

IMPORTANTE:
- No compartir con terceros
- Guardar en lugar seguro
- Cualquier consulta, contactar
  al administrador
===============================
```

### Cambiar un Código

Si un inquilino perdió su código o querés cambiarlo:

1. Entrá a [Firebase Console](https://console.firebase.google.com/)
2. Seleccioná tu proyecto "azzaro2-reservas"
3. Andá a "Firestore Database"
4. Buscá la colección "departments"
5. Encontrá el documento del departamento (ej: "1A")
6. Hacé clic en el documento
7. Editá el campo "code"
8. Escribí el nuevo código
9. Guardá los cambios

**El cambio es inmediato.** El inquilino deberá usar el nuevo código para su próximo ingreso.

## 🚨 Mantenimiento y Soporte

### Problemas Comunes y Soluciones

#### "No puedo acceder al panel de admin"
**Posibles causas:**
- Código incorrecto
- Usuario no es "ADMIN"

**Solución:**
- Verificá que el usuario sea exactamente "ADMIN" (en mayúsculas)
- Revisá el código en Firebase

#### "Los inquilinos dicen que no pueden reservar"
**Posibles causas:**
- Alcanzaron el límite de reservas
- El horario está bloqueado
- Hay un conflicto de horario

**Solución:**
- Entrá al panel admin y verificá las reservas del departamento
- Revisá si hay bloqueos en ese horario
- Pedile al inquilino que intente con otro horario

#### "Una reserva no aparece en el PDF"
**Posibles causas:**
- La reserva está fuera de la semana seleccionada

**Solución:**
- Navegá a la semana correcta antes de imprimir

### Respaldo de Datos

**Tus datos están seguros en Firebase**, que hace respaldos automáticos. Pero podés hacer respaldos manuales:

1. Entrá a Firebase Console
2. Andá a "Firestore Database"
3. Hacé clic en "⋮" (tres puntos) → "Export data"
4. Elegí las colecciones y guardá

### Actualizar la Aplicación

Si la desarrolladora te envía una actualización:

```bash
# Descargá los cambios
git pull origin main

# Desplegá la nueva versión
npm run deploy
```

## 📞 Contacto con la Desarrolladora

Para cualquier problema técnico o consulta, contactá a:
- **Nombre:** Yani
- **Método:** [Agregar tu método de contacto preferido]

## 📝 Registro de Cambios

Guardá un registro de cambios importantes:

**Ejemplo:**
```
Fecha: 21/11/2024
Acción: Sistema implementado
Notas: 24 departamentos configurados

Fecha: [Fecha]
Acción: [Qué se hizo]
Notas: [Observaciones]
```

## ✅ Checklist Mensual

- [ ] Revisar que todos los departamentos tengan acceso
- [ ] Verificar que no haya bloqueos antiguos sin usar
- [ ] Limpiar reservas canceladas viejas (opcional)
- [ ] Revisar si hay patrones de uso para mejorar reglas

---

**Última actualización:** Noviembre 2024
