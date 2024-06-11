import express from 'express';
import passport from 'passport';
import { loginUser, logoutUser, getUserList, getUserByUsername, getUserProfile, getUserHistory } from '../controllers/user-controller.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/logout', passport.authenticate('jwt', { session: false }), logoutUser);
router.get('/', getUserList);
router.get('/:username', getUserByUsername);
router.get('/profile', passport.authenticate('jwt', { session: false }), getUserProfile);
router.get('/history', passport.authenticate('jwt', { session: false }), getUserHistory);

export default router;