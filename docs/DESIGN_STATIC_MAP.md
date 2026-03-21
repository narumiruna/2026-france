---
name: Design Static Map
description: 靜態餐廳網站設計文件（地圖頁 + 城市總覽頁）。
---

# 靜態餐廳網站設計文件（MVP）

## 1. 目標與非目標
### 1.1 目標
- 建立可直接部署的純靜態網站（無後端 API）。
- 提供兩個分頁：`overview`（城市美食總覽）與 `map`（即時附近店家）。
- `map` 頁開啟後即嘗試取得使用者即時位置。
- 顯示使用者附近已研究餐廳，並提供可操作的餐廳資訊卡（popup）。
- 定位失敗或拒絕時，自動回退到法國巴黎預設位置。

### 1.2 非目標（本階段不做）
- 不做帳號、收藏、同步、後端資料庫。
- 不做複雜搜尋引擎與推薦系統。
- 不引入 React、Server API、PostGIS 等高複雜度元件。

## 2. 技術架構
- 前端：`HTML + CSS + JavaScript`
- 地圖函式庫：`Leaflet`
- 底圖：`OpenStreetMap tiles`
- 部署：`GitHub Pages`
- 資料儲存：本地 `JSON`
- 地圖標記聚合：`leaflet.markercluster`

設計原則：先完成可用、可維護、可部署的最小版本，再迭代視覺與功能。

## 3. 功能規格
### 3.0 分頁資訊架構
- `overview` 分頁：顯示每個城市的美食重點摘要，建議固定區塊如下：
  - 旅行資訊（停留期間、主要活動區域）
  - 城市美食亮點（代表料理與飲食特色）
  - 重點區域（適合覓食的街區或商圈）
  - 調查策略（優先研究項目）
  - 注意事項（預約、營業時段、排隊、季節性）
  - 重要筆記（個人偏好、過去踩雷/成功經驗）
- `map` 分頁：顯示即時位置與 2 公里內店家。
- 手機版與桌面版皆需能快速切換分頁。

### 3.1 定位與回退
- 頁面載入後使用 `navigator.geolocation.watchPosition` 持續追蹤位置。
- 若使用者拒絕定位、定位逾時、或裝置不支援定位：
  - 地圖中心改為巴黎預設點（Notre-Dame 周邊）。
  - 顯示清楚提示訊息（例如：已改用巴黎預設位置）。

### 3.2 附近餐廳定義
- 「附近」預設定義為使用者位置半徑 `2` 公里。
- 每次定位更新都重新計算距離並刷新顯示結果。
- 距離計算採 Haversine（公里）。

### 3.3 地圖顯示
- 使用者位置：專屬 marker + 半徑圈（2 公里）。
- 餐廳位置：marker + cluster。
- 點擊餐廳 marker 顯示完整 popup 欄位。

## 4. 資料契約（JSON）
資料檔路徑：
- `data/restaurants.json`（地圖店家資料）
- `data/city-overview.json`（城市總覽資料）

每筆餐廳至少包含以下欄位：
- `id`: 唯一識別字串
- `name`: 餐廳名稱（可使用法文或英文官方名稱）
- `category`: 類型（restaurant / cafe / dessert）
- `lat`: 緯度（數值）
- `lng`: 經度（數值）
- `score`: 綜合分數（數值）
- `address`: 地址
- `google_maps_url`: Google Maps 連結
- `price_level`: 價格帶（例如 €, €€, €€€）
- `opening_hours`: 營業資訊（字串或結構化字串）
- `source_urls`: 來源連結陣列
- `notes`: 備註（推薦理由、注意事項等）

每個城市總覽至少包含以下欄位：
- `city`: 城市名稱（例如 `Paris`）
- `period`: 停留日期區間（例如 `2026-06-06 ~ 2026-06-10`）
- `highlights`: 美食重點陣列（例如：海鮮、甜點、在地名店）
- `signature_dishes`: 建議嘗試料理陣列
- `top_candidates`: 代表店家 `id` 陣列（對應 `restaurants.json`）
- `notes`: 城市層級備註（交通區域、預約難度、營業提醒）

建議擴充欄位（overview 頁會直接使用）：
- `trip_info`: 旅行資訊（主要景點或活動）
- `areas`: 重點覓食區域陣列
- `research_strategy`: 研究策略物件
  - `priorities`: 優先研究清單
  - `constraints`: 限制與注意事項

## 5. 使用者介面需求
- 桌面與手機皆可用（RWD）。
- 首屏可見分頁切換（`overview` / `map`）。
- `overview` 頁需可快速比較各城市重點，並可連動跳轉到 `map`。
- `overview` 頁每個城市卡片至少顯示：`period`, `highlights`, `signature_dishes`, `areas`, `research_strategy.constraints`。
- `map` 頁需顯示定位狀態（定位中/定位失敗/資料載入狀態）。
- popup 內容需可快速判斷是否值得前往（分數、類型、地址、連結、備註）。

## 6. 驗收標準
- `overview` 分頁可顯示各城市摘要，內容對應 `city-overview.json`。
- 允許定位時，地圖可持續追蹤位置並更新 2 公里內店家。
- 拒絕定位時，地圖自動切換到巴黎預設點且功能仍可正常使用。
- marker cluster 運作正常，密集區域仍可操作。
- `restaurants.json` 或 `city-overview.json` 欄位缺漏時不造成整頁崩潰（跳過該筆並記錄警告）。
- 部署到 GitHub Pages 後可正常載入地圖與資料。

## 7. 後續擴充方向（非 MVP）
- 半徑切換（2/5/10 公里）。
- 依分類、分數、價格帶篩選。
- 離線快取（Service Worker）。
- 進階底圖方案（MapLibre / Protomaps）。
