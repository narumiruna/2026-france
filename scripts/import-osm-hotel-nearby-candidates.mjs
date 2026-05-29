import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const TARGET_COUNT = 400;
const COUNTED_CATEGORIES = new Set(["restaurant", "cafe", "creperie", "dessert"]);
const FOOD_AMENITIES = /^(restaurant|cafe|fast_food|ice_cream|food_court)$/;
const FOOD_SHOPS = /^(bakery|pastry|confectionery|deli)$/;
const CITIES_DIR = path.join("data", "cities");
const RESTAURANTS_FILE = path.join("data", "restaurants.json");
const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

const cityConfigs = [
  {
    file: "avignon.json",
    prefix: "avignon",
    cityName: "Avignon",
    hotel: "ibis Avignon Centre Pont de l'Europe",
    lat: 43.9437,
    lng: 4.7981,
    radiusMeters: 12000,
    areaLabel: "Avignon 住宿、舊城、Villeneuve-lès-Avignon 與近郊延伸動線",
    queryLabel: "Avignon centre, 84000 Avignon",
  },
  {
    file: "nice.json",
    prefix: "nice",
    cityName: "Nice",
    hotel: "ibis Nice Centre Notre-Dame",
    lat: 43.7042,
    lng: 7.2653,
    radiusMeters: 8500,
    areaLabel: "Nice 住宿、Jean Médecin、Libération、舊城、港區與近郊延伸動線",
    queryLabel: "Nice centre, 06000 Nice",
  },
  {
    file: "mont-saint-michel.json",
    prefix: "msm",
    cityName: "Mont Saint-Michel",
    hotel: "Hôtel Gabriel",
    lat: 48.6155,
    lng: -1.5109,
    radiusMeters: 65000,
    areaLabel: "La Caserne、Beauvoir、Pontorson、Avranches、Granville、Dol-de-Bretagne、Saint-Malo 與 Mont Saint-Michel 外圍車程 / 轉乘動線",
    queryLabel: "Baie du Mont-Saint-Michel / Pontorson / Avranches area",
  },
  {
    file: "paris.json",
    prefix: "paris",
    cityName: "Paris",
    hotel: "ibis Paris Tour Eiffel Cambronne 15ème",
    lat: 48.847,
    lng: 2.3014,
    radiusMeters: 6000,
    areaLabel: "Cambronne、La Motte-Picquet、Commerce、Ségur、左岸與 Paris 核心延伸動線",
    queryLabel: "Cambronne / La Motte-Picquet, 75015 Paris",
  },
];

const shouldDryRun = process.argv.includes("--dry-run");

