import { Router } from 'express';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import UsersProfileController from '../controllers/UsersProfileController';

const usersProfileRouter = Router();
const usersProfileController = new UsersProfileController();

usersProfileRouter.use(ensureAuthenticated);

usersProfileRouter.get('/', usersProfileController.show);
usersProfileRouter.put('/', usersProfileController.update);

export default usersProfileRouter;
