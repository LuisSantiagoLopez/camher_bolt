import React from 'react';
import ProjectStructure from './Documentation/components/ProjectStructure';
import MainComponents from './Documentation/components/MainComponents';
import SystemStates from './Documentation/components/SystemStates';
import DatabaseStructure from './Documentation/components/DatabaseStructure';
import SecurityPermissions from './Documentation/components/SecurityPermissions';

const Documentation: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Documentación Técnica del Sistema
          </h1>
          <p className="text-lg text-gray-600">
            Sistema de Seguimiento de Partes para Camher Aliados
          </p>
        </div>

        <div className="space-y-12">
          <ProjectStructure />
          <MainComponents />
          <SystemStates />
          <DatabaseStructure />
          <SecurityPermissions />
        </div>
      </div>
    </div>
  );
};

export default Documentation;