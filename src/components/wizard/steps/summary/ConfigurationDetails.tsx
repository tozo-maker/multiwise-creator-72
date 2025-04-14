
import React from 'react';
import { SystemConfiguration } from './SystemConfiguration';
import { ProjectConfiguration } from './ProjectConfiguration';
import { ConfigData } from '../../types';

interface ConfigurationDetailsProps {
  data: ConfigData;
}

export const ConfigurationDetails: React.FC<ConfigurationDetailsProps> = ({ data }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Configuration Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SystemConfiguration data={data} />
        <ProjectConfiguration data={data} />
      </div>
    </div>
  );
};
