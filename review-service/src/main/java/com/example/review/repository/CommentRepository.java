package com.example.review.repository;

import com.example.review.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByReview_IdOrderByIdAsc(Long reviewId);
}
