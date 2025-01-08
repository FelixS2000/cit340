// Smooth Scroll for Contact Button
document.addEventListener('DOMContentLoaded', () => {
  const contactButton = document.querySelector('.btn');
  contactButton.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Thank you for your interest! We will contact you shortly.');
  });
});

// Hero Image Animation on Load
window.addEventListener('load', () => {
  const heroImage = document.querySelector('.hero-image');
  heroImage.style.transition = 'transform 1s ease-in-out';
  heroImage.style.transform = 'scale(1.05)';
  setTimeout(() => {
    heroImage.style.transform = 'scale(1)';
  }, 1000);
});
