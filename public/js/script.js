// main.js

// Navigation Toggle for Mobile View
const navigationToggle = () => {
  const nav = document.querySelector('nav');
  const toggleButton = document.querySelector('.nav-toggle');

  toggleButton.addEventListener('click', () => {
    nav.classList.toggle('active');
  });
};

// Contact Button Interaction
const contactButtonHandler = () => {
  const contactBtn = document.querySelector('.btn');

  contactBtn.addEventListener('click', (event) => {
    event.preventDefault();
    alert('Thank you for reaching out! We will contact you shortly.');
  });
};

// Dynamic Image Loader for Vehicles
const loadVehicleImages = () => {
  const vehicleList = [
    { src: '/public/images/vehicles/adventador.jpg', alt: 'Lamborghini Adventador' },
    { src: '/public/images/vehicles/batmobile.jpg', alt: 'Batmobile' },
    { src: '/public/images/vehicles/crwn-vic.jpg', alt: 'Crown Victoria' }
  ];

  const vehicleContainer = document.querySelector('.vehicle-list');

  vehicleList.forEach(vehicle => {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    const caption = document.createElement('figcaption');

    img.src = vehicle.src;
    img.alt = vehicle.alt;
    caption.textContent = vehicle.alt;

    figure.appendChild(img);
    figure.appendChild(caption);
    vehicleContainer.appendChild(figure);
  });
};

// Initialize Functions on Page Load
document.addEventListener('DOMContentLoaded', () => {
  navigationToggle();
  contactButtonHandler();
  loadVehicleImages();
});
