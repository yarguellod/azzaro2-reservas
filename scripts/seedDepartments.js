// scripts/seedDepartments.js
// Script para crear todos los departamentos en Firebase
// Ejecutar con: node scripts/seedDepartments.js

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyC6sSnSCtFehljhv1baeIII6eiMq05NjlU",
  authDomain: "azzaro2-reservas.firebaseapp.com",
  projectId: "azzaro2-reservas",
  storageBucket: "azzaro2-reservas.firebasestorage.app",
  messagingSenderId: "185561829322",
  appId: "1:185561829322:web:9ffff9b4a4f0d1f5260933",
  measurementId: "G-LDW0261RET"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Generate simple code for department
function generateSimpleCode(department) {
  return `azzaro2-${department.toLowerCase()}`;
}

// Generate all departments data
function generateDepartments() {
  const floors = [1, 2, 3, 4];
  const units = ['A', 'B', 'C', 'D', 'E', 'F'];
  const departments = [];

  // Add ADMIN first
  departments.push({
    id: 'ADMIN',
    code: 'azzaro2-admin',
    isAdmin: true
  });

  // Add all apartment departments
  floors.forEach(floor => {
    units.forEach(unit => {
      const dept = `${floor}${unit}`;
      departments.push({
        id: dept,
        code: generateSimpleCode(dept),
        isAdmin: false
      });
    });
  });

  return departments;
}

// Upload to Firebase
async function seedDepartments() {
  console.log('Starting to seed departments to Firebase...\n');

  const departments = generateDepartments();

  for (const dept of departments) {
    try {
      await setDoc(doc(db, 'departaments', dept.id), dept);
      console.log(`✓ Created: ${dept.id} (code: ${dept.code})`);
    } catch (error) {
      console.error(`✗ Error creating ${dept.id}:`, error.message);
    }
  }

  console.log('\n=================================');
  console.log(`Done! Created ${departments.length} departments.`);
  console.log('=================================\n');

  console.log('Department codes for reference:');
  console.log('-------------------------------');
  departments.forEach(d => {
    console.log(`${d.id.padEnd(6)} : ${d.code}${d.isAdmin ? ' (ADMIN)' : ''}`);
  });

  process.exit(0);
}

seedDepartments();
