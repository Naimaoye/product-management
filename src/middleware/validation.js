import Joi from '@hapi/joi';

const email = Joi.string().trim()
  .required()
  .label('email must not be empty');

const address = Joi.string().trim()
  .required()
  .label('address must not be empty');
 
const password = Joi.string()
  .label('password must not be empty');

  const phoneNumber = Joi.string()
  .label('phoneNumber must not be empty');

    export default {
        signup: Joi.object().keys({
          email,
          address,
          password,
          phoneNumber
        }),
        signin: Joi.object().keys({
          email,
          password
        }),
    }