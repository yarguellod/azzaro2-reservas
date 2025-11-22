// src/components/ReservationApp.js
import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { getAllReservations, cancelReservation } from '../services/reservationService';
import { getSession, logout } from '../services/authService';
import NewReservation from './NewReservation';
import AdminPanel from './AdminPanel';
import '../styles/ReservationApp.css';

const ReservationApp = ({ onLogout }) => {
  const [reservations, setReservations] = useState([]);
  const [userReservations, setUserReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewReservation, setShowNewReservation] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  
  const user = getSession();

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    setLoading(true);
    const allReservations = await getAllReservations();
    setReservations(allReservations);
    
    // Filtrar reservas del usuario
    const userRes = allReservations.filter(r => r.department === user.department);
    setUserReservations(userRes);
    
    setLoading(false);
  };

  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm('¿Está seguro que desea cancelar esta reserva?')) {
      return;
    }

    const result = await cancelReservation(reservationId);
    if (result.success) {
      alert('Reserva cancelada exitosamente');
      loadReservations();
    } else {
      alert('Error al cancelar la reserva: ' + result.error);
    }
  };

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(selectedWeek, i));
    }
    return days;
  };

  const getReservationsForDay = (date, area) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return reservations.filter(r => {
      const resDateStr = format(r.startTime, 'yyyy-MM-dd');
      return resDateStr === dateStr && r.area === area;
    });
  };

  const nextWeek = () => {
    setSelectedWeek(addDays(selectedWeek, 7));
  };

  const prevWeek = () => {
    setSelectedWeek(addDays(selectedWeek, -7));
  };

  const goToToday = () => {
    setSelectedWeek(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  if (loading) {
    return <div className="loading">Cargando reservas...</div>;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>Torre Azzaro II - Reservas</h1>
          <div className="header-actions">
            <span className="user-info">Depto: {user.department}</span>
            {user.isAdmin && (
              <button 
                className="btn-secondary"
                onClick={() => setShowAdminPanel(!showAdminPanel)}
              >
                {showAdminPanel ? 'Ver Calendario' : 'Panel Admin'}
              </button>
            )}
            <button className="btn-secondary" onClick={handleLogout}>
              Salir
            </button>
          </div>
        </div>
      </header>

      {showAdminPanel && user.isAdmin ? (
        <AdminPanel 
          reservations={reservations}
          onUpdate={loadReservations}
          onClose={() => setShowAdminPanel(false)}
        />
      ) : (
        <main className="main-content">
          <section className="user-reservations">
            <div className="section-header">
              <h2>Mis Reservas</h2>
              <button 
                className="btn-primary"
                onClick={() => setShowNewReservation(true)}
              >
                + Nueva Reserva
              </button>
            </div>
            
            <div className="reservations-list">
              {userReservations.length === 0 ? (
                <p className="no-reservations">No tienes reservas activas</p>
              ) : (
                userReservations.map(res => (
                  <div key={res.id} className="reservation-card">
                    <div className="reservation-info">
                      <h3>{res.area}</h3>
                      <p>{format(res.startTime, "EEEE d 'de' MMMM", { locale: es })}</p>
                      <p className="time">
                        {format(res.startTime, 'HH:mm')} - {format(res.endTime, 'HH:mm')}
                      </p>
                    </div>
                    <button 
                      className="btn-danger"
                      onClick={() => handleCancelReservation(res.id)}
                    >
                      Cancelar
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="calendar-section">
            <div className="calendar-header">
              <button className="btn-nav" onClick={prevWeek}>‹</button>
              <button className="btn-secondary" onClick={goToToday}>Hoy</button>
              <h2>
                {format(selectedWeek, "d 'de' MMMM", { locale: es })} - 
                {format(addDays(selectedWeek, 6), "d 'de' MMMM yyyy", { locale: es })}
              </h2>
              <button className="btn-nav" onClick={nextWeek}>›</button>
            </div>

            <div className="calendar-grid">
              {['Quincho', 'Piscina'].map(area => (
                <div key={area} className="area-section">
                  <h3 className="area-title">{area}</h3>
                  <div className="days-grid">
                    {getWeekDays().map((day, index) => (
                      <div key={index} className="day-column">
                        <div className="day-header">
                          {format(day, 'EEE d', { locale: es })}
                        </div>
                        <div className="day-reservations">
                          {getReservationsForDay(day, area).map(res => (
                            <div 
                              key={res.id} 
                              className={`reservation-slot ${res.isBlock ? 'blocked' : ''} ${res.department === user.department ? 'own' : ''}`}
                            >
                              <div className="slot-time">
                                {format(res.startTime, 'HH:mm')} - {format(res.endTime, 'HH:mm')}
                              </div>
                              <div className="slot-dept">
                                {res.isBlock ? 'MANTENIMIENTO' : `Depto ${res.department}`}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {showNewReservation && (
        <NewReservation
          reservations={reservations}
          onClose={() => setShowNewReservation(false)}
          onSuccess={() => {
            setShowNewReservation(false);
            loadReservations();
          }}
        />
      )}
    </div>
  );
};

export default ReservationApp;
