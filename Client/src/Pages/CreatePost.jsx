import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FadeLoader } from "react-spinners";

const CreatePost = () => {
  const [post, setPost] = useState({ title: '', content: '', author: '', image: null });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPost((prevPost) => ({
        ...prevPost,
        image: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('title', post.title);
    formData.append('author', post.author);
    formData.append('content', post.content);
    formData.append('image', post.image);

    console.log('Submitting Form Data:', {
      title: post.title,
      author: post.author,
      content: post.content,
      image: post.image,
    });

    try {
        setLoading(true);
        const response = await fetch("http://localhost:8080/posts", {
            method: 'POST',
            body: formData,
        });
        setLoading(false);

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);

        toast.success('Post created successfully!');
        navigate('/');
    } catch (error) {
        setLoading(false);
        console.error('Error creating post:', error);
        toast.error('Error creating post: ' + error.message);
    }
};

if (loading) {
    return <div><FadeLoader /></div>;
}

return (
    <div className="max-w-[900px] mx-auto p-5">
      <h1 className="text-4xl font-bold mb-4">Create Post</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={post.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Content</label>
          <textarea
            name="content"
            value={post.content}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            rows="10"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Author</label>
          <input
            type="text"
            name="author"
            value={post.author}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
          {imagePreview && (
            <img src={imagePreview} alt="Post Preview" className="mt-4 max-w-full h-auto" />
          )}
        </div>
        <button
          type="submit"
          className="bg-[#7c3aed] px-4 py-2 text-white rounded-sm hover:bg-purple-400"
          disabled={loading}
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
