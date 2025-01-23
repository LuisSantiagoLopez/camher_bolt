import React from 'react';
import { CardProps } from '../../types/cardTypes.d.ts';
import UnitCard from '../cards/UnitCard';
import AdminCard from '../cards/AdminCard';
import ProviderCard from '../cards/ProviderCard';
import FailureCard from '../cards/FailureCard';
import CounterCard from '../cards/CounterCard';
import CardBackground from './CardBackground';
import { motion } from 'framer-motion';
import { IconContext } from 'react-icons';
import { AiOutlineClose } from 'react-icons/ai';
import Semaforo from './Semaforo';
import { getUnitName } from '@/helpers/helperFunPart';
import { useSelectedToolContext } from '@/context/SelectedToolContext';

export default function Card(cardP: CardProps): JSX.Element {
  const [unitName, setUnitName] = React.useState('');
  const { setPastTools, setSelectedTool } = useSelectedToolContext();

  React.useEffect(() => {
    getUnitName(cardP.data, setUnitName);
  }, []);

  const handleEdit = () => {
    // Store current part data in session storage
    sessionStorage.setItem('editingPart', JSON.stringify(cardP.data));
    // Navigate to the edit flow
    setPastTools(['status', 'action']);
    setSelectedTool('newrefaction');
  };

  let content;
  switch (cardP.type) {
    case 'unit':
      content = <UnitCard unit={cardP.data} name={unitName} />;
      break;
    case 'counter':
      content = <CounterCard counter={cardP.data} />;
      break;
    case 'failure':
      content = (
        <FailureCard
          failure={cardP.data}
          isAction={cardP.isAction}
          name={unitName}
          handleClick={cardP.handleClick}
          onEdit={handleEdit}
        />
      );
      break;
    case 'admincard':
      content = (
        <AdminCard
          unit={cardP.data}
          isAction={cardP.isAction}
          name={unitName}
        />
      );
      break;
    case 'provider':
      if (!cardP.data) throw new Error('Missing data');
      content = (
        <ProviderCard unit={cardP.data} name={unitName} isInvoice={true} />
      );
      break;
    case 'receipt':
      if (!cardP.data) throw new Error('Missing data');
      content = (
        <ProviderCard unit={cardP.data} name={unitName} isInvoice={false} />
      );
      break;
    default:
      content = <></>;
      break;
  }

  return (
    <CardBackground>
      <motion.div onClick={cardP.handleBack} className="hover:cursor-pointer">
        <IconContext.Provider value={{ size: '1em' }}>
          <AiOutlineClose className="right-5 top-5 rounded-md text-3xl hover:scale-105" />
        </IconContext.Provider>
      </motion.div>
      {content}
      <Semaforo process={cardP.data.status} type={'parte'} />
    </CardBackground>
  );
}