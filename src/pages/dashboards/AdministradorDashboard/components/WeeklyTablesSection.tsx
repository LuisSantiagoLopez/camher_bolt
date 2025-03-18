import React from 'react';
import { WeeklyTable } from '../../../../types';
import WeeklyTableList from '../../../../components/weeklyTable/WeeklyTableList';

interface Props {
  tables: WeeklyTable[];
}

const WeeklyTablesSection: React.FC<Props> = ({ tables }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Tablas Semanales</h3>
      <WeeklyTableList
        tables={tables}
        onReupload={() => {}} // Administrators can't reupload tables
      />
    </div>
  );
};

export default WeeklyTablesSection;