import express from 'express';
import { setupRoutes } from './routes/index';
import { setupMiddleware } from './middleware/index';

const app = express();

// Setup middleware
setupMiddleware(app);

// Setup routes
setupRoutes(app);

export default app;