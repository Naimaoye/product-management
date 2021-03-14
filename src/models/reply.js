import mongoose from 'mongoose';

const replySchema =  new mongoose.Schema({
    text: { type: String },
    createdAt: { type: Date, default: Date.now },
    userId: { type: String },
    productId: { type: String },
    commentId: { type: String }
});



const Reply = mongoose.model('Reply', replySchema);

export default Reply;