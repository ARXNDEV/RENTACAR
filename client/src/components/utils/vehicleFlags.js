export const isVehicleDeleted = (vehicle) =>
  vehicle?.isDeleted === true || vehicle?.isDeleted === "true";

export const isVehicleVisible = (vehicle) => !isVehicleDeleted(vehicle);
