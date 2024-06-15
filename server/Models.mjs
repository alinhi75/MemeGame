// import { Sequelize, DataTypes } from 'sequelize';

// // Database setup
// const sequelize = new Sequelize({
//     dialect: 'sqlite',
//     storage: 'database.sqlite',
// });

// const User = sequelize.define('User', {
//     username: { type: DataTypes.STRING, unique: true, allowNull: false },
//     password: { type: DataTypes.STRING, allowNull: false },
//     token: { type: DataTypes.STRING, allowNull: true },
//     // isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
// }, { timestamps: false });

// const Meme = sequelize.define('Meme', {
//     imageUrl: { type: DataTypes.STRING, allowNull: false },
//     caption: { type: DataTypes.STRING, allowNull: false },
// }, { timestamps: false });

// const Game = sequelize.define('Game', {
//     userId: { type: DataTypes.INTEGER, allowNull: true },
//     totalScore: { type: DataTypes.INTEGER, defaultValue: 0 },
//     isCompleted: { type: DataTypes.BOOLEAN, defaultValue: false },
// }, { timestamps: true });

// const Round = sequelize.define('Round', {
//     gameId: { type: DataTypes.INTEGER, allowNull: false },
//     memeId: { type: DataTypes.INTEGER, allowNull: false },
//     selectedCaption: { type: DataTypes.STRING, allowNull: true },
//     score: { type: DataTypes.INTEGER, defaultValue: 0 },
// }, { timestamps: true });

// Meme.hasMany(Round, { foreignKey: 'memeId' });
// Game.hasMany(Round, { foreignKey: 'gameId' });

// sequelize.sync();

// export { User, Meme, Game, Round, sequelize };