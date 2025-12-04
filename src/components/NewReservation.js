// src/components/NewReservation.js
import React, { useState } from 'react';
import { format, addHours, setHours, setMinutes } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import { createReservation } from '../services/reservationService';
import { getSession } from '../services/authService';
import { AREAS, DEPARTMENTS, validateReservation } from '../utils/validations';
import '../styles/Modal.css';

const NewReservation = ({ reservations, onClose, onSuccess }) => {
  const user = getSession();
  const [formData, setFormData] = useState({
    area: AREAS.QUINCHO,
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '18:00',
    endTime: '22:00',
    department: user.department
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    try {
      // Construir fechas completas
      const [startHour, startMin] = formData.startTime.split(':').map(Number);
      const [endHour, endMin] = formData.endTime.split(':').map(Number);
      
      let startDate = new Date(formData.date);
      startDate = setHours(startDate, startHour);
      startDate = setMinutes(startDate, startMin);
      
      let endDate = new Date(formData.date);
      endDate = setHours(endDate, endHour);
      endDate = setMinutes(endDate, endMin);

      // Si la hora de fin es menor que la de inicio, asumimos que es del día siguiente
      if (endDate <= startDate) {
        endDate = addHours(endDate, 24);
      }

      const reservation = {
        department: user.isAdmin ? formData.department : user.department,
        area: formData.area,
        startTime: startDate,
        endTime: endDate
      };

      // Validar reserva
      const validation = validateReservation(reservations, reservation);
      
      if (!validation.valid) {
        setErrors(validation.errors);
        setLoading(false);
        return;
      }

      // Crear reserva en Firestore
      const result = await createReservation({
        ...reservation,
        startTime: Timestamp.fromDate(startDate),
        endTime: Timestamp.fromDate(endDate)
      });

      if (result.success) {
        alert('¡Reserva creada exitosamente!');
        onSuccess();
      } else {
        setErrors([result.error]);
      }
    } catch (error) {
      setErrors(['Error al crear la reserva: ' + error.message]);
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nueva Reserva</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="reservation-form">
          {user.isAdmin && (
            <div className="form-group">
              <label>Departamento</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                disabled={loading}
              >
                {DEPARTMENTS.filter(d => d !== 'ADMIN').map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Área</label>
            <select
              name="area"
              value={formData.area}
              onChange={handleChange}
              disabled={loading}
            >
              <option value={AREAS.QUINCHO}>{AREAS.QUINCHO}</option>
              <option value={AREAS.PISCINA}>{AREAS.PISCINA}</option>
            </select>
          </div>

          <div className="form-group">
            <label>Fecha</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={format(new Date(), 'yyyy-MM-dd')}
              disabled={loading}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Hora Inicio</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label>Hora Fin</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
          </div>

          {errors.length > 0 && (
            <div className="error-list">
              {errors.map((error, index) => (
                <div key={index} className="error-message">{error}</div>
              ))}
            </div>
          )}

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear Reserva'}
            </button>
          </div>
        </form>

        <div className="reservation-rules">
          <h4>Recordá:</h4>
          <ul>
            <li>Máximo 2 reservas futuras por departamento</li>
            <li>Máximo 3 reservas por semana</li>
            <li>Duración máxima: 4 horas</li>
            <li>El titular de la reserva debe estar presente</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NewReservation;
