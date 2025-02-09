import * as ExcelJS from 'exceljs';

// Create a new Excel workbook and worksheet from array data
export const createSheet = (name: string, data: any[][]) => {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet(name);
  
  ws.addRows(data);
  
  wb.xlsx.writeFile(`${name}.xlsx`);
  
  return wb;
};

// Create a blob from array data for Excel file
export const createBlobSheet = (name: string, data: any[][]) => {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet(name);
  
  ws.addRows(data);
  
  return wb.xlsx.writeBuffer().then(buffer => {
    return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  });
};

// Helper function to download a blob as an Excel file
const downloadBlobAsXlsx = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;

  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
};

// Get part table data and download as Excel
export async function getPartTableBlob(partIDs: string[]): Promise<Blob | null> {
  try {
    const res = await fetch('api/parts', {
      method: 'POST',
      body: JSON.stringify({
        partIDs: partIDs,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error('Server responded with a non-200 status code.');
    }

    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'parts.xlsx';
    a.style.display = 'none';
    document.body.appendChild(a);

    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    return blob;
  } catch (err) {
    console.error(err);
    throw new Error("Can't get table data");
  }
}

// Get table data and download as Excel
export async function getTableBlob(tableIDs: string[]): Promise<Blob | null> {
  try {
    const res = await fetch('api/tables', {
      method: 'POST',
      body: JSON.stringify({
        tableIDs: tableIDs,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const blob = await res.blob();

    if (!res.ok)
      throw new Error('Server responded with a non-200 status code.');

    downloadBlobAsXlsx(blob, 'table.xlsx');
    return blob;
  } catch (err) {
    console.error(err);
    return null;
  }
}