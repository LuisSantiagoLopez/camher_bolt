import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { IconContext } from 'react-icons';
import { AiOutlineDownload, AiOutlineFieldTime, AiFillQuestionCircle, AiOutlineUnorderedList, AiOutlineEdit } from 'react-icons/ai';
import { PartT as Part } from '@/graphql';
import { getPartTableBlob } from '@/helpers/createSheet';
import YesNo from '@/reusable/yesNo';
import { setPartProvider } from '@/helpers/helperFunPart';
import { queryAllProvider } from '@/helpers/helperFunProvider';
import ProviderQueryDropdown from '@/components/ui/ProviderQueryDropdown';
import { fetchFileFromS3 } from '@/helpers/s3';
import { useSelectedToolContext } from '@/context/SelectedToolContext';

interface FailureCardProps {
  failure: Part;
  isAction?: boolean;
  name?: string;
  handleClick: (unit: Part, status: number) => void;
}

export default function FailureCard({
  failure,
  isAction,
  name,
  handleClick,
}: FailureCardProps) {
  const [url, setUrl] = useState('');
  const [shortId, setShortId] = useState('');
  const [allProvider, setAllProvider] = useState<Provider[]>([]);
  const [provider, setProvider] = useState<Provider>();
  const [isLoading, setIsLoading] = useState(false);
  const { setPastTools, setSelectedTool } = useSelectedToolContext();

  useEffect(() => {
    const fetchProviders = async () => {
      const providerList = await queryAllProvider();
      if (!providerList) return;
      setAllProvider(providerList as Provider[]);
    };
    fetchProviders();
  }, []);

  const handleDownloadTable = async () => {
    if (!failure) return;
    setIsLoading(true);
    await getPartTableBlob([failure.id]);
    setIsLoading(false);
  };

  const handleEdit = () => {
    // Store current part data in session storage
    sessionStorage.setItem('editingPart', JSON.stringify(failure));
    // Navigate to edit flow
    setPastTools(['status', 'action']);
    setSelectedTool('newrefaction');
  };

  const handleYes = async () => {
    if (!failure || !provider) {
      alert('Por favor selecciona un proveedor');
      return;
    }
    try {
      await setPartProvider(failure.id, provider.id);
      handleClick(failure, failure.status ? failure.status + 1 : 1);
    } catch (error) {
      console.error('Error updating:', error);
      alert('Error al actualizar');
    }
  };

  const handleNo = () => {
    handleClick(failure, -1);
  };

  useEffect(() => {
    if (!failure) return;
    const shortid1 = failure.id.split('-')[0];
    const shortid2 = failure.id.split('-')[4];
    setShortId(shortid1 + '-' + shortid2);
    getImg();
  }, []);

  async function getImg() {
    try {
      if (!failure?.id) return;
      const { blob } = await fetchFileFromS3(failure?.id, 'partApproval');
      if (!blob) return;
      const url = window.URL.createObjectURL(blob);
      if (!url) return;
      setUrl(url);
    } catch (error) {
      console.error('Error fetching image', error);
    }
  }

  return (
    <>
      <div id="leftContainer" className="flex flex-row justify-center text-center">
        {url && (
          <Image
            className="aspect-square rounded-md object-cover"
            src={url}
            alt={'unit' + shortId + 'evidence'}
            width={200}
            height={200}
          />
        )}
        <div id="cardInfo" className="ml-16 flex w-[75%] flex-col items-start justify-around">
          <div id="infoContainer" className="flex flex-row space-x-5">
            <div className="text-5xl font-bold text-white">UNIDAD {name}</div>
            <div className="flex space-x-2">
              <button onClick={handleDownloadTable}>
                <IconContext.Provider value={{ size: '1.5em' }}>
                  {!isLoading ? (
                    <AiOutlineDownload />
                  ) : (
                    <div className="flex h-5 w-5 animate-spin flex-row items-center rounded-full border-b-2 border-t-2 border-white"></div>
                  )}
                </IconContext.Provider>
              </button>
              <button onClick={handleEdit} className="hover:text-camherdarkyellow">
                <IconContext.Provider value={{ size: '1.5em' }}>
                  <AiOutlineEdit />
                </IconContext.Provider>
              </button>
            </div>
          </div>
          <div className="mt-5 flex w-full flex-row items-center space-x-5 rounded-md bg-neutral-600 px-10 py-5">
            <IconContext.Provider value={{ size: '1.5em' }}>
              <AiOutlineUnorderedList />
            </IconContext.Provider>
            <p className="text-xl font-light">
              {failure && failure.failureReport?.description}
            </p>
          </div>
          <div className="mt-5 flex w-full flex-row items-center space-x-5 rounded-md bg-neutral-600 px-10 py-5">
            <IconContext.Provider value={{ size: '1.5em' }}>
              <AiFillQuestionCircle />
            </IconContext.Provider>
            <p className="text-xl font-light">
              {failure && failure.failureReport?.operator}
            </p>
          </div>
          <div className="my-5 flex w-full flex-row items-center space-x-5 rounded-md bg-neutral-600 px-10 py-5">
            <IconContext.Provider value={{ size: '1.5em' }}>
              <AiOutlineFieldTime />
            </IconContext.Provider>
            <p className="font-light md:text-sm lg:text-xl">
              {failure && failure.updatedAt}
            </p>
          </div>
        </div>
      </div>

      {isAction && (
        <>
          <div className="flex w-full flex-col items-center justify-center space-y-6 p-4">
            <ProviderQueryDropdown
              options={allProvider}
              setOption={setProvider}
              className="w-1/2 border border-black"
              placeholder="Seleccionar proveedor..."
            />
            <div className="flex w-full justify-center space-x-4">
              <button
                onClick={handleYes}
                className="h-14 w-72 rounded-lg bg-camhergreen px-8 text-lg font-light text-stone-700 transition-all hover:font-semibold"
              >
                Continuar proceso
              </button>
              <button
                onClick={handleNo}
                className="h-14 w-72 rounded-lg bg-camherred px-8 text-lg font-light text-stone-700 transition-all hover:font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </>
      )}

      <div id="cardFooter" className="mt-3 flex flex-row items-center justify-between text-sm">
        <p className="text-sm text-white">{failure && failure.reqDate}</p>
        <div id="cardID" className="flex flex-col justify-center self-end rounded-md bg-camhergreen px-2 text-black">
          <p className="mx-auto">{failure && failure.id}</p>
        </div>
      </div>
    </>
  );
}