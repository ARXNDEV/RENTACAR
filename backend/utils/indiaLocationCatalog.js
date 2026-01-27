import fs from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_PATH = resolve(__dirname, "../data/india-state-districts.json");

const HUB_TEMPLATES = [
  { suffix: "central-hub", label: "Central Mobility Hub" },
  { suffix: "railway-station", label: "Railway Station" },
  { suffix: "bus-stand", label: "Bus Stand" },
];

const LEGACY_DISTRICT_ALIASES = {
  "Bangalore Urban": "Karnataka",
  Calicut: "Kerala",
  Trivandrum: "Kerala",
  Kochi: "Kerala",
  Kottayam: "Kerala",
  Thrissur: "Kerala",
};

let catalogCache = null;

const slugify = (value = "") =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const titleCase = (value = "") =>
  value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export const getIndiaDistrictCatalog = () => {
  if (catalogCache) {
    return catalogCache;
  }

  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  catalogCache = JSON.parse(raw).map((entry) => ({
    state: titleCase(entry.StateName?.trim()),
    district: titleCase(entry["DistrictName(InEnglish)"]?.trim()),
  }));

  return catalogCache;
};

export const buildIndiaLocationEntries = () => {
  const seenIds = new Set();

  return getIndiaDistrictCatalog().flatMap(({ state, district }) =>
    HUB_TEMPLATES.map(({ suffix, label }) => {
      const id = `india-location:${slugify(state)}:${slugify(district)}:${suffix}`;
      if (seenIds.has(id)) {
        return null;
      }

      seenIds.add(id);

      return {
        id,
        type: "location",
        state,
        district,
        location: `${district} ${label}, ${state}`,
      };
    }).filter(Boolean)
  );
};

export const getDistrictStateMap = () => {
  const districtMap = new Map();

  getIndiaDistrictCatalog().forEach(({ state, district }) => {
    if (!districtMap.has(district)) {
      districtMap.set(district, state);
    }
  });

  Object.entries(LEGACY_DISTRICT_ALIASES).forEach(([district, state]) => {
    if (!districtMap.has(district)) {
      districtMap.set(district, state);
    }
  });

  return districtMap;
};
