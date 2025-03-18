import React from 'react';
import { FolderTree } from 'lucide-react';

const ProjectStructure: React.FC = () => {
  return (
    <section className="bg-white shadow rounded-lg p-8">
      <div className="flex items-center mb-6">
        <FolderTree className="h-8 w-8 text-primary-500 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">Estructura del Proyecto</h2>
      </div>
      <div className="prose max-w-none">
        <h3>Directorios Principales</h3>
        <ul>
          <li>
            <code>/src</code>
            <ul>
              <li><code>/components</code> - Componentes reutilizables de React</li>
              <li><code>/pages</code> - Páginas principales de la aplicación</li>
              <li><code>/layouts</code> - Layouts reutilizables</li>
              <li><code>/store</code> - Estado global usando Zustand</li>
              <li><code>/services</code> - Servicios de la aplicación (email, etc.)</li>
              <li><code>/utils</code> - Utilidades y funciones auxiliares</li>
              <li><code>/types</code> - Definiciones de tipos TypeScript</li>
              <li><code>/lib</code> - Configuración de librerías (Supabase)</li>
            </ul>
          </li>
          <li>
            <code>/supabase</code>
            <ul>
              <li><code>/migrations</code> - Migraciones de la base de datos</li>
            </ul>
          </li>
        </ul>

        <h3>Archivos Principales</h3>
        <ul>
          <li><code>vite.config.ts</code> - Configuración de Vite</li>
          <li><code>tailwind.config.js</code> - Configuración de Tailwind CSS</li>
          <li><code>package.json</code> - Dependencias y scripts</li>
          <li><code>tsconfig.json</code> - Configuración de TypeScript</li>
        </ul>
      </div>
    </section>
  );
};

export default ProjectStructure;