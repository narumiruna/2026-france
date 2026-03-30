---
name: Progress
description: 讀這份文件以追蹤各城市餐廳研究進度與最新狀態。
---

# 研究進度追蹤（PROGRESS）

本文件是餐廳研究進度的單一真實來源。每次完成研究或調整候選清單後，必須更新本文件。

## 狀態定義
- `⏳ Not Started`：尚未開始城市研究。
- `🔄 In Progress`：已開始蒐集或驗證資料，但未完成主力/備選清單。
- `📝 Needs Review`：候選與來源已整理，等待最終檢查。
- `✅ Completed`：已完成該城市本階段研究，且資料已同步到 JSON。

## 城市進度（依行程順序）

| 城市 | 期間 | 狀態 | 已研究間數 | 首選 | 已排除 | 最後更新 | 備註 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Avignon | 2026-05-30 ~ 2026-06-02 | 📝 Needs Review | 20 | 11 hotel_nearby | 0 | 2026-03-30 | 新增 6 筆飯店附近（hotel_nearby）候選：Les Grands Bateaux de Provence（Bd de l'Oulle，步行 5 分）、Fou de Fafa（Rue des Trois Faucons）、Le Cochon Bleu（Rue d'Annanelle）、Hiély-Lucullus（Michelin 綠星，Rue de la République）、Ma Belle Cuisine（Rue Félix Gras）、La Sou'Pape（Rue de la Grande Fusterie）；hotel_nearby 共計 11 筆。 |
| Nice | 2026-06-02 ~ 2026-06-05 | 📝 Needs Review | 22 | 13 | 0 | 2026-03-30 | 新增 6 筆景點附近餐廳：Flaveur（Michelin 2 星，近 Place Masséna）、JAN（Michelin 1 星，Vieux Nice）、Les Agitateurs（Michelin 1 星，Vieux Nice/Colline du Château 一帶）、Le Bistrot Gourmand（Bib Gourmand，近 Place Masséna）、Bar des Oiseaux（Michelin 收錄，Vieux Nice）、Le Safari（Cours Saleya 花市地標）；同步補齊 HUG Café 至 data/restaurants.json（先前僅存於 nice.json）。 |
| Mont Saint-Michel | 2026-06-05 ~ 2026-06-06 | 📝 Needs Review | 6 | 2 | 0 | 2026-03-21 | 新增 La Ferme Saint-Michel（飯店同路段晚餐，諾曼第 agneau de pré-salé）、Le Relais du Roy（同路段備選晚餐，灣景）。已建立 mont-saint-michel.json，整合現有候選。 |
| Paris | 2026-06-06 ~ 2026-06-10 | 📝 Needs Review | 31 | 16 | 1 | 2026-03-28 | 將 Maison Pichard（88 Rue Cambronne）註記為永久歇業（保留條目避免重複研究誤納入），並在 UI 載入時排除 `is_closed: true`。本輪續研除 Merci Jérôme 外，另補強 Le Moulin de la Croix Nivert、Laboulangerie、Boulangerie Barlan 並升級為 `ready`。 |

## 更新紀錄
- 2026-03-30: Avignon 飯店附近餐廳補強（+6 筆 hotel_nearby）：
  - `avignon-grands-bateaux-provence`：Les Grands Bateaux de Provence（Bd de l'Oulle，步行約 5 分鐘，河畔船上餐廳）升為 `ready`，score 35。
  - `avignon-fou-de-fafa`：Fou de Fafa（17 Rue des Trois Faucons，步行約 12 分鐘，Tripadvisor 4.7/5）升為 `ready`，score 37。
  - `avignon-le-cochon-bleu`：Le Cochon Bleu（9 Rue d'Annanelle，步行約 10 分鐘，傳統法式）升為 `ready`，score 35。
  - `avignon-hiely-lucullus`：Hiély-Lucullus（5 Rue de la République，步行約 12 分鐘，Michelin 綠星）升為 `ready`，score 43。
  - `avignon-ma-belle-cuisine`：Ma Belle Cuisine（3 Rue Félix Gras，步行約 10 分鐘）為 `researching`，score 33，待補指南型來源。
  - `avignon-la-soupape`：La Sou'Pape（51 Rue de la Grande Fusterie，步行約 10 分鐘，平價午餐）為 `researching`，score 30，待補指南型來源。
  - Avignon hotel_nearby 總計達 11 筆（原 5 筆 + 新增 6 筆）；同步更新 `data/cities/avignon.json`、`data/restaurants.json`、`data/city-overview.json`。
