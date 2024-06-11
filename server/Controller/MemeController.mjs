import Meme from '../models/meme.js';
import Caption from '../models/caption.js';

// Get all memes
const getAllMemes = async(req, res) => {
    try {
        const memes = await Meme.findAll();
        res.json(memes);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a meme by ID
const getMemeById = async(req, res) => {
    try {
        const meme = await Meme.findByPk(req.params.id);
        if (!meme) {
            return res.status(404).json({ message: 'Meme not found' });
        }
        res.json(meme);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Create a new meme
const createMeme = async(req, res) => {
    try {
        const { imageUrl, captions } = req.body;
        const meme = await Meme.create({ imageUrl });

        // Create associated captions
        if (captions && captions.length) {
            const captionPromises = captions.map(text => Caption.create({ text, memeId: meme.id }));
            await Promise.all(captionPromises);
        }

        res.status(201).json(meme);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a meme
const updateMeme = async(req, res) => {
    try {
        const { imageUrl, captions } = req.body;
        const meme = await Meme.findByPk(req.params.id);

        if (!meme) {
            return res.status(404).json({ message: 'Meme not found' });
        }

        meme.imageUrl = imageUrl || meme.imageUrl;
        await meme.save();

        // Update associated captions if provided
        if (captions && captions.length) {
            await Caption.destroy({ where: { memeId: meme.id } });
            const captionPromises = captions.map(text => Caption.create({ text, memeId: meme.id }));
            await Promise.all(captionPromises);
        }

        res.json(meme);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a meme
const deleteMeme = async(req, res) => {
    try {
        const meme = await Meme.findByPk(req.params.id);
        if (!meme) {
            return res.status(404).json({ message: 'Meme not found' });
        }

        await meme.destroy();
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export { getAllMemes, getMemeById, createMeme, updateMeme, deleteMeme };