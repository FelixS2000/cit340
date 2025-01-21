function buildVehicleHTML(vehicle) {
    return `
        <div class="vehicle-detail">
            <h1>${vehicle.make} ${vehicle.model}</h1>
            <img src="${vehicle.image}" alt="${vehicle.year} ${vehicle.make} ${vehicle.model}">
            <p>Year: ${vehicle.year}</p>
            <p>Price: $${vehicle.price.toLocaleString()}</p>
            <p>Mileage: ${vehicle.mileage.toLocaleString()} miles</p>
            <p>Description: ${vehicle.description}</p>
        </div>
    `;
}

// Export as part of an object for extensibility
module.exports = { buildVehicleHTML };
