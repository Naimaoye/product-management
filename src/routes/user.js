import express from 'express';
import UserController from '../controller/user';
import userValidations from '../middleware/userValidation';

const userRoute = express.Router();

userRoute.post('/signup',
  userValidations.validateUser('signup'),
  userValidations.userExists,
  UserController.signup);

userRoute.post('/signin',
  userValidations.validateUser('signin'),
  userValidations.validateLogin,
  UserController.signin);

  userRoute.post(
    '/uploadProduct',
    UserController.uploadProduct);

    userRoute.get(
        '/seachProductByLocation',
        UserController.returnUserSearchProduct);

userRoute.get(
        '/userLocationProducts/:id',
        UserController.returnUserProductView);
  

      export default userRoute; 