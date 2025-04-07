import { useState } from 'react';
import { User } from '../../../core/domain/User';
import { Payment } from '../../../core/services/paymentService';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import * as XLSX from 'xlsx';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { formatDate } from '../../../core/utils/dateUtils';

interface StatisticsExportProps {
  users: User[];
  payments: Payment[];
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#1F2937',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#374151',
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    color: '#4B5563',
  },
});

const StatisticsPDF = ({ users, payments }: StatisticsExportProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Reporte de Estadísticas</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumen de Usuarios</Text>
        <Text style={styles.text}>Total de usuarios: {users.length}</Text>
        <Text style={styles.text}>Usuarios activos: {users.filter(u => u.paid).length}</Text>
        <Text style={styles.text}>Usuarios inactivos: {users.filter(u => !u.paid).length}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumen de Pagos</Text>
        <Text style={styles.text}>Total de pagos: {payments.length}</Text>
        <Text style={styles.text}>
          Ingresos totales: ${payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString('es-CO')} COP
        </Text>
      </View>
    </Page>
  </Document>
);

export const StatisticsExport = ({ users, payments }: StatisticsExportProps) => {
  const [showPDF, setShowPDF] = useState(false);

  const exportToExcel = () => {
    // Crear hoja de usuarios
    const usersSheet = XLSX.utils.json_to_sheet(
      users.map(user => ({
        Nombre: user.name,
        Teléfono: user.cell_phone,
        'Día de Pago': user.date_to_pay,
        Estado: user.paid ? 'Activo' : 'Inactivo',
        'Último Pago': user.last_payment_date ? formatDate(user.last_payment_date) : 'Sin pagos'
      }))
    );

    // Crear hoja de pagos
    const paymentsSheet = XLSX.utils.json_to_sheet(
      payments.map(payment => ({
        Fecha: formatDate(payment.payment_date),
        Monto: payment.amount,
        Usuario: users.find(u => u.id === payment.user_id)?.name,
        Estado: payment.status
      }))
    );

    // Crear libro
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, usersSheet, 'Usuarios');
    XLSX.utils.book_append_sheet(wb, paymentsSheet, 'Pagos');

    // Guardar archivo
    XLSX.writeFile(wb, 'estadisticas.xlsx');
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Exportar Datos</h3>
        <ArrowDownTrayIcon className="h-6 w-6 text-gray-400" />
      </div>

      <div className="flex space-x-4">
        <button
          onClick={exportToExcel}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
        >
          Exportar a Excel
        </button>
        <button
          onClick={() => setShowPDF(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
        >
          Exportar a PDF
        </button>
      </div>

      {showPDF && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Vista Previa del PDF</h3>
              <button
                onClick={() => setShowPDF(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Cerrar
              </button>
            </div>
            <PDFViewer width="100%" height={500}>
              <StatisticsPDF users={users} payments={payments} />
            </PDFViewer>
          </div>
        </div>
      )}
    </div>
  );
}; 