import { NextApiRequest, NextApiResponse } from 'next';
import * as ExcelJS from 'exceljs';
import { createClient } from '@/utils/supabase/server';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const tableIDs = req.body.tableIDs;

  if (!tableIDs || !Array.isArray(tableIDs) || tableIDs.length === 0) {
    console.log('Invalid or no IDs provided');
    return res.status(400).end();
  }

  const wb = new ExcelJS.Workbook();

  try {
    const supabase = await createClient();

    // Fetch tables and their parts
    const { data: tables, error: tablesError } = await supabase
      .from('tables')
      .select(`
        *,
        parts:parts(
          id,
          status,
          invoiceInfo,
          unit:units(name),
          provider:providers(name)
        )
      `)
      .in('id', tableIDs);

    if (tablesError) throw tablesError;
    if (!tables) throw new Error('No tables found');

    for (const table of tables) {
      if (table.customFile) {
        // Handle custom file case
        const { data: fileData, error: fileError } = await supabase
          .storage
          .from('files')
          .download(table.customFile);

        if (fileError) throw fileError;
        if (!fileData) throw new Error('No file data found');

        const wsName = `Tabla ${table.id}`.slice(0, 31);
        const ws = wb.addWorksheet(wsName);
        const customFileWorkbook = new ExcelJS.Workbook();
        await customFileWorkbook.xlsx.load(await fileData.arrayBuffer());
        const customFileWorksheet = customFileWorkbook.getWorksheet(1);

        if (!customFileWorksheet) {
          throw new Error('No worksheet found in the custom file');
        }

        customFileWorksheet.eachRow((row, rowNumber) => {
          const rowData = Array.isArray(row.values) ? row.values.slice(1) : [];
          ws.addRow(rowData);
        });
      } else {
        // Create standard table worksheet
        const wsName = `Tabla ${table.id}`.slice(0, 31);
        const ws = wb.addWorksheet(wsName);
        
        const tableHeader = [
          'ID Parte',
          'No Factura',
          'Subtotal',
          'Fecha de Factura',
          'Unidad',
          'Proveedor',
        ];

        ws.addRow(tableHeader);

        if (table.parts) {
          for (const part of table.parts) {
            if (part.status === 12 && part.invoiceInfo) {
              const date = part.invoiceInfo.date ? new Date(part.invoiceInfo.date) : null;
              const formattedDate = date ? 
                `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}` : '';

              ws.addRow([
                part.id,
                part.invoiceInfo.number || '',
                part.invoiceInfo.subTotal || '',
                formattedDate,
                part.unit?.name || '',
                part.provider?.name || '',
              ]);
            }
          }
        }

        // Style the worksheet
        ws.getColumn(1).width = 35;
        ws.getColumn(2).width = 15;
        ws.getColumn(3).width = 20;
        ws.getColumn(4).width = 20;
        ws.getColumn(5).width = 20;
        ws.getColumn(6).width = 20;

        // Style the header
        const headerStyle = {
          font: { bold: true },
          fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFC500' }
          }
        };

        tableHeader.forEach((_, colIdx) => {
          const cell = ws.getCell(`${String.fromCharCode(65 + colIdx)}1`);
          Object.assign(cell, headerStyle);
        });
      }
    }

    const buffer = await wb.xlsx.writeBuffer();
    
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=Tabla.xlsx');
    res.send(buffer);
  } catch (error) {
    console.error('Failed to generate spreadsheet', error);
    res.status(400).end();
  }
};