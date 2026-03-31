const DEFAULT_PARIS = { lat: 48.847, lng: 2.3014 };
const CITY_CENTERS = {
  Avignon: { lat: 43.9437, lng: 4.7981 },
  Nice: { lat: 43.7042, lng: 7.2653 },
  "Mont Saint-Michel": { lat: 48.6155, lng: -1.5109 },
  Paris: { lat: 48.847, lng: 2.3014 },
};
const CITY_EMOJI = {
  Avignon: "🏛",
  Nice: "🌊",
  "Mont Saint-Michel": "🏰",
  Paris: "🗼",
};
const CITY_PREFIX = {
  Avignon: "avignon",
  Nice: "nice",
  "Mont Saint-Michel": "msm",
  Paris: "paris",
};

const CITY_COLORS = {
  Avignon: "var(--city-avignon)",
  Nice: "var(--city-nice)",
  "Mont Saint-Michel": "var(--city-msm)",
  Paris: "var(--city-paris)",
};

const DEFAULT_CITY_COLOR = "var(--gold)";

function getCityPrefix(cityName) {
  return (cityName || "").toLowerCase().replace(/\s+/g, "-");
}

function getApiKey() {
  const params = new URLSearchParams(window.location.search);
  return params.get("key") || "";
}

function loadGoogleMaps(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=marker`;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error("無法載入 Google Maps API，請確認 API key 是否正確。"));
    document.head.appendChild(script);
  });
}

function loadMarkerClusterer() {
  return new Promise((resolve, reject) => {
    if (window.markerClusterer) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@googlemaps/markerclusterer@2.5.3/dist/index.min.js";
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error("無法載入 MarkerClusterer。"));
    document.head.appendChild(script);
  });
}

const state = {
  cityOverview: [],
  restaurants: [],
  userPosition: null,
  cityFocusOrigin: null,
  cityFocusName: "",
  geolocationWatchId: null,
  map: null,
  restaurantMarkers: [],
  hotelMarkers: [],
  markerClusterer: null,
  infoWindow: null,
};

const elements = {
  mapStatus: document.querySelector("#map-status"),
  mapSidebarList: document.querySelector("#map-sidebar-list"),
  overviewList: document.querySelector("#overview-list"),
  topPicksList: document.querySelector("#top-picks-list"),
  tabButtons: document.querySelectorAll(".tab"),
  panels: document.querySelectorAll(".panel"),
  overviewTemplate: document.querySelector("#overview-card-template"),
  goToLocationBtn: document.querySelector("#go-to-location"),
  tripBanner: document.querySelector("#trip-banner"),
};

init().catch((error) => {
  setStatus(`初始化失敗：${error.message}`);
});

async function init() {
  setupTabs();
  const apiKey = getApiKey();
  if (!apiKey) {
    setStatus("請在網址加上 ?key=YOUR_API_KEY 以載入 Google Maps。");
  }
  await Promise.all([loadData(), loadGoogleMaps(apiKey), loadMarkerClusterer()]);
  renderTripBanner();
  renderOverview();
  renderTopPicks();
  setupMap();
  renderHotelMarkers();
  startGeolocation();
  renderNearbyRestaurants();
  setupGoToLocation();
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
  document.body.classList.toggle("map-is-active", tabName === "map");
  if (tabName === "map" && state.map) {
    setTimeout(() => google.maps.event.trigger(state.map, "resize"), 0);
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
  state.restaurants = Array.isArray(restaurants)
    ? restaurants.filter((place) => isValidRestaurant(place) && !isClosedRestaurant(place))
    : [];
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

function isClosedRestaurant(place) {
  return place?.is_closed === true;
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

function renderTripBanner() {
  if (!elements.tripBanner) return;
  const cities = state.cityOverview;
  if (cities.length === 0) {
    elements.tripBanner.style.display = "none";
    return;
  }

  const items = cities.map((city, i) => {
    const prefix = CITY_PREFIX[city.city] ?? getCityPrefix(city.city);
    const color = CITY_COLORS[city.city] || DEFAULT_CITY_COLOR;
    const shortPeriod = formatPeriod(city.period);
    const sep =
      i < cities.length - 1
        ? '<span class="trip-banner-sep" aria-hidden="true">›</span>'
        : "";
    return `<span class="trip-banner-item"><span class="trip-banner-dot" style="background:${color}"></span>${escapeHtml(CITY_EMOJI[city.city] || "📍")} ${escapeHtml(city.city)} <small>${escapeHtml(shortPeriod)}</small></span>${sep}`;
  });

  elements.tripBanner.innerHTML = items.join("");
}

function renderOverview() {
  elements.overviewList.innerHTML = "";
  for (const city of state.cityOverview) {
    const node = elements.overviewTemplate.content.cloneNode(true);
    node.querySelector(".city-name").textContent = city.city || "Unknown";
    node.querySelector(".city-period").textContent = formatPeriod(city.period);
    node.querySelector(".city-notes").textContent = city.notes || "";
    node.querySelector(".city-emoji").textContent = CITY_EMOJI[city.city] || "🍴";
    fillList(node.querySelector(".city-highlights"), city.highlights);
    fillList(node.querySelector(".city-dishes"), city.signature_dishes);
    fillList(node.querySelector(".city-areas"), city.areas);
    renderHotel(node.querySelector(".city-hotel"), city.hotel);
    fillList(node.querySelector(".city-constraints"), city.research_strategy?.constraints);

    const cityPrefix = CITY_PREFIX[city.city] ?? getCityPrefix(city.city);
    const card = node.querySelector(".city-card");
    if (card) {
      card.dataset.city = cityPrefix;
      card.style.setProperty("--city-accent", CITY_COLORS[city.city] || DEFAULT_CITY_COLOR);
    }
    const restCount = state.restaurants.filter((r) => r.id && r.id.startsWith(cityPrefix)).length;
    const badge = node.querySelector(".city-rest-count");
    badge.textContent = `🍴 ${restCount} 間`;

    const button = node.querySelector(".go-map");
    button.addEventListener("click", () => {
      switchTab("map");
      focusCityOnMap(city.city);
    });
    elements.overviewList.appendChild(node);
  }
}

function renderTopPicks() {
  elements.topPicksList.innerHTML = "";
  const restById = Object.fromEntries(state.restaurants.map((r) => [r.id, r]));

  for (const city of state.cityOverview) {
    const candidates = (city.top_candidates || [])
      .map((id) => restById[id])
      .filter(Boolean);
    if (candidates.length === 0) continue;

    const section = document.createElement("section");
    section.className = "top-picks-city";
    const cityPrefix = CITY_PREFIX[city.city] ?? getCityPrefix(city.city);
    section.dataset.city = cityPrefix;
    section.style.setProperty("--city-accent", CITY_COLORS[city.city] || DEFAULT_CITY_COLOR);

    const heading = document.createElement("h2");
    heading.className = "top-picks-city-heading";
    heading.textContent = `${CITY_EMOJI[city.city] || "🍴"} ${city.city}`;
    section.appendChild(heading);

    const list = document.createElement("ul");
    list.className = "top-picks-list";

    for (const [rankIndex, place] of candidates.entries()) {
      const li = document.createElement("li");
      li.className = "top-picks-card";

      const scoreNum = Number(place.score);
      const scoreValid = Number.isFinite(scoreNum);
      const scorePct = scoreValid ? Math.min(100, Math.round((scoreNum / 50) * 100)) : 0;

      li.innerHTML = `
        <div class="tpc-header">
          <span class="tpc-rank">${rankIndex + 1}</span>
          <span class="tpc-name">${escapeHtml(place.name)}</span>
          <span class="tpc-category">${escapeHtml(place.category)}</span>
        </div>
        ${
          scoreValid
            ? `<div class="tpc-score-row">
                <span class="tpc-score-label">評分</span>
                <div class="tpc-score-bar"><div class="tpc-score-fill" style="width:${scorePct}%"></div></div>
                <span class="tpc-score-num">${escapeHtml(String(place.score))}/50</span>
               </div>`
            : ""
        }
        <div class="tpc-meta">
          ${place.price_level ? `<span class="tpc-badge">${escapeHtml(place.price_level)}</span>` : ""}
          ${place.opening_hours ? `<span class="tpc-hours">${escapeHtml(place.opening_hours)}</span>` : ""}
        </div>
        ${place.notes ? `<p class="tpc-notes">${escapeHtml(place.notes)}</p>` : ""}
        <div class="tpc-footer">
          <a class="tpc-map-link" href="${safeUrl(place.google_maps_url)}" target="_blank" rel="noopener">📍 Google Maps</a>
          <button class="tpc-go-map" type="button" data-city="${escapeHtml(city.city)}">🗺 在地圖查看</button>
        </div>
      `;

      li.querySelector(".tpc-go-map").addEventListener("click", (e) => {
        const cityName = e.currentTarget.dataset.city;
        switchTab("map");
        focusCityOnMap(cityName);
      });

      list.appendChild(li);
    }

    section.appendChild(list);
    elements.topPicksList.appendChild(section);
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
  link.href = safeUrl(hotel.google_maps_url);
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
  const mapEl = document.getElementById("map-view");
  state.map = new google.maps.Map(mapEl, {
    center: { lat: DEFAULT_PARIS.lat, lng: DEFAULT_PARIS.lng },
    zoom: 13,
    mapId: "france-food-map",
    gestureHandling: "greedy",
  });
  state.infoWindow = new google.maps.InfoWindow();
  state.map.addListener("idle", renderNearbyRestaurants);
}

function renderHotelMarkers() {
  for (const marker of state.hotelMarkers) {
    marker.setMap(null);
  }
  state.hotelMarkers = [];

  for (const city of state.cityOverview) {
    const hotel = city.hotel;
    if (!hotel?.name || hotel.lat == null || hotel.lng == null) continue;
    const lat = Number(hotel.lat);
    const lng = Number(hotel.lng);
    if (Number.isNaN(lat) || Number.isNaN(lng)) continue;

    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: state.map,
      title: hotel.name,
      label: {
        text: "🏨",
        fontSize: "1.5rem",
      },
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 0,
      },
      zIndex: 1000,
    });

    const mapsLinkHtml = hotel.google_maps_url
      ? `<hr class="popup-divider" /><p style="margin:0"><a href="${safeUrl(hotel.google_maps_url)}" target="_blank" rel="noopener">📍 Google Maps</a></p>`
      : "";
    const contentString = `
      <div class="popup hotel-popup">
        <h4 class="popup-name">🏨 ${escapeHtml(hotel.name)}</h4>
        <hr class="popup-divider" />
        <div class="popup-rows">
          <span class="popup-label">城市</span><span class="popup-value">${escapeHtml(city.city)}</span>
          <span class="popup-label">入住期間</span><span class="popup-value">${escapeHtml(city.period || "")}</span>
          ${hotel.address ? `<span class="popup-label">地址</span><span class="popup-value">${escapeHtml(hotel.address)}</span>` : ""}
        </div>
        ${mapsLinkHtml}
      </div>
    `;
    marker.addListener("click", () => {
      state.infoWindow.setContent(contentString);
      state.infoWindow.open(state.map, marker);
    });
    state.hotelMarkers.push(marker);
  }
}

function startGeolocation() {
  if (!("geolocation" in navigator)) {
    setStatus("裝置不支援定位，已使用巴黎預設位置。");
    return;
  }

  setStatus("定位中...");
  state.geolocationWatchId = navigator.geolocation.watchPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      state.userPosition = { lat, lng };
      if (!state.cityFocusOrigin) {
        setStatus("定位成功。");
      } else {
        setStatus(`定位成功，目前固定顯示 ${state.cityFocusName}。`);
      }
    },
    () => {
      state.userPosition = null;
      if (!state.cityFocusOrigin) {
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

function renderNearbyRestaurants() {
  if (!state.map) return;
  const bounds = state.map.getBounds();
  if (!bounds) return;
  const origin = getActiveOrigin();
  const visible = [];
  for (const place of state.restaurants) {
    const lat = Number(place.lat);
    const lng = Number(place.lng);
    if (bounds.contains({ lat, lng })) {
      const distanceKm = haversineKm(origin.lat, origin.lng, lat, lng);
      visible.push({ ...place, distanceKm });
    }
  }

  // Remove old restaurant markers
  for (const marker of state.restaurantMarkers) {
    marker.setMap(null);
  }
  state.restaurantMarkers = [];
  if (state.markerClusterer) {
    state.markerClusterer.clearMarkers();
  }

  const newMarkers = [];
  for (const place of visible) {
    const marker = new google.maps.Marker({
      position: { lat: Number(place.lat), lng: Number(place.lng) },
      title: place.name,
    });
    const popupContent = buildPopup(place);
    marker.addListener("click", () => {
      state.infoWindow.setContent(popupContent);
      state.infoWindow.open(state.map, marker);
    });
    newMarkers.push(marker);
  }
  state.restaurantMarkers = newMarkers;

  if (window.markerClusterer && newMarkers.length > 0) {
    state.markerClusterer = new markerClusterer.MarkerClusterer({
      map: state.map,
      markers: newMarkers,
    });
  } else {
    for (const marker of newMarkers) {
      marker.setMap(state.map);
    }
  }

  renderSidebarList(visible);
}

function renderSidebarList(visible) {
  const list = elements.mapSidebarList;
  if (!list) return;

  if (visible.length === 0) {
    list.innerHTML = '<p class="sidebar-empty">目前地圖範圍內無餐廳</p>';
    return;
  }

  const sorted = [...visible].sort((a, b) => a.distanceKm - b.distanceKm);
  list.innerHTML = sorted
    .map(
      (place) => `
      <div class="sidebar-item">
        <div class="sidebar-item-name">${escapeHtml(place.name)}</div>
        <div class="sidebar-item-meta">
          <span>${escapeHtml(place.category)}</span>
          <span>${place.distanceKm.toFixed(2)} km</span>
          ${place.price_level ? `<span>${escapeHtml(place.price_level)}</span>` : ""}
        </div>
        ${place.notes ? `<p class="sidebar-item-notes">${escapeHtml(place.notes)}</p>` : ""}
        <a class="sidebar-item-link" href="${safeUrl(place.google_maps_url)}" target="_blank" rel="noopener noreferrer">📍 Google Maps</a>
      </div>
    `,
    )
    .join("");
}

function buildPopup(place) {
  const hours = place.opening_hours || "未知";
  const price = place.price_level || "未知";
  const scoreNum = Number(place.score);
  const scoreValid = Number.isFinite(scoreNum);
  const scoreDisplay = scoreValid ? String(place.score) : "未知";
  const scorePct = scoreValid ? Math.min(100, Math.round((scoreNum / 50) * 100)) : 0;
  const note = place.notes || "無";
  const sourceCount = Array.isArray(place.source_urls) ? place.source_urls.length : 0;

  const scoreBarHtml = scoreValid
    ? `<div class="popup-score-row">
        <span class="popup-score-label">評分</span>
        <div class="popup-score-bar">
          <div class="popup-score-fill" style="width:${scorePct}%"></div>
        </div>
        <span class="popup-score-num">${escapeHtml(scoreDisplay)}/50</span>
       </div>`
    : "";

  return `
    <div class="popup">
      <h4 class="popup-name">${escapeHtml(place.name)}</h4>
      ${scoreBarHtml}
      <hr class="popup-divider" />
      <div class="popup-rows">
        <span class="popup-label">分類</span><span class="popup-value">${escapeHtml(place.category)}</span>
        <span class="popup-label">距離</span><span class="popup-value">${place.distanceKm.toFixed(2)} km</span>
        <span class="popup-label">價格帶</span><span class="popup-value">${escapeHtml(price)}</span>
        <span class="popup-label">營業時間</span><span class="popup-value">${escapeHtml(hours)}</span>
        <span class="popup-label">地址</span><span class="popup-value">${escapeHtml(place.address)}</span>
        <span class="popup-label">來源數</span><span class="popup-value">${sourceCount}</span>
        <span class="popup-label">備註</span><span class="popup-value">${escapeHtml(note)}</span>
      </div>
      <hr class="popup-divider" />
      <p style="margin:0"><a href="${safeUrl(place.google_maps_url)}" target="_blank" rel="noopener">📍 Google Maps</a></p>
    </div>
  `;
}

function focusCityOnMap(cityName) {
  if (!state.map) return;
  const cityCenter = CITY_CENTERS[cityName] || DEFAULT_PARIS;
  state.cityFocusOrigin = cityCenter;
  state.cityFocusName = cityName || "Paris";
  state.map.setCenter({ lat: cityCenter.lat, lng: cityCenter.lng });
  state.map.setZoom(13);
  setStatus(`正在顯示 ${state.cityFocusName}。`);
}

function clearCityFocus() {
  if (!state.cityFocusOrigin) return;
  state.cityFocusOrigin = null;
  state.cityFocusName = "";
  renderNearbyRestaurants();
  setStatus("已切回目前位置模式。");
}

function setupGoToLocation() {
  if (!elements.goToLocationBtn) return;
  elements.goToLocationBtn.addEventListener("click", goToUserLocation);
}

function goToUserLocation() {
  if (!state.map) return;
  if (state.userPosition) {
    panToUserPosition(state.userPosition);
  } else if (!("geolocation" in navigator)) {
    setStatus("裝置不支援定位。");
  } else {
    setStatus("定位中，請稍候...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        state.userPosition = { lat: position.coords.latitude, lng: position.coords.longitude };
        panToUserPosition(state.userPosition);
      },
      () => {
        setStatus("定位失敗或被拒絕，無法跳轉至目前位置。");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }
}

function panToUserPosition(position) {
  state.cityFocusOrigin = null;
  state.cityFocusName = "";
  state.map.setCenter({ lat: position.lat, lng: position.lng });
  state.map.setZoom(15);
  setStatus("已移至目前位置。");
  renderNearbyRestaurants();
}

function getActiveOrigin() {
  if (state.cityFocusOrigin) return state.cityFocusOrigin;
  if (state.userPosition) return state.userPosition;
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

function safeUrl(url) {
  if (typeof url !== "string") return "#";
  return url.startsWith("https://") || url.startsWith("http://") ? encodeURI(url) : "#";
}

window.addEventListener("beforeunload", () => {
  if (state.geolocationWatchId !== null && "geolocation" in navigator) {
    navigator.geolocation.clearWatch(state.geolocationWatchId);
  }
});
