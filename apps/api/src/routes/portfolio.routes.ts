import type { FastifyInstance } from 'fastify';
import { getPortfolio, getPortfolioByUser } from '../controllers/portfolio.controller.js';

export async function portfolioRoutes(app: FastifyInstance) {
  app.get('/portfolio/:id', getPortfolio);
  app.get('/api/v1/portfolio/:userId', getPortfolioByUser);
}
