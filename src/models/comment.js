import mongoose from 'mongoose';

const commentSchema =  new mongoose.Schema({
    text: { type: String },
    createdAt: { type: Date, default: Date.now },
    userId: { type: String },
    productId: { type: String }
});



const Comment = mongoose.model('Comment', commentSchema);

export default Comment;