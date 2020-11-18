import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import UsersProfileController from '../controllers/UsersProfileController';

const usersProfileRouter = Router();

const usersProfileController = new UsersProfileController();

usersProfileRouter.use(ensureAuthenticated);

usersProfileRouter.get('/', usersProfileController.show);

usersProfileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      previous_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
    },
  }),
  usersProfileController.update,
);

export default usersProfileRouter;
