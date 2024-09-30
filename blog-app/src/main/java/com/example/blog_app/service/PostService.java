package com.example.blog_app.service;

import com.example.blog_app.model.Post;
import com.example.blog_app.repository.PostRepository;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {
    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    public Optional<Post> getPostById(Long id) {
        return postRepository.findById(id);
    }

    public Post updatePost(Long id, String title, String author, String content) throws IOException {
        Optional<Post> optionalPost = postRepository.findById(id);
        if (optionalPost.isPresent()) {
            Post post = optionalPost.get();
            if (title != null) post.setTitle(title);
            if (author != null) post.setAuthor(author);
            if (content != null) post.setContent(content);
            // Do not modify the image field
            return postRepository.save(post);
        } else {
            throw new EntityNotFoundException("Post not found with id: " + id);
        }
    }


    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }
}
