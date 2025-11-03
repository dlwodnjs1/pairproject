package com.example.review.service;

import com.example.review.model.Comment;
import com.example.review.model.Review;
import com.example.review.repository.CommentRepository;
import com.example.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final ReviewRepository reviewRepository;

    public List<Comment> listByReview(Long reviewId) {
        return commentRepository.findByReview_IdOrderByIdAsc(reviewId);
    }

    public Comment add(Long reviewId, String userId, String content) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("리뷰가 없습니다. id=" + reviewId));

        Comment c = new Comment();
        c.setReview(review);
        c.setUserId(userId);
        c.setContent(content);
        c.setCreatedAt(LocalDateTime.now());
        return commentRepository.save(c);
    }

    public void delete(Long commentId) {
        commentRepository.deleteById(commentId);
    }
}
