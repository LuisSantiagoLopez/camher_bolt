import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { PartT as Part } from '@/graphql';
import { queryPartsForProvider } from '@/helpers/helperFunPart';
import { queryProviderByEmail } from '@/helpers/helperFunProvider';
import { DownloadFile } from '@/components/ui/DownloadFile';
import LoadingAnim from '@/components/ui/animations/loadingAnim';
import { Field } from '@/helpers/s3';

interface ProviderDocsProps {
  email: string;
  updatePrevTools: (tool: string) => void;
}

export default function ProviderDocs({ email, updatePrevTools }: ProviderDocsProps) {
  const [parts, setParts] = useState<Part[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadParts = async () => {
      try {
        setIsLoading(true);
        const provider = await queryProviderByEmail(email);
        if (!provider) {
          throw new Error('Provider not found');
        }
        const providerParts = await queryPartsForProvider(provider.id);
        setParts(providerParts.filter(part => part.invoiceImg || part.counterRecieptImg));
      } catch (err) {
        console.error('Error loading parts:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadParts();
  }, [email]);

  if (isLoading) return <LoadingAnim />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <Head>
        <title>Documentos</title>
        <meta name="description" content="Documentos de proveedor Camher" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-8 text-center text-4xl font-bold">Mis Documentos</h1>

          <button
            onClick={() => updatePrevTools('action')}
            className="mb-8 rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
          >
            Regresar al menú
          </button>

          {parts.length === 0 ? (
            <div className="rounded-lg bg-gray-100 p-8 text-center">
              <p className="text-lg text-gray-600">No hay documentos disponibles</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {parts.map((part) => part && (
                <motion.div
                  key={part.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-lg bg-white p-6 shadow-lg"
                >
                  <h3 className="mb-4 text-xl font-semibold">
                    Unidad: {part.Unit?.name}
                  </h3>
                  <p className="mb-2 text-gray-600">
                    Fecha: {new Date(part.reqDate || '').toLocaleDateString()}
                  </p>
                  <div className="mt-4 space-y-4">
                    {part.invoiceImg && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Factura</span>
                        <DownloadFile
                          partID={part.id}
                          field={Field.invoice}
                          small
                        />
                      </div>
                    )}
                    {part.counterRecieptImg && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Contrarecibo</span>
                        <DownloadFile
                          partID={part.id}
                          field={Field.counterReceiptImg}
                          small
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}