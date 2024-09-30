import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';

const Post = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:8080/posts");
  
        if (!res.ok) {
          toast.error("Failed to fetch posts");
          return;
        }
  
        const text = await res.text();
        if (!text) {
          toast.error("No posts found");
          return;
        }
  
        const data = JSON.parse(text);
        setPosts(data);
      } catch (error) {
        toast.error("An error occurred while fetching posts");
        console.error("Fetch error: ", error);
      }
    };
    
    fetchPosts();
  }, []);
  

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  const truncateContent = (content, maxLength) => {
    const sanitizedContent = stripHtml(content);
    if (sanitizedContent.length <= maxLength) {
      return sanitizedContent;
    }
    return sanitizedContent.slice(0, maxLength) + '...';
  };

  return (
    <>
      {posts.map((post, index) => (
        <div className="grid grid-cols-1 mb-16 gap-3 justify-between items-center max-w-[900px] border-black border-[1px] bg-[#f5f5f4] text-black" key={index}>
          <Link to={`/posts/${post.id}`}>
            <div>
              {post.image && (
                <img src={`data:image/jpeg;base64,${post.image}`} alt="" className='h-52 w-screen' />
              )}
            </div>
            <div className='flex flex-col justify-center gap-3 p-3 text-black'>
              <h2 className="font-bold m-0 sm:text-4xl text-3xl">{post.title}</h2>
              <div className="flex items-center gap-3 m-0 sm:text-[16px] text-[10px] font-bold">
                <p className="text-lg text-[#fb923c]">{post.author}</p>
                <time dateTime="" className='text-[#fb923c]'>{new Date(post.createdAt).toLocaleString()}</time>
              </div>
              <p>
                {truncateContent(post.content, 340)} <span className='text-blue-700 w-fit px-2 py-1 rounded-sm'>Read more</span>
              </p>
            </div>
          </Link>
        </div>
      ))}
    </>
  );
};

export default Post;
