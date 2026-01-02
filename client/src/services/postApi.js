import API from "./api";

// export const getPosts = () => API.get("/posts");
export const createPost = (data) => API.post("/posts", data);
// export const editPost = (id) => API.get(`/posts/edit/${id}`, id);
export const updatePost = (id, data) => API.put(`/posts/${id}`, data);
export const deletePost = (id) => API.delete(`/posts/${id}`);

export const getPosts = (page = 1) =>
  API.get(`/posts?page=${page}`);

export const likePost = (id) =>
  API.post(`/posts/${id}/like`);

export const commentPost = (id, text) =>
  API.post(`/posts/${id}/comment`, { text });

export const getBlogs = (page = 1) =>
  API.get(`/blogs?page=${page}`);
export const getBlogById = (id) => API.get(`/blogs/${id}`, id);