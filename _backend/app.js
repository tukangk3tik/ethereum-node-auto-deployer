import Fastify from 'fastify';
import authPlugin from './plugins/auth.js';
import masterDataRoutes from './routes/master-data.route.js';
import userRoutes from './routes/user.route.js';
import ethNodeRoutes from './routes/eth-node.route.js';
import connectDB from './config/db.js';
import setupProject from './setup-project.js';
import cors from '@fastify/cors';

const fastify = Fastify({
  logger: true
});

async function buildApp() {
  // setup project here
  await setupProject();

  // connect db here
  await connectDB();

  fastify.get('/', async () => {
    return 'ETH Node Deployer API - v1';
  });

  // register all route, middleware, and plugin here
  fastify.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  fastify.register(authPlugin);
  fastify.register(masterDataRoutes);
  fastify.register(userRoutes);
  fastify.register(ethNodeRoutes);

  return fastify;
}

export default buildApp;