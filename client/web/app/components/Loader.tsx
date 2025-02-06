import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white">
      <div className="relative">
        {/* Main Purple Circle */}
        <div className="w-12 h-12 border-4 border-purple-200 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-purple-600 rounded-full animate-pulse" 
               style={{ 
                 clipPath: 'polygon(50% 0, 100% 0, 100% 50%, 50% 50%)',
                 animation: 'spin 1s linear infinite' 
               }}>
          </div>
        </div>
        
        {/* BioVault Text */}
        <div className="mt-4 text-center">
          <span className="text-sm font-medium text-purple-600">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default Loader;