- 2026-03-30: Nice 新增 6 筆重要景點附近餐廳，同步更新 `data/cities/nice.json` 與 `data/restaurants.json`：
  - Flaveur（Michelin 2 星，25 Rue Gubernatis，近 Place Masséna）
  - JAN（Michelin 1 星，12 Rue Lascaris，Vieux Nice）
  - Les Agitateurs（Michelin 1 星，24 Rue Bonaparte，Vieux Nice/近 Colline du Château）
  - Le Bistrot Gourmand（Michelin Bib Gourmand，3 Rue Desboutin，近 Place Masséna）
  - Bar des Oiseaux（Michelin Guide 收錄，5 Rue Saint Vincent，Vieux Nice）
  - Le Safari（1972 年地標，1 Cours Saleya 花市旁）
  - 同步補齊 HUG Café 至 `data/restaurants.json`（先前僅收錄於 `data/cities/nice.json`）
- 2026-03-30: Avignon 景點周邊補強（+3 新增，+1 更名確認）：
  - `avignon-la-mirande`：La Mirande（4 Place de l'Amirande，Michelin 1★ + 綠星，Palais des Papes 正旁）升為 `ready`，score 45。
  - `avignon-le-gout-du-jour`：Le Goût du Jour（20 Rue Saint-Étienne，Michelin 推薦，舊城區）升為 `ready`，score 40。
  - `avignon-brasserie-horloge`：Brasserie de l'Horloge（26 Place de l'Horloge，每日開放，Place de l'Horloge 正面）升為 `ready`，score 32。
  - `avignon-christian-etienne`：確認 Christian Etienne 於 2020 年更名為 Sevin（主廚 Guilhem Sevin 接手），更新名稱、營業時間、價位及來源，升為 `ready`，score 42。
  - 四筆同步新增至 `data/restaurants.json`；同步補入先前遺漏的 `avignon-acte-2`。
  - `data/city-overview.json` Avignon 頂候選更新為 7 筆，覆蓋 Palais des Papes、Place de l'Horloge 兩大景點周邊。
- 2026-03-28: Paris 續研（多間增補）：
  - `paris-le-moulin-croix-nivert`、`paris-laboulangerie-laos`、`paris-boulangerie-barlan` 皆補齊多來源佐證後由 `researching` 升級為 `ready`。
  - 三筆均為飯店周邊（Cambronne / Motte-Picquet 一帶）早餐/咖啡/外帶低風險備選。
  - 三筆已同步新增至 `data/restaurants.json`，可直接由地圖主資料載入。
- 2026-03-28: Paris 續研（最小增補）：
  - `paris-merci-jerome-motte-picquet` 補齊 4 筆來源（官方頁、Google Maps、Tripadvisor、Mappy），狀態由 `researching` 升級為 `ready`。
  - 同步新增至 `data/restaurants.json`，確保地圖主資料可顯示此飯店周邊早餐/咖啡/外帶備選。
- 2026-03-28: Paris 店家狀態維護：
  - Maison Pichard 改為歇業保留策略（不刪除，新增 `is_closed: true`、`closure_checked_at`、`closure_note`）。
  - `data/cities/paris.json` 同步改為 `status: rejected`，保留歷史資訊避免重複研究。
  - 前端 `assets/app.js` 加入 `is_closed` 過濾，歇業店不顯示於地圖、側欄與 overview 計數。
