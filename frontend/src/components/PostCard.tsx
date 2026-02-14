import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Heart, MessageCircle, Trash2, ShieldCheck, Send } from 'lucide-react';
import type { Post, Comment, AdminReply } from '../types';
import { useAuth } from '../context/AuthContext';
import { postsAPI, commentsAPI, adminRepliesAPI } from '../services/api';
import { formatDistanceToNow } from '../utils/dateUtils';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface PostCardProps {
  post: Post;
  onUpdate: () => void;
}

const PostCard = ({ post, onUpdate }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [adminReplies, setAdminReplies] = useState<AdminReply[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newAdminReply, setNewAdminReply] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAdmin } = useAuth();
  const [isLiked, setIsLiked] = useState(user ? post.likes.includes(user._id) : false);
  const [likeCount, setLikeCount] = useState(post.likes.length);

  const handleLike = async () => {
    if (!user) return;
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    try {
      await postsAPI.likePost(post._id);
      onUpdate();
    } catch (err) {
      // Revert on error
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev + 1 : prev - 1);
    }
  };

  const loadComments = async () => {
    if (showComments) {
      setShowComments(false);
      return;
    }
    try {
      const [commentsRes, adminRepliesRes] = await Promise.all([
        commentsAPI.getCommentsByPost(post._id),
        adminRepliesAPI.getAdminRepliesByPost(post._id),
      ]);
      setComments(commentsRes.data.comments);
      setAdminReplies(adminRepliesRes.data.adminReplies);
      setShowComments(true);
    } catch (err) {
      console.error(err);
    } finally {
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    try {
      await commentsAPI.createComment({ content: newComment, postId: post._id });
      setNewComment('');
      loadComments();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminReply.trim()) return;
    setIsSubmitting(true);
    try {
      await adminRepliesAPI.createAdminReply({ content: newAdminReply, postId: post._id });
      setNewAdminReply('');
      loadComments();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Delete this post?')) {
      await postsAPI.deletePost(post._id);
      onUpdate();
    }
  };

  return (
    <Card className="mb-6 overflow-hidden border-slate-100 bg-white shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-lg hover:ring-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-0">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-white shadow-sm bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
            {post.author.avatar ? (
              <img src={post.author.avatar} alt={post.author.username} className="h-full w-full object-cover" />
            ) : (
              post.author.username.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">{post.author.username}</span>
              {post.author.role === 'admin' && (
                <span className="flex items-center gap-0.5 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600 ring-1 ring-inset ring-blue-500/10">
                  <ShieldCheck className="h-3 w-3" /> ADMIN
                </span>
              )}
            </div>
            <span className="text-xs text-slate-500">{formatDistanceToNow(post.createdAt)}</span>
          </div>
        </div>
        
        {(user?._id === post.author._id || isAdmin) && (
          <Button variant="ghost" size="sm" onClick={handleDelete} className="text-slate-400 hover:text-red-500">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h2 className="mb-2 text-xl font-bold text-slate-900">{post.title}</h2>
        <p className="mb-4 text-slate-600 leading-relaxed whitespace-pre-wrap">{post.content}</p>
        
        {post.image && (
          <motion.div 
            layoutId={`image-${post._id}`}
            className="relative mb-4 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-900/5 aspect-video"
          >
            <img src={post.image} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
          </motion.div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-3">
        <div className="flex gap-4">
          <motion.button 
            type="button"
            whileTap={{ scale: 0.8 }}
            onClick={handleLike}
            disabled={!user}
            className={`group flex items-center gap-1.5 text-sm font-medium transition-colors ${
              isLiked ? 'text-pink-500' : 'text-slate-500 hover:text-pink-500'
            }`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likeCount}</span>
          </motion.button>

          <button 
            type="button"
            onClick={loadComments}
            className="group flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-500 transition-colors"
          >
            <MessageCircle className="h-5 w-5 group-hover:fill-blue-500/10" />
            <span>{showComments ? 'Hide' : 'Show'} Comments</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-100 bg-slate-50 p-4 overflow-hidden"
          >
            <div className="space-y-4">
              {adminReplies.map((reply) => (
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  key={reply._id}
                  className="ml-4 rounded-xl border-l-4 border-l-purple-500 bg-white p-4 shadow-sm ring-1 ring-purple-100"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="h-4 w-4 text-purple-600" />
                    <span className="text-xs font-bold text-purple-700 uppercase tracking-wide">Official Response from {reply.admin.username}</span>
                  </div>
                  <p className="text-slate-700 text-sm">{reply.content}</p>
                </motion.div>
              ))}

              {comments.map((comment) => (
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  key={comment._id} 
                  className="flex gap-3"
                >
                  <div className="h-8 w-8 flex-shrink-0 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                    {comment.author.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 rounded-2xl rounded-tl-none bg-white p-3 shadow-sm ring-1 ring-slate-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-slate-900">{comment.author.username}</span>
                      <span className="text-[10px] text-slate-400">{formatDistanceToNow(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm text-slate-600">{comment.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {user && (
              <div className="mt-6 flex flex-col gap-3">
                <form onSubmit={handleCommentSubmit} className="relative">
                  <input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full rounded-xl border border-slate-200 bg-white pr-12 pl-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 shadow-sm transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={isSubmitting || !newComment.trim()}
                    className="absolute right-2 top-2 rounded-lg p-1.5 text-blue-600 hover:bg-blue-50 disabled:opacity-50 transition-colors"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>

                {isAdmin && (
                  <form onSubmit={handleAdminReplySubmit} className="relative mt-2">
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <ShieldCheck className="h-4 w-4 text-purple-500" />
                      </div>
                      <input 
                        value={newAdminReply}
                        onChange={(e) => setNewAdminReply(e.target.value)}
                        placeholder="Post an official admin response..."
                        className="w-full rounded-xl border-purple-200 bg-purple-50/50 pl-10 pr-12 py-3 text-sm text-purple-900 placeholder:text-purple-400 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 shadow-sm transition-all"
                      />
                      <button 
                        type="submit"
                        disabled={isSubmitting || !newAdminReply.trim()}
                        className="absolute right-2 top-2 rounded-lg p-1.5 text-purple-600 hover:bg-purple-100 disabled:opacity-50 transition-colors"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default PostCard;
