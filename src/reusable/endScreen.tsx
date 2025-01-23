import React from 'react';
import { EndScreenProps } from "@/types/buttonTypes";

export default function EndScreen({
    handleButton1,
    title,
    subtitle,
}: EndScreenProps) 
{
  return (
    <div className="flex flex-col items-center py-60 h-screen">
      <h1 className="text-4xl font-bold mb-8">{title}</h1>
      <p className="text-lg text-gray-600 mb-4">{subtitle}</p>
      <button onClick={handleButton1} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded">
        Menú
      </button>
    </div>
  );
};

