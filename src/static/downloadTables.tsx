import React, { useEffect, useState } from 'react';
import { AiOutlineDownload } from 'react-icons/ai';
import { IconContext } from 'react-icons';
import Head from 'next/head';
import Button from '#/Button';
import { getPartTableBlob, getTableBlob } from '@/helpers/createSheet';
import { DateRangeType } from '@/types/datepickerTypes';
import { DatePicker } from '@/components/ui/DatePicker';
import { queryPartsByTime } from '@/helpers/helperFunPart';
import { queryTablesByTime } from '@/helpers/helperFunTable';

interface Props {
  isTable?: boolean;
}

function DownloadTables({ isTable }: Props) {
  const initialDateRange: DateRangeType = {
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    endDate: new Date(new Date().setDate(new Date().getDate() - 1)),
  };
  const [dateRange, setDateRange] = useState<DateRangeType>(initialDateRange);
  const [tableParts, setTableParts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getTableParts = async () => {
    if (!isTable) {
      const parts = await queryPartsByTime(
        dateRange.startDate,
        dateRange.endDate,
      );
      
      if (!parts) return [];

      setTableParts(parts);
      return parts;
    } else {
      const tables = await queryTablesByTime(
        dateRange.startDate,
        dateRange.endDate,
      );
      if (!tables) return [];
      setTableParts(tables);
      return tables;
    }
  };

  const handleButtonClick = async () => {
    setIsLoading(true);
    if (!isTable) {
      const parts = await getTableParts();
      if (parts.length === 0) {
        alert('No hay datos para descargar');
        setIsLoading(false);
        return;
      }
      await getPartTableBlob(parts);
    } else {
      const tables = await getTableParts();
      if (tables.length === 0) {
        alert('No hay datos para descargar');
        setIsLoading(false);
        return;
      }
      await getTableBlob(tables);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <Head>
        <title>Descargar {isTable ? 'Tablas' : 'Partes'}</title>
        <meta name="description" content="Camher" />
      </Head>

      <div className="mt-20 flex flex-col items-center justify-center gap-10">
        <h1 className="mb-5 self-center text-5xl">
          Descargar {isTable ? 'Tablas' : 'Partes'}
        </h1>
        <h2 className="text-2xl self-center">
        Descarga las tablas.
        </h2>
        <DatePicker setValue={setDateRange} value={dateRange} />
        <Button intent="green" onClick={handleButtonClick}>
          <div className="flex justify-center">
            {'  '}Descargar{'  '}
            <IconContext.Provider value={{ size: '1.5em' }}>
              {!isLoading ? (
                <AiOutlineDownload />
              ) : (
                <div className="flex h-5 w-5 animate-spin flex-row items-center rounded-full border-b-2 border-t-2 border-white"></div>
              )}
            </IconContext.Provider>
          </div>
        </Button>
      </div>
    </div>
  );
}

export default DownloadTables;
