package com.example.review.service;

import com.example.review.model.Review;
import com.example.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public Review saveReview(Review review) {
        return reviewRepository.save(review);
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    // 특정 리뷰 조회 (ID로 조회)
    public Review getReviewById(Long id) {
        Optional<Review> review = reviewRepository.findById(id);
        return review.orElse(null); // 리뷰가 없으면 null 반환
    }

    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }

    public List<Review> getReviewsByMovie(String movieId) {
        return reviewRepository.findByMovieId(movieId);
    }

    public List<Review> getReviewsByUser(String userId) {
        return reviewRepository.findByUserId(userId);
    }



    public Review updateReview(Long id, Review reviewDetails) {
        System.out.println("[updateReview] 요청 id = " + id);
        System.out.println("[updateReview] 요청 movieId = " + reviewDetails.getMovieId());

        Optional<Review> existingReview = reviewRepository.findById(id);

        if (!existingReview.isPresent()) {
            System.out.println("[updateReview] ⚠ 리뷰 없음 (id=" + id + ")");
            return null;
        }

        Review review = existingReview.get();
        System.out.println("[updateReview] 기존 movieId = " + review.getMovieId());

        if (reviewDetails.getMovieId() != null) {
            review.setMovieId(reviewDetails.getMovieId());
            System.out.println("[updateReview] ✅ movieId 변경됨 → " + review.getMovieId());
        }

        if (reviewDetails.getUserId() != null) review.setUserId(reviewDetails.getUserId());
        if (reviewDetails.getRating() != null) review.setRating(reviewDetails.getRating());
        if (reviewDetails.getComment() != null) review.setComment(reviewDetails.getComment());

        Review saved = reviewRepository.save(review);
        System.out.println("[updateReview] 저장 완료 movieId = " + saved.getMovieId());

        return saved;
    }

}


