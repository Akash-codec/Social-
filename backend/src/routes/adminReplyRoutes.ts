import express from 'express';
import {
  createAdminReply,
  getAdminRepliesByPost,
  deleteAdminReply,
} from '../controllers/adminReplyController';
import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticate, authorizeAdmin, createAdminReply);
router.get('/post/:postId', getAdminRepliesByPost);
router.delete('/:id', authenticate, authorizeAdmin, deleteAdminReply);

export default router;
