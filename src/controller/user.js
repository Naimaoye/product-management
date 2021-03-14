import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user';
import Product from '../models/product';
import Comment from '../models/comment';
import Reply from '../models/reply';
import sendEmail from '../utils/mailer';
import transporter from '../utils/transporter';
import { uploadFile } from '../config/firebase';

dotenv.config();

const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const client = require('twilio')(accountSid, authToken);



const composeReplyEmail = (email, replierEmail) => ({
  recipientEmail: `${email}`,
  subject: 'Your Registration Status',
  body: `<p>Hello <br> This is to notify you that ${replierEmail} replied your comment </p>`
});

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
    const userId = req.user.id;
      //firestore comes here
      uploadFile(imageLink).catch(console.error);
      let newProduct = new Product({
        imageLink, 
        productName, 
        location,
        userId: userId
      });
      const resp = await newProduct.save();
      return res.status(201).json({
        message: 'product uploaded successfully',
        status: 201,
        data: {
          productId: resp._id,
          productImage: resp.imageLink,
          name: resp.productName,
          location: resp.location
        }
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
      const userId = req.user.id;
      const user = await User.findOne({_id: userId});
    const {address} = user;
      const products = await Product.find({location: address});
      if(!product){
        return res.status(404).json({
          status: 404,
          message: 'no product found in your location',
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
     * @description Implements createComment endpoint
     * @static
     * @param {object} req - Request object
     * @param {object} res - Response object
     * @returns {object} JSON response
     * @memberof UserController
     */

 static async createComment(req, res) {
  try{
  const userId = req.user.id;
  const user = await User.findOne({_id: userId});
  const {productId} = req.params;
  const product = await Product.findOne({_id: productId});
  let {
    text
  } = req.body;
   if(user && product){
  let newComment = new Comment({
    text,
    userId: userId,
    productId: productId
  });
  const resp = await newComment.save();
  return res.status(201).json({
    message: 'comment created successfully',
    status: 201,
    data: {
      commentId: resp._id,
      text: resp.text
    }
  });
} else {
  return res.status(403).json({
    message: 'something went wrong',
    status: 403,
  });
}
  } catch(e){
    res.status(500).json({
      status: 500,
      message: e
    })
  }
}

/**
     * @method
     * @description Implements replyComment endpoint
     * @static
     * @param {object} req - Request object
     * @param {object} res - Response object
     * @returns {object} JSON response
     * @memberof UserController
     */

 static async replyComment(req, res) {
  try{
  const { commentId } = req.params;
  const replyingUserId = req.user.id;
  const postedComment = await Comment.findOne({_id: commentId });
  const postedCommentUserId = postedComment.userId;
  const user = await User.findOne({_id: postedCommentUserId});
  const replier =await  User.findOne({_id: replyingUserId});
  let {
    text
  } = req.body;
  let newReply = new Reply({
    text,
    commentId: commentId,
    userId: replyingUserId,
    productId: postedComment.productId
  });
  const resp = await newReply.save();
  // pass text inside the email and sms transporter.
  if(resp){
  const { phoneNumber, email } = user;
  const mailData = composeReplyEmail(email, replier.email);
  sendEmail(transporter(), mailData);
  // send sms
  client.messages
  .create({
     body: `Hello. This is to notify you that ${replier.email} replied your comment`,
     from: '+18148861376',
     to: `${phoneNumber}`,
   })
  .then(message => console.log(message.sid))
  .catch(err => console.log(err));
  return res.status(201).json({
    message: 'reply created successfully',
    status: 201,
    data: {
      replyId: resp._id,
      text: resp.text
    }
  });
  }
  } catch(e){
    res.status(500).json({
      status: 500,
      message: e
    })
  }
}

}
