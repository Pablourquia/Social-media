import { User } from '../models/User';
import { Follower } from '../models/Follower';
import express from 'express';
export const followerRouter = express.Router();

followerRouter.post('/followers/', async (req, res) => {
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
