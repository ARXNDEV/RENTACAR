const uniqueSorted = (items = []) =>
  [...new Set(items.filter(Boolean))].sort((a, b) => a.localeCompare(b));

export const buildMasterDataLookups = (data = []) => {
  const locationRows = data.filter((item) => item.type === "location");
  const carRows = data.filter((item) => item.type === "car");

  return {
    locationRows,
    models: uniqueSorted(carRows.map((item) => item.model)),
    brands: uniqueSorted(carRows.map((item) => item.brand)),
    states: uniqueSorted(locationRows.map((item) => item.state)),
    districts: uniqueSorted(locationRows.map((item) => item.district)),
    locations: uniqueSorted(locationRows.map((item) => item.location)),
  };
};

export const getDistrictOptions = (locationRows = [], state = "") =>
  uniqueSorted(
    locationRows
      .filter((item) => !state || item.state === state)
      .map((item) => item.district)
  );

export const getLocationOptions = (
  locationRows = [],
  { state = "", district = "" } = {}
) =>
  uniqueSorted(
    locationRows
      .filter(
        (item) =>
          (!state || item.state === state) &&
          (!district || item.district === district)
      )
      .map((item) => item.location)
  );
