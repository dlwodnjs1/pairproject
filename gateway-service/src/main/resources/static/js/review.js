let reviewModal;

document.addEventListener('DOMContentLoaded', function() {
    reviewModal = new bootstrap.Modal(document.getElementById('reviewModal'));
    loadReviews();
});

// 리뷰 목록 불러오기
async function loadReviews() {
    try {
        const response = await fetch('/api/reviews');
        const reviews = await response.json();

        const tbody = document.getElementById('reviewTableBody');
        tbody.innerHTML = '';

        reviews.forEach(review => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${review.id}</td>
                <td>${review.movieId}</td>
                <td>${review.userId}</td>
                <td>${'⭐'.repeat(review.rating)}</td>
                <td>${review.comment}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editReview(${review.id})">수정</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteReview(${review.id})">삭제</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('리뷰 목록을 불러오는데 실패했습니다:', error);
        alert('리뷰 목록을 불러오는데 실패했습니다.');
    }
}

// 리뷰 추가 모달 표시
function showAddReviewModal() {
    document.getElementById('modalTitle').textContent = '리뷰 추가';
    document.getElementById('reviewForm').reset();
    document.getElementById('reviewId').value = '';
    reviewModal.show();
}

// 리뷰 수정 모달 표시
async function editReview(id) {
    try {
        const response = await fetch(`/api/reviews/${id}`);
        const review = await response.json();

        document.getElementById('modalTitle').textContent = '리뷰 수정';
        document.getElementById('reviewId').value = review.id;
        document.getElementById('movieId').value = review.movieId;
        document.getElementById('userId').value = review.userId;
        document.getElementById('rating').value = review.rating;
        document.getElementById('comment').value = review.comment;

        reviewModal.show();
    } catch (error) {
        console.error('리뷰 정보를 불러오는데 실패했습니다:', error);
        alert('리뷰 정보를 불러오는데 실패했습니다.');
    }
}



// 리뷰 저장 (등록/수정 공통)
async function saveReview() {
    const id = document.getElementById('reviewId').value;
    const review = {
        movieId: document.getElementById('movieId').value,
        userId: document.getElementById('userId').value,
        rating: parseInt(document.getElementById('rating').value),
        comment: document.getElementById('comment').value
    };

    console.log(`[saveReview] 요청 id=${id}, movieId=${review.movieId}, userId=${review.userId}`);

    try {
        const url = id ? `/api/reviews/${id}` : '/api/reviews';
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(review)
        });

        if (!response.ok) {
            throw new Error('저장에 실패했습니다.');
        }

        const savedReview = await response.json();
        console.log(`[saveReview] 성공:`, savedReview);


        reviewModal.hide();
        loadReviews();
        alert('저장되었습니다.');
    } catch (error) {
        console.error('저장에 실패했습니다:', error);
        alert('저장에 실패했습니다.');
    }
}

// 리뷰 삭제
async function deleteReview(id) {
    if (!confirm('정말 삭제하시겠습니까?')) {
        return;
    }

    try {
        const response = await fetch(`/api/reviews/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('삭제에 실패했습니다.');
        }

        loadReviews();
        alert('삭제되었습니다.');
    } catch (error) {
        console.error('삭제에 실패했습니다:', error);
        alert('삭제에 실패했습니다.');
    }
}
