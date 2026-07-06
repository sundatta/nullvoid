import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifyWebsocket from '@fastify/websocket';
import cookie from '@fastify/cookie';
import { config } from '@nullvoid/config';
import { createLogger } from '@nullvoid/logger';
import { getPrisma, disconnectPrisma } from '@nullvoid/database';
import { portfolioRoutes } from './routes/portfolio.routes.js';

const logger = createLogger('api');

async function buildApp() {
  const app = Fastify({
    logger: false,
    bodyLimit: 10 * 1024 * 1024,
  });

  await app.register(cors, {
    origin: config.DASHBOARD_URL,
    credentials: true,
  });

  await app.register(helmet, {
    contentSecurityPolicy: false,
  });

  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  await app.register(cookie);

  await app.register(fastifyJwt, {
    secret: config.JWT_SECRET,
    cookie: { cookieName: 'token', signed: false },
  });

  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'NullVoid API',
        version: '1.0.0',
        description: 'Enterprise-Grade Discord Bot API',
      },
      servers: [{ url: config.API_URL }],
    },
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
  });

  await app.register(fastifyWebsocket);

  app.get('/health', async () => ({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  }));

  app.get('/api/v1', async () => ({
    name: 'NullVoid API',
    version: '1.0.0',
  }));

  app.get('/api/v1/auth/me', async (req, reply) => {
    try {
      await req.jwtVerify();
    } catch {
      return reply.status(401).send({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not logged in' } });
    }
    const payload = req.user as { sub?: string };
    return { success: true, data: { id: payload.sub ?? '0', username: 'User', discriminator: '0000', avatar: null, locale: 'en', premium: false } };
  });

  app.post('/api/v1/auth/logout', async (_req, reply) => {
    reply.clearCookie('token', { path: '/' });
    return { success: true, data: { message: 'Logged out' } };
  });

  app.get('/api/v1/guilds', async (req, reply) => {
    try {
      await req.jwtVerify();
    } catch {
      return reply.status(401).send({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not logged in' } });
    }
    return { success: true, data: [] };
  });

  await app.register(portfolioRoutes);

  return app;
}

async function main() {
  const app = await buildApp();

  getPrisma();
  logger.info('Database connected');

  const port = config.API_PORT;
  const host = '0.0.0.0';

  await app.listen({ port, host });
  logger.info({ port, host }, 'API server started');

  const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
  for (const signal of signals) {
    process.on(signal, async () => {
      logger.info(`Received ${signal}, shutting down`);
      await app.close();
      await disconnectPrisma();
      process.exit(0);
    });
  }
}

main().catch((error) => {
  logger.fatal({ error }, 'Failed to start API');
  process.exit(1);
});
