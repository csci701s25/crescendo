import { Router } from 'express';
import actionsRouter from './actions';
import countsRouter from './counts';

const router = Router();

router.use('/actions', actionsRouter);
router.use('/counts', countsRouter);

export default router;
