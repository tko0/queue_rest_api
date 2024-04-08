import express from 'express';
import QueueRouter from './queueRouter';

const router = express.Router();

router.use('/queue', QueueRouter);

export default router;