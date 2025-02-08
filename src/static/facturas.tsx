import Head from 'next/head';
import Button from '#/Button';
import { buttonAndPartProps } from '@/types/partTypes';
import { updateStatus } from '@/helpers/helperFunPart';
import { DownloadFile } from '@/components/ui/DownloadFile';

export default function Facturas({
  handleButton1,
  partID,
}: buttonAndPartProps) {
  const handleButtonClick = async () => {
    // Ask the user for confirmation
    const isConfirmed = window.confirm(
      '¿Estás seguro que deseas finalizar el proceso?',
    );
    if (!isConfirmed) return;

    try {
      await updateStatus(11, partID); // 11 = status
    } catch (error) {
      console.error('Error updating part', error);
      alert('Error al actualizar la parte, intente de nuevo');
      return;
    }
    // Handle button action
    handleButton1();
  };

  return (
    <>
      <Head>
        <title>Factura</title>
        <meta name="description" content="Camher" />
      </Head>
      <div className="mt-20 flex flex-col items-center justify-center gap-1">
        <DownloadFile partID={partID} field={'invoice'} isButton={false} />

        <Button className="m-5" intent={'green'} onClick={handleButtonClick}>
          {'  '}Finalizar Proceso{'  '}
        </Button>
      </div>
    </>
  );
}
