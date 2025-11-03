package com.example.review.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "COMMENT")
@Getter @Setter
public class Comment {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 어떤 리뷰에 달린 댓글인지
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    @JsonBackReference   // 순환참조 방지 (Review 쪽에 Managed)
    private Review review;

    private String userId;        // 댓글 작성자
    @Column(length = 1000)
    private String content;       // 댓글 내용
    private LocalDateTime createdAt = LocalDateTime.now();
}
