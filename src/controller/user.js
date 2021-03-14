import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import User from '../models/user';
import Product from '../models/product';
import Comment from '../models/comment';
import { uploadFile } from '../config/firebase';

dotenv.config();



export default class UserController {
/**
     * @method
     * @description Implements signup endpoint
     * @static
     * @param {object} req - Request object
     * @param {object} res - Response object
     * @returns {object} JSON response
     * @memberof UserController
     */
static async signup(req, res) {
  try{
let {
    address, email, password
  } = req.body;
  let user = {
    address, email, password
  };
   
  let newUser = new User(user);
  await newUser.save();
  return res.status(201).json({
    message: 'user created successfully',
    status: 201,
  });
} catch(e){
  return res.status(500).json({
    status: 500, 
    error: 'database error'
  });
}
};

/**
     * @method
     * @description Implements upload Image endpoint
     * @static
     * @param {object} req - Request object
     * @param {object} res - Response object
     * @returns {object} JSON response
     * @memberof UserController
     */

static async uploadProduct(req, res) {
  try{
    let { imageLink, productName, location } = req.body;
    let product = {
        imageLink, productName, location
      };
      //firestore comes here
      uploadFile(imageLink).catch(console.error);
      let newProduct = new Product(product);
      await newProduct.save();
      return res.status(201).json({
        message: 'product uploaded successfully',
        status: 201,
      });
  }catch(e){
    return res.status(500).json({
      status: 500, 
      error:'database error'
    });
  }
};

/**
     * @method
     * @description Implements signin endpoint
     * @static
     * @param {object} req - Request object
     * @param {object} res - Response object
     * @returns {object} JSON response
     * @memberof UserController
     */

 static async signin(req, res) {
    try{
      let { email, password } = req.body;
      email = email.trim().toLowerCase();
      password = password;  
      const resp = await User.findOne({ email });
      const key = process.env.SECRET_KEY
      let token = jwt.sign({
        id: resp.id,
      }, key, { expiresIn: '12h' });
      return res.status(200).json({
        status: 200, 
        message:'Login successful.',
        location: resp.address,
        token: token
      });
    }catch(e){
      return res.status(500).json({
        status: 500, 
        error:'database error'
      });
    }
  };
  
/**
     * @method
     * @description Implements returnUserProductView endpoint
     * @static
     * @param {object} req - query parameter
     * @param {object} res - Response Array
     * @returns {object} JSON response
     * @memberof UserController
     */

static async returnUserSearchProduct(req, res) {
    try{
    let { location } = req.query;
      const products = await Product.find({location: location});
      if(!product){
        return res.status(404).json({
          status: 404,
          message: 'no product found in this location',
      });
      }
      return res.status(200).json({
        status: 200,
        data: products
    });
     
    } catch(e){
      res.status(500).json({
        status: 500,
        message: err
      })
    }
  }

  /**
     * @method
     * @description Implements returnUserProductView endpoint
     * @static
     * @param {object} req - Request parameter
     * @param {object} res - Response Array
     * @returns {object} JSON response
     * @memberof UserController
     */

static async returnUserProductView(req, res) {
    try{
    let { id } = req.params;
    const user = await User.findOne({_id: id})
    const {address} = user;
      const products = await Product.find({location: address});
      if(!product){
        return res.status(404).json({
          status: 404,
          message: 'no product found in this location',
      });
      }
      return res.status(200).json({
        status: 200,
        data: products
    });
     
    } catch(e){
      res.status(500).json({
        status: 500,
        message: err
      })
    }
  }


}
