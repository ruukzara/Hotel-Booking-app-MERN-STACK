import { Cms } from '../../controllers/index.js';
import express from 'express';

const router = express.Router();

router.get('/', Cms.Reviews.addReview);

router.delete('/:id', Cms.Reviews.destroy);

export default router;
