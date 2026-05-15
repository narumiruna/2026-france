import fs from "node:fs";
import path from "node:path";

const MINIMUM_HOTEL_NEARBY_COUNT = 50;
const COUNTED_CATEGORIES = new Set(["restaurant", "cafe", "creperie", "dessert"]);
const CITIES_DIR = path.join("data", "cities");
const RESTAURANTS_FILE = path.join("data", "restaurants.json");
const shouldListCounted = process.argv.includes("--list");
const shouldOutputJson = process.argv.includes("--json");

const cityPrefixByFile = {
  "avignon.json": "avignon",
  "mont-saint-michel.json": "msm",
  "nice.json": "nice",
  "paris.json": "paris",
};

let hasFailure = false;
const restaurants = JSON.parse(fs.readFileSync(RESTAURANTS_FILE, "utf8"));
const results = [];

function isUsableHotelNearby(row) {
  return (
    row.hotel_nearby === true &&
    row.status === "ready" &&
    row.is_closed !== true &&
    COUNTED_CATEGORIES.has(row.category)
  );
}

function countByCategory(rows) {
  return rows.reduce((totals, row) => {
    totals[row.category] = (totals[row.category] ?? 0) + 1;
    return totals;
  }, {});
}

function formatIds(rows) {
  return rows
    .map((row) => row.id)
    .sort()
    .join(", ");
}

for (const file of fs.readdirSync(CITIES_DIR).sort()) {
  if (!file.endsWith(".json")) {
    continue;
  }

  const idPrefix = cityPrefixByFile[file];
  if (!idPrefix) {
    throw new Error(`Missing city prefix mapping for ${file}`);
  }

  const filePath = path.join(CITIES_DIR, file);
  const rows = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const cityCounted = rows.filter(isUsableHotelNearby);
  const mapCounted = restaurants.filter(
    (row) => row.id.startsWith(`${idPrefix}-`) && isUsableHotelNearby(row),
  );

  const cityMissing = Math.max(0, MINIMUM_HOTEL_NEARBY_COUNT - cityCounted.length);
  const mapMissing = Math.max(0, MINIMUM_HOTEL_NEARBY_COUNT - mapCounted.length);
  const countMismatch = cityCounted.length !== mapCounted.length;
  const status = cityMissing === 0 && mapMissing === 0 && !countMismatch ? "PASS" : "FAIL";
  const result = {
    file,
    status,
    minimum: MINIMUM_HOTEL_NEARBY_COUNT,
    cityCount: cityCounted.length,
    cityMissing,
    mapCount: mapCounted.length,
    mapMissing,
    countMismatch,
    cityCategories: countByCategory(cityCounted),
    mapCategories: countByCategory(mapCounted),
  };

  if (shouldListCounted) {
    result.cityIds = cityCounted.map((row) => row.id).sort();
    result.mapIds = mapCounted.map((row) => row.id).sort();
  }

  results.push(result);

  if (!shouldOutputJson) {
    console.log(
      `${status} ${file}: city=${cityCounted.length}/${MINIMUM_HOTEL_NEARBY_COUNT}` +
        (cityMissing > 0 ? `, city missing ${cityMissing}` : "") +
        ` map=${mapCounted.length}/${MINIMUM_HOTEL_NEARBY_COUNT}` +
        (mapMissing > 0 ? `, map missing ${mapMissing}` : "") +
        (countMismatch ? ", city/map count mismatch" : "") +
        ` cityCategories=${JSON.stringify(result.cityCategories)}` +
        ` mapCategories=${JSON.stringify(result.mapCategories)}`,
    );

    if (shouldListCounted) {
      console.log(`  cityIds: ${formatIds(cityCounted)}`);
      console.log(`  mapIds: ${formatIds(mapCounted)}`);
    }
  }

  if (cityMissing > 0 || mapMissing > 0 || countMismatch) {
    hasFailure = true;
  }
}

if (shouldOutputJson) {
  console.log(JSON.stringify(results, null, 2));
}

if (hasFailure) {
  process.exitCode = 1;
}
