---
name: Hotel Nearby Gaps
description: 追蹤每個住宿點附近餐廳與咖啡廳候選是否達到 400 間門檻。
---

# 住宿附近候選缺口

本文件只追蹤「每個住宿地點附近至少 400 間可用餐廳或咖啡廳」的達標狀態與維護要求。進度狀態仍以 [PROGRESS.md](./PROGRESS.md) 為準，資料驗證以 `node scripts/verify-hotel-nearby-counts.mjs` 為準。

## 計數規則
- 計入條件：
  - `hotel_nearby: true`
  - `status: "ready"`
  - 未標記 `is_closed: true`
  - 類型為 `restaurant`、`cafe`、`creperie` 或 `dessert`
- `data/cities/*.json` 與 `data/restaurants.json` 必須同步達標。
- 每站達到 `400/400` 前，不得把住宿周邊研究標記為完成。

## 目前缺口

| 城市 | 住宿點 | 目前可用數 | 仍缺 | 補齊狀態 |
| --- | --- | ---: | ---: | --- |
| Avignon | ibis Avignon Centre Pont de l'Europe | 400/400 | 0 | 已補齊；新增外查候選集中於住宿周邊、舊城核心、Rue de la République、Cours Jean Jaurès、Villeneuve-lès-Avignon 與近郊延伸動線。 |
| Nice | ibis Nice Centre Notre-Dame | 400/400 | 0 | 已補齊；新增外查候選集中於 Rue Lamartine、Jean Médecin、Rue Assalit、Nice-Ville、Libération、Vieux Nice、港區與近郊延伸動線。 |
| Mont Saint-Michel | Hôtel Gabriel | 400/400 | 0 | 已補齊；外圍動線定義為 La Caserne、Beauvoir、島內進島動線、Pontorson、Avranches、Granville、Dol-de-Bretagne 與 Saint-Malo 車程 / 轉乘備案。 |
| Paris | ibis Paris Tour Eiffel Cambronne 15ème | 400/400 | 0 | 已補齊；新增外查候選集中於 Cambronne、La Motte-Picquet、Commerce、Ségur、左岸與 Paris 核心延伸動線。 |

## 已用本地補標
- 2026-05-15：用既有座標補標 2 公里內已研究候選：
  - Avignon：`La Mirande`、`Sevin`
  - Nice：`Flaveur`、`Boulangerie Pâtisserie Jeannot`、`Fenocchio`、`Lou Pilha Leva`、`JAN`、`La Rossettisserie`、`Les Agitateurs`、`Le Safari`、`Bar des Oiseaux`、`HOBO Coffee`、`Chez Pipo`
  - Paris：`Les Petits Parisiens`

## 本地候選池稽核
- 以下為 2026-05-15 將門檻提高到 50 間時的歷史稽核；2026-05-29 的 100 與 400 間門檻已改用新一輪外部 OSM/Overpass 匯入補齊。
- Avignon：repo 內可用候選共 32 筆，已全數計入住宿附近；剩餘缺口無法靠補標完成。
- Nice：repo 內可用候選共 41 筆，已全數計入住宿附近；剩餘缺口無法靠補標完成。
- Mont Saint-Michel：repo 內可用候選共 30 筆，已全數計入住宿附近；剩餘缺口無法靠補標完成。
- Paris：repo 內可用候選共 45 筆，其中 31 筆已計入住宿附近；其餘 14 筆為跨區主力或甜點，不應為了達標硬標為住宿附近。
- 結論：本地候選池不足以達標；已於 2026-05-15 經使用者允許外部查詢後補齊。

## 外部補齊結果
- 2026-05-29：使用 OSM/Overpass 以住宿座標與周邊動線查詢，新增 1200 筆 `ready + hotel_nearby` 候選，將四站門檻提高到 `400/400`：
  - Avignon：新增 300 筆，達 `400/400`。
  - Nice：新增 300 筆，達 `400/400`。
  - Mont Saint-Michel：新增 300 筆，達 `400/400`；外圍動線擴大納入 Granville、Dol-de-Bretagne 與 Saint-Malo 車程 / 轉乘備案。
  - Paris：新增 300 筆，達 `400/400`。
  - 驗證指令 `node scripts/verify-hotel-nearby-counts.mjs` 已通過，四站 city/map 計數皆為 `400/400` 且無 mismatch。
- 2026-05-29：使用 OSM/Overpass 以住宿座標與周邊動線查詢，新增 200 筆 `ready + hotel_nearby` 候選，將四站門檻提高到 `100/100`：
  - Avignon：新增 50 筆，達 `100/100`。
  - Nice：新增 50 筆，達 `100/100`。
  - Mont Saint-Michel：新增 50 筆，達 `100/100`；外圍動線擴大納入 Pontorson 與 Avranches 短程車程 / 轉乘備案。
  - Paris：新增 50 筆，達 `100/100`。
  - 驗證指令 `node scripts/verify-hotel-nearby-counts.mjs` 已通過，四站 city/map 計數皆為 `100/100` 且無 mismatch。
- 2026-05-15：使用 OSM/Overpass 以住宿座標與周邊動線查詢，新增 66 筆 `ready + hotel_nearby` 候選：
  - Avignon：新增 18 筆，達 `50/50`。
  - Nice：新增 9 筆，達 `50/50`。
  - Mont Saint-Michel：新增 20 筆，達 `50/50`。
  - Paris：新增 19 筆，達 `50/50`。
- 每筆新增候選至少保留 OSM/Overpass 來源 URL、Google Maps 查詢 URL；OSM 有提供官方網站時同步保留。
- 驗證指令 `node scripts/verify-hotel-nearby-counts.mjs` 已通過，四站 city/map 計數皆為 `50/50` 且無 mismatch。

## 維護要求
- 後續新增或調整候選仍需外部來源查證；不可憑店名或地圖猜測入庫。
- 每筆候選至少補齊：
  - `name`
  - `category`
  - `lat`
  - `lng`
  - `address`
  - `google_maps_url`
  - `opening_hours`
  - `price_level`
  - `source_urls`
  - `notes`
  - `hotel_nearby: true`
  - `meal_tags`
- 新增後同步更新：
  - `data/cities/<city>.json`
  - `data/restaurants.json`
  - `data/city-overview.json`
  - `docs/PROGRESS.md`
- 完成前必跑：
  - `node scripts/verify-hotel-nearby-counts.mjs`
- 需要稽核實際計入名單時可跑：
  - `node scripts/verify-hotel-nearby-counts.mjs --list`
- 需要接報表或工具時可跑：
  - `node scripts/verify-hotel-nearby-counts.mjs --json`
