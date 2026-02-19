import { createApplication } from "@specific-dev/framework";
import * as schema from './db/schema/schema.js';
import * as clientsRoutes from './routes/clients.js';
import * as programsRoutes from './routes/programs.js';

// Create application with schema for full database type support
export const app = await createApplication(schema);

// Export App type for use in route files
export type App = typeof app;

// Register routes
clientsRoutes.register(app, app.fastify);
programsRoutes.register(app, app.fastify);

await app.run();
app.logger.info('Application running');
