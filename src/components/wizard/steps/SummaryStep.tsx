
import React from 'react';
import { ConfigData } from '../types';
import { ProjectOverview } from './summary/ProjectOverview';
import { ConfigurationDetails } from './summary/ConfigurationDetails';
import { LanguageContentConfiguration } from './summary/LanguageContentConfiguration';
import { ReferenceDocuments } from './summary/ReferenceDocuments';
import { ReadyToCreateCard } from './summary/ReadyToCreateCard';

interface SummaryStepProps {
  data: ConfigData;
}

export const SummaryStep: React.FC<SummaryStepProps> = ({ data }) => {
  console.log('Summary data:', data);

  return (
    <div className="space-y-6">
      <ProjectOverview data={data} />
      <ConfigurationDetails data={data} />
      <LanguageContentConfiguration data={data} />
      <ReferenceDocuments data={data} />
      <ReadyToCreateCard />
    </div>
  );
};
