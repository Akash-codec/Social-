import axios from 'axios';

const API_URL = 'https://social-q59g.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  register: (data: { username: string; email: string; password: string; role?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// Posts API
export const postsAPI = {
  getAllPosts: () => api.get('/posts'),
  getPostById: (id: string) => api.get(`/posts/${id}`),
  createPost: (data: FormData | { title: string; content: string; image?: string }) => {
    // If data is FormData, send with multipart/form-data
    if (data instanceof FormData) {
      return api.post('/posts', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    // Otherwise send as JSON
    return api.post('/posts', data);
  },
  updatePost: (id: string, data: { title?: string; content?: string; image?: string }) =>
    api.put(`/posts/${id}`, data),
  deletePost: (id: string) => api.delete(`/posts/${id}`),
  likePost: (id: string) => api.post(`/posts/${id}/like`),
};

// Comments API
export const commentsAPI = {
  createComment: (data: { content: string; postId: string }) => api.post('/comments', data),
  getCommentsByPost: (postId: string) => api.get(`/comments/post/${postId}`),
  deleteComment: (id: string) => api.delete(`/comments/${id}`),
};

// Admin Replies API
export const adminRepliesAPI = {
  createAdminReply: (data: { content: string; postId: string }) =>
    api.post('/admin-replies', data),
  getAdminRepliesByPost: (postId: string) => api.get(`/admin-replies/post/${postId}`),
  deleteAdminReply: (id: string) => api.delete(`/admin-replies/${id}`),
};

export default api;
