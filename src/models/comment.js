import mongoose from 'mongoose';

const commentSchema =  new mongoose.Schema({
    comment: { type: String },
    isReplied: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
});



const Comment = mongoose.model('Comment', commentSchema);

export default Comment;