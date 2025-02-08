import { NextApiRequest, NextApiResponse } from 'next';
import * as ExcelJS from 'exceljs';
import { API, Amplify } from 'aws-amplify';
import { S3 } from 'aws-sdk';
import config from '@/aws-exports';
import {
  GetTableQuery,
  Part,
  PartsByTableIDQuery,
  Table,
  getTable,
  partsByTableID,
} from '@/graphql';

Amplify.configure({ ...config, ssr: true });

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY) {
    console.error('AWS credentials not found');
    return res.status(400).end();
  }

  const s3 = new S3({
    region: config.aws_user_files_s3_bucket_region,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });

  const fetchS3Object = async (
    params: AWS.S3.GetObjectRequest,
  ): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
      s3.getObject(
        params,
        (error: AWS.AWSError, data: AWS.S3.GetObjectOutput) => {
          if (error) {
            console.error(error);
            reject(error);
          } else if (!data || !data.Body || !(data.Body instanceof Buffer)) {
            console.log('No data found or not a buffer');
            reject(new Error('No data found or not a buffer'));
          } else {
            console.log('File downloaded successfully');
            resolve(data.Body);
          }
        },
      );
    });
  };

  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const tableIDs = req.body.tableIDs;

  if (!tableIDs || !Array.isArray(tableIDs) || tableIDs.length === 0) {
    console.log('Invalid or no IDs provided');
    return res.status(400).end();
  }

  const wb = new ExcelJS.Workbook();

  const tablePromises = tableIDs.map(async (tableID) => {
    try {
      // Fetch table and parts concurrently for each tableID
      const [tableRes, partsRes] = await Promise.all([
        API.graphql({
          query: getTable,
          variables: { id: tableID },
        }) as Promise<{ data: GetTableQuery }>,
        API.graphql({
          query: partsByTableID,
          variables: {
            tableID,
            filter: {
              status: {
                eq: 12,
              },
              invoiceImg: { attributeExists: true },
              counterRecieptImg: { attributeExists: true },
            },
          },
        }) as Promise<{ data: PartsByTableIDQuery }>,
      ]);

      const table = tableRes.data.getTable as Table;
      if (!table) {
        console.log('Table not found:', table);
        return;
      }
      if (partsRes.data.partsByTableID?.items?.length === 0) return;

      if (tableRes.data.getTable?.customFile) {
        const customFileKey = `public/${tableRes.data.getTable.customFile}`;
        console.log('customFileUrl', customFileKey);
        const params: S3.GetObjectRequest = {
          Bucket: config.aws_user_files_s3_bucket,
          Key: customFileKey, // specify the exact key of the file you want to download
        };

        let response;

        try {
          response = await fetchS3Object(params);
        } catch (error) {
          console.error('Error fetching custom file:', error);
          return;
        }

        if (!response) {
          console.error('No custom file buffer found');
          return;
        }

        // Add a new worksheet to the existing workbook and copy the contents of the fetched Excel file
        const wsName = `Tabla ${table.id}`.slice(0, 31);
        const ws = wb.addWorksheet(wsName);
        const customFileWorkbook = new ExcelJS.Workbook();
        await customFileWorkbook.xlsx.load(response as unknown as ExcelJS.Buffer);
        const customFileWorksheet = customFileWorkbook.getWorksheet(1); // Assuming it's the first worksheet

        if (!customFileWorksheet) {
          throw new Error('No worksheet found in the custom file');
        }

        // Copy the contents of the fetched worksheet to the new worksheet
        customFileWorksheet.eachRow((row, rowNumber) => {
          if (rowNumber === 1) {
            // Copy header row
            ws.addRow(row.values);
          } else {
            // Ensure row.values is an array before slicing
            if (Array.isArray(row.values)) {
              const rowData = row.values.slice(1); // Skip the first cell
              ws.addRow(rowData);
            }
          }
        });
      } else {
        const wsName = `Tabla ${table.id}`.slice(0, 31);
        const ws = wb.addWorksheet(wsName);
        const parts = partsRes.data.partsByTableID?.items as Part[];

        if (!parts) {
          console.log('No parts found for table:', table);
          return;
        }

        const tableHeader = [
          'ID Parte',
          'No Factura',
          'Subtotal',
          'Fecha de Factura',
          'Unidad',
          'Proveedor',
        ];

        ws.addRow(tableHeader);

        // Add all rows concurrently (although this operation is synchronous)
        const rowPromises = parts.map(async (part) => {
          const dateString = part.invoiceInfo?.date;
          let row;
          if (dateString !== undefined) {
            const date = new Date(dateString as string);
            console.log('date', date);
            const formattedDate = `${date.getDate()}/${
              date.getMonth() + 1
            }/${date.getFullYear()}`;
            console.log('formattedDate', formattedDate);
            row = [
              part.id,
              part.invoiceInfo?.number,
              part.invoiceInfo?.subTotal,
              formattedDate,
              part.Unit?.name,
              part.Provider?.name,
            ];
          } else {
            row = [
              part.id,
              part.invoiceInfo?.number,
              part.invoiceInfo?.subTotal,
              '',
            ];
          }
          ws.addRow(row);
        });

        await Promise.all(rowPromises);

        const titleStyle = {
          font: { bold: true },
          alignment: { horizontal: 'center' },
          fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFC500' } as ExcelJS.Color,
          },
        };

        ws.getColumn(1).width = 35;
        ws.getColumn(2).width = 15;
        ws.getColumn(3).width = 20;
        ws.getColumn(4).width = 20;
        ws.getColumn(5).width = 20;
        ws.getColumn(6).width = 20;

        // Applying styles to the header
        tableHeader.forEach((_, colIdx) => {
          const colLetter = String.fromCharCode(65 + colIdx); // 65 is the ASCII value for 'A'
          // @ts-ignore
          ws.getCell(`${colLetter}1`).style = titleStyle;
        });
      }
    } catch (error) {
      console.error('Error processing ID:', tableID, error);
    }
  });

  // Wait for all promises to resolve
  await Promise.all(tablePromises);

  if (wb.worksheets.length === 0) {
    console.log('No worksheets found');
    return res.status(400).end();
  }

  try {
    // Create a buffer from the ExcelJS workbook
    const buffer = await wb.xlsx.writeBuffer();

    // Set response headers and send the file
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=Tabla.xlsx');

    res.send(buffer); // Send the buffer directly as the response
  } catch (error) {
    console.error('Failed to generate spreadsheet', error);
    res.status(400).end();
  }
};
