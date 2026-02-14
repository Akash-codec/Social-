import express from 'express';
import { createComment, getCommentsByPost, deleteComment } from '../controllers/commentController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticate, createComment);
router.get('/post/:postId', getCommentsByPost);
router.delete('/:id', authenticate, deleteComment);

export default router;
