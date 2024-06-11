import express from 'express';
import passport from 'passport';
import { startGame, startAnonymousGame, submitRound, endGame } from '../controllers/game-controller.js';

const router = express.Router();

router.get('/start', passport.authenticate('jwt', { session: false }), startGame);
router.get('/anonymous', startAnonymousGame);
router.post('/round', passport.authenticate('jwt', { session: false }), submitRound);
router.post('/end', passport.authenticate('jwt', { session: false }), endGame);

export default router;