CREATE TABLE IF NOT EXISTS review (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    movie_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    rating INT NOT NULL,
    comment VARCHAR(1000)
    );

CREATE TABLE IF NOT EXISTS comment (
                                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                       review_id BIGINT NOT NULL,
                                       user_id VARCHAR(255) NOT NULL,
    content VARCHAR(1000),
    created_at TIMESTAMP,
    CONSTRAINT fk_comment_review
    FOREIGN KEY (review_id) REFERENCES review(id)
    );
