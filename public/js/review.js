// public/js/review.js
document.getElementById('addReviewForm')?.addEventListener('submit', function(e) {
  const reviewText = document.getElementById('review_text').value;
  const vehicleId = document.getElementById('inv_id').value;

  if (!reviewText.trim()) {
      e.preventDefault();
      alert('Please enter a review text');
      return;
  }

  if (!vehicleId) {
      e.preventDefault();
      alert('Please select a vehicle');
      return;
  }
});
