import {Schema, Document, model, Types} from 'mongoose';
import {IUser} from './User';

interface IFollower extends Document {
    follower: IUser['id'];
    following: IUser['id'][];
}

const followerSchema = new Schema<IFollower> ({
    follower: {
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
    },
    following: [{
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
    }]
});

export const Follower = model<IFollower>('Follower', followerSchema);