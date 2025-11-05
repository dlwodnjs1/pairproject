package com.example.review.service;

import com.example.review.config.RabbitConfig; // ✅ 추가
import com.example.review.model.Review;
import com.example.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final RabbitTemplate rabbitTemplate;

    // ✅ 리뷰 저장 + 메시지 발행
    public Review saveReview(Review review) {
        Review saved = reviewRepository.save(review); // DB에 저장

        // ✅ 저장 직후 메시지 큐로 이벤트 발행
        rabbitTemplate.convertAndSend(RabbitConfig.QUEUE_NAME, saved.getId());
        System.out.println("📨 RabbitMQ 메시지 발행 완료 → 큐: " + RabbitConfig.QUEUE_NAME + ", 리뷰 ID: " + saved.getId());

        return saved;
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    // 특정 리뷰 조회 (ID로 조회)
    public Review getReviewById(Long id) {
        Optional<Review> review = reviewRepository.findById(id);
        return review.orElse(null);
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
