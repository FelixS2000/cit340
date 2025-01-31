// Smooth Scroll for Contact Button
document.addEventListener('DOMContentLoaded', () => {
  const contactButton = document.querySelector('.btn');
  contactButton.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Thank you for your interest! We will contact you shortly.');
  });

  // Client-side validation for add classification form
  const classificationForm = document.querySelector('#add-classification-form');
  if (classificationForm) {
    classificationForm.addEventListener('submit', (e) => {
      const classificationName = document.querySelector('#classificationName').value;
      if (!classificationName || /\s|[^a-zA-Z0-9]/.test(classificationName)) {
        e.preventDefault();
        alert('Classification name cannot contain spaces or special characters.');
      }
    });
  }

  // Client-side validation for add inventory form
  const inventoryForm = document.querySelector('#add-inventory-form');
  if (inventoryForm) {
    inventoryForm.addEventListener('submit', (e) => {
      const make = document.querySelector('#make').value;
      const model = document.querySelector('#model').value;
      const year = document.querySelector('#year').value;
      const price = document.querySelector('#price').value;
      const mileage = document.querySelector('#mileage').value;

      if (!make || !model || !year || !price || !mileage || isNaN(year) || isNaN(price) || isNaN(mileage)) {
        e.preventDefault();
        alert('All fields are required and must be valid.');
      }
    });
  }
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
