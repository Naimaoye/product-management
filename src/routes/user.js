import express from 'express';
import UserController from '../controller/user';
import Authentication from '../utils/checkAuth';
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
    '/uploadProduct', Authentication.verifyToken,
    UserController.uploadProduct);

    userRoute.get(
        '/seachProductByLocation',
        UserController.returnUserSearchProduct);

userRoute.get(
        '/userLocationProducts', Authentication.verifyToken,
        UserController.returnUserProductView);

userRoute.post(
  '/comment/:productId', Authentication.verifyToken,
  UserController.createComment
);

userRoute.post(
  '/reply/:commentId', Authentication.verifyToken,
  UserController.replyComment
);
  

export default userRoute; 