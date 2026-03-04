import { app, AppOrServiceRoute } from '@xcan-angus/infra';
import { initAfterAuthentication } from '@/lib/initAuth';
import { BrowserRouter } from 'react-router-dom';

import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

start();

async function start() {
  await app.initEnvironment();
  await initAfterAuthentication({ code: AppOrServiceRoute.ai });
  createRoot(document.getElementById('root')!).render(<BrowserRouter><App /></BrowserRouter>);
}
