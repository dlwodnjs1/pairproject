let reviewModal;

document.addEventListener('DOMContentLoaded', function () {
    reviewModal = new bootstrap.Modal(document.getElementById('reviewModal'));
    loadReviews();
});

// ============================
// 리뷰 목록 불러오기 (+ 댓글 UI 포함)
// ============================
async function loadReviews() {
    try {
        const response = await fetch('/api/reviews');
        if (!response.ok) throw new Error('리뷰 조회 실패');
        const reviews = await response.json();

        const tbody = document.getElementById('reviewTableBody');
        tbody.innerHTML = '';

        reviews.forEach(review => {
            // 1) 리뷰 행
            const tr = document.createElement('tr');
            tr.innerHTML = `
        <td>${review.id}</td>
        <td>${review.movieId}</td>
        <td>${review.userId}</td>
        <td>${'⭐'.repeat(review.rating)}</td>
        <td>${review.comment}</td>
        <td>
          <button class="btn btn-sm btn-secondary" onclick="toggleComments(${review.id})">댓글</button>
          <button class="btn btn-sm btn-primary" onclick="editReview(${review.id})">수정</button>
          <button class="btn btn-sm btn-danger" onclick="deleteReview(${review.id})">삭제</button>
        </td>
      `;
            tbody.appendChild(tr);

            // 2) 댓글 표시용 행(처음은 접힘)
            const commentRow = document.createElement('tr');
            commentRow.id = `commentRow-${review.id}`;
            commentRow.classList.add('collapse');
            commentRow.innerHTML = `
        <td colspan="6">
          <div id="commentList-${review.id}" class="mb-3"></div>
          <div class="input-group">
            <input type="text" id="commentUser-${review.id}" class="form-control" placeholder="작성자 ID">
            <input type="text" id="commentContent-${review.id}" class="form-control" placeholder="댓글 내용">
            <button class="btn btn-success" onclick="addComment(${review.id})">등록</button>
          </div>
        </td>
      `;
            tbody.appendChild(commentRow);
        });
    } catch (error) {
        console.error('리뷰 목록을 불러오는데 실패했습니다:', error);
        alert('리뷰 목록을 불러오는데 실패했습니다.');
    }
}

// ============================
// 리뷰 추가/수정 모달
// ============================
function showAddReviewModal() {
    document.getElementById('modalTitle').textContent = '리뷰 추가';
    document.getElementById('reviewForm').reset();
    document.getElementById('reviewId').value = '';
    reviewModal.show();
}

async function editReview(id) {
    try {
        const response = await fetch(`/api/reviews/${id}`);
        if (!response.ok) throw new Error('리뷰 조회 실패');
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

// ============================
// 리뷰 저장(등록/수정)
// ============================
async function saveReview() {
    const id = document.getElementById('reviewId').value;
    const review = {
        movieId: document.getElementById('movieId').value,
        userId: document.getElementById('userId').value,
        rating: parseFloat(document.getElementById('rating').value), // 소수 허용시 parseFloat
        comment: document.getElementById('comment').value
    };

    try {
        const url = id ? `/api/reviews/${id}` : '/api/reviews';
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(review)
        });

        if (!response.ok) throw new Error('저장에 실패했습니다.');

        reviewModal.hide();
        await loadReviews();
        alert('저장되었습니다.');
    } catch (error) {
        console.error('저장에 실패했습니다:', error);
        alert('저장에 실패했습니다.');
    }
}

// ============================
// 리뷰 삭제
// ============================
async function deleteReview(id) {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
        const response = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('삭제에 실패했습니다.');
        await loadReviews();
        alert('삭제되었습니다.');
    } catch (error) {
        console.error('삭제에 실패했습니다:', error);
        alert('삭제에 실패했습니다.');
    }
}

// ============================
// 댓글 토글/조회/등록/삭제 (전역)
// ============================
async function toggleComments(reviewId) {
    const row = document.getElementById(`commentRow-${reviewId}`);
    if (!row) return;

    const isShown = row.classList.contains('show');
    if (isShown) {
        row.classList.remove('show');
    } else {
        await loadComments(reviewId);
        row.classList.add('show');
    }
}

async function loadComments(reviewId) {
    try {
        const res = await fetch(`/api/reviews/${reviewId}/comments`);
        if (!res.ok) throw new Error('댓글 조회 실패');

        const comments = await res.json();
        const list = document.getElementById(`commentList-${reviewId}`);
        if (!list) return;

        if (!comments.length) {
            list.innerHTML = `<div class="text-muted">아직 댓글이 없습니다.</div>`;
            return;
        }

        list.innerHTML = comments.map(c => `
      <div class="d-flex justify-content-between align-items-center border rounded p-2 mb-2">
        <div>
          <div><strong>${c.userId}</strong></div>
          <div>${c.content}</div>
          <small class="text-muted">${c.createdAt ? c.createdAt.replace('T',' ') : ''}</small>
        </div>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteComment(${reviewId}, ${c.id})">삭제</button>
      </div>
    `).join('');
    } catch (e) {
        console.error(e);
        alert('댓글을 불러오지 못했습니다.');
    }
}

async function addComment(reviewId) {
    const userInput = document.getElementById(`commentUser-${reviewId}`);
    const contentInput = document.getElementById(`commentContent-${reviewId}`);
    const userId = (userInput?.value || '').trim();
    const content = (contentInput?.value || '').trim();

    if (!userId || !content) {
        alert('작성자와 내용을 입력해주세요.');
        return;
    }

    try {
        const res = await fetch(`/api/reviews/${reviewId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, content })
        });
        if (!res.ok) throw new Error('댓글 등록 실패');

        userInput.value = '';
        contentInput.value = '';
        await loadComments(reviewId);
    } catch (e) {
        console.error(e);
        alert('댓글 등록에 실패했습니다.');
    }
}

async function deleteComment(reviewId, commentId) {
    if (!confirm('댓글을 삭제할까요?')) return;

    try {
        const res = await fetch(`/api/reviews/comments/${commentId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('댓글 삭제 실패');

        await loadComments(reviewId);
    } catch (e) {
        console.error(e);
        alert('댓글 삭제에 실패했습니다.');
    }
}
