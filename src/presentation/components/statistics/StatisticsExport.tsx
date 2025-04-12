import { useState } from 'react';
import { Client } from '../../../core/domain/Client';
import { Payment } from '../../../core/domain/Payment';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import * as XLSX from 'xlsx';

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
  tableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 5,
    width: '100%',
  },
  tableHeader: {
    backgroundColor: '#F3F4F6',
  },
  tableCell: {
    flex: 1,
    padding: 5,
    fontSize: 10,
    textAlign: 'center',
  },
  viewer: {
    width: '100%',
    height: '600px',
    marginBottom: '20px',
  },
});

interface StatisticsExportProps {
  clients: Client[];
  payments: Payment[];
}

const StatisticsPDF = ({ clients, payments }: StatisticsExportProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Reporte de Estadísticas</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen de Clientes</Text>
          <View style={styles.tableContainer}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Total Clientes</Text>
              <Text style={styles.tableCell}>Clientes Activos</Text>
              <Text style={styles.tableCell}>Clientes Inactivos</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>{clients.length}</Text>
              <Text style={styles.tableCell}>
                {clients.filter(c => c.status === 'active').length}
              </Text>
              <Text style={styles.tableCell}>
                {clients.filter(c => c.status === 'inactive').length}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen de Pagos</Text>
          <View style={styles.tableContainer}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Total Pagos</Text>
              <Text style={styles.tableCell}>Ingresos Totales</Text>
              <Text style={styles.tableCell}>Promedio por Pago</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>{payments.length}</Text>
              <Text style={styles.tableCell}>
                ${payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString('es-CO')} COP
              </Text>
              <Text style={styles.tableCell}>
                ${(payments.reduce((sum, p) => sum + p.amount, 0) / (payments.length || 1)).toLocaleString('es-CO')} COP
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export const StatisticsExport: React.FC<StatisticsExportProps> = ({ clients, payments }) => {
  const [showPDF, setShowPDF] = useState(false);

  const exportToExcel = () => {
    const clientsSheet = XLSX.utils.json_to_sheet(
      clients.map(client => ({
        Nombre: client.name,
        Teléfono: client.cell_phone,
        'Día de Pago': client.day_to_pay,
        Estado: client.status === 'active' ? 'Activo' : 'Inactivo',
        'Último Pago': client.last_payment_date || 'Nunca'
      }))
    );

    const paymentsSheet = XLSX.utils.json_to_sheet(
      payments.map(payment => ({
        Cliente: clients.find(c => c.id === payment.client_id)?.name || 'Desconocido',
        Monto: payment.amount,
        Fecha: payment.payment_date,
        Estado: payment.status
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, clientsSheet, 'Clientes');
    XLSX.utils.book_append_sheet(wb, paymentsSheet, 'Pagos');

    XLSX.writeFile(wb, 'estadisticas.xlsx');
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <button
          onClick={exportToExcel}
          className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Exportar a Excel
        </button>
        <button
          onClick={() => setShowPDF(!showPDF)}
          className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200"
        >
          {showPDF ? 'Ocultar PDF' : 'Ver PDF'}
        </button>
      </div>
      {showPDF && (
        <PDFViewer style={styles.viewer}>
          <StatisticsPDF clients={clients} payments={payments} />
        </PDFViewer>
      )}
    </div>
  );
};
