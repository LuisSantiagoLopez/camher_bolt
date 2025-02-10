import React, { useState, useEffect } from 'react';
import CollapsedCard from '@/components/ui/CollapsedCard';
import { queryPartsByRange } from '@/helpers/helperFunPart';
import { Part } from '@/types/database';

const PendingPartPage = () => {
  const [parts, setParts] = useState<Part[]>([]);

  useEffect(() => {
    const fetchParts = async () => {
      const res = await queryPartsByRange(6, 6);
      setParts(res);
    };

    fetchParts();
  }, []);

  if (!parts.length) {
    return <div>There are no pending parts.</div>;
  }

  return (
    <div>
      <h1>Pending Parts</h1>
      <div className="part-list">
        {parts.map((part, index) => (
          <CollapsedCard
            key={part?.id ?? index.toString()}
            part={part}
            handleClick={() => {
              return;
              // TODO: Implement
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PendingPartPage;
