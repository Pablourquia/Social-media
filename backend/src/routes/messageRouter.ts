import { Message } from '../models/Message';
import { User } from '../models/User';
import express from 'express';
export const messageRouter = express.Router();

messageRouter.post('/messages/create', async (req, res) => {
    try {
        const { sender, content, addressee } = req.body;
        if (!sender || !content || !addressee) {
            return res.status(400).json({message: 'Please fill all fields'});
        }
        const senderExists = await User.findById(sender);
        const addresseeExists = await User.findById(addressee);
        if (!senderExists || !addresseeExists) {
            return res.status(400).json({message: 'User not found'});
        }
        const message = new Message({sender, content, addressee, createdAt: new Date()});
        await message.save();
        return res.status(201).json({message: 'Message created', content: message.content});
    }
    catch (error) {
        res.status(500).json({message: 'Server error'});
    }
})

messageRouter.get('/messages/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const my_messages = await Message.find({sender: id});
        const messages_for_me = await Message.find({addressee: id});
        return res.status(200).json({my_messages, messages_for_me});
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
})