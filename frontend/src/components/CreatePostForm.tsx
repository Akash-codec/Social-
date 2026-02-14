import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Send, PenLine, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../services/api';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Toast } from './ui/Toast';

const CreatePostForm = ({ onPostCreated }: { onPostCreated: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const { user } = useAuth();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setToast({ msg: 'Please select a valid image file', type: 'error' });
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setToast({ msg: 'Image size must be less than 5MB', type: 'error' });
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      console.log('Submitting post with data:', { title, content, hasImage: !!imageFile });
      await postsAPI.createPost(formData);
      setToast({ msg: 'Post published successfully!', type: 'success' });
      setTitle('');
      setContent('');
      removeImage();
      setIsOpen(false);
      onPostCreated();
    } catch (err: any) {
      console.error('Failed to create post:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to publish post.';
      setToast({ msg: errorMsg, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <Card className="mb-8 overflow-hidden border-none bg-gradient-to-br from-blue-500 to-indigo-600 p-1">
        <div className="bg-white rounded-xl p-4">
          {!isOpen ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setIsOpen(true)}
              className="flex cursor-pointer items-center gap-4 rounded-xl bg-slate-50 p-3 hover:bg-slate-100 transition-colors"
            >
              <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <PenLine className="h-5 w-5" />
              </div>
              <span className="text-slate-500 font-medium select-none">Share something with the community...</span>
            </motion.div>
          ) : (
            <motion.form 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h3 className="font-semibold text-slate-900">Create New Post</h3>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} type="button">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <Input 
                placeholder="Post Title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="font-bold text-lg border-none px-0 shadow-none focus:ring-0 placeholder:text-slate-300" 
              />
              
              <textarea
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                maxLength={5000}
                rows={4}
                className="w-full resize-none border-none bg-transparent p-0 text-slate-600 placeholder:text-slate-400 focus:ring-0 focus:outline-none text-base leading-relaxed"
              />

              {/* Image Upload */}
              <div className="space-y-3">
                <label className="flex items-center justify-center w-full h-32 px-4 transition bg-slate-50 border-2 border-slate-200 border-dashed rounded-xl appearance-none cursor-pointer hover:border-blue-400 focus:outline-none">
                  <span className="flex items-center space-x-2">
                    <Upload className="w-6 h-6 text-slate-400" />
                    <span className="font-medium text-slate-500">
                      {imageFile ? imageFile.name : 'Click to upload an image'}
                    </span>
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>

                {/* Image Preview */}
                {imagePreview && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative rounded-xl overflow-hidden bg-slate-100"
                  >
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-80 object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </motion.div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" isLoading={isSubmitting} disabled={!title.trim() || !content.trim()}>
                  Publish Post <Send className="ml-2 h-4 w-4 cursor-pointer" />
                </Button>
              </div>
            </motion.form>
          )}
        </div>
      </Card>
      
      <Toast 
        isVisible={!!toast} 
        message={toast?.msg || ''}  
        type={toast?.type} 
        onClose={() => setToast(null)} 
      />
    </>
  );
};

export default CreatePostForm;
