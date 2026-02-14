import { Response } from 'express';
import AdminReply from '../models/AdminReply';
import Post from '../models/Post';
import { AuthRequest } from '../middleware/auth';

export const createAdminReply = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const adminReply = new AdminReply({
      content,
      admin: req.user._id,
      post: postId,
      isOfficial: true,
    });

    await adminReply.save();
    await adminReply.populate('admin', 'username email avatar role');

    res.status(201).json({
      message: 'Admin reply created successfully',
      adminReply,
    });
  } catch (error: any) {
    console.error('Create admin reply error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAdminRepliesByPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;

    const adminReplies = await AdminReply.find({ post: postId })
      .populate('admin', 'username email avatar role')
      .sort({ createdAt: -1 });

    res.status(200).json({ adminReplies });
  } catch (error: any) {
    console.error('Get admin replies error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteAdminReply = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const adminReply = await AdminReply.findById(id);

    if (!adminReply) {
      res.status(404).json({ message: 'Admin reply not found' });
      return;
    }

    if (!req.user || (adminReply.admin.toString() !== req.user._id.toString() && req.user.role !== 'admin')) {
      res.status(403).json({ message: 'Not authorized to delete this admin reply' });
      return;
    }

    await AdminReply.findByIdAndDelete(id);

    res.status(200).json({ message: 'Admin reply deleted successfully' });
  } catch (error: any) {
    console.error('Delete admin reply error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
