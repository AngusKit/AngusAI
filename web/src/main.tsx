import { app, AppOrServiceRoute } from '@xcan-angus/infra';
import { initAfterAuthentication } from '@/lib/initAuth.ts';

import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

start();

async function start() {
  await app.initEnvironment();
  await initAfterAuthentication({ code: AppOrServiceRoute.gm });
  createRoot(document.getElementById('root')!).render(<App />);
}
