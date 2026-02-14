import { Response } from 'express';
import Post from '../models/Post';
import Comment from '../models/Comment';
import AdminReply from '../models/AdminReply';
import { AuthRequest } from '../middleware/auth';

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, content } = req.body;

    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    // Handle image - either uploaded file or URL from body
    let imageUrl = req.body.image || '';
    
    if (req.file) {
      // If a file was uploaded, create the URL for it
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      imageUrl = `${baseUrl}/uploads/posts/${req.file.filename}`;
    }

    const post = new Post({
      title,
      content,
      image: imageUrl,
      author: req.user._id,
    });

    await post.save();
    await post.populate('author', 'username email avatar role');

    res.status(201).json({
      message: 'Post created successfully',
      post,
    });
  } catch (error: any) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const posts = await Post.find()
      .populate('author', 'username email avatar role')
      .sort({ createdAt: -1 });

    res.status(200).json({ posts });
  } catch (error: any) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getPostById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id).populate('author', 'username email avatar role');

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    // Get comments
    const comments = await Comment.find({ post: id })
      .populate('author', 'username email avatar role')
      .sort({ createdAt: -1 });

    // Get admin replies
    const adminReplies = await AdminReply.find({ post: id })
      .populate('admin', 'username email avatar role')
      .sort({ createdAt: -1 });

    res.status(200).json({ post, comments, adminReplies });
  } catch (error: any) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updatePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content, image } = req.body;

    const post = await Post.findById(id);

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    if (!req.user || post.author.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'Not authorized to update this post' });
      return;
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.image = image !== undefined ? image : post.image;

    await post.save();
    await post.populate('author', 'username email avatar role');

    res.status(200).json({
      message: 'Post updated successfully',
      post,
    });
  } catch (error: any) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    if (!req.user || (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin')) {
      res.status(403).json({ message: 'Not authorized to delete this post' });
      return;
    }

    // Delete associated comments and admin replies
    await Comment.deleteMany({ post: id });
    await AdminReply.deleteMany({ post: id });
    await Post.findByIdAndDelete(id);

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error: any) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const likePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const post = await Post.findById(id);

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    const likeIndex = post.likes.indexOf(req.user._id);

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(req.user._id);
    }

    await post.save();
    await post.populate('author', 'username email avatar role');

    res.status(200).json({
      message: likeIndex > -1 ? 'Post unliked' : 'Post liked',
      post,
    });
  } catch (error: any) {
    console.error('Like post error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
