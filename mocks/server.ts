
import { handlers } from './handlers';

export const mockServer = {
  listen: () => console.log('[MSW MockServer] Listening for API requests...'),
  resetHandlers: () => console.log('[MSW MockServer] Handlers reset.'),
  close: () => console.log('[MSW MockServer] Closed.'),
  handlers,
};
