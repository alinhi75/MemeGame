import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.js';
import Meme from './meme.js';
import Caption from './caption.js';

// Define the Game model
const Game = sequelize.define('Game', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    score: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps
    tableName: 'games', // Explicitly sets the table name
});

// Define the GameRound model
const GameRound = sequelize.define('GameRound', {
    gameId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Game,
            key: 'id',
        },
    },
    memeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Meme,
            key: 'id',
        },
    },
    selectedCaptionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Caption,
            key: 'id',
        },
    },
    isCorrect: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps
    tableName: 'game_rounds', // Explicitly sets the table name
});

// Define associations
Game.hasMany(GameRound, { onDelete: 'CASCADE' });
GameRound.belongsTo(Game);
User.hasMany(Game);
Game.belongsTo(User);
Meme.hasMany(GameRound);
GameRound.belongsTo(Meme);
Caption.hasMany(GameRound);
GameRound.belongsTo(Caption);

export { Game, GameRound };