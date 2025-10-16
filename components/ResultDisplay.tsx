import React from 'react';
import type { MedicationInfo, GroundingSource } from '../types';
import { InfoIcon, WarningIcon } from './IconComponents';

interface ResultDisplayProps {
  imagePreviewUrl: string;
  medicationInfo: MedicationInfo;
  sources: GroundingSource[];
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ imagePreviewUrl, medicationInfo, sources }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center border-b pb-6">
        <img src={imagePreviewUrl} alt="Medication preview" className="w-48 h-48 mx-auto rounded-lg object-cover shadow-lg mb-4"/>
        <h2 className="text-4xl font-bold text-slate-800">{medicationInfo.name}</h2>
        <p className="text-slate-500 mt-1">以下是简化的药品信息摘要</p>
      </div>

      <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
        <h3 className="text-2xl font-bold text-green-800 flex items-center gap-3 mb-3">
          <InfoIcon />
          如何服用 (用量)
        </h3>
        <p className="text-xl text-green-900 leading-relaxed">
          {medicationInfo.dosage}
        </p>
      </div>

      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
        <h3 className="text-2xl font-bold text-red-800 flex items-center gap-3 mb-3">
          <WarningIcon />
          什么时候不能吃 (禁忌)
        </h3>
        <p className="text-xl text-red-900 leading-relaxed">
          {medicationInfo.contraindications}
        </p>
      </div>

      {sources.length > 0 && (
        <div className="pt-6 border-t">
          <h4 className="text-lg font-semibold text-slate-600 mb-2">信息来源:</h4>
          <ul className="space-y-1 text-sm list-disc list-inside">
            {sources.map((source, index) => (
              <li key={index}>
                <a 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:underline"
                >
                  {source.title || new URL(source.uri).hostname}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};