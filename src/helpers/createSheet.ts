import * as XLSX from 'xlsx';

export const createSheet = (name: string, data: any[][]) => {
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, name);

  XLSX.writeFile(wb, `${name}.xlsx`);

  return wb;
};

export const createBlobSheet = (name: string, data: any[][]) => {
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, name);

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

  return new Blob([wbout], { type: 'application/octet-stream' });
};

const downloadBlobAsXlsx = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none'; // Hide the element
  a.href = url;
  a.download = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;

  document.body.appendChild(a); // Required for Firefox
  a.click();

  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
};

export async function getPartTableBlob(
  partIDs: string[],
): Promise<Blob | null> {
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
    a.style.display = 'none'; // Hide the link
    document.body.appendChild(a);

    // Trigger the download
    a.click();

    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    return blob;
  } catch (err) {
    console.error(err);
    throw new Error("Can't get table data");
  }
}

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
