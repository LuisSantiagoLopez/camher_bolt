import React from 'react';
import { motion } from 'framer-motion';

interface SemaforoProps {
  process: number;
  type: 'parte' | 'tabla';
}

interface CicleProps {
  value: string;
  ind: number;
  tooltipContent: string;
}

const Semaforo = ({ process, type }: SemaforoProps) => {
  const maxNum = type == 'parte' ? 10 : 3;
  const toolsArrParte = [
    'En espera de revisión mecánica',
    'Orden de trabajo',
    'Soilictud de Parte para reparación',
    'En espera de validación de daños',
    'En espera de aprobación de diagnóstico',
    'En espera de aprobación del administrador',
    'En espera de aprobación del administrador',
    'En espera de validación',
    'En espera de factura de proveedor',
    'Facturas',
  ];

  const toolsArrTabla = [
    'Tabla pendiente de aprobación',
    'Tabla pendiente de carga al SAE',
    'Tabla subida al SAE',
  ];

  const circles = [];
  let max = maxNum;
  for (let i = 0; i < max; i++) {
    let tooltipContent = type == 'parte' ? toolsArrParte[i] : toolsArrTabla[i];
    let value = process - i === 1 ? 'Actual' : process - i > 1 ? 'Aprobadas' : 'rest';
    value = process === -1 ? 'Canceladas' : value;
    circles.push(
      <Circle
        value={value}
        ind={max - i - 1}
        tooltipContent={tooltipContent}
      />,
    );
  }
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row pt-1">{circles}</div>
      <p className="text-sm font-thin text-neutral-400">
        {type == 'parte' ? toolsArrParte[process -1] : toolsArrTabla[process-1]}
      </p>
    </div>
  );
};

interface ToolTipProps {
  children?: React.ReactNode;
  content: string;
}

const ToolTip: React.FC<ToolTipProps> = ({ children, content }) => {
  return (
    <div className="relative">
      {children}
      <div className="tooltip absolute -top-24 left-3 -translate-x-1/2 transform rounded-md border border-gray-700 bg-black p-2 text-xs text-white shadow-lg">
        {content}
      </div>
    </div>
  );
};

function Circle({ value, ind, tooltipContent }: CicleProps) {
  const [tooltip, setShowTooltip] = React.useState(false);
  const colorClass =
    value === 'Actual'
      ? 'bg-yellow-400'
      : value === 'Aprobadas'
      ? 'bg-green-400'
      : value === 'Canceladas'
      ? 'bg-red-400'
      : 'bg-white';
  const circleSize =
    value === 'Actual'
      ? 'lg:w-8 w-4 h-4 lg:h-8'
      : value === 'Aprobadas'
      ? 'lg:w-6 w-3 h-3 lg:h-6 '
      : value === 'Canceladas'
      ? 'lg:w-6 w-3 h-3 lg:h-6'
      : 'lg:w-6 w-3 h-3 lg:h-6 ';
  const tail = ind == 0 ? '' : 'w-3';
  return (
    <motion.div
      className="mt-4 flex flex-row items-center"
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.8 }}
      style={{ x: 1 }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {tooltip && <ToolTip content={tooltipContent} />}
      <div className={`${circleSize} rounded-full ${colorClass}`}></div>
      <div className={`${tail} h-1 ${colorClass}`}> </div>
    </motion.div>
  );
}

export default Semaforo;
