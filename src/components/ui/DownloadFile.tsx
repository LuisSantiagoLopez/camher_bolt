import { useState } from 'react';
import { fetchFileFromS3, Field } from '@/helpers/s3';
import {
  AiFillFileText,
  AiOutlineDownload,
  AiOutlinePaperClip,
} from 'react-icons/ai';

interface DownloadFileProps {
  partID: string;
  field: keyof typeof Field;
  isButton?: boolean;
  small?: boolean;
}

export const DownloadFile: React.FC<DownloadFileProps> = ({
  partID,
  field,
  isButton = true,
  small = false,
}) => {
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDownload = async () => {
    setIsLoading(true);
    if (!partID) return; // If there's no partID, there's no file to download
    if (url) {
      // If URL is already set, trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = field;
      link.click();
      setIsLoading(false);
      return;
    }
    try {
      const { blob, filename } = await fetchFileFromS3(partID, field);
      if (!blob) return;
      const generatedUrl = window.URL.createObjectURL(blob);
      setUrl(generatedUrl);
      // Trigger download after URL is set
      const link = document.createElement('a');
      link.href = generatedUrl;
      link.download = filename || 'default_filename';
      link.click();
    } catch (error) {
      console.error(`Error fetching ${field}`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonName = (field: keyof typeof Field): string => {
    switch (field) {
      case Field.invoice:
        return 'Descargar Factura';
      case Field.counterReceiptImg:
        return 'Descargar Contrarrecibo';
      case Field.partApprovalImg:
        return 'Descargar Evidencia';
      default:
        return '';
    }
  };

  const getIcon = (field: keyof typeof Field): JSX.Element => {
    switch (field) {
      case Field.invoice:
        return <AiFillFileText />;
      case Field.counterReceiptImg:
        return <AiOutlinePaperClip />;
      default:
        return <AiOutlineDownload />;
    }
  };

  const LoadingSpinner = () => (
    <div className="flex h-5 w-5 animate-spin flex-row items-center rounded-full border-b-2 border-t-2 border-white"></div>
  );

  if (small) {
    return (
      <div className="m-3 flex flex-row items-center">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <button
            className="flex flex-row items-center text-xl font-light"
            onClick={handleDownload}
            title={getButtonName(field)}
          >
            {getIcon(field)}
          </button>
        )}
      </div>
    );
  }

  if (isButton) {
    return (
      <div className="mt-5 flex w-full flex-row items-center space-x-5 rounded-md bg-neutral-600 px-10 py-5">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <button
            className="flex flex-row items-center space-x-2 text-xl font-light"
            onClick={handleDownload}
            title={getButtonName(field)}
          >
            <p>{getButtonName(field)}</p>
            {getIcon(field)}
          </button>
        )}
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center">
        <h1 className="mb-5 self-center text-5xl font-extralight">
          {getButtonName(field)}
        </h1>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <button onClick={handleDownload} title={getButtonName(field)}>
            <AiOutlineDownload className="cursor-pointer text-6xl" />
          </button>
        )}
      </div>
    );
  }
};
