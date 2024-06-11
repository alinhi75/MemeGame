import Meme from '../models/meme.js';
import Caption from '../models/caption.js';

// Get all memes
const getAllMemes = async() => {
    try {
        const memes = await Meme.findAll();
        return memes;
    } catch (error) {
        console.error('Error getting all memes:', error);
        throw error;
    }
};

// Get a meme by ID
const getMemeById = async(id) => {
    try {
        const meme = await Meme.findByPk(id);
        return meme;
    } catch (error) {
        console.error('Error getting meme by ID:', error);
        throw error;
    }
};

// Create a new meme
const createMeme = async(imageUrl, captions) => {
    try {
        const meme = await Meme.create({ imageUrl });

        // Create associated captions
        if (captions && captions.length) {
            const captionPromises = captions.map(text => Caption.create({ text, memeId: meme.id }));
            await Promise.all(captionPromises);
        }

        return meme;
    } catch (error) {
        console.error('Error creating meme:', error);
        throw error;
    }
};

// Update a meme
const updateMeme = async(id, imageUrl, captions) => {
    try {
        const meme = await Meme.findByPk(id);

        if (!meme) {
            throw new Error('Meme not found');
        }

        meme.imageUrl = imageUrl || meme.imageUrl;
        await meme.save();

        // Update associated captions if provided
        if (captions && captions.length) {
            await Caption.destroy({ where: { memeId: meme.id } });
            const captionPromises = captions.map(text => Caption.create({ text, memeId: meme.id }));
            await Promise.all(captionPromises);
        }

        return meme;
    } catch (error) {
        console.error('Error updating meme:', error);
        throw error;
    }
};

// Delete a meme
const deleteMeme = async(id) => {
    try {
        const meme = await Meme.findByPk(id);
        if (!meme) {
            throw new Error('Meme not found');
        }

        await meme.destroy();
        return meme;
    } catch (error) {
        console.error('Error deleting meme:', error);
        throw error;
    }
};

export { getAllMemes, getMemeById, createMeme, updateMeme, deleteMeme };