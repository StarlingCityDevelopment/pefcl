import React from 'react';
import { createRoot } from 'react-dom/client';
import { NuiProvider } from 'react-fivem-hooks';
import { HashRouter } from 'react-router';
import image from './bg.png';
import MobileApp from './views/Mobile/Mobile';

const Root = () => (
  <HashRouter>
    <NuiProvider>
      <div className="relative w-[500px] h-[1000px]">
        <div 
          className="absolute inset-0 z-10 pointer-events-none" 
          style={{ 
            backgroundImage: `url(${image})`,
            backgroundSize: '100% 100%'
          }} 
        />
        <React.Suspense fallback='Loading phone'>
          <div className="absolute top-[100px] left-[50px] right-[50px] bottom-[100px] z-[2] flex flex-col bg-center bg-cover bg-no-repeat rounded-[20px] overflow-hidden">
            <MobileApp />
          </div>
        </React.Suspense>
      </div>
    </NuiProvider>
  </HashRouter>
);

const container = document.getElementById('mobile-app');
if (!container) {
  throw new Error('Failed to find the root element');
}

const root = createRoot(container!);
root.render(<Root />);
