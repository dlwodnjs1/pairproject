package com.example.review.controller;

import com.example.review.model.Review;
import com.example.review.repository.ReviewRepository;
import com.example.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public Review addReview(@RequestBody Review review) {
        return reviewService.saveReview(review);
    }

    @GetMapping
    public List<Review> getReviews() {
        return reviewService.getAllReviews();
    }

    @GetMapping("/movie/{movieId}")
    public List<Review> getReviewsByMovie(@PathVariable String movieId) {
        return reviewService.getReviewsByMovie(movieId);
    }

    @GetMapping("/user/{userId}")
    public List<Review> getReviewsByUser(@PathVariable String userId) {
        return reviewService.getReviewsByUser(userId);
    }

    @DeleteMapping("/{id}")
    public String deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return "Review deleted";
    }

    // 특정 리뷰 조회 (ID로 조회)
    @GetMapping("/{id}")
    public ResponseEntity<Review> getReviewById(@PathVariable Long id) {
        Review review = reviewService.getReviewById(id); // 서비스에서 리뷰를 ID로 가져오는 메소드 호출
        if (review != null) {
            return ResponseEntity.ok(review);  // 리뷰가 있으면 OK 상태와 함께 반환
        } else {
            return ResponseEntity.notFound().build();  // 리뷰가 없으면 404 Not Found 상태 반환
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Review> updateReview(
            @PathVariable Long id,
            @RequestBody Review reviewDetails) { // ✅ 반드시 @RequestBody 사용
        return ResponseEntity.ok(reviewService.updateReview(id, reviewDetails));
    }

}
