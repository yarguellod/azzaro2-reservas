// src/utils/pdfGenerator.js
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

export const generateWeeklyPDF = (reservations, weekStart) => {
  const doc = new jsPDF();
  const weekEnd = addDays(weekStart, 6);
  
  // Título
  doc.setFontSize(18);
  doc.text('Torre Azzaro II - Reservas', 105, 15, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(
    `Semana del ${format(weekStart, "d 'de' MMMM", { locale: es })} al ${format(weekEnd, "d 'de' MMMM yyyy", { locale: es })}`,
    105,
    25,
    { align: 'center' }
  );

  let yPosition = 35;

  // Generar tabla para cada día
  for (let i = 0; i < 7; i++) {
    const currentDay = addDays(weekStart, i);
    const dateStr = format(currentDay, 'yyyy-MM-dd');
    
    // Filtrar reservas del día
    const dayReservations = reservations.filter(r => {
      const resDateStr = format(r.startTime, 'yyyy-MM-dd');
      return resDateStr === dateStr;
    }).sort((a, b) => a.startTime - b.startTime);

    if (dayReservations.length === 0) continue;

    // Verificar si hay espacio, sino nueva página
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    // Título del día
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(format(currentDay, "EEEE d 'de' MMMM", { locale: es }).toUpperCase(), 14, yPosition);
    yPosition += 2;

    // Separar por área
    const quinchoRes = dayReservations.filter(r => r.area === 'Quincho');
    const piscinaRes = dayReservations.filter(r => r.area === 'Piscina');

    // Tabla Quincho
    if (quinchoRes.length > 0) {
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      yPosition += 5;
      doc.text('QUINCHO', 14, yPosition);
      yPosition += 2;

      const quinchoData = quinchoRes.map(r => [
        format(r.startTime, 'HH:mm') + ' - ' + format(r.endTime, 'HH:mm'),
        r.isBlock ? r.reason : `Depto ${r.department}`
      ]);

      doc.autoTable({
        startY: yPosition,
        head: [['Horario', 'Departamento']],
        body: quinchoData,
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
        margin: { left: 20, right: 14 },
        tableWidth: 'auto'
      });

      yPosition = doc.lastAutoTable.finalY + 8;
    }

    // Tabla Piscina
    if (piscinaRes.length > 0) {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(11);
      doc.text('PISCINA', 14, yPosition);
      yPosition += 2;

      const piscinaData = piscinaRes.map(r => [
        format(r.startTime, 'HH:mm') + ' - ' + format(r.endTime, 'HH:mm'),
        r.isBlock ? r.reason : `Depto ${r.department}`
      ]);

      doc.autoTable({
        startY: yPosition,
        head: [['Horario', 'Departamento']],
        body: piscinaData,
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
        margin: { left: 20, right: 14 },
        tableWidth: 'auto'
      });

      yPosition = doc.lastAutoTable.finalY + 10;
    }
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Página ${i} de ${pageCount} - Generado el ${format(new Date(), 'dd/MM/yyyy HH:mm')}`,
      105,
      290,
      { align: 'center' }
    );
  }

  // Descargar PDF
  doc.save(`Azzaro2-Reservas-${format(weekStart, 'dd-MM-yyyy')}.pdf`);
};

// Función para generar confirmación de reserva individual
export const generateReservationConfirmation = (reservation) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('Torre Azzaro II', 105, 20, { align: 'center' });
  
  doc.setFontSize(14);
  doc.text('Confirmación de Reserva', 105, 35, { align: 'center' });
  
  // Información de la reserva
  doc.setFontSize(12);
  const info = [
    ['Departamento:', reservation.department],
    ['Área:', reservation.area],
    ['Fecha:', format(reservation.startTime, "EEEE d 'de' MMMM yyyy", { locale: es })],
    ['Horario:', `${format(reservation.startTime, 'HH:mm')} - ${format(reservation.endTime, 'HH:mm')}`]
  ];

  let yPos = 60;
  info.forEach(([label, value]) => {
    doc.setFont(undefined, 'bold');
    doc.text(label, 40, yPos);
    doc.setFont(undefined, 'normal');
    doc.text(value, 100, yPos);
    yPos += 15;
  });

  // Recordatorios
  doc.setFontSize(10);
  doc.text('Recordatorios:', 40, yPos + 10);
  doc.setFont(undefined, 'normal');
  doc.text('• El titular de la reserva debe estar presente en el área', 40, yPos + 20);
  doc.text('• Respetar los horarios reservados', 40, yPos + 28);
  doc.text('• Mantener el área limpia y ordenada', 40, yPos + 36);

  doc.save(`Reserva-${reservation.department}-${format(reservation.startTime, 'dd-MM-yyyy')}.pdf`);
};
