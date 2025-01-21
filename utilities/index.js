function buildVehicleHTML(vehicle) {
  return `
      <div class="vehicle-detail">
          <img 
              src="${vehicle.image}" 
              alt="${vehicle.year} ${vehicle.make} ${vehicle.model}" 
              role="img"
          >
          <div class="vehicle-info">
              <h2>${vehicle.year} ${vehicle.make} ${vehicle.model}</h2>
              <p><strong>Price:</strong> $${vehicle.price.toLocaleString()}</p>
              <p><strong>Mileage:</strong> ${vehicle.mileage.toLocaleString()} miles</p>
              <p><strong>Color:</strong> ${vehicle.color}</p>
              <p>${vehicle.description}</p>
          </div>
      </div>
  `;
}

// Export as part of an object for extensibility
module.exports = { buildVehicleHTML };
