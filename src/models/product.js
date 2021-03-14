import mongoose from 'mongoose';

const productSchema =  new mongoose.Schema({
    imageLink: { type: String },
    productName: { type: String },
    location: { type: String },
    createdAt: { type: Date, default: Date.now },
    userId: { type: String }
});



const Product = mongoose.model('Product', productSchema);

export default Product;