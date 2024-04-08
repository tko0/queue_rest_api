import { Router } from 'express';
import { addSongsToQueue, removeSongsFromQueue, getQueueController } from '../controllers/queueController';

const QueueRouter: Router = Router();

QueueRouter.post('/add', addSongsToQueue);
QueueRouter.delete('/remove', removeSongsFromQueue);
QueueRouter.get('/get', getQueueController)

export default QueueRouter;
