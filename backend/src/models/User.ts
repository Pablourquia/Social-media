import {Schema, Document, model} from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    photo?: string;
}

const userSchema = new Schema<IUser> ({
    name:  {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: false
    }
})

export const User = model<IUser>('User', userSchema);