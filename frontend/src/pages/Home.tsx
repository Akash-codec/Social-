import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import type { Post } from '../types';
import { postsAPI } from '../services/api';
import CreatePostForm from '../components/CreatePostForm';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';
import { StaggerContainer, StaggerItem, PageTransition } from '../components/ui/Animations';
import { Loader2, Plus, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getAllPosts();
      setPosts(response.data.posts);
    } catch (err: any) {
      setError('Failed to load community feed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <PageTransition className="min-h-screen bg-slate-50/50 pb-20">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-8 sm:py-12">
          
          <div className="text-center mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4"
            >
              Community Feed
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg leading-8 text-slate-600 max-w-md mx-auto"
            >
              Share your thoughts, connect with others, and explore new ideas in a vibrant community space.
            </motion.p>
          </div>

          <div className="space-y-8">
            {user ? (
              <CreatePostForm onPostCreated={fetchPosts} />
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-center text-white shadow-xl mb-12"
              >
                <Sparkles className="mx-auto h-12 w-12 text-white/80 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Join the Conversation</h2>
                <p className="text-indigo-100 mb-6 max-w-md mx-auto">
                  Sign in to create posts, share your ideas, and interact with the community.
                </p>
                <div className="flex justify-center gap-4">
                  <Link to="/login">
                    <Button variant="secondary" className="bg-white text-indigo-600 hover:bg-white/90 border-none shadow-lg">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-indigo-700 text-white hover:bg-indigo-800 border border-indigo-400/30 shadow-lg">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
              </div>
            ) : error ? (
              <div className="rounded-xl bg-red-50 p-4 text-center text-red-600 border border-red-100">
                {error}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No posts yet</h3>
                <p className="text-slate-500 max-w-xs mx-auto">
                  Be the first to break the silence! Create a post to get started.
                </p>
              </div>
            ) : (
              <StaggerContainer>
                <AnimatePresence mode="popLayout">
                  {posts.map((post) => (
                    <StaggerItem key={post._id}>
                      <PostCard post={post} onUpdate={fetchPosts} />
                    </StaggerItem>
                  ))}
                </AnimatePresence>
              </StaggerContainer>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Home;
