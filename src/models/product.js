import mongoose from 'mongoose';

const productSchema =  new mongoose.Schema({
    imageLink: { type: String },
    productName: { type: String },
    location: { type: String },
    createdAt: { type: Date, default: Date.now },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
});



const Product = mongoose.model('Product', productSchema);

export default Product;