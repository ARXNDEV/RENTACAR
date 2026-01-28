export const activeVehicleMatch = {
  $and: [
    {
      $or: [
        { isDeleted: false },
        { isDeleted: "false" },
        { isDeleted: { $exists: false } },
      ],
    },
    {
      $or: [
        { isAdminApproved: true },
        { isAdminApproved: "true" },
        { isAdminApproved: { $exists: false } },
      ],
    },
  ],
};

const normalizeBooleanFlag = (value, fallback) => {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return fallback;
};

export const normalizeVehicleFlags = (vehicle) => ({
  ...vehicle,
  isDeleted: normalizeBooleanFlag(vehicle?.isDeleted, false),
  isAdminApproved: normalizeBooleanFlag(vehicle?.isAdminApproved, true),
  isBooked: normalizeBooleanFlag(vehicle?.isBooked, false),
  isAdminAdded: normalizeBooleanFlag(vehicle?.isAdminAdded, true),
  isRejected: normalizeBooleanFlag(vehicle?.isRejected, false),
});

export const isVehicleVisible = (vehicle) =>
  [false, "false", null, undefined].includes(vehicle?.isDeleted) &&
  [true, "true", null, undefined].includes(vehicle?.isAdminApproved) &&
  [false, "false", null, undefined].includes(vehicle?.isBooked);
