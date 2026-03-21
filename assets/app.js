const DEFAULT_PARIS = { lat: 48.853, lng: 2.3499 };
const NEARBY_KM = 2;
const CITY_CENTERS = {
  Avignon: { lat: 43.9493, lng: 4.8055 },
  Nice: { lat: 43.7102, lng: 7.262 },
  "Mont Saint-Michel": { lat: 48.636, lng: -1.5115 },
  Paris: { lat: 48.853, lng: 2.3499 },
};

const state = {
  cityOverview: [],
  restaurants: [],
  userPosition: null,
  cityFocusOrigin: null,
  cityFocusName: "",
  geolocationWatchId: null,
  map: null,
  markerGroup: null,
  userMarker: null,
  radiusCircle: null,
};

const elements = {
  mapStatus: document.querySelector("#map-status"),
  overviewList: document.querySelector("#overview-list"),
  tabButtons: document.querySelectorAll(".tab"),
  panels: document.querySelectorAll(".panel"),
  overviewTemplate: document.querySelector("#overview-card-template"),
};

init().catch((error) => {
  setStatus(`初始化失敗：${error.message}`);
});

async function init() {
  setupTabs();
  await loadData();
  renderOverview();
  setupMap();
  startGeolocation();
  renderNearbyRestaurants();
}

function setupTabs() {
  for (const button of elements.tabButtons) {
    button.addEventListener("click", () => {
      const tab = button.dataset.tab;
      if (tab === "map") {
        clearCityFocus();
      }
      switchTab(tab);
    });
  }
}

function switchTab(tabName) {
  for (const button of elements.tabButtons) {
    button.classList.toggle("is-active", button.dataset.tab === tabName);
  }
  for (const panel of elements.panels) {
    panel.classList.toggle("is-active", panel.id === tabName);
  }
  if (tabName === "map" && state.map) {
    setTimeout(() => state.map.invalidateSize(), 0);
    updateUserMarker();
    renderNearbyRestaurants();
  }
}

async function loadData() {
  const [cityOverviewResp, restaurantsResp] = await Promise.all([
    fetch("./data/city-overview.json"),
    fetch("./data/restaurants.json"),
  ]);

  if (!cityOverviewResp.ok) {
    throw new Error(`無法讀取 city-overview.json (${cityOverviewResp.status})`);
  }
  if (!restaurantsResp.ok) {
    throw new Error(`無法讀取 restaurants.json (${restaurantsResp.status})`);
  }

  const cityOverview = await cityOverviewResp.json();
  const restaurants = await restaurantsResp.json();

  state.cityOverview = Array.isArray(cityOverview) ? cityOverview : [];
  state.restaurants = Array.isArray(restaurants) ? restaurants.filter(isValidRestaurant) : [];
}

function isValidRestaurant(place) {
  const required = ["id", "name", "category", "lat", "lng", "address", "google_maps_url"];
  for (const key of required) {
    if (place?.[key] === undefined || place[key] === null || place[key] === "") {
      console.warn(`Skip invalid restaurant: missing ${key}`, place);
      return false;
    }
  }
  const lat = Number(place.lat);
  const lng = Number(place.lng);
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    console.warn("Skip invalid restaurant: bad lat/lng", place);
    return false;
  }
  return true;
}

function formatPeriod(period) {
  if (!period) return "";
  const parts = period.split(" ~ ");
  if (parts.length !== 2) return period;
  const [start, end] = parts;
  const startMs = Date.parse(start);
  const endMs = Date.parse(end);
  if (Number.isNaN(startMs) || Number.isNaN(endMs)) return period;
  const nights = Math.round((endMs - startMs) / (1000 * 60 * 60 * 24));
  const shortStart = start.length >= 8 ? start.slice(5) : start;
  const shortEnd = end.length >= 8 ? end.slice(5) : end;
  return `${shortStart} ~ ${shortEnd}（${nights} 晚）`;
}

function renderOverview() {
  elements.overviewList.innerHTML = "";
  for (const city of state.cityOverview) {
    const node = elements.overviewTemplate.content.cloneNode(true);
    node.querySelector(".city-name").textContent = city.city || "Unknown";
    node.querySelector(".city-period").textContent = formatPeriod(city.period);
    node.querySelector(".city-notes").textContent = city.notes || "";
    fillList(node.querySelector(".city-highlights"), city.highlights);
    fillList(node.querySelector(".city-dishes"), city.signature_dishes);
    fillList(node.querySelector(".city-areas"), city.areas);
    renderHotel(node.querySelector(".city-hotel"), city.hotel);
    fillList(node.querySelector(".city-constraints"), city.research_strategy?.constraints);

    const button = node.querySelector(".go-map");
    button.addEventListener("click", () => {
      switchTab("map");
      focusCityOnMap(city.city);
    });
    elements.overviewList.appendChild(node);
  }
}

function renderHotel(container, hotel) {
  container.innerHTML = "";
  if (!hotel?.name) {
    container.textContent = "待補資料";
    return;
  }

  if (!hotel.google_maps_url) {
    container.textContent = hotel.name;
    return;
  }

  const link = document.createElement("a");
  link.href = encodeURI(hotel.google_maps_url);
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = hotel.name;
  container.appendChild(link);
}

function fillList(container, values) {
  container.innerHTML = "";
  if (!Array.isArray(values) || values.length === 0) {
    const li = document.createElement("li");
    li.textContent = "待補資料";
    container.appendChild(li);
    return;
  }
  for (const value of values) {
    const li = document.createElement("li");
    li.textContent = value;
    container.appendChild(li);
  }
}

