// src/components/AdminPanel.js
import React, { useState } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore';
import { deleteReservation, createBlock } from '../services/reservationService';
import { generateWeeklyPDF } from '../utils/pdfGenerator';
import '../styles/AdminPanel.css';

const AdminPanel = ({ reservations, onUpdate }) => {
  const [selectedWeek, setSelectedWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [showBlockForm, setShowBlockForm] = useState(false);
  const [blockForm, setBlockForm] = useState({
    area: 'Quincho',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '08:00',
    endTime: '12:00',
    reason: 'Mantenimiento'
  });

  const handleDeleteReservation = async (reservationId, department) => {
    if (!window.confirm(`¿Eliminar reserva del Depto ${department}?`)) {
      return;
    }

    const result = await deleteReservation(reservationId);
    if (result.success) {
      alert('Reserva eliminada');
      onUpdate();
    } else {
      alert('Error: ' + result.error);
    }
  };

  const handleCreateBlock = async (e) => {
    e.preventDefault();
    
    const [startHour, startMin] = blockForm.startTime.split(':').map(Number);
    const [endHour, endMin] = blockForm.endTime.split(':').map(Number);
    
    let startDate = new Date(blockForm.date);
    startDate.setHours(startHour, startMin, 0);
    
    let endDate = new Date(blockForm.date);
    endDate.setHours(endHour, endMin, 0);

    if (endDate <= startDate) {
      endDate = addDays(endDate, 1);
    }

    const result = await createBlock({
      area: blockForm.area,
      startTime: Timestamp.fromDate(startDate),
      endTime: Timestamp.fromDate(endDate),
      reason: blockForm.reason
    });

    if (result.success) {
      alert('Horario bloqueado exitosamente');
      setShowBlockForm(false);
      onUpdate();
    } else {
      alert('Error: ' + result.error);
    }
  };

  const handlePrintWeek = () => {
    const weekStart = selectedWeek;
    const weekEnd = addDays(weekStart, 6);
    
    const weekReservations = reservations.filter(r => {
      const resDate = r.startTime;
      return resDate >= weekStart && resDate <= addDays(weekEnd, 1);
    });

    generateWeeklyPDF(weekReservations, weekStart);
  };

  const nextWeek = () => setSelectedWeek(addDays(selectedWeek, 7));
  const prevWeek = () => setSelectedWeek(addDays(selectedWeek, -7));
  const goToToday = () => setSelectedWeek(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(selectedWeek, i));
    }
    return days;
  };

  const getReservationsForDay = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return reservations.filter(r => {
      const resDateStr = format(r.startTime, 'yyyy-MM-dd');
      return resDateStr === dateStr;
    }).sort((a, b) => a.startTime - b.startTime);
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Panel de Administrador</h2>
        <div className="admin-actions">
          <button className="btn-primary" onClick={() => setShowBlockForm(true)}>
            Bloquear Horario
          </button>
          <button className="btn-secondary" onClick={handlePrintWeek}>
            🖨️ Imprimir Semana
          </button>
        </div>
      </div>

      <div className="week-navigation">
        <button className="btn-nav" onClick={prevWeek}>‹</button>
        <button className="btn-secondary" onClick={goToToday}>Hoy</button>
        <h3>
          {format(selectedWeek, "d 'de' MMMM", { locale: es })} - 
          {format(addDays(selectedWeek, 6), "d 'de' MMMM yyyy", { locale: es })}
        </h3>
        <button className="btn-nav" onClick={nextWeek}>›</button>
      </div>

      <div className="admin-calendar">
        {getWeekDays().map((day, index) => (
          <div key={index} className="admin-day">
            <div className="admin-day-header">
              <strong>{format(day, 'EEEE', { locale: es })}</strong>
              <span>{format(day, 'd/MM')}</span>
            </div>
            
            <div className="admin-reservations">
              {getReservationsForDay(day).map(res => (
                <div 
                  key={res.id} 
                  className={`admin-reservation ${res.isBlock ? 'block' : ''}`}
                >
                  <div className="res-header">
                    <span className="res-area">{res.area}</span>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteReservation(res.id, res.department)}
                    >
                      ×
                    </button>
                  </div>
                  <div className="res-time">
                    {format(res.startTime, 'HH:mm')} - {format(res.endTime, 'HH:mm')}
                  </div>
                  <div className="res-dept">
                    {res.isBlock ? res.reason : `Depto ${res.department}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showBlockForm && (
        <div className="modal-overlay" onClick={() => setShowBlockForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Bloquear Horario</h2>
              <button className="close-btn" onClick={() => setShowBlockForm(false)}>×</button>
            </div>

            <form onSubmit={handleCreateBlock} className="block-form">
              <div className="form-group">
                <label>Área</label>
                <select 
                  value={blockForm.area}
                  onChange={e => setBlockForm({...blockForm, area: e.target.value})}
                >
                  <option value="Quincho">Quincho</option>
                  <option value="Piscina">Piscina</option>
                </select>
              </div>

              <div className="form-group">
                <label>Fecha</label>
                <input
                  type="date"
                  value={blockForm.date}
                  onChange={e => setBlockForm({...blockForm, date: e.target.value})}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Hora Inicio</label>
                  <input
                    type="time"
                    value={blockForm.startTime}
                    onChange={e => setBlockForm({...blockForm, startTime: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Hora Fin</label>
                  <input
                    type="time"
                    value={blockForm.endTime}
                    onChange={e => setBlockForm({...blockForm, endTime: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Motivo</label>
                <input
                  type="text"
                  value={blockForm.reason}
                  onChange={e => setBlockForm({...blockForm, reason: e.target.value})}
                  placeholder="ej: Mantenimiento, Limpieza"
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowBlockForm(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Bloquear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
