import { createClient } from '@libsql/client';

const dbClient = createClient({
  url: 'file:clam.db',
});

export default dbClient;