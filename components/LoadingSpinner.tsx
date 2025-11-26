import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-200 rounded-full animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full border-t-4 border-purple-600 rounded-full animate-spin"></div>
      </div>
      <p className="text-purple-600 font-medium animate-pulse">
        AI가 이름을 분석하고 있어요...
      </p>
    </div>
  );
};
