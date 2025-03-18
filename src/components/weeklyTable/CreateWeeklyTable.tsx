import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { validateWeeklyTableDates } from '../../utils/validation';
import * as XLSX from 'xlsx';

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

const CreateWeeklyTable: React.FC<Props> = ({ onClose, onCreated }) => {
  const [weekStart, setWeekStart] = useState('');
  const [weekEnd, setWeekEnd] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateExcelFile = async (startDate: string, endDate: string) => {
    try {
      // Get approved requests for the date range
      // Add one day to endDate to include the full end date
      const endDateTime = new Date(endDate);
      endDateTime.setDate(endDateTime.getDate() + 1);
      
      const { data: requests, error } = await supabase
        .from('part_requests')
        .select(`
          *,
          unit:units(name),
          provider:providers(name),
          parts(name, description, cost, quantity)
        `)
        .eq('status', 'status_13')
        .gte('created_at', startDate)
        .lt('created_at', endDateTime.toISOString());

      if (error) throw error;
      if (!requests?.length) return null;

      // Format data for Excel
      const excelData = requests.map(request => ({
        'ID': request.short_id,
        'Fecha': new Date(request.created_at).toLocaleDateString('es-MX'),
        // Reporte de Falla
        'Unidad': request.unit?.name || '',
        'Ubicación del Problema': request.problem_location,
        'Operador que Detectó': request.operator_detected,
        'Descripción del Problema': request.problem_description,
        'Ubicación de Partes Dañadas': request.damaged_parts_location,
        // Orden de Trabajo
        'Trabajo Mecánico': request.mechanic_work,
        'Mecánico Asignado': request.assigned_mechanic,
        'Tipo de Reparación': request.repair_type,
        'Observaciones': request.observations,
        // Solicitud de Partes
        'Proveedor': request.provider?.name || '',
        'Partes': request.parts?.map(p => `${p.name} (${p.quantity})`).join(', ') || '',
        'Descripción de Partes': request.parts?.map(p => p.description).join(', ') || '',
        'Costos Individuales': request.parts?.map(p => `$${p.cost}`).join(', ') || '',
        'Monto Total': `$${request.total_amount?.toLocaleString('es-MX')}`,
        'Importante': request.is_important ? 'Sí' : 'No',
        'Pago en Efectivo': request.is_cash_payment ? 'Sí' : 'No',
        // Facturación
        'Número de Factura': request.invoice_number || '',
      }));

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData, { origin: 'A2' });

      // Add title row
      XLSX.utils.sheet_add_aoa(ws, [['Reporte Semanal de Solicitudes de Partes']], { origin: 'A1' });

      // Add section headers
      const sections = [
        { start: 'A', end: 'B', title: 'Información General', color: '4472C4' },
        { start: 'C', end: 'G', title: 'Reporte de Falla', color: '70AD47' },
        { start: 'H', end: 'K', title: 'Orden de Trabajo', color: 'ED7D31' },
        { start: 'L', end: 'R', title: 'Solicitud de Partes', color: '7030A0' },
        { start: 'S', end: 'S', title: 'Facturación', color: '00B0F0' }
      ];

      // Set column widths
      const colWidths = [
        { wch: 10 },  // ID
        { wch: 12 },  // Fecha
        { wch: 15 },  // Unidad
        { wch: 20 },  // Ubicación Problema
        { wch: 20 },  // Operador
        { wch: 30 },  // Descripción Problema
        { wch: 20 },  // Ubicación Partes
        { wch: 30 },  // Trabajo Mecánico
        { wch: 20 },  // Mecánico
        { wch: 15 },  // Tipo Reparación
        { wch: 30 },  // Observaciones
        { wch: 20 },  // Proveedor
        { wch: 30 },  // Partes
        { wch: 30 },  // Descripción Partes
        { wch: 20 },  // Costos
        { wch: 15 },  // Total
        { wch: 10 },  // Importante
        { wch: 10 },  // Efectivo
        { wch: 15 },  // Factura
      ];
      ws['!cols'] = colWidths;

      // Add styles
      const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
      for (let R = range.s.r; R <= range.e.r; R++) {
        for (let C = range.s.c; C <= range.e.c; C++) {
          const cell_address = { c: C, r: R };
          const cell_ref = XLSX.utils.encode_cell(cell_address);
          if (!ws[cell_ref]) continue;

          // Add cell style
          ws[cell_ref].s = {
            font: { name: 'Arial', sz: 11 },
            alignment: { vertical: 'center', horizontal: 'left', wrapText: true },
            border: {
              top: { style: 'thin' },
              bottom: { style: 'thin' },
              left: { style: 'thin' },
              right: { style: 'thin' }
            }
          };

          // Style header row
          if (R === 0) {
            ws[cell_ref].s.font = { bold: true, sz: 14, color: { rgb: 'FFFFFF' } };
            ws[cell_ref].s.fill = { fgColor: { rgb: '4472C4' } };
            ws[cell_ref].s.alignment.horizontal = 'center';
          }
          // Style column headers
          else if (R === 1) {
            ws[cell_ref].s.font = { bold: true, sz: 11 };
            ws[cell_ref].s.fill = { fgColor: { rgb: 'E2EFDA' } };
          }
          // Style data rows
          else {
            if (C >= 14 && C <= 15) { // Money columns
              ws[cell_ref].s.alignment.horizontal = 'right';
            }
          }
        }
      }

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Solicitudes');

      // Convert to binary string
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
      
      // Create Blob and upload to Supabase Storage
      const blob = new Blob(
        [Uint8Array.from(atob(excelBuffer), c => c.charCodeAt(0))],
        { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
      );

      const fileName = `weekly-table-${startDate}-${endDate}.xlsx`;

      // Upload file
      const { error: uploadError, data } = await supabase.storage
        .from('weekly_tables')
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('weekly_tables')
        .getPublicUrl(fileName);

      return { publicUrl, requests };
    } catch (error) {
      console.error('Error generating Excel file:', error);
      throw error;
    }
  };

  const validateApprovedRequests = async (startDate: string, endDate: string) => {
    // Add one day to endDate to include the full end date
    const endDateTime = new Date(endDate);
    endDateTime.setDate(endDateTime.getDate() + 1);

    const { data, error } = await supabase
      .from('part_requests')
      .select('id')
      .eq('status', 'status_13')
      .gte('created_at', startDate)
      .lt('created_at', endDateTime.toISOString());

    if (error) throw error;
    return data?.length > 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);

      // Validate dates
      const dateError = validateWeeklyTableDates(weekStart, weekEnd);
      if (dateError) {
        setError(dateError);
        return;
      }

      // Check if there are approved requests in the date range
      const hasApprovedRequests = await validateApprovedRequests(weekStart, weekEnd);
      if (!hasApprovedRequests) {
        setError('No hay solicitudes aprobadas en el rango de fechas seleccionado');
        return;
      }

      // Generate Excel file and get URL
      const result = await generateExcelFile(weekStart, weekEnd);
      if (!result) {
        setError('Error al generar el archivo Excel');
        return;
      }

      const { publicUrl, requests } = result;

      // Create weekly table
      const { data: weeklyTable, error: createError } = await supabase
        .from('weekly_tables')
        .insert({
          week_start: weekStart,
          week_end: weekEnd,
          status: 0,
          table_url: publicUrl
        })
        .select()
        .single();

      if (createError) throw createError;

      // Create weekly table items for each request
      const { error: itemsError } = await supabase
        .from('weekly_table_items')
        .insert(
          requests.map(request => ({
            weekly_table_id: weeklyTable.id,
            part_request_id: request.id
          }))
        );

      if (itemsError) throw itemsError;

      onCreated();
      onClose();
    } catch (error: any) {
      console.error('Error creating weekly table:', error);
      setError(error.message || 'Error al crear la tabla semanal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            Crear Tabla de la Semana
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha de Inicio
            </label>
            <input
              type="date"
              value={weekStart}
              onChange={(e) => setWeekStart(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha de Fin
            </label>
            <input
              type="date"
              value={weekEnd}
              onChange={(e) => setWeekEnd(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Creando...' : 'Crear Tabla'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWeeklyTable;