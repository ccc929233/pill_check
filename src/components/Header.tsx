import React from 'react';
import { PillIcon } from './IconComponents';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <PillIcon className="h-8 w-8 text-blue-600 mr-3" />
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
          智能药品识别助手
        </h1>
      </div>
    </header>
  );
};
