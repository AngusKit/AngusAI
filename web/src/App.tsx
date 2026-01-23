import { eventQueue } from '@xcan-angus/infra';

import { toast } from 'sonner';
import { AppRoute } from './routes/AppRoute';

export default function App() {
  eventQueue.register('http_error', (msg: string) => {
    toast.error(msg);
  });
  return (
    <AppRoute />
  );
}
