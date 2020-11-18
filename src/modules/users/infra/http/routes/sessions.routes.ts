import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import SessionssController from '../controllers/SessionsController';

const sessionsRouter = Router();

const sessionsController = new SessionssController();

sessionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  sessionsController.create,
);

export default sessionsRouter;
