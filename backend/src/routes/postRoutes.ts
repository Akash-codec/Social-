import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
} from '../controllers/postController';
import { authenticate } from '../middleware/auth';
import { upload } from '../config/multer';

const router = express.Router();

router.post('/', authenticate, upload.single('image'), createPost);
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.put('/:id', authenticate, updatePost);
router.delete('/:id', authenticate, deletePost);
router.post('/:id/like', authenticate, likePost);

export default router;
