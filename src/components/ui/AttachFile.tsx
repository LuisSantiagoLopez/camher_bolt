import { uploadFileToS3 } from '@/helpers/s3';
import React, { useEffect, useState } from 'react';

interface UploadImageProps {
  part: string;
  name: string;
  imagesOnly?: boolean; // Optional prop to only allow images
  isTable?: boolean; // Optional prop to only allow images
  setStatus?: (status: number, unitID: string) => void;
  isUploadComplete: boolean;
  setIsUploadComplete: React.Dispatch<React.SetStateAction<boolean>>;
}

const UploadImage: React.FC<UploadImageProps> = ({
  part,
  name,
  imagesOnly = false,
  isTable = false,
  setStatus = null,
  setIsUploadComplete,
  isUploadComplete,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Add isLoading state

  useEffect(() => {
    const uploadFile = async () => {
      setIsLoading(true); // Set isLoading to true when upload starts
      try {
        if (!selectedFile) {
          setIsLoading(false); // Set isLoading to false if there's no file
          return;
        }
        const key = `${name}/${part}`;
        await uploadFileToS3(selectedFile, key, imagesOnly, isTable); // Pass imagesOnly prop in case we want to only allow images
        if (setStatus) setStatus(1, part);
        setIsUploadComplete(true); // Set to true when upload is complete
      } catch (error: any) {
        // Check the message property of the error
        if (error.message === 'FileTypeNotAllowedException') {
          isTable
            ? alert('El tipo de archivo no está permitido. Cargue un excel.')
            : !imagesOnly
            ? alert(
                'El tipo de archivo no está permitido, cargue un documento, imagen o PDF.',
              )
            : alert('El tipo de archivo no está permitido, cargue una imagen.');
        } else {
          alert('Error al subir el archivo, intente de nuevo.');
        }
      } finally {
        setIsLoading(false); // Set isLoading to false when upload is complete or an error occurs
      }
    };

    uploadFile();
  }, [selectedFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
    }
  };

  return (
    <div className="rounded-md border border-gray-100 bg-white p-4 shadow-md">
      <label
        htmlFor="upload"
        className="flex cursor-pointer flex-col items-center gap-2"
      >
        {/* Render a loading spinner while isLoading is true */}
        {isLoading ? (
          <div className="h-10 w-10 animate-spin rounded-full border-b-4 border-t-4 border-green-500"></div>
        ) : // Render a checkmark when isUploadComplete is true
        isUploadComplete ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-green-500"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
            <path d="M22 4L12 14.01l-3-3"></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 fill-white stroke-orange-400"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        )}
      </label>
      <input
        id="upload"
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default UploadImage;
