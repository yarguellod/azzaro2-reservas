// src/utils/validations.js
import { startOfWeek, endOfWeek, isWithinInterval, addMonths, differenceInHours } from 'date-fns';

// Constantes de configuración
export const MAX_FUTURE_RESERVATIONS = 2;
export const MAX_WEEKLY_RESERVATIONS = 3;
export const MAX_RESERVATION_HOURS = 4;
export const MAX_ADVANCE_DAYS = 30;

// Áreas disponibles
export const AREAS = {
  QUINCHO: 'Quincho',
  PISCINA: 'Piscina'
};

// Horarios de operación
export const OPERATING_HOURS = {
  // Lunes a Jueves y Domingo: 8:00 - 24:00
  default: { start: 8, end: 24 },
  // Viernes y Sábado: 8:00 - 2:00 (del día siguiente)
  weekend: { start: 8, end: 26 } // 26 = 2:00 AM del día siguiente
};

// Genera los departamentos (1-4 pisos, A-F departamentos)
export const generateDepartments = () => {
  const floors = [1, 2, 3, 4];
  const units = ['A', 'B', 'C', 'D', 'E', 'F'];
  const departments = [];
  
  floors.forEach(floor => {
    units.forEach(unit => {
      departments.push(`${floor}${unit}`);
    });
  });
  
  return departments;
};

export const DEPARTMENTS = ['ADMIN', ...generateDepartments()];

// Verifica si una fecha está dentro del rango permitido de anticipación
export const isWithinAdvanceLimit = (date) => {
  const maxDate = addMonths(new Date(), 1);
  return date <= maxDate;
};

// Verifica si el horario está dentro de las horas de operación
export const isWithinOperatingHours = (startDate, endDate) => {
  const day = startDate.getDay();
  const isFridayOrSaturday = day === 5 || day === 6;
  const hours = isFridayOrSaturday ? OPERATING_HOURS.weekend : OPERATING_HOURS.default;
  
  const startHour = startDate.getHours();
  const endHour = endDate.getHours();
  
  // Si termina a las 00:00, considerar como 24
  const adjustedEndHour = endHour === 0 ? 24 : endHour;
  
  return startHour >= hours.start && adjustedEndHour <= hours.end;
};

// Verifica si la duración de la reserva no excede el máximo
export const isValidDuration = (startDate, endDate) => {
  const hours = differenceInHours(endDate, startDate);
  return hours > 0 && hours <= MAX_RESERVATION_HOURS;
};

// Cuenta las reservas futuras de un departamento
export const countFutureReservations = (reservations, department) => {
  const now = new Date();
  return reservations.filter(r => 
    r.department === department && 
    new Date(r.startTime) > now
  ).length;
};

// Cuenta las reservas de un departamento en una semana específica
export const countWeeklyReservations = (reservations, department, date) => {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Lunes
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 }); // Domingo
  
  return reservations.filter(r => {
    if (r.department !== department) return false;
    const resDate = new Date(r.startTime);
    return isWithinInterval(resDate, { start: weekStart, end: weekEnd });
  }).length;
};

// Verifica si hay conflicto de horario para un área específica
export const hasTimeConflict = (reservations, area, startTime, endTime, excludeId = null) => {
  const newStart = new Date(startTime);
  const newEnd = new Date(endTime);
  
  return reservations.some(r => {
    if (r.id === excludeId) return false; // Excluir la reserva actual si estamos editando
    if (r.area !== area) return false; // Solo conflictos en la misma área
    
    const existingStart = new Date(r.startTime);
    const existingEnd = new Date(r.endTime);
    
    // Verifica solapamiento
    return (newStart < existingEnd && newEnd > existingStart);
  });
};

// Valida todas las reglas para una nueva reserva
export const validateReservation = (reservations, reservation) => {
  const errors = [];
  
  const { department, area, startTime, endTime } = reservation;
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  // 1. Verificar anticipación máxima
  if (!isWithinAdvanceLimit(start)) {
    errors.push(`La reserva no puede hacerse con más de ${MAX_ADVANCE_DAYS} días de anticipación.`);
  }
  
  // 2. Verificar que la fecha no sea en el pasado
  if (start < new Date()) {
    errors.push('No se pueden hacer reservas en el pasado.');
  }
  
  // 3. Verificar horarios de operación
  if (!isWithinOperatingHours(start, end)) {
    errors.push('El horario está fuera del horario de operación permitido.');
  }
  
  // 4. Verificar duración máxima
  if (!isValidDuration(start, end)) {
    errors.push(`La reserva no puede exceder ${MAX_RESERVATION_HOURS} horas.`);
  }
  
  // 5. Verificar límite de reservas futuras
  const futureCount = countFutureReservations(reservations, department);
  if (futureCount >= MAX_FUTURE_RESERVATIONS) {
    errors.push(`Ya tienes ${MAX_FUTURE_RESERVATIONS} reservas futuras. Cancela alguna para hacer una nueva.`);
  }
  
  // 6. Verificar límite semanal
  const weeklyCount = countWeeklyReservations(reservations, department, start);
  if (weeklyCount >= MAX_WEEKLY_RESERVATIONS) {
    errors.push(`Ya tienes ${MAX_WEEKLY_RESERVATIONS} reservas esta semana.`);
  }
  
  // 7. Verificar conflictos de horario
  if (hasTimeConflict(reservations, area, startTime, endTime)) {
    errors.push(`Ya existe una reserva de ${area} en ese horario.`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};
