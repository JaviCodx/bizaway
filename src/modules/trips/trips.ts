import autoload from '@fastify/autoload'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function catalogue (app, opts) {
  app.register(autoload, {
    dir: join(__dirname, 'routes'),
    options: {
      prefix: opts.prefix
    }
  })
}