import { findUserByUsername, findUserById, findAllUsers } from '../dao/user-dao.js';
import { generateToken } from '../config/passport-config.js';
import Game from 'Models/game.js';

const loginUser = async(req, res) => {
    const { username, password } = req.body;
    const user = await findUserByUsername(username);
    if (user && await user.validatePassword(password)) {
        const token = generateToken(user);
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

const logoutUser = (req, res) => {
    req.logout();
    res.status(200).json({ message: 'Logged out successfully' });
};

const getUserList = async(req, res) => {
    const users = await findAllUsers();
    res.json(users);
};

const getUserByUsername = async(req, res) => {
    const user = await findUserByUsername(req.params.username);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

const getUserProfile = async(req, res) => {
    res.json(req.user);
};

const getUserHistory = async(req, res) => {
    const games = await Game.findAll({ where: { userId: req.user.id } });
    res.json(games);
};

export { loginUser, logoutUser, getUserList, getUserByUsername, getUserProfile, getUserHistory };