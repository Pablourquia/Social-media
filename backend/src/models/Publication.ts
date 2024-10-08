import {Schema, Document, model, Types} from 'mongoose';
import {IUser} from './User';

interface IComment extends Document {
    author: IUser['id'];
    content: string;
    replies: IComment[];
    createdAt: Date;
    _id: Types.ObjectId;
}

interface IPublication extends Document{
    author: IUser['id'];
    title: string;
    description: string;
    comments: IComment[];
}

const commentSchema = new Schema<IComment> ({
    author: {
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    replies: [ { type: Schema.Types.ObjectId, ref: 'Comment' } ],
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    _id: {
        type: Schema.Types.ObjectId,
        auto: true,
    }
});

const publicationSchema = new Schema<IPublication> ({
    author: {
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    comments: [commentSchema]
});

const Publication = model<IPublication>('Publication', publicationSchema);
const Comment = model<IComment>('Comment', commentSchema);

export {Publication, Comment};