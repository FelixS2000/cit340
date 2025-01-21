// utilities/index.js

function buildVehicleHTML(vehicle) {
  return `
      <div class="vehicle-detail">
          <img src="/public/images/full/${vehicle.image}" alt="${vehicle.make} ${vehicle.model}">
          <div class="vehicle-info">
              <h2>${vehicle.year} ${vehicle.make} ${vehicle.model}</h2>
              <p>Price: $${vehicle.price.toLocaleString()}</p>
              <p>Mileage: ${vehicle.mileage.toLocaleString()} miles</p>
              <p>${vehicle.description}</p>
          </div>
      </div>
  `;
}

module.exports = { buildVehicleHTML };
