// utilities/index.js

exports.wrapVehicleDetailsInHTML = (vehicle) => {
  return `
      <h1>${vehicle.make} ${vehicle.model}</h1>
      <img src="${vehicle.imageUrl}" alt="${vehicle.make} ${vehicle.model}" />
      <p>Year: ${vehicle.year}</p>
      <p>Price: $${vehicle.price.toLocaleString()}</p>
      <p>Mileage: ${vehicle.mileage.toLocaleString()} miles</p>
      <p>Description: ${vehicle.description}</p>
  `;
};