- 2026-03-21: 建立初始進度文件並初始化四城市狀態為 `In Progress`。
- 2026-03-21: 補強 Nice（+3 候選：Le Bistrot d'Antoine、Lou Pilha Leva、La Rossettisserie）與 Paris（+5 候選：Le Comptoir du Relais、Frenchie、Jacques Genin、Café des Musées、Breizh Café）；兩城市升級為 `Needs Review`。
- 2026-03-21: 依正確搜尋方法（先確認飯店地址 → 搜尋街道附近 → 擴大至區域）補齊四城市飯店附近美食候選（咖啡/早餐、晚餐、外帶）：
  - Avignon：Brunch Coffee、Café Tulipe、Pavillon 84、Pollen（共 4 筆新增）
  - Nice：La Bélugue、Verdant Café、La Gauloise、Aux Deux Chefs、Chez Davia、Boulangerie Jeannot、HOBO Coffee（共 7 筆新增）
  - Mont Saint-Michel：La Ferme Saint-Michel（1 筆新增）；建立 data/cities/mont-saint-michel.json
  - Paris：Maison Pichard、Brasserie Wallace、Melt Cambronne、La Véraison、Neige d'Été（共 5 筆新增）
  - 新增欄位 hotel_nearby 與 meal_tags 至所有新建條目
- 2026-03-21: 擴充各城市住宿附近餐廳研究，新增 5 筆 hotel_nearby 候選：
  - Avignon：Acte 2（Michelin/Gault&Millau 精緻晚餐，3b Rue de la Petite Calade）
  - Nice：HUG Café（精品咖啡/早餐，2 Rue de Suisse，飯店步行約 12 分鐘）
  - Mont Saint-Michel：Le Relais du Roy（諾曼第料理備選晚餐，8 Route du Mont Saint-Michel，同路段）
  - Paris：Maison Landemaine Cambronne（廣場烘焙坊，7 Place Cambronne，步行 2 分鐘）、Café Cambronne（廣場全日咖啡館，5 Place Cambronne，步行 2 分鐘）
- 2026-03-27: 擴充 Paris 候選（+5）並同步更新 `data/cities/paris.json`：
  - 15ème（飯店周邊/實用備選）：Le Beurre Noisette、L'Os à Moelle
  - 11ème（主力晚餐）：Bistrot Paul Bert、Le Servan
  - 3ème（傳統法餐備選）：Parcelles
  - 來源驗證流程：依使用者要求改用 Firecrawl（官方網站 + Michelin + Tripadvisor/Gault&Millau）交叉確認營業資訊與地址
- 2026-03-27: 擴充 Paris 候選（+5）並同步更新 `data/cities/paris.json`：
  - 15ème（飯店周邊/實用備選）：Biscotte、L'Accolade
  - 11ème（主力晚餐）：Clamato、Le Chardenoux
  - 14ème（左岸南側備選）：Les Petits Parisiens
  - 來源驗證流程：依使用者要求使用 Playwright + Firecrawl（官方網站 + Michelin + Tripadvisor）交叉確認地址、營業時段與訂位規則
- 2026-03-27: 使用 Lightpanda MCP 延續 Paris 研究，新增 3 筆 15ème 飯店周邊候選並同步更新 `data/cities/paris.json`：
  - Le Moulin de la Croix Nivert（早餐/外帶）
  - Laboulangerie（早餐/外帶）
  - Quatre Heures - Cambronne（早餐/外帶）
  - 本輪限制：Tripadvisor/Michelin 清單頁受反爬限制，因此先以官方站 + OSM/Nominatim + 在地店家資料頁建立 `researching` 候選，待下一輪補齊指南型來源後再升級 `ready`。
- 2026-03-27: 使用 Playwright MCP 針對上一輪限制補強 Paris 15ème 候選（+2）並同步更新 `data/cities/paris.json`：
  - Boulangerie Barlan（Rue Cambronne，早餐/外帶）
  - Merci Jérôme（Avenue de la Motte-Picquet，早餐/外帶）
  - 同步將 Le Moulin de la Croix Nivert 的地理來源改為 Nominatim，以符合「官方站 + OSM/Nominatim + 在地店家資料頁」的 `researching` 來源結構。
