import { Response } from 'express';
import Comment from '../models/Comment';
import Post from '../models/Post';
import { AuthRequest } from '../middleware/auth';

export const createComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { content, postId } = req.body;

    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    const comment = new Comment({
      content,
      author: req.user._id,
      post: postId,
    });

    await comment.save();
    await comment.populate('author', 'username email avatar role');

    res.status(201).json({
      message: 'Comment created successfully',
      comment,
    });
  } catch (error: any) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getCommentsByPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate('author', 'username email avatar role')
      .sort({ createdAt: -1 });

    res.status(200).json({ comments });
  } catch (error: any) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    if (!req.user || (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin')) {
      res.status(403).json({ message: 'Not authorized to delete this comment' });
      return;
    }

    await Comment.findByIdAndDelete(id);

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error: any) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
