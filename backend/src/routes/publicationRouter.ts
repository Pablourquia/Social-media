import { Publication } from '../models/Publication';
import { Comment } from '../models/Publication';
import { User } from '../models/User';
import express from 'express';
export const publicationRouter = express.Router();

// Create a new publication
publicationRouter.post('/publications/create', async (req, res) => {
    try {
        const { author, title, description, comments } = req.body;
        if (!author || !title || !description) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        const user = await User.findById(author);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const publication = new Publication({ author, title, description, comments });
        await publication.save();
        return res.status(201).json({
            message: 'Publication created',
            title: publication.title,
            description: publication.description,
            comments: publication.comments
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all publications
publicationRouter.get('/publications', async (req, res) => {
    try {
        const publications = await Publication.find();
        return res.status(200).json(publications);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get publication by id of a user
publicationRouter.get('/publications', async (req, res) => {
    try {
        const { id } = req.body;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const publications = await Publication.find({ author: id });
        return res.status(200).json(publications);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new comment
publicationRouter.post('/publications/:id/comments/create', async (req, res) => {
    try {
        const { author, content } = req.body;
        const { id } = req.params;

        if (!author || !content) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        const publication = await Publication.findById(id);
        if (!publication) {
            return res.status(404).json({ message: 'Publication not found' });
        }

        const comment = new Comment({ author, content, createdAt: new Date(), replies: [] });
        publication.comments.push(comment);

        await publication.save();
        return res.status(201).json({ message: 'Comment added', comment });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new reply (comment to a comment)
publicationRouter.post('/publications/:id/comments/:commentId/replies/create', async (req, res) => {
    try {
        const { author, content } = req.body;
        const { id, commentId } = req.params;

        if (!author || !content) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        const publication = await Publication.findById(id);
        if (!publication) {
            return res.status(404).json({ message: 'Publication not found' });
        }

        const comment = publication.comments.find(comment => comment._id.toString() === commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const newReply = new Comment({
            author,
            content,
            createdAt: new Date(),
            replies: []
        });

        comment.replies.push(newReply);
        await publication.save();
        return res.status(201).json({ message: 'Reply added', comment });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
});


