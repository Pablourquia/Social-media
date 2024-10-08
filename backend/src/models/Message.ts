import {Schema, Document, model} from 'mongoose';
import {IUser} from './User';

interface IMessage extends Document {
    sender: IUser['id'];
    content: string;
    addressee: IUser['id'];
    createdAt: Date;
}

const messageSchema = new Schema<IMessage> ({
    sender: {
        type: Schema.Types.ObjectId, 
        ref: 'User',                 
        required: true 
    },
    content: {
        type: String,
        required: true,
    },
    addressee: {
        type: Schema.Types.ObjectId, 
        ref: 'User',                 
        required: true 
    },
    createdAt: {
        type: Date,
        required: true
    }
});

export const Message = model<IMessage>('Message', messageSchema);