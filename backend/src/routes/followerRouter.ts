import { User } from '../models/User';
import { Follower } from '../models/Follower';
import express from 'express';
export const followerRouter = express.Router();

// Create a new follower
followerRouter.post('/follower/', async (req, res) => {
    try {
        const { follower, following } = req.body;

        if (!follower || !following) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        const user = await User.findById(follower);
        if (!user) {
            return res.status(404).json({ message: 'Follower user not found' });
        }

        let existFollower = await Follower.findOne({ follower: follower });

        if (existFollower) {
            if (existFollower.following.includes(following)) {
                return res.status(400).json({ message: 'Already following this user' });
            }
        
            existFollower.following.push(following);
            await existFollower.save();
            return res.status(200).json({ message: 'Following user added' });

        } else {
            const newFollower = new Follower({
                follower: follower,
                following: [following]
            });
            await newFollower.save();
            return res.status(201).json({ message: 'Follower created and following added' });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Get all following users of a user
followerRouter.get('/follower/:id', async (req, res) => {   
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        let followings = Follower.find({ follower: id });
        return res.status(200).json(followings);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Remove a follower
followerRouter.delete('/follower/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { following } = req.body;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        let existFollower = await Follower.findOne({ follower: id });
        if (!existFollower) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!existFollower.following.includes(following)) {
            return res.status(404).json({ message: 'Following user not found' });
        }
        existFollower.following = existFollower.following.filter(f => f !== following);
        await existFollower.save();
        return res.status(200).json({ message: 'Following user removed' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Get all followers from a user
followerRouter.get('/followers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        let followers = Follower.find({ following: id });
        return res.status(200).json(followers);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});