function normalize(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function slugify(value) {
  const slug = normalize(value).replace(/\s+/g, "-").replace(/^-+|-+$/g, "");
  return slug || "candidate";
}

function distanceKm(aLat, aLng, bLat, bLng) {
  const radiusKm = 6371;
  const toRad = (degrees) => (degrees * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const startLat = toRad(aLat);
  const endLat = toRad(bLat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(startLat) * Math.cos(endLat) * Math.sin(dLng / 2) ** 2;
  return 2 * radiusKm * Math.asin(Math.sqrt(h));
}

function osmUrl(element) {
  return `https://www.openstreetmap.org/${element.type}/${element.id}`;
}

function elementLatLng(element) {
  if (typeof element.lat === "number" && typeof element.lon === "number") {
    return { lat: element.lat, lng: element.lon };
  }

  if (element.center) {
    return { lat: element.center.lat, lng: element.center.lon };
  }

  return null;
}

function categoryFromTags(tags) {
  const amenity = tags.amenity;
  const shop = tags.shop;
  const cuisine = normalize(tags.cuisine);
  const name = normalize(tags.name);

  if (cuisine.includes("crepe") || name.includes("creperie")) {
    return "creperie";
  }

  if (amenity === "cafe") {
    return "cafe";
  }

  if (amenity === "ice_cream" || cuisine.includes("ice cream")) {
    return "dessert";
  }

  if (shop === "pastry" || shop === "confectionery") {
    return "dessert";
  }

  if (shop === "bakery" || shop === "deli") {
    return "cafe";
  }

  return "restaurant";
}

function mealTagsFor(row, tags) {
  if (row.category === "cafe" || row.category === "dessert") {
    return ["coffee", "breakfast", "takeout"];
  }

  if (tags.amenity === "fast_food" || tags.takeaway === "yes") {
    return ["lunch", "dinner", "takeout"];
  }

  return ["lunch", "dinner"];
}

function scoreFor(row, tags, km) {
  let score = 30;
  if (row.category === "restaurant" || row.category === "creperie") score += 2;
  if (tags.opening_hours) score += 2;
  if (tags.website || tags["contact:website"]) score += 2;
  if (tags.cuisine) score += 1;
  if (km <= 1) score += 1;
  return Math.min(score, 36);
}

function priceFor(tags) {
  if (tags.amenity === "cafe" || tags.amenity === "fast_food" || FOOD_SHOPS.test(tags.shop ?? "")) {
    return "€";
  }

  return "€€";
}

function addressFor(tags, config) {
  const houseNumber = tags["addr:housenumber"];
  const street = tags["addr:street"];
  const postcode = tags["addr:postcode"];
  const city = tags["addr:city"];
  const parts = [
    [houseNumber, street].filter(Boolean).join(" "),
    [postcode, city].filter(Boolean).join(" "),
  ].filter(Boolean);

  if (parts.length > 0) {
    return parts.join(", ");
  }

  return `${config.queryLabel}（OSM 未提供門牌）`;
}

function overpassQuery(config) {
  const radius = config.radiusMeters;
  const { lat, lng } = config;

  return `
[out:json][timeout:120];
(
  node(around:${radius},${lat},${lng})["name"]["amenity"~"^(restaurant|cafe|fast_food|ice_cream|food_court)$"];
  way(around:${radius},${lat},${lng})["name"]["amenity"~"^(restaurant|cafe|fast_food|ice_cream|food_court)$"];
  relation(around:${radius},${lat},${lng})["name"]["amenity"~"^(restaurant|cafe|fast_food|ice_cream|food_court)$"];
  node(around:${radius},${lat},${lng})["name"]["shop"~"^(bakery|pastry|confectionery|deli)$"];
  way(around:${radius},${lat},${lng})["name"]["shop"~"^(bakery|pastry|confectionery|deli)$"];
  relation(around:${radius},${lat},${lng})["name"]["shop"~"^(bakery|pastry|confectionery|deli)$"];
);
out center tags;
`;
}

function fetchOverpass(config) {
  const errors = [];

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const output = execFileSync(
        "curl",
        [
          "-fsSL",
          "-A",
          "2026-france-food-map/1.0",
          "-G",
          "--data-urlencode",
          `data=${overpassQuery(config)}`,
          endpoint,
        ],
        {
          encoding: "utf8",
          maxBuffer: 80 * 1024 * 1024,
          timeout: 180_000,
        },
      );

      return JSON.parse(output);
    } catch (error) {
      errors.push(`${endpoint}: ${error.message}`);
    }
  }

  throw new Error(`Overpass query failed for ${config.cityName}: ${errors.join("; ")}`);
}

function isCounted(row) {
  return (
    row.hotel_nearby === true &&
    row.status === "ready" &&
    row.is_closed !== true &&
    COUNTED_CATEGORIES.has(row.category)
  );
}

function collectExistingKeys(rows) {
  const names = new Set();
  const osmUrls = new Set();
  const ids = new Set();

  for (const row of rows) {
    ids.add(row.id);
    names.add(normalize(row.name));
    for (const url of row.source_urls ?? []) {
      if (url.includes("openstreetmap.org/")) {
        osmUrls.add(url);
      }
    }
  }

  return { names, osmUrls, ids };
}

function uniqueId(prefix, name, ids) {
  const base = `${prefix}-${slugify(name)}`;
  let candidate = base;
  let index = 2;

  while (ids.has(candidate)) {
    candidate = `${base}-${index}`;
    index += 1;
  }

  ids.add(candidate);
  return candidate;
}

function candidateFromElement(element, config, ids) {
  const tags = element.tags ?? {};
  const position = elementLatLng(element);
  if (!position || !tags.name) {
    return null;
  }

  const amenity = tags.amenity ?? "";
  const shop = tags.shop ?? "";
  if (!FOOD_AMENITIES.test(amenity) && !FOOD_SHOPS.test(shop)) {
    return null;
  }

  const km = distanceKm(config.lat, config.lng, position.lat, position.lng);
  const category = categoryFromTags(tags);
  const googleMapsUrl = `https://maps.google.com/?q=${encodeURIComponent(`${tags.name} ${config.queryLabel}`)}`;
  const website = tags.website ?? tags["contact:website"];
  const sourceUrls = [googleMapsUrl, osmUrl(element)];
  if (website) {
    sourceUrls.push(website);
  }

  const row = {
    id: uniqueId(config.prefix, tags.name, ids),
    name: tags.name,
    category,
    status: "ready",
    lat: Number(position.lat.toFixed(6)),
    lng: Number(position.lng.toFixed(6)),
    score: 30,
    address: addressFor(tags, config),
    google_maps_url: googleMapsUrl,
    price_level: priceFor(tags),
    opening_hours: tags.opening_hours ?? "Unknown (旅前再確認)",
    visit_priority: km <= 2 ? "medium" : "low",
    reservation_required: false,
    hotel_nearby: true,
    meal_tags: [],
    source_urls: sourceUrls,
    notes: "",
  };

  row.meal_tags = mealTagsFor(row, tags);
  row.score = scoreFor(row, tags, km);

  const cuisineNote = tags.cuisine ? `；OSM cuisine=${tags.cuisine}` : "";
  const typeNote = amenity ? `OSM amenity=${amenity}` : `OSM shop=${shop}`;
  const hoursNote = tags.opening_hours
    ? `OSM 提供營業時段：${tags.opening_hours}。`
    : "OSM 未提供營業時段，旅前需再確認。";
  row.notes =
    `【外部查詢補齊 400 間門檻：OSM/Overpass，距住宿點約 ${km.toFixed(1)} km】` +
    `位於${config.areaLabel}；${typeNote}${cuisineNote}。${hoursNote}` +
    "定位為住宿附近實用備案，適合旅中依營業狀態臨時選用。";

  return { row, km, osmUrl: osmUrl(element), normalizedName: normalize(tags.name) };
}

function writeJson(filePath, rows) {
  fs.writeFileSync(filePath, `${JSON.stringify(rows, null, 2)}\n`);
}

const restaurants = JSON.parse(fs.readFileSync(RESTAURANTS_FILE, "utf8"));
const plannedAdditions = [];
const globalIds = new Set(restaurants.map((row) => row.id));

for (const config of cityConfigs) {
  const cityPath = path.join(CITIES_DIR, config.file);
  const cityRows = JSON.parse(fs.readFileSync(cityPath, "utf8"));
  const counted = cityRows.filter(isCounted).length;
  const missing = Math.max(0, TARGET_COUNT - counted);

  if (missing === 0) {
    console.log(`${config.cityName}: already ${counted}/${TARGET_COUNT}`);
    continue;
  }

  const cityKeys = collectExistingKeys(cityRows);
  const mapKeys = collectExistingKeys(restaurants);
  console.log(`${config.cityName}: querying OSM within ${config.radiusMeters / 1000} km`);
  const overpass = fetchOverpass(config);
  const seenNames = new Set([...cityKeys.names, ...mapKeys.names]);
  const seenOsmUrls = new Set([...cityKeys.osmUrls, ...mapKeys.osmUrls]);
  const candidates = [];

  for (const element of overpass.elements ?? []) {
    const candidate = candidateFromElement(element, config, globalIds);
    if (!candidate) {
      continue;
    }

    if (seenOsmUrls.has(candidate.osmUrl) || seenNames.has(candidate.normalizedName)) {
      continue;
    }

    seenOsmUrls.add(candidate.osmUrl);
    seenNames.add(candidate.normalizedName);
    candidates.push(candidate);
  }

  candidates.sort((a, b) => a.km - b.km || b.row.score - a.row.score || a.row.name.localeCompare(b.row.name));

  if (candidates.length < missing) {
    throw new Error(
      `${config.cityName}: need ${missing} additions but only found ${candidates.length} usable new OSM candidates`,
    );
  }

  const selected = candidates.slice(0, missing).map((candidate) => candidate.row);
  plannedAdditions.push({ config, rows: selected });
  console.log(`${config.cityName}: ${counted}/${TARGET_COUNT}, adding ${selected.length}`);
}

if (shouldDryRun) {
  console.log("Dry run; no files written.");
  process.exit(0);
}

for (const { config, rows } of plannedAdditions) {
  const cityPath = path.join(CITIES_DIR, config.file);
  const cityRows = JSON.parse(fs.readFileSync(cityPath, "utf8"));
  writeJson(cityPath, [...cityRows, ...rows]);
  restaurants.push(...rows);
}

writeJson(RESTAURANTS_FILE, restaurants);