function setupMap() {
  state.map = L.map("map-view").setView([DEFAULT_PARIS.lat, DEFAULT_PARIS.lng], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(state.map);

  state.markerGroup = L.markerClusterGroup();
  state.map.addLayer(state.markerGroup);
}

function startGeolocation() {
  if (!("geolocation" in navigator)) {
    setStatus("裝置不支援定位，已使用巴黎預設位置。");
    updateUserMarker();
    renderNearbyRestaurants();
    return;
  }

  setStatus("定位中...");
  state.geolocationWatchId = navigator.geolocation.watchPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      state.userPosition = { lat, lng };
      updateUserMarker();
      if (!state.cityFocusOrigin) {
        renderNearbyRestaurants();
        setStatus("定位成功，已更新附近餐廳。");
      } else {
        setStatus(`定位成功，目前固定顯示 ${state.cityFocusName}。`);
      }
    },
    () => {
      state.userPosition = null;
      updateUserMarker();
      if (!state.cityFocusOrigin) {
        renderNearbyRestaurants();
        setStatus("定位失敗或被拒絕，已使用巴黎預設位置。");
      } else {
        setStatus(`定位失敗或被拒絕，目前固定顯示 ${state.cityFocusName}。`);
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 10000,
    },
  );
}

function updateUserMarker() {
  const center = getActiveOrigin();
  const markerTitle = state.cityFocusOrigin ? `目前檢視：${state.cityFocusName}` : "目前位置";
  if (state.userMarker) {
    state.map.removeLayer(state.userMarker);
    state.map.removeLayer(state.radiusCircle);
  }

  state.userMarker = L.marker([center.lat, center.lng], { title: markerTitle }).addTo(state.map);
  state.radiusCircle = L.circle([center.lat, center.lng], {
    radius: NEARBY_KM * 1000,
    color: "#2a4d66",
    weight: 2,
    fillColor: "#2a4d66",
    fillOpacity: 0.08,
  }).addTo(state.map);
}

function renderNearbyRestaurants() {
  const origin = getActiveOrigin();
  const nearby = [];
  for (const place of state.restaurants) {
    const distanceKm = haversineKm(origin.lat, origin.lng, Number(place.lat), Number(place.lng));
    if (distanceKm <= NEARBY_KM) {
      nearby.push({ ...place, distanceKm });
    }
  }

  state.markerGroup.clearLayers();
  for (const place of nearby) {
    const marker = L.marker([Number(place.lat), Number(place.lng)]);
    marker.bindPopup(buildPopup(place));
    state.markerGroup.addLayer(marker);
  }
}

function buildPopup(place) {
  const hours = place.opening_hours || "未知";
  const price = place.price_level || "未知";
  const score = Number.isFinite(Number(place.score)) ? place.score : "未知";
  const note = place.notes || "無";
  const sourceCount = Array.isArray(place.source_urls) ? place.source_urls.length : 0;
  return `
    <div class="popup">
      <h4>${escapeHtml(place.name)}</h4>
      <p><strong>分類：</strong>${escapeHtml(place.category)}</p>
      <p><strong>分數：</strong>${escapeHtml(String(score))} / 50</p>
      <p><strong>距離：</strong>${place.distanceKm.toFixed(2)} km</p>
      <p><strong>價格帶：</strong>${escapeHtml(price)}</p>
      <p><strong>營業資訊：</strong>${escapeHtml(hours)}</p>
      <p><strong>地址：</strong>${escapeHtml(place.address)}</p>
      <p><strong>來源數：</strong>${sourceCount}</p>
      <p><strong>備註：</strong>${escapeHtml(note)}</p>
      <p><a href="${encodeURI(place.google_maps_url)}" target="_blank" rel="noopener">Google Maps</a></p>
    </div>
  `;
}

function focusCityOnMap(cityName) {
  if (!state.map) return;
  const cityCenter = CITY_CENTERS[cityName] || DEFAULT_PARIS;
  state.cityFocusOrigin = cityCenter;
  state.cityFocusName = cityName || "Paris";
  state.map.setView([cityCenter.lat, cityCenter.lng], 13);
  updateUserMarker();
  renderNearbyRestaurants();
  setStatus(`目前固定顯示 ${state.cityFocusName} 附近 2 公里餐廳。`);
}

function clearCityFocus() {
  if (!state.cityFocusOrigin) return;
  state.cityFocusOrigin = null;
  state.cityFocusName = "";
  updateUserMarker();
  renderNearbyRestaurants();
  setStatus("已切回目前位置模式。");
}

function getActiveOrigin() {
  if (state.cityFocusOrigin) return state.cityFocusOrigin;
  if (state.userPosition) {
    const hasNearby = state.restaurants.some(
      (r) => haversineKm(state.userPosition.lat, state.userPosition.lng, Number(r.lat), Number(r.lng)) <= NEARBY_KM,
    );
    if (hasNearby) return state.userPosition;
  }
  return DEFAULT_PARIS;
}

function haversineKm(lat1, lng1, lat2, lng2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const earthKm = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthKm * c;
}

function setStatus(text) {
  elements.mapStatus.textContent = text;
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

window.addEventListener("beforeunload", () => {
  if (state.geolocationWatchId !== null && "geolocation" in navigator) {
    navigator.geolocation.clearWatch(state.geolocationWatchId);
  }
});
