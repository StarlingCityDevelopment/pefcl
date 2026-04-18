import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { GlobalSettingsProvider } from '@hooks/useGlobalSettings';
import { NuiProvider } from 'react-fivem-hooks';
import { I18nextProvider } from 'react-i18next';
import { HashRouter } from 'react-router';
import App from './App';
import i18n from './utils/i18n';

const container = document.getElementById('root');
if (!container) {
 throw new Error('Failed to find the root element');
}

const root = createRoot(container);

root.render(
 <React.StrictMode>
 <NuiProvider>
 <GlobalSettingsProvider>
 <I18nextProvider i18n={i18n}>
 <HashRouter>
 <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-black text-white font-bold uppercase tracking-widest text-[10px]">Securely Initializing...</div>}>
 <App />
 </React.Suspense>
 </HashRouter>
 </I18nextProvider>
 </GlobalSettingsProvider>
 </NuiProvider>
 </React.StrictMode>,
);
