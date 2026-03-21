---
name: Design Static Map
description: 以地圖為核心的靜態餐廳網站設計文件（MVP）。
---

# 靜態地圖餐廳網站設計文件（MVP）

## 1. 目標與非目標
### 1.1 目標
- 建立可直接部署的純靜態網站（無後端 API）。
- 以地圖為主介面，開啟頁面後即嘗試取得使用者即時位置。
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
資料檔路徑：`data/restaurants.json`

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

## 5. 使用者介面需求
- 桌面與手機皆可用（RWD）。
- 首屏可見地圖與狀態提示（定位中/定位失敗/資料載入狀態）。
- popup 內容需可快速判斷是否值得前往（分數、類型、地址、連結、備註）。

## 6. 驗收標準
- 允許定位時，地圖可持續追蹤位置並更新 2 公里內店家。
- 拒絕定位時，地圖自動切換到巴黎預設點且功能仍可正常使用。
- marker cluster 運作正常，密集區域仍可操作。
- `restaurants.json` 欄位缺漏時不造成整頁崩潰（跳過該筆並記錄警告）。
- 部署到 GitHub Pages 後可正常載入地圖與資料。

## 7. 後續擴充方向（非 MVP）
- 半徑切換（2/5/10 公里）。
- 依分類、分數、價格帶篩選。
- 離線快取（Service Worker）。
- 進階底圖方案（MapLibre / Protomaps）。
