// Get the hero image element
const heroImage = document.querySelector('.hero-image');

heroImage.addEventListener('click', () => {
  alert('Hero image clicked!'); 
});

// Get the vehicle images
const vehicleImages = document.querySelectorAll('.vehicle-list img');

vehicleImages.forEach(image => {
  image.addEventListener('click', () => {
    alert('Vehicle image clicked!'); 
  });
});

// Get the contact button
const contactButton = document.querySelector('.btn');

contactButton.addEventListener('click', () => {
  alert('Contact button clicked!'); 
});