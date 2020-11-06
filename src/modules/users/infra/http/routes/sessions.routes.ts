import { Router } from 'express';
import SessionssController from '../controllers/SessionsController';

const sessionsRouter = Router();
const sessionsController = new SessionssController();

sessionsRouter.post('/', sessionsController.create);

export default sessionsRouter;
