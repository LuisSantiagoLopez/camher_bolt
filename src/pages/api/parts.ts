import { NextApiRequest, NextApiResponse } from 'next';
import * as ExcelJS from 'exceljs';
import { API, Amplify } from 'aws-amplify';
import config from '@/aws-exports';
import { GetPartQuery, Part, getPart } from '@/graphql';

Amplify.configure({ ...config, ssr: true });

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const partIDs = req.body.partIDs;

  if (!partIDs || !Array.isArray(partIDs) || partIDs.length === 0) {
    console.warn('Invalid or no IDs provided');
    return res.status(400).end();
  }

  const wb = new ExcelJS.Workbook();
  const sheet = wb.addWorksheet('Reporte de Partes');

  // Define reusable styles
  const titleStyle = {
    font: { bold: true, size: 14, color: { argb: 'FFFFFF' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF9C20' } },
    alignment: { horizontal: 'center', vertical: 'middle' },
    border: {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    },
  };

  const sectionTitleStyle = {
    font: { bold: true, size: 12, color: { argb: 'FFFFFF' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'A6A6A6' } },
    alignment: { horizontal: 'center', vertical: 'middle' },
    border: {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    },
  };

  const headerStyle = {
    font: { bold: true, size: 11 },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F0F0F0' } },
    alignment: { horizontal: 'center', vertical: 'middle' },
    border: {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    },
  };

  const dataStyle = {
    font: { size: 11 },
    alignment: { horizontal: 'left', vertical: 'middle', wrapText: true },
    border: {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    },
  };

  // Set column widths
  sheet.columns = [
    { width: 20 }, // A
    { width: 15 }, // B
    { width: 20 }, // C
    { width: 20 }, // D
    { width: 35 }, // E
    { width: 15 }, // F
    { width: 15 }, // G
  ];

  let currentRow = 1;

  // Sort parts by date
  const parts = await Promise.all(
    partIDs.map(async (id) => {
      const partRes = (await API.graphql({
        query: getPart,
        variables: { id },
      })) as { data: GetPartQuery };
      return partRes.data.getPart as Part;
    })
  );

  const sortedParts = parts
    .filter(part => part)
    .sort((a, b) => {
      const dateA = new Date(a.reqDate || '').getTime();
      const dateB = new Date(b.reqDate || '').getTime();
      return dateB - dateA;
    });

  for (const part of sortedParts) {
    try {
      const { reqDate, failureReport, partReq, workOrder } = part;
      const unitName = part.Unit.name;
      const {
        operator,
        problemLocation,
        description: failureDescription,
      } = failureReport || {};

      const {
        partDescription,
        isImportant,
        isCash,
        quantity,
        price: partPrice,
        unitaryPrice,
      } = partReq || {};

      // Add part date header
      sheet.getRow(currentRow).height = 30;
      const dateStr = reqDate ? new Date(reqDate).toLocaleDateString() : 'Sin fecha';
      sheet.mergeCells(`A${currentRow}:G${currentRow}`);
      const headerRow = sheet.getRow(currentRow);
      headerRow.getCell(1).value = `ORDEN DE REFACCIÓN - ${dateStr}`;
      headerRow.eachCell((cell) => {
        Object.assign(cell.style, titleStyle);
      });
      currentRow++;

      // Failure Report Section
      sheet.mergeCells(`A${currentRow}:G${currentRow}`);
      const failureSectionRow = sheet.getRow(currentRow);
      failureSectionRow.getCell(1).value = 'REPORTE DE FALLA';
      failureSectionRow.eachCell((cell) => {
        Object.assign(cell.style, sectionTitleStyle);
      });
      currentRow++;

      // Failure Report Headers
      const failureHeaders = ['Fecha', 'Unidad', 'Operador', 'Localización', 'Descripción de Falla'];
      sheet.mergeCells(`E${currentRow}:G${currentRow}`);
      const failureHeaderRow = sheet.getRow(currentRow);
      failureHeaders.forEach((header, index) => {
        const cell = failureHeaderRow.getCell(index + 1);
        cell.value = header;
        Object.assign(cell.style, headerStyle);
      });
      currentRow++;

      // Failure Data Row
      sheet.mergeCells(`E${currentRow}:G${currentRow}`);
      const failureDataRow = sheet.getRow(currentRow);
      [
        reqDate ? new Date(reqDate).toLocaleDateString() : '',
        unitName || '',
        operator || '',
        problemLocation || '',
        failureDescription || ''
      ].forEach((value, index) => {
        const cell = failureDataRow.getCell(index + 1);
        cell.value = value;
        Object.assign(cell.style, dataStyle);
      });
      currentRow++;

      // Spacing row
      currentRow++;

      // Work Order Section
      sheet.mergeCells(`A${currentRow}:G${currentRow}`);
      const workOrderSectionRow = sheet.getRow(currentRow);
      workOrderSectionRow.getCell(1).value = 'ORDEN DE TRABAJO';
      workOrderSectionRow.eachCell((cell) => {
        Object.assign(cell.style, sectionTitleStyle);
      });
      currentRow++;

      const {
        jobToBeDone,
        personInCharge,
        sparePart,
        observation: workObservation,
      } = workOrder || {};

      const workOrderHeaders = ['Trabajo a Efectuar', 'Asignado', 'Refacción', 'Observaciones'];
      sheet.mergeCells(`D${currentRow}:G${currentRow}`);
      const workOrderHeaderRow = sheet.getRow(currentRow);
      workOrderHeaders.forEach((header, index) => {
        const cell = workOrderHeaderRow.getCell(index + 1);
        cell.value = header;
        Object.assign(cell.style, headerStyle);
      });
      currentRow++;

      // Work Order Data Row
      sheet.mergeCells(`D${currentRow}:G${currentRow}`);
      const workOrderDataRow = sheet.getRow(currentRow);
      [jobToBeDone || '', personInCharge || '', sparePart || '', workObservation || ''].forEach((value, index) => {
        const cell = workOrderDataRow.getCell(index + 1);
        cell.value = value;
        Object.assign(cell.style, dataStyle);
      });
      currentRow++;

      // Spacing row
      currentRow++;

      // Parts Request Section
      if (partDescription?.length) {
        // Parts Request Section Title
        sheet.mergeCells(`A${currentRow}:G${currentRow}`);
        const partsSectionRow = sheet.getRow(currentRow);
        partsSectionRow.getCell(1).value = 'SOLICITUD DE PARTES';
        partsSectionRow.eachCell((cell) => {
          Object.assign(cell.style, sectionTitleStyle);
        });
        currentRow++;

        const partsHeaders = [
          'Descripción',
          'Unidad',
          'Precio Unitario',
          'Cantidad',
          'Es Importante',
          'Es de Contado',
          'Precio Total'
        ];
        const partsHeaderRow = sheet.getRow(currentRow);
        partsHeaders.forEach((header, index) => {
          const cell = partsHeaderRow.getCell(index + 1);
          cell.value = header;
          Object.assign(cell.style, headerStyle);
        });
        currentRow++;

        partDescription.forEach((desc, index) => {
          const row = sheet.getRow(currentRow);
          [
            desc || '',
            unitName || '',
            unitaryPrice ? `$${unitaryPrice[index]}` : '',
            quantity ? quantity[index] : '',
            isImportant ? 'Sí' : 'No',
            isCash ? 'Sí' : 'No',
            index === 0 ? `$${partPrice}` : ''
          ].forEach((value, colIndex) => {
            const cell = row.getCell(colIndex + 1);
            cell.value = value;
            Object.assign(cell.style, dataStyle);
          });
          currentRow++;
        });
      }

      // Add spacing between parts
      sheet.addRow([]);
      sheet.addRow([]);
      currentRow += 2;

    } catch (error) {
      console.error('Error processing part:', error);
    }
  }

  try {
    const buffer = await wb.xlsx.writeBuffer();
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=Partes.xlsx');
    res.send(buffer);
  } catch (error) {
    console.error('Failed to generate spreadsheet', error);
    res.status(400).end();
  }
};