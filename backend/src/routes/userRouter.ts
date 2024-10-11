import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import express from 'express';
export const usersRouter = express.Router();

usersRouter.post('/users/create', async (req, res) => {
    try{
        const { name, email, password, photo } = req.body;
        if (!name || !email || !password) {
            return res.status(401).json({message: 'Please fill all fields'});
        } else {
            if (await User.findOne({email})) {
                return res.status(402).json({message: 'User already exists'});
            }
        }
        const user = new User({name, email, password, photo});
        await user.save();
        const token = jwt.sign({id: user._id}, 'secreto');
        return res.status(201).json({message : 'User created', token: token, name: user.name, email: user.email, photo: user.photo});
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
})

usersRouter.post('/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({message: 'Please fill all fields'});
        }
        const user = await User.findOne({email});
        if (!user) {
            return res.status(402).json({message: 'User not found'});
        }
        if (password !== user.password) {
            return res.status(403).json({message: 'Invalid password'});
        }
        const token = jwt.sign({id: user._id}, 'secreto');
        return res.status(200).json({message: 'User logged in', token: token, name: user.name, email: user.email, photo: user.photo});
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
})