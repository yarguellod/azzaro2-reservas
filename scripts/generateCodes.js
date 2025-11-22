// scripts/generateCodes.js
// Script para generar códigos aleatorios para los departamentos
// Ejecutar con: node scripts/generateCodes.js

const crypto = require('crypto');

// Generar código aleatorio seguro
function generateSecureCode(department) {
  const randomPart = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `${department}-${randomPart}`;
}

// Generar código simple (menos seguro pero más fácil de recordar)
function generateSimpleCode(department) {
  return `azzaro2-${department.toLowerCase()}`;
}

// Generar todos los departamentos
function generateAllCodes(secure = false) {
  const floors = [1, 2, 3, 4];
  const units = ['A', 'B', 'C', 'D', 'E', 'F'];
  const codes = {};

  floors.forEach(floor => {
    units.forEach(unit => {
      const dept = `${floor}${unit}`;
      codes[dept] = secure ? generateSecureCode(dept) : generateSimpleCode(dept);
    });
  });

  // Agregar código de admin
  codes['ADMIN'] = secure ? generateSecureCode('ADMIN') : 'azzaro2-admin';

  return codes;
}

// Generar en formato JSON para Firebase
function generateFirebaseJSON(secure = false) {
  const codes = generateAllCodes(secure);
  const firebaseData = {};

  Object.keys(codes).forEach(dept => {
    firebaseData[dept] = {
      id: dept,
      code: codes[dept],
      isAdmin: dept === 'ADMIN'
    };
  });

  return firebaseData;
}

// Generar en formato CSV para imprimir y distribuir
function generateCSV(secure = false) {
  const codes = generateAllCodes(secure);
  let csv = 'Departamento,Código\n';

  Object.keys(codes).forEach(dept => {
    csv += `${dept},${codes[dept]}\n`;
  });

  return csv;
}

// Ejecución del script
console.log('=================================');
console.log('GENERADOR DE CÓDIGOS - AZZARO II');
console.log('=================================\n');

console.log('Elige el tipo de códigos a generar:');
console.log('1. Códigos simples (fáciles de recordar)');
console.log('2. Códigos seguros (aleatorios)\n');

// Para este ejemplo, generamos ambos
console.log('--- CÓDIGOS SIMPLES ---\n');
const simpleCodes = generateAllCodes(false);
Object.keys(simpleCodes).forEach(dept => {
  console.log(`${dept}: ${simpleCodes[dept]}`);
});

console.log('\n--- CÓDIGOS SEGUROS ---\n');
const secureCodes = generateAllCodes(true);
Object.keys(secureCodes).forEach(dept => {
  console.log(`${dept}: ${secureCodes[dept]}`);
});

console.log('\n--- FORMATO JSON PARA FIREBASE (Códigos Simples) ---\n');
console.log(JSON.stringify(generateFirebaseJSON(false), null, 2));

console.log('\n--- FORMATO CSV PARA IMPRIMIR ---\n');
console.log(generateCSV(false));

console.log('\n=================================');
console.log('Copia el formato que necesites');
console.log('=================================\n